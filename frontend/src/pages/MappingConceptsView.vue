<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAppStore } from "@/stores/app";
import * as rdflib from "rdflib";


// confirmation dialog
const dialog = ref(false)

const specPred = ref(null)
const specObj = ref(null)

function openDialog(pred,obj) {
  dialog.value = true;
  specPred.value = pred
  specObj.value = obj
}

function confirmDelete() {
  dialog.value = false;
  // Put your deletion logic here, e.g. emit, API call, etc.
  console.log('Item deleted!');
  removeSpecialPredicate(specPred.value,specObj.value)
}

// Namespaces
const RDFS = rdflib.Namespace("http://www.w3.org/2000/01/rdf-schema#");
const EX = rdflib.Namespace("http://example.org/");
const RDF = rdflib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const XSD = rdflib.Namespace("http://www.w3.org/2001/XMLSchema#");
const MS4AI = rdflib.Namespace("http://ontology.tno.nl/manuscriptAI/");

// A set of "special" predicates that should be non-editable
// but removable (with an X button).
const specialPredicates = [
  MS4AI("hasSupport").value,
  MS4AI("hasScript").value,
  MS4AI("hasDecoration").value,
  MS4AI("hasFormat").value,
  MS4AI("hasBinding").value,
  MS4AI("hasInk").value,
  MS4AI("hasAttributedAuthor").value,
  MS4AI("hasAttributedCopyist").value,
  MS4AI("hasAttributedMiniaturist").value,
  MS4AI("hasAttributedBookbinder").value,
  MS4AI("hasAttributedIlluminator").value,
  MS4AI("hasAttributedRubricator").value,
  MS4AI("includesWork").value,
];

// App Store & Router
const store = useAppStore();

const fileName = computed(()=>{
  return store.recentFileContent.name
})

const numberOfManuscripts = computed(()=>{
  return store.getStructuredData.number_of_manuscripts
})

// Create empty RDF store
const rdfStore = rdflib.graph();

// Local state
const manuscripts = ref([]);
const selectedIndex = ref(null);

const activeManuscript = computed(() => {
  return selectedIndex.value !== null
    ? manuscripts.value[selectedIndex.value]
    : null;
});

const selManuscript = ref(null)

watch(selManuscript,async(newV, oldV)=>{
  console.log("sel manuscript newV: ", newV[0])


})
const updateSelection = (e) => {
  console.log("selected Manuscript", e)
  selectedIndex.value = e
}

/** incipit & explicit from the .loci array */
const incipitLocus = computed(() => {
  if (!activeManuscript.value) return null;
  return (
    activeManuscript.value.loci.find((l) =>
      l.concernsFeature.endsWith("incipit")
    ) || null
  );
});
const explicitLocus = computed(() => {
  if (!activeManuscript.value) return null;
  return (
    activeManuscript.value.loci.find((l) =>
      l.concernsFeature.endsWith("explicit")
    ) || null
  );
});


/** parse RDF => fill manuscripts[] with .properties + .loci */
function parseRdfTurtle(turtleString) {
  rdflib.parse(
    turtleString,
    rdfStore,
    "http://example.org/",
    "text/turtle",
    (err) => {
      if (err) {
        console.error("Error parsing Turtle:", err);
        return;
      }

      // find ms4ai:Manuscript
      const msSubjects = rdfStore
        .statementsMatching(null, RDF("type"), MS4AI("Manuscript"))
        .map((st) => st.subject);

      const results = [...new Set(msSubjects)].map((subj) => {
        const sUri = subj.value;
        const stms = rdfStore.statementsMatching(subj, null, null);

        const propDict = {};
        const loci = [];

        stms.forEach((st) => {
          const pVal = st.predicate.value;
          const oVal = st.object.value;

          if (pVal === RDF("type").value) return; // skip "ms RDF:type ms4ai:Manuscript"

          if (pVal === MS4AI("includesLocus").value) {
            // store in array if multiple
            if (!propDict[pVal]) {
              propDict[pVal] = [];
            }
            propDict[pVal].push(oVal);

            // also parse the Locus node
            const locusStms = rdfStore.statementsMatching(st.object, null, null);
            let feature = "",
              textVal = "";
            locusStms.forEach((ls) => {
              if (ls.predicate.value === MS4AI("concernsFeature").value) {
                feature = ls.object.value;
              } else if (ls.predicate.value === MS4AI("includesText").value) {
                textVal = ls.object.value;
              }
            });
            loci.push({
              nodeUri: oVal,
              concernsFeature: feature,
              includesText: textVal,
            });
          } else {
            // normal property
            if (!propDict[pVal]) {
              propDict[pVal] = [];
            }
            propDict[pVal].push(oVal);
          }
        });

        // Convert single-element arrays into single values if desired
        for (const key in propDict) {
          if (Array.isArray(propDict[key]) && propDict[key].length === 1) {
            propDict[key] = propDict[key][0];
          }
        }

        const shelfVal =
          propDict[MS4AI("shelfmark").value] || "Manuscript (no shelfmark)";

        return {
          subjectUri: sUri,
          shortLabel: shelfVal,
          properties: propDict,
          loci,
          reviewed: false,
        };
      });

      manuscripts.value = results;
      selectedIndex.value = results.length > 0 ? 0 : null;
      console.log("manuscripts value: ", manuscripts.value)
    }
  );
}

