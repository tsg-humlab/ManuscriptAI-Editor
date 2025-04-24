<template>
  <div>
    <header>
      Manuscript-AI
    </header>
    <div class="content">
      <!-- LEFT PANEL: Physical Characteristics Form -->
      <div class="container-left">
        <h1>Physical Characteristics</h1>

        <!-- SCRIPT -->
        <div class="padded-group">
          <div class="form-group">
            <label for="predefined-script">Script</label>
            <div class="multiselect-container">
              <select
                id="predefined-script"
                ref="predefinedScript"
                v-model="selectedScript"
                @change="addScriptSelection"
              >
                <option value="">
                  Select a predefined script
                </option>
                <option value="uncial">
                  Uncial
                </option>
                <option value="half-uncial">
                  Half-uncial
                </option>
                <option value="carolingianMinuscule">
                  Carolingian Minuscule
                </option>
                <option value="textualis">
                  Textualis
                </option>
                <option value="cursiva">
                  Cursiva
                </option>
                <option value="bastarda">
                  Bastarda
                </option>
                <option value="mercantesca">
                  Mercantesca
                </option>
                <option value="angloSaxonMinuscule">
                  Anglo-Saxon Minuscule
                </option>
                <option value="rotunda">
                  Rotunda
                </option>
                <option value="notarile">
                  Notarile
                </option>
                <option value="humanistic">
                  Humanistic
                </option>
                <option value="insularScript">
                  Insular Script
                </option>
                <option value="visigothic">
                  Visigothic
                </option>
                <option value="beneventan">
                  Beneventan
                </option>
                <option value="merovingian">
                  Merovingian
                </option>
                <option value="luxueilMinuscule">
                  Luxueil Minuscule
                </option>
                <option value="ashuriScript">
                  Ashuri Script
                </option>
                <option value="byzantineMinuscule">
                  Byzantine Minuscule
                </option>
                <option value="kufic">
                  Kufic
                </option>
                <option value="maghrebi">
                  Maghrebi
                </option>
                <option value="nandinagari">
                  Nandinagari
                </option>
                <option value="brahmi">
                  Brahmi
                </option>
                <option value="kana">
                  Kana
                </option>
                <option value="pallava">
                  Pallava
                </option>
                <option value="baybayin">
                  Baybayin
                </option>
                <option value="nahuatlWriting">
                  Nahuatl Writing
                </option>
                <option value="chanceryHand">
                  Chancery Hand
                </option>
                <option value="cyrillicScript">
                  Cyrillic Script
                </option>
                <option value="naskh">
                  Naskh
                </option>
                <option value="devanagari">
                  Devanagari
                </option>
                <option value="chineseCalligraphy">
                  Chinese Calligraphy
                </option>
                <option value="phagsPa">
                  Phags-pa
                </option>
                <option value="khmer">
                  Khmer
                </option>
                <option value="geez">
                  Ge'ez
                </option>
                <option value="mayaHieroglyphs">
                  Maya Hieroglyphs
                </option>
              </select>
              <transition-group
                name="slide-fade"
                tag="div"
                class="selected-items"
              >
                <span
                  v-for="(s, i) in selectedScripts"
                  :key="s.value"
                  @click="removeScript(s.value)"
                >
                  {{ s.text }}
                </span>
              </transition-group>
            </div>
          </div>
          <div class="form-group">
            <label for="additional-info-script">(Additional) Information about Script</label>
            <input
              id="additional-info-script"
              v-model="additionalInfoScript"
              type="text"
              placeholder="Enter information about the script"
              @input="updateRDF"
            >
          </div>
        </div>

        <!-- SUPPORT -->
        <div class="padded-group">
          <div class="form-group">
            <label for="predefined-support">Support</label>
            <div class="multiselect-container">
              <select
                id="predefined-support"
                ref="predefinedSupport"
                v-model="selectedSupport"
                @change="addSupportSelection"
              >
                <option value="">
                  Select a predefined support
                </option>
                <option value="papyrus">
                  Papyrus
                </option>
                <option value="parchment">
                  Parchment
                </option>
                <option value="silk">
                  Silk
                </option>
                <option value="bark">
                  Bark
                </option>
                <option value="palmLeaves">
                  Palm Leaves
                </option>
                <option value="paper">
                  Paper
                </option>
                <option value="vellum">
                  Vellum
                </option>
                <option value="donkeySkin">
                  Donkey Skin
                </option>
                <option value="marbledPaper">
                  Marbled Paper
                </option>
                <option value="uterineVellum">
                  Uterine Vellum
                </option>
                <option value="russiaLeather">
                  Russia Leather
                </option>
                <option value="calico">
                  Calico
                </option>
                <option value="canvas">
                  Canvas
                </option>
                <option value="sheepskin">
                  Sheepskin
                </option>
                <option value="velvet">
                  Velvet
                </option>
                <option value="naturalGoatskin">
                  Natural Goatskin
                </option>
                <option value="roughskin">
                  Roughskin
                </option>
                <option value="satin">
                  Satin
                </option>
                <option value="deerskin">
                  Deer Skin
                </option>
                <option value="pigskin">
                  Pigskin
                </option>
                <option value="morocco">
                  Morocco
                </option>
              </select>
              <transition-group
                name="slide-fade"
                tag="div"
                class="selected-items"
              >
                <span
                  v-for="(s, i) in selectedSupports"
                  :key="s.value"
                  @click="removeSupport(s.value)"
                >
                  {{ s.text }}
                </span>
              </transition-group>
            </div>
          </div>
          <div class="form-group">
            <label for="additional-info-support">(Additional) Information about Support</label>
            <input
              id="additional-info-support"
              v-model="additionalInfoSupport"
              type="text"
              placeholder="Enter information about the support"
              @input="updateRDF"
            >
          </div>
        </div>

        <!-- DECORATION -->
        <div class="padded-group">
          <div class="form-group">
            <label for="predefined-decoration">Includes Decoration</label>
            <div class="multiselect-container">
              <select
                id="predefined-decoration"
                ref="predefinedDecoration"
                v-model="selectedDecoration"
                @change="addDecorationSelection"
              >
                <option value="">
                  Select a predefined decoration
                </option>
                <option value="illumination">
                  Illumination
                </option>
                <option value="miniature">
                  Miniature
                </option>
                <option value="historiatedInitial">
                  Historiated Initial
                </option>
                <option value="borderDesign">
                  Border Design
                </option>
                <option value="drollerie">
                  Drollerie
                </option>
                <option value="bindingDecoration">
                  Binding Decoration
                </option>
                <option value="tooling">
                  Tooling
                </option>
                <option value="embossing">
                  Embossing
                </option>
                <option value="decoratedInitial">
                  Decorated Initial
                </option>
                <option value="schematicDrawing">
                  Schematic Drawing
                </option>
                <option value="penworkInitial">
                  Penwork Initial
                </option>
                <option value="coloredDrawing">
                  Colored Drawing
                </option>
                <option value="figure">
                  Figure
                </option>
                <option value="ornamentation">
                  Ornamentation
                </option>
                <option value="illustrationCycle">
                  Illustration Cycle
                </option>
                <option value="panel">
                  Panel
                </option>
                <option value="fastener">
                  Fastener
                </option>
                <option value="clasp">
                  Clasp
                </option>
              </select>
              <transition-group
                name="slide-fade"
                tag="div"
                class="selected-items"
              >
                <span
                  v-for="(d, i) in selectedDecorations"
                  :key="d.value"
                  @click="removeDecoration(d.value)"
                >
                  {{ d.text }}
                </span>
              </transition-group>
            </div>
          </div>
          <div class="form-group">
            <label for="additional-info-decoration">(Additional) Information about Decoration(s)</label>
            <input
              id="additional-info-decoration"
              v-model="additionalInfoDecoration"
              type="text"
              placeholder="Enter information about the decoration(s)"
              @input="updateRDF"
            >
          </div>
        </div>

        <!-- FORMAT -->
        <div class="padded-group">
          <div class="form-group">
            <label for="predefined-format">Format</label>
            <div class="multiselect-container">
              <select
                id="predefined-format"
                ref="predefinedFormat"
                v-model="selectedFormat"
                @change="addFormatSelection"
              >
                <option value="">
                  Select a predefined format
                </option>
                <option value="quarto">
                  Quarto (4to)
                </option>
                <option value="folio">
                  Folio (2to)
                </option>
                <option value="octavo">
                  Octavo (8vo)
                </option>
                <option value="duodecimo">
                  Duodecimo (12mo)
                </option>
                <option value="sextodecimo">
                  Sextodecimo (16mo)
                </option>
              </select>
              <transition-group
                name="slide-fade"
                tag="div"
                class="selected-items"
              >
                <span
                  v-for="(f, i) in selectedFormats"
                  :key="f.value"
                  @click="removeFormat(f.value)"
                >
                  {{ f.text }}
                </span>
              </transition-group>
            </div>
          </div>
          <div class="form-group">
            <label for="additional-info-format">(Additional) Information about Format</label>
            <input
              id="additional-info-format"
              v-model="additionalInfoFormat"
              type="text"
              placeholder="Enter information about the format"
              @input="updateRDF"
            >
          </div>
        </div>

        <!-- INK -->
        <div class="padded-group">
          <div class="form-group">
            <label for="predefined-ink">Ink</label>
            <div class="multiselect-container">
              <select
                id="predefined-ink"
                ref="predefinedInk"
                v-model="selectedInk"
                @change="addInkSelection"
              >
                <option value="">
                  Select a predefined ink
                </option>
                <option value="carbonInk">
                  Carbon Ink
                </option>
                <option value="invisibleInk">
                  Invisible Ink
                </option>
                <option value="copperGallInk">
                  Copper Gall Ink
                </option>
                <option value="redInk">
                  Red Ink
                </option>
                <option value="ironGallInk">
                  Iron Gall Ink
                </option>
                <option value="coloredInk">
                  Colored Ink
                </option>
                <option value="organicInk">
                  Organic Ink
                </option>
              </select>
              <transition-group
                name="slide-fade"
                tag="div"
                class="selected-items"
              >
                <span
                  v-for="(ink, i) in selectedInks"
                  :key="ink.value"
                  @click="removeInk(ink.value)"
                >
                  {{ ink.text }}
                </span>
              </transition-group>
            </div>
          </div>
          <div class="form-group">
            <label for="additional-info-ink">(Additional) Information about Ink</label>
            <input
              id="additional-info-ink"
              v-model="additionalInfoInk"
              type="text"
              placeholder="Enter information about the ink"
              @input="updateRDF"
            >
          </div>
        </div>

        <!-- BINDING TECHNIQUE -->
        <div class="padded-group">
          <div class="form-group">
            <label for="predefined-binding-technique">Binding Technique</label>
            <div class="multiselect-container">
              <select
                id="predefined-binding-technique"
                ref="predefinedBindingTechnique"
                v-model="selectedBindingTechnique"
                @change="addBindingTechniqueSelection"
              >
                <option value="">
                  Select a predefined binding technique
                </option>
                <option value="copticBinding">
                  Coptic Binding
                </option>
                <option value="carolingianBinding">
                  Carolingian Binding
                </option>
                <option value="romanesqueBinding">
                  Romanesque Binding
                </option>
                <option value="gothicBinding">
                  Gothic Binding
                </option>
                <option value="limpVellumBinding">
                  Limp Vellum Binding
                </option>
                <option value="sewnOnCordsBinding">
                  Sew-on-Cords Binding
                </option>
              </select>
              <transition-group
                name="slide-fade"
                tag="div"
                class="selected-items"
              >
                <span
                  v-for="(b, i) in selectedBindingTechniques"
                  :key="b.value"
                  @click="removeBindingTechnique(b.value)"
                >
                  {{ b.text }}
                </span>
              </transition-group>
            </div>
          </div>
          <div class="form-group">
            <label for="additional-info-binding-technique">(Additional) Information about Binding Technique</label>
            <input
              id="additional-info-binding-technique"
              v-model="additionalInfoBindingTechnique"
              type="text"
              placeholder="Enter information about the binding technique"
              @input="updateRDF"
            >
          </div>
        </div>

        <!-- DIMENSIONS & CONSERVATION -->
        <div class="padded-group">
          <div class="form-group">
            <label for="width">Manuscript Width in Millimeters</label>
            <input
              id="width"
              v-model="width"
              type="text"
              placeholder="Enter width in millimeters"
              @input="updateRDF"
            >
          </div>
        </div>
        <div class="padded-group">
          <div class="form-group">
            <label for="length">Manuscript Length in Millimeters</label>
            <input
              id="length"
              v-model="length"
              type="text"
              placeholder="Enter length in millimeters"
              @input="updateRDF"
            >
          </div>
        </div>
        <div class="padded-group">
          <div class="form-group">
            <label for="thickness">Manuscript Thickness in Millimeters</label>
            <input
              id="thickness"
              v-model="thickness"
              type="text"
              placeholder="Enter thickness in millimeters"
              @input="updateRDF"
            >
          </div>
        </div>
        <div class="padded-group">
          <div class="form-group">
            <label for="foliosCount">Number of Folia</label>
            <input
              id="foliosCount"
              v-model="foliosCount"
              type="text"
              placeholder="Enter number of Folia"
              @input="updateRDF"
            >
          </div>
        </div>
        <div class="padded-group">
          <div class="form-group">
            <label for="conservationInterventions">Conservation Interventions</label>
            <input
              id="conservationInterventions"
              v-model="conservationInterventions"
              type="text"
              placeholder="Enter conservation interventions information"
              @input="updateRDF"
            >
          </div>
        </div>

        <!-- Next Page Button -->
        <button
          class="main-button"
          @click="goToLocusPage"
        >
          Next
        </button>
      </div>

      <!-- RIGHT PANEL: RDF Display -->
      <div class="container-right">
        <h1>Turtle RDF Syntax</h1>
        <div class="rdf-container">
          <p>Prefixes used:</p>
          <pre id="static-rdf">
