<template>
  <v-container
    fluid
    class="main-layout"
  >
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar padded-container">
      <div class="sidebar-header">
        <v-icon color="primary">
          mdi-book-outline
        </v-icon>
        <span class="header-text">Manuscripts</span>
      </div>

      <!-- Manuscript List -->
      <div
        v-for="(ms, idx) in manuscripts"
        :key="ms.subjectUri"
        :class="['ms-list-item', { active: selectedIndex === idx }]"
        @click="selectedIndex = idx"
      >
        <v-icon
          small
          class="book-open-icon"
        >
          mdi-book-open
        </v-icon>
        {{ ms.shortLabel }}
      </div>

      <!-- Mark as Reviewed Button -->
      <v-btn
        color="primary"
        class="reviewed-btn"
        style="margin-top: auto; margin-bottom: 10px;"
        @click="markReviewed"
      >
        Mark as Reviewed
      </v-btn>

      <!-- Download Turtle Button: only visible if "reviewed" is true -->
      <v-btn
        v-if="reviewed"
        class="extract-btn"
        @click="downloadTurtle"
      >
        Download Turtle
      </v-btn>
    </aside>

    <!-- Divider -->
    <div class="divider" />

    <!-- RIGHT PANEL -->
    <section class="review-panel padded-container">
      <h2 class="review-title">
        RDF Triples
      </h2>

      <!-- Prefixes -->
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

      <!-- If a manuscript is selected -->
      <div
        v-if="activeManuscript"
        class="manuscript-section"
      >
        <h3 class="props-heading">
          Properties
        </h3>

        <div
          v-for="(obj, pred) in activeManuscript.properties"
          :key="pred"
          class="property-row"
        >
          <div class="prop-label">
            {{ shrinkUri(pred) }}
          </div>
          <div class="prop-value">
            <!-- 1) If obj is array of URIs => show each URI, but NO remove button if it's includesLocus -->
            <template v-if="Array.isArray(obj)">
              <div
                v-for="(val, i) in obj"
                :key="i"
                style="display: flex; align-items: center; margin-bottom: 0.5rem;"
              >
                <v-text-field
                  class="highlighted-uri"
                  :model-value="shrinkUri(val)"
                  dense
                  hide-details
                  outlined
                  disabled
                />

                <!-- If this predicate is in specialPredicates, show X -->
                <v-btn
                  v-if="specialPredicates.includes(pred)"
                  icon
                  @click="openDialog(pred, val)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>

                <!-- NOTICE: NO cross for includesLocus -->
              </div>
            </template>

            <!-- 2) If single URI => show an X only if it's a specialPredicate, NOT includesLocus -->
            <template v-else-if="typeof obj === 'string' && (obj.startsWith('http://') || obj.startsWith('https://'))">
              <div style="display: flex; align-items: center;">
                <v-text-field
                  class="highlighted-uri"
                  :model-value="shrinkUri(obj)"
                  dense
                  hide-details
                  outlined
                  disabled
                />
                <v-btn
                  v-if="specialPredicates.includes(pred)"
                  icon
                  @click="openDialog(pred, val)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </template>

            <!-- 3) If it's a single string property => editable text -->
            <template v-else-if="typeof obj === 'string'">
              <v-text-field
                :model-value="activeManuscript.properties[pred]"
                dense
                hide-details
                outlined
                @update:model-value="(newVal) => {
                  // Update local data
                  activeManuscript.properties[pred] = newVal;
                  // Update RDF store as xsd:string
                  updateSinglePropertyValue(pred, newVal);
                }"
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
                :model-value="incipitLocus.includesText"
                dense
                hide-details
                outlined
                class="large-textfield"
                @update:model-value="(newVal) => updateLocusText(incipitLocus.nodeUri, newVal)"
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
                :model-value="explicitLocus.includesText"
                dense
                hide-details
                outlined
                class="large-textfield"
                @update:model-value="(newVal) => updateLocusText(explicitLocus.nodeUri, newVal)"
              />
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Please select a manuscript on the left.</p>
      </div>
    </section>

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
        color="black"
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

<script setup>
import { ref, computed, onMounted } from "vue";
import * as rdflib from "rdflib";
import { useAppStore } from "@/stores/app";
// import { useRouter } from "vue-router";

const dialog   = ref(false);
const specPred = ref(null);
const specObj  = ref(null);

function openDialog(pred, obj) {
  specPred.value = pred;
  specObj.value  = obj;
  dialog.value   = true;
}

function confirmDelete() {
  dialog.value = false;
  removeUriValue(specPred.value, specObj.value);
}