const turtle  = computed(()=>{
  return store.getRdfOutput
})

watch(turtle,(newValue, oldValue) => {
  console.log("newV", newValue, "oldV", oldValue)
  parseRdfTurtle(newValue)
})

onMounted(() => {
  console.log("mounting mapping concepts!", turtle.value)
  parseRdfTurtle(turtle.value);
});

/** shrink URIs to prefix */
function shrinkUri(fullUri) {
  if (fullUri.startsWith("http://www.w3.org/2000/01/rdf-schema#")) {
    return "rdfs:" + fullUri.slice("http://www.w3.org/2000/01/rdf-schema#".length);
  } else if (fullUri.startsWith(MS4AI().value)) {
    return "ms4ai:" + fullUri.slice(MS4AI().value.length);
  } else if (fullUri.startsWith(RDF().value)) {
    return "rdf:" + fullUri.slice(RDF().value.length);
  } else if (fullUri.startsWith(EX().value)) {
    return "ex:" + fullUri.slice(EX().value.length);
  } else if (fullUri.startsWith(XSD().value)) {
    return "xsd:" + fullUri.slice(XSD().value.length);
  }
  // fallback: remove http:// for a shorter display
  return fullUri.replace("http://", "");
}
function downloadTurtle() {
  // 1) Build a Serializer with the prefixes
  const serializer = new rdflib.Serializer(rdfStore, {
    // no `base` field → ex: won’t collapse to <>
    prefixes: {
      ex:   "http://example.org/",
      m:    "http://ontology.tno.nl/manuscriptAI/",
      rdf:  "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd:  "http://www.w3.org/2001/XMLSchema#",
      ent:  "http://www.wikidata.org/entity/"
    },
    explicit: true,
    shorter:  false
  });

  // 2) Serialize to string
  let ttlData = serializer.toN3(rdfStore);

  // 3) clean up formatting
  ttlData = ttlData
    .replace(/a m:Locus;/g,                  "a m:Locus ;")
    .replace(/; m:concernsFeature /g,        ";\n    m:concernsFeature ")
    .replace(/; m:includesText /g,           ";\n    m:includesText ")
    .replace(/ ; /g,                         " ;\n    ")
    .replace(/ , /g,                         ",\n        ")
    .replace(/\.\nex:/g,                    ".\n\nex:");

  // 4) Trigger download
  const blob = new Blob([ttlData], { type: "text/turtle" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "manuscripts.ttl";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
/**
 * Removes the given `valueToRemove` for the property `pred` from
 * both the `activeManuscript.properties` *and* the rdfStore so that
 * the user can truly remove that triple (or that value from an array).
 */
function removeSpecialPredicate(pred, valueToRemove) {
  if (!activeManuscript.value) return;
  const props = activeManuscript.value.properties[pred];

  // Remove from local data structure
  if (Array.isArray(props)) {
    const idx = props.indexOf(valueToRemove);
    if (idx >= 0) {
      props.splice(idx, 1);
    }
    if (props.length === 0) {
      delete activeManuscript.value.properties[pred];
    }
  } else {
    // single value
    delete activeManuscript.value.properties[pred];
  }

  // Remove from RDF store
  const subject = rdflib.sym(activeManuscript.value.subjectUri);
  const predicate = rdflib.sym(pred);
  // Usually these special properties point to URIs:
  const object = rdflib.sym(valueToRemove);

  // Remove all statements matching s/p/o
  const stmtsToRemove = rdfStore.match(subject, predicate, object);
  rdfStore.remove(stmtsToRemove);
}

</script>

<template>
  <v-container
    id="mapping-concepts-view"
    fluid
  >
    <v-card
      variant="flat"
      color="transparent"
    >
      <v-card-title>Reviewing concept mapping</v-card-title>
      <v-card-text>
        In this step of the process, you have the manuscript properties have been mapped to concepts of the ManuscriptAI ontology.
        Review the quality of the mapping, provide feedback. Upon completion, you can mark a manuscript as reviewed. Once all the manuscripts have been reviewed you can download them locally to your computer in Turtle.
      </v-card-text>
    </v-card>
    <v-row>
      <v-col cols="4">
        <v-card
          id="list-of-reviewed-manuscripts"
          variant="text"
        >
          <v-list
            lines="two"
            bg-color="white"
          >
            <v-list-item
              :title="`File: ${fileName}`"
              :subtitle="`Manuscripts: ${numberOfManuscripts}`"
            >
              <template #prepend>
                <v-avatar>
                  <v-icon size="x-large">
                    mdi-file-document-outline
                  </v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
          <v-divider />
          <v-card-item>
            <v-list
              v-model:selected="selManuscript"
              bg-color="white"
            >
              <v-list-subheader>MANUSCRIPTS</v-list-subheader>
              <v-list-item
                v-for="(man,index) in manuscripts"
                :key="'reviewed-manuscript'+index"
                :title="man.shortLabel? man.shortLabel : 'Manuscript'+index+1"
                :value="man"
                color="primary"
                nav
                @click="updateSelection(index)"
              >
                <template #prepend>
                  <v-avatar color="grey-lighten-1">
                    <v-icon>mdi-book-open-blank-variant-outline</v-icon>
                  </v-avatar>
                </template>
                <template #append>
                  <v-icon v-if="man?.reviewed">
                    mdi-bookmark-check-outline
                  </v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card-item>
          <v-card-item>
            <v-btn
              :disabled="!manuscripts.every((m)=> m.reviewed === true)"
              @click="downloadTurtle"
            >
              download turtle
            </v-btn>
          </v-card-item>
        </v-card>
      </v-col>
      <v-divider
        vertical
        class="my-3"
      />
      <!-- content area of selection -->
      <v-col>
        <v-card
          v-if="selManuscript?.length>0"
          title="RDF Triples"
          variant="text"
        >
          <!-- Prefixes -->
          <v-card-item>
            <div class="prefixes-box">
              <h3 class="props-heading">
                Prefixes
              </h3>
              <div class="prefix-row">
                <code>ex: http://example.org/</code>
              </div>
              <div class="prefix-row">
                <code>rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns#</code>
              </div>
              <div class="prefix-row">
                <code>rdfs: http://www.w3.org/2000/01/rdf-schema#</code>
              </div>
              <div class="prefix-row">
                <code>xsd: http://www.w3.org/2001/XMLSchema#</code>
              </div>
              <div class="prefix-row">
                <code>ms4ai: http://ontology.tno.nl/manuscriptAI/</code>
              </div>
            </div>
          </v-card-item>
          <v-card-item>
            <strong>Actions:</strong>
            <v-btn
              class="ml-2"
              size="small"
              @click="()=>{ manuscripts[selectedIndex].reviewed = true;}"
            >
              Mark as reviewed
            </v-btn>
          </v-card-item>
          <!-- Properties -->
          <v-card-item class="pt-0">
            <p><strong>Properties</strong></p>
          </v-card-item>
          <v-card-item
            v-if="activeManuscript"
            id="property-container"
          >
            <div
              v-for="(obj, pred) in activeManuscript.properties"
              :key="pred"
              class="property-row"
            >
              <div class="prop-label">
                {{ shrinkUri(pred) }}
              </div>
              <div class="prop-value">
                <!-- 1) If ms4ai:includesLocus => specialized logic -->
                <template v-if="pred === MS4AI('includesLocus').value && Array.isArray(obj)">
                  <!-- multiple locus URIs -->
                  <div
                    v-for="(locusUri, i) in obj"
                    :key="i"
                    style="margin-bottom: 0.5rem;"
                  >
                    <v-text-field
                      class="highlighted-uri"
                      :value="shrinkUri(locusUri)"
                      dense
                      hide-details
                      outlined
                      disabled
                    />
                  </div>
                </template>
                <template v-else-if="pred === MS4AI('includesLocus').value">
                  <!-- single-locus case -->
                  <v-textarea
                    class="highlighted-uri"
                    :value="shrinkUri(obj)"
                    dense
                    hide-details
                    outlined
                    disabled
                  />
                </template>
                <!-- 2) If pred is in the set of special predicates => disabled + remove button -->
                <template v-else-if="specialPredicates.includes(pred)">
                  <!-- If the property value is an array... -->
                  <template v-if="Array.isArray(obj)">
                    <div
                      v-for="(val, i) in obj"
                      :key="i"
                      style="display: flex; align-items: center; margin-bottom: 0.5rem;"
                    >
                      <v-text-field
                        class="highlighted-uri"
                        :value="shrinkUri(val)"
                        dense
                        hide-details
                        outlined
                        readonly
                      >
                        <template #append-inner>
                          <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="openDialog(pred, obj)"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                      <!-- "Remove" button -->
                      <!--                         <v-btn style="margin-left: -150px !important;" size="small" color="red" icon @click="removeSpecialPredicate(pred, val)">-->
                      <!--                           <v-icon>mdi-close</v-icon>-->
                      <!--                         </v-btn>-->
                    </div>
                  </template>
                  <!-- If the property has a single value... -->
                  <template v-else>
                    <div style="display: flex; align-items: center;">
                      <v-text-field
                        class="highlighted-uri"
                        :value="shrinkUri(obj)"
                        dense
                        hide-details
                        outlined
                        readonly
                      >
                        <template #append-inner>
                          <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="openDialog(pred,obj)"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </div>
                  </template>
                </template>

                <!-- 3) If obj is array => multiple objects for this property (normal logic) -->
                <template v-else-if="Array.isArray(obj)">
                  <div
                    v-for="(val, index) in obj"
                    :key="index"
                    style="margin-bottom: 0.5rem;"
                  >
                    <v-text-field
                      :value="shrinkUri(val)"
                      dense
                      hide-details
                      outlined
                      disabled
                    />
                  </div>
                </template>

                <!-- 4) Otherwise single string property => normal text field (editable) -->
                <template v-else>
                  <v-text-field
                    v-model="activeManuscript.properties[pred]"
                    dense
                    hide-details
                    outlined
                  />
                </template>
              </div>
            </div>
            <!-- If incipit or explicit exist, show them in turtle style -->
            <div
              v-if="incipitLocus || explicitLocus"
              class="manuscript-section"
              style="margin-top: 2rem;"
            >
              <h3 class="props-heading">
                Incipit/Explicit Loci
              </h3>

              <!-- INCIPIT box -->
              <div
                v-if="incipitLocus"
                class="locus-turtle"
              >
                <p class="turtle-line">
                  <strong class="highlighted-uri">{{ shrinkUri(incipitLocus.nodeUri) }}</strong>
                  rdf:type ms4ai:Locus ;
                </p>
                <p class="turtle-line indent">
                  ms4ai:concernsFeature
                  <span class="highlighted-uri">{{ shrinkUri(incipitLocus.concernsFeature) }}</span>
                  ;
                </p>
                <p class="turtle-line indent">
                  ms4ai:includesText
                  <v-text-field
                    v-model="incipitLocus.includesText"
                    dense
                    hide-details
                    outlined
                    class="large-textfield"
                  />
                </p>
              </div>

              <!-- EXPLICIT box -->
              <div
                v-if="explicitLocus"
                class="locus-turtle"
                style="margin-top:1.5rem;"
              >
                <p class="turtle-line">
                  <strong class="highlighted-uri">{{ shrinkUri(explicitLocus.nodeUri) }}</strong>
                  rdf:type ms4ai:Locus ;
                </p>
                <p class="turtle-line indent">
                  ms4ai:concernsFeature
                  <span class="highlighted-uri">{{ shrinkUri(explicitLocus.concernsFeature) }}</span>
                  ;
                </p>
                <p class="turtle-line indent">
                  ms4ai:includesText
                  <v-text-field
                    v-model="explicitLocus.includesText"
                    dense
                    hide-details
                    outlined
                    class="large-textfield"
                  />
                </p>
              </div>
            </div>
          </v-card-item>
          <v-card-item v-else>
            No active manuscript!
          </v-card-item>
        </v-card>
        <v-card
          v-else
          variant="text"
          class="pa-10"
        >
          No selected manuscript. Please select a manuscript from the list of extracted manuscripts on the left.
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h6">
          Confirm Deletion
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this item? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>

.prefixes-box {
  background: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  margin-top: .5rem;
}
.prefix-row {
  margin-bottom: 6px;
  font-size: 0.95rem;
}

.props-heading {
  margin-bottom: 1rem;
  color: #666;
  font-size: 1.1rem;
}
.highlighted-uri {
  color: #1565c0 !important;
  font-weight: 600;
}


.manuscript-section {
  margin-top: 1rem;
}
.props-heading {
  margin-bottom: 1rem;
  color: #666;
  font-size: 1.1rem;
}
.property-row {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 1rem;

}
.prop-label {
  //width: 200px;
  font-weight: 600;
  margin-right: 1rem;
  word-wrap: break-word;
}
.prop-value {
  flex: 1;
  margin-right: 1rem;
}
.reviewed-btn {
  margin-top: 2rem;
}


.locus-turtle {
  background: #fffef8;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}
.turtle-line {
  margin: 0.3rem 0;
  font-size: 0.95rem;
}
.indent {
  margin-left: 0.5rem;
}

.large-textfield {
  width: 90%;
  margin-left: .1rem;
  display: inline-block;
}


.highlighted-uri {
  color: #1565c0 !important;
  font-weight: 600;
}
</style>