@prefix ex: &lt;<span class="ex">http://www.example.org/</span>&gt; .
@prefix rdf: &lt;<span class="rdf">http://www.w3.org/1999/02/22-rdf-syntax-ns#</span>&gt; .
@prefix rdfs: &lt;<span class="rdfs">http://www.w3.org/2000/01/rdf-schema#</span>&gt; .
@prefix xsd: &lt;<span class="xsd">http://www.w3.org/2001/XMLSchema#</span>&gt; .
@prefix MS4AI: &lt;<span class="ms4ai">http://ontology.tno.nl/manuscriptAI/</span>&gt; .
          </pre>
        </div>
        <div
          class="rdf-container"
          style="overflow:auto; max-height: 2000px;"
        >
          <p>Knowledge Graph:</p>
          <pre
            id="dynamic-rdf"
            v-html="rdfContent"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhysicalCharacteristics",
  data() {
    return {
      // Stored triple from the previous page
      storedTriple: "",
      // Multiselect arrays
      selectedScripts: [],
      selectedSupports: [],
      selectedDecorations: [],
      selectedFormats: [],
      selectedInks: [],
      selectedBindingTechniques: [],
      // v-model for dropdown selections
      selectedScript: "",
      selectedSupport: "",
      selectedDecoration: "",
      selectedFormat: "",
      selectedInk: "",
      selectedBindingTechnique: "",
      // Additional info fields
      additionalInfoScript: "",
      additionalInfoSupport: "",
      additionalInfoDecoration: "",
      additionalInfoFormat: "",
      additionalInfoInk: "",
      additionalInfoBindingTechnique: "",
      // Dimensions & conservation
      width: "",
      length: "",
      thickness: "",
      foliosCount: "",
      conservationInterventions: ""
    };
  },
  computed: {
    rdfContent() {
      // Begin with the stored triple.
      let rdf = this.storedTriple;
      // If the stored triple ends with " .", convert it to a semicolon for appending.
      if (rdf.endsWith(" .")) {
        rdf = rdf.slice(0, -2) + " ;\n";
      }
      // Helper to append a triple line.
      const appendTriple = (predicate, value, isUri = false) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        if (isUri) {
          rdf += `    <span class="ms4ai">${predicate}</span> <span class="xsd"><span class="ms4ai">MS4AI:${trimmed}</span></span> ;\n`;
        } else {
          rdf += `    <span class="ms4ai">${predicate}</span> <span class="xsd">"${trimmed}"^^xsd:string</span> ;\n`;
        }
      };
      // Append physical characteristics.
      // Scripts
      this.selectedScripts.forEach(s => appendTriple("MS4AI:hasScript", s.value, true));
      appendTriple("MS4AI:script", this.additionalInfoScript);
      // Supports
      this.selectedSupports.forEach(s => appendTriple("MS4AI:hasSupport", s.value, true));
      appendTriple("MS4AI:support", this.additionalInfoSupport);
      // Decorations
      this.selectedDecorations.forEach(d => appendTriple("MS4AI:hasDecoration", d.value, true));
      appendTriple("MS4AI:includesDecoration", this.additionalInfoDecoration);
      // Formats
      this.selectedFormats.forEach(f => appendTriple("MS4AI:hasFormat", f.value, true));
      appendTriple("MS4AI:format", this.additionalInfoFormat);
      // Inks
      this.selectedInks.forEach(i => appendTriple("MS4AI:hasInk", i.value, true));
      appendTriple("MS4AI:ink", this.additionalInfoInk);
      // Binding techniques
      this.selectedBindingTechniques.forEach(b => appendTriple("MS4AI:hasBindingTechnique", b.value, true));
      appendTriple("MS4AI:binding", this.additionalInfoBindingTechnique);
      // Dimensions and conservation
      appendTriple("MS4AI:width", this.width);
      appendTriple("MS4AI:length", this.length);
      appendTriple("MS4AI:thickness", this.thickness);
      appendTriple("MS4AI:foliaCount", this.foliosCount);
      appendTriple("MS4AI:conservationIntervention", this.conservationInterventions);
      rdf = rdf.trim().replace(/;\s*$/, " .");
      return rdf;
    }
  },
  watch: {
    rdfContent(newVal) {
      localStorage.setItem("rdfTriple", newVal);
    }
  },
  mounted() {
    // Block back navigation.
    history.pushState(null, null, location.href);
    window.onpopstate = () => history.go(1);
    // If refreshed, clear stored triple and go to landing page.
    if (performance && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      localStorage.removeItem("rdfTriple");
      window.location.href = "/";
      return;
    }
    // Load stored triple from localStorage.
    const triple = localStorage.getItem("rdfTriple");
    if (!triple) {
      window.location.href = "/";
      return;
    }
    this.storedTriple = triple;
  },
  methods: {
    // SCRIPT
    addScriptSelection() {
      if (this.selectedScript) {
        const exists = this.selectedScripts.some(s => s.value === this.selectedScript);
        if (!exists) {
          const selectElem = this.$refs.predefinedScript;
          const textLabel = selectElem.options[selectElem.selectedIndex].text;
          this.selectedScripts.push({ value: this.selectedScript, text: textLabel });
          this.selectedScript = "";
          this.updateRDF();
        }
      }
    },
    removeScript(val) {
      this.selectedScripts = this.selectedScripts.filter(s => s.value !== val);
      this.updateRDF();
    },
    // SUPPORT
    addSupportSelection() {
      if (this.selectedSupport) {
        const exists = this.selectedSupports.some(s => s.value === this.selectedSupport);
        if (!exists) {
          const selectElem = this.$refs.predefinedSupport;
          const textLabel = selectElem.options[selectElem.selectedIndex].text;
          this.selectedSupports.push({ value: this.selectedSupport, text: textLabel });
          this.selectedSupport = "";
          this.updateRDF();
        }
      }
    },
    removeSupport(val) {
      this.selectedSupports = this.selectedSupports.filter(s => s.value !== val);
      this.updateRDF();
    },
    // DECORATION
    addDecorationSelection() {
      if (this.selectedDecoration) {
        const exists = this.selectedDecorations.some(d => d.value === this.selectedDecoration);
        if (!exists) {
          const selectElem = this.$refs.predefinedDecoration;
          const textLabel = selectElem.options[selectElem.selectedIndex].text;
          this.selectedDecorations.push({ value: this.selectedDecoration, text: textLabel });
          this.selectedDecoration = "";
          this.updateRDF();
        }
      }
    },
    removeDecoration(val) {
      this.selectedDecorations = this.selectedDecorations.filter(d => d.value !== val);
      this.updateRDF();
    },
    // FORMAT
    addFormatSelection() {
      if (this.selectedFormat) {
        const exists = this.selectedFormats.some(f => f.value === this.selectedFormat);
        if (!exists) {
          const selectElem = this.$refs.predefinedFormat;
          const textLabel = selectElem.options[selectElem.selectedIndex].text;
          this.selectedFormats.push({ value: this.selectedFormat, text: textLabel });
          this.selectedFormat = "";
          this.updateRDF();
        }
      }
    },
    removeFormat(val) {
      this.selectedFormats = this.selectedFormats.filter(f => f.value !== val);
      this.updateRDF();
    },
    // INK
    addInkSelection() {
      if (this.selectedInk) {
        const exists = this.selectedInks.some(i => i.value === this.selectedInk);
        if (!exists) {
          const selectElem = this.$refs.predefinedInk;
          const textLabel = selectElem.options[selectElem.selectedIndex].text;
          this.selectedInks.push({ value: this.selectedInk, text: textLabel });
          this.selectedInk = "";
          this.updateRDF();
        }
      }
    },
    removeInk(val) {
      this.selectedInks = this.selectedInks.filter(i => i.value !== val);
      this.updateRDF();
    },
    // BINDING TECHNIQUE
    addBindingTechniqueSelection() {
      if (this.selectedBindingTechnique) {
        const exists = this.selectedBindingTechniques.some(b => b.value === this.selectedBindingTechnique);
        if (!exists) {
          const selectElem = this.$refs.predefinedBindingTechnique;
          const textLabel = selectElem.options[selectElem.selectedIndex].text;
          this.selectedBindingTechniques.push({ value: this.selectedBindingTechnique, text: textLabel });
          this.selectedBindingTechnique = "";
          this.updateRDF();
        }
      }
    },
    removeBindingTechnique(val) {
      this.selectedBindingTechniques = this.selectedBindingTechniques.filter(b => b.value !== val);
      this.updateRDF();
    },
    updateRDF() {
      localStorage.setItem("rdfTriple", this.rdfContent);
    },
    goToLocusPage() {
      localStorage.setItem("rdfTriple", this.rdfContent);
      // Navigate to the "locus" route
      this.$router.push({ name: "manuscriptDescriptionChoice" });
}
  }
};
</script>