// Namespaces
const RDF  = rdflib.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const RDFS = rdflib.Namespace("http://www.w3.org/2000/01/rdf-schema#");
const XSD  = rdflib.Namespace("http://www.w3.org/2001/XMLSchema#");
const EX   = rdflib.Namespace("http://example.org/");
const MS4AI= rdflib.Namespace("http://ontology.tno.nl/manuscriptAI/");

// Vue store & router
const store = useAppStore();
// const router = useRouter();

// Create rdflib store
const rdfStore = rdflib.graph();

// Register prefixes
rdfStore.setPrefixForURI("ex",   "http://example.org/");
rdfStore.setPrefixForURI("rdf",  "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
rdfStore.setPrefixForURI("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
rdfStore.setPrefixForURI("xsd",  "http://www.w3.org/2001/XMLSchema#");
rdfStore.setPrefixForURI("ms4ai","http://ontology.tno.nl/manuscriptAI/");

// Reactive data
const manuscripts = ref([]);
const selectedIndex = ref(null);
const reviewed = ref(false);

// Special predicates that get an X button if URI-based
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

// Computed
const activeManuscript = computed(() => {
  return selectedIndex.value !== null
    ? manuscripts.value[selectedIndex.value]
    : null;
});

// incipit/explicit
const incipitLocus = computed(() => {
  if (!activeManuscript.value) return null;
  return activeManuscript.value.loci.find((l) =>
    l.concernsFeature.endsWith("incipit")
  ) || null;
});
const explicitLocus = computed(() => {
  if (!activeManuscript.value) return null;
  return activeManuscript.value.loci.find((l) =>
    l.concernsFeature.endsWith("explicit")
  ) || null;
});

// On mount => parse
onMounted(() => {
  const turtle = store.rdfOutput || "";
  if (!turtle) {
    console.warn("No RDF output found in store.");
    return;
  }
  parseRdf(turtle);
});

function parseRdf(turtleString) {
  rdflib.parse(turtleString, rdfStore, "http://example.org/", "text/turtle", (err) => {
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
        if (pVal === RDF("type").value) return;

        if (pVal === MS4AI("includesLocus").value) {
          if (!propDict[pVal]) propDict[pVal] = [];
          propDict[pVal].push(oVal);

          // parse Locus node
          const locStms = rdfStore.statementsMatching(st.object, null, null);
          let feature = "", textVal = "";
          locStms.forEach((ls) => {
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
          if (!propDict[pVal]) propDict[pVal] = [];
          propDict[pVal].push(oVal);
        }
      });

      // single-element arrays => single string
      for (const key in propDict) {
        if (Array.isArray(propDict[key]) && propDict[key].length === 1) {
          propDict[key] = propDict[key][0];
        }
      }

      const shelfVal = propDict[MS4AI("shelfmark").value] || "Manuscript (no shelfmark)";
      return {
        subjectUri: sUri,
        shortLabel: shelfVal,
        properties: propDict,
        loci,
      };
    });

    manuscripts.value = results;
    selectedIndex.value = results.length > 0 ? 0 : null;
  });
}

// Mark as reviewed => show "Download Turtle"
function markReviewed() {
  reviewed.value = true;
  alert("Manuscript marked as reviewed! You can now download or keep editing.");
}

/** For normal single-string property => store as xsd:string */
function updateSinglePropertyValue(pred, newVal) {
  if (!activeManuscript.value) return;
  const subject = rdflib.sym(activeManuscript.value.subjectUri);
  const predicate = rdflib.sym(pred);

  // remove old
  const oldStmts = rdfStore.match(subject, predicate, null);
  rdfStore.remove(oldStmts);

  // add new
  const typedStr = rdflib.literal(newVal, null, XSD("string"));
  rdfStore.add(subject, predicate, typedStr);
}

/** For incipit/explicit text fields => store as xsd:string */
function updateLocusText(locusUri, newVal) {
  if (!activeManuscript.value) return;
  const locusObj = activeManuscript.value.loci.find((l) => l.nodeUri === locusUri);
  if (!locusObj) return;

  const s = rdflib.sym(locusUri);
  const p = rdflib.sym(MS4AI("includesText").value);

  const oldStmts = rdfStore.match(s, p, null);
  rdfStore.remove(oldStmts);

  const typedStr = rdflib.literal(newVal, null, XSD("string"));
  rdfStore.add(s, p, typedStr);

  locusObj.includesText = newVal;
}