<style scoped>

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #23263C;
  color: white;
  text-align: center;
  padding: 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  z-index: 1000;
}


.content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}


.container-left,
.container-right {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 45%;
  width: 100%;
  box-sizing: border-box;
  margin: 10px;
  display: flex;
  flex-direction: column;
}


.container-left h1,
.container-right h1 {
  margin-bottom: 20px;
  font-size: 2em;
  color: #23263C;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
}


.padded-group {
  margin-bottom: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}


.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}


label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
  font-size: 1em;
}


input,
select {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  width: 100%;
}
input:focus,
select:focus {
  border-color: #23263C;
  outline: none;
}


.multiselect-container {
  position: relative;
}
.selected-items {
  margin-top: 10px;
  padding: 10px;
  background-color: #f6f6f6;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 38px;
}
.selected-items span {
  display: inline-block;
  background-color: #23263C;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  margin: 2px;
  font-size: 0.9em;
  cursor: pointer;
}
.selected-items span:hover {
  background-color: #23263C;
}


.main-button {
  display: inline-block;
  background-color: #23263C;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  text-align: center;
  margin-bottom: 20px;
  margin-right: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.main-button:hover {
  background-color: #1B1E2A;
  transform: translateY(-2px);
}


.rdf-container {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: "Courier New", Courier, monospace;
  white-space: pre-wrap;
  overflow: auto;
  max-height: 300px;
}


</style>