/** Removes a URI from the local data + the store (only for specialPredicates). */
function removeUriValue(pred, uriToRemove) {
  if (!activeManuscript.value) return;
  const props = activeManuscript.value.properties[pred];

  if (Array.isArray(props)) {
    const idx = props.indexOf(uriToRemove);
    if (idx >= 0) props.splice(idx, 1);
    if (!props.length) delete activeManuscript.value.properties[pred];
  } else {
    delete activeManuscript.value.properties[pred];
  }

  // remove from store
  const subject = rdflib.sym(activeManuscript.value.subjectUri);
  const predicate = rdflib.sym(pred);
  const object = rdflib.sym(uriToRemove);
  const toRemove = rdfStore.match(subject, predicate, object);
  rdfStore.remove(toRemove);
}

/**
 * Download the final Turtle. We do a small string replacement to better
 * format semicolons/comma-lists. It's not perfect, but helps.
 */
function downloadTurtle() {
  const serializer = new rdflib.Serializer(rdfStore, {
    base: "http://example.org/",
    prefixes: {
      ex: "http://example.org/",
      ms4ai: "http://ontology.tno.nl/manuscriptAI/",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd: "http://www.w3.org/2001/XMLSchema#"
    },
    explicit: true,
    shorter: false
  });

  // Remove any short 'm:' prefix if introduced
  if (serializer.namespaces["m"]) {
    delete serializer.namespaces["m"];
  }
  serializer.namespaces["ms4ai"] = "http://ontology.tno.nl/manuscriptAI/";

  let ttlData = serializer.toN3(rdfStore);

  // POST-PROCESS FOR BETTER FORMATTING (still hacky):
  ttlData = ttlData
    .replace(/a m:Locus;/g, "a m:Locus ;")
    .replace(/; m:concernsFeature /g, ";\n    m:concernsFeature ")
    .replace(/; m:includesText /g, ";\n    m:includesText ")
    .replace(/ ; /g, " ;\n    ")
    .replace(/ , /g, ",\n        ")
    // extra blank line before next 'ex:' subject
    .replace(/\.\nex:/g, ".\n\nex:");

  // Trigger download
  const blob = new Blob([ttlData], { type: "text/turtle" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "manuscripts.ttl";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** For UI display of URIs => prefix:local style */
function shrinkUri(fullUri) {
  if (fullUri.startsWith(MS4AI().value)) {
    return "ms4ai:" + fullUri.slice(MS4AI().value.length);
  } else if (fullUri.startsWith(RDF().value)) {
    return "rdf:" + fullUri.slice(RDF().value.length);
  } else if (fullUri.startsWith(RDFS().value)) {
    return "rdfs:" + fullUri.slice(RDFS().value.length);
  } else if (fullUri.startsWith(EX().value)) {
    return "ex:" + fullUri.slice(EX().value.length);
  } else if (fullUri.startsWith(XSD().value)) {
    return "xsd:" + fullUri.slice(XSD().value.length);
  }
  return fullUri;
}
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: calc(100vh - 30px);
  margin-top: 30px;
  padding: 0;
  box-sizing: border-box;
}
.padded-container {
  padding: 1rem;
  box-sizing: border-box;
  font-family: "Courier New", Courier, monospace;
}

.sidebar {
  width: 240px;
  min-width: 240px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.header-text {
  margin-left: 8px;
  font-weight: 600;
  font-size: 1.1rem;
}
.ms-list-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 6px;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}
.ms-list-item:hover {
  background-color: #f2f2f2;
}
.ms-list-item.active {
  background-color: #e8e8e8;
  font-weight: 600;
}
.book-open-icon {
  margin-right: 0.5rem;
}
.extract-btn {
  margin-top: 10px;
  margin-bottom: 20px;
}

.divider {
  width: 1px;
  background-color: #ddd;
  margin: 0 1rem;
}

.review-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.review-title {
  margin-top: 0;
}

.prefixes-box {
  background: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
}
.prefix-row {
  margin-bottom: 6px;
  font-size: 0.95rem;
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
  align-items: center;
  margin-bottom: 1.5rem;
}
.prop-label {
  width: 300px;
  font-weight: 600;
  margin-right: 2rem;
  word-wrap: break-word;
  white-space: normal;
}
.prop-value {
  flex: 1;
  margin-right: 1rem;
}
.reviewed-btn {
  margin-top: auto;
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
  margin-left: 2rem;
}

.large-textfield {
  width: 90%;
  margin-left: 1rem;
  display: inline-block;
}

.highlighted-uri {
  color: #1565c0 !important;
  font-weight: 600;
}
</style>
