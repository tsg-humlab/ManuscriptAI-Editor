<template>
  <div>
    <header>
      Manuscript-AI
    </header>
    <div class="content">
      <!-- Left Panel: URI Fields -->
      <div class="container-left">
        <h1>Expand Connections</h1>
        <p class="custom-info">
          Here, you can link your data with other collections by providing URI/IRI
          identifiers for the work(s), author(s), copyist(s) and place of origin(s)
          of the manuscript.
        </p>
        <button
          class="main-button wikidata"
          @click="searchWikidata"
        >
          Search on Wikidata
        </button>
        <button
          class="main-button europeana"
          @click="searchEuropeana"
        >
          Search on Europeana
        </button>

        <!-- Dynamic URI Fields -->
        <div
          v-for="cat in categories"
          :key="cat.key"
          class="multiple-uris"
        >
          <h3>{{ cat.label }}</h3>
          <div
            v-for="(uri, index) in cat.array"
            :key="cat.key + '-' + index"
            class="form-group"
          >
            <input
              v-model="cat.array[index]"
              type="url"
              :placeholder="cat.placeholder"
              @blur="handleBlur(cat.key, index)"
            >
            <button
              class="add-button"
              @click="addUri(cat.key)"
            >
              +
            </button>
            <button
              v-if="cat.array.length > 1 || (cat.array.length === 1 && uri.trim() !== '')"
              class="remove-button"
              @click="removeUri(cat.key, index)"
            >
              X
            </button>
          </div>
        </div>

        <button
          class="main-button"
          :disabled="invalidURIs.size > 0"
          @click="goToManuscriptTraditionPage"
        >
          Next
        </button>
      </div>

      <!-- Right Panel: RDF Display -->
      <div class="container-right">
        <h1>Turtle RDF Syntax</h1>
        <div
          class="rdf-container"
          style="overflow:auto; max-height: 300px;"
        >
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
          style="overflow:auto; max-height: 800px;"
        >
          <p>Knowledge Graph:</p>
          <pre
            id="dynamic-rdf"
            v-html="rdfContent"
          />
        </div>
      </div>
    </div>

    <!-- Popup for invalid URI -->
    <div
      v-if="uriPopupVisible"
      class="popup"
    >
      <p>{{ popupMessage }}</p>
      <button @click="closeUriPopup">
        Close
      </button>
    </div>
    <div
      v-if="uriPopupVisible"
      class="overlay"
    />
  </div>
</template>

<script>
export default {
  name: "MentionInformation",
  data() {
    return {
      // Get the stored triple (from StructureView.vue)
      storedTriple: localStorage.getItem("rdfTriple") || "",
      // Reactive arrays for each category—each starts with one empty string.
      worksUris: [""],
      authorUris: [""],
      copyistUris: [""],
      rubricatorUris: [""],
      miniaturistUris: [""],
      illuminatorUris: [""],
      bookbinderUris: [""],
      placeOriginUris: [""],
      // Set to track invalid URI fields (keys like "works-0")
      invalidURIs: new Set(),
      // Popup flags and message.
      infoPopupVisible: false,
      uriPopupVisible: false,
      popupMessage: "",
      // Define our categories; each will link to its reactive array.
      categories: [
        { key: "works", label: "Work", array: null, placeholder: "Enter valid URI" },
        { key: "author", label: "Author", array: null, placeholder: "Enter valid URI" },
        { key: "copyist", label: "Copyist", array: null, placeholder: "Enter valid URI" },
        { key: "rubricator", label: "Rubricator", array: null, placeholder: "Enter valid URI" },
        { key: "miniaturist", label: "Miniaturist", array: null, placeholder: "Enter valid URI" },
        { key: "illuminator", label: "Illuminator", array: null, placeholder: "Enter valid URI" },
        { key: "bookbinder", label: "Bookbinder", array: null, placeholder: "Enter valid URI" },
        { key: "placeOrigin", label: "Place of Origin", array: null, placeholder: "Enter valid URI" }
      ]
    };
  },
  computed: {
    rdfContent() {
      // Start with the stored triple.
      let rdf = this.storedTriple;
      // If the stored triple ends with " .", remove it and add a semicolon for further appending.
      if (rdf.endsWith(" .")) {
        rdf = rdf.slice(0, -2) + " ;\n";
      }
      // Helper: Only append if the value is non-empty and passes the URI regex.
      const uriPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      const appendTriple = (predicate, value) => {
        const trimmed = value.trim();
        if (trimmed === "" || !uriPattern.test(trimmed)) return;
        rdf += `    <span class="ms4ai">${predicate}</span> <span class="uri">&lt;${trimmed}&gt;</span> ;\n`;
      };
      // Append additional triples for each category.
      this.worksUris.forEach(uri => appendTriple("MS4AI:includesWork", uri));
      this.authorUris.forEach(uri => appendTriple("MS4AI:hasAttributedAuthor", uri));
      this.copyistUris.forEach(uri => appendTriple("MS4AI:hasAttributedCopyist", uri));
      this.rubricatorUris.forEach(uri => appendTriple("MS4AI:hasAttributedRubricator", uri));
      this.miniaturistUris.forEach(uri => appendTriple("MS4AI:hasAttributedMiniaturist", uri));
      this.illuminatorUris.forEach(uri => appendTriple("MS4AI:hasAttributedIlluminator", uri));
      this.bookbinderUris.forEach(uri => appendTriple("MS4AI:hasAttributedBookbinder", uri));
      this.placeOriginUris.forEach(uri => appendTriple("MS4AI:hasPlaceOfOrigin", uri));
      // Replace the final semicolon with a period.
      rdf = rdf.trim().replace(/;\s*$/, " .");
      return rdf;
    }
  },
  watch: {
    // Whenever the computed RDF content changes, update localStorage.
    rdfContent(newVal) {
      localStorage.setItem("rdfTriple", newVal);
    }
  },
  mounted() {
    // Block back navigation.
    history.pushState(null, null, location.href);
    window.onpopstate = () => history.go(1);

    // Detect page refresh: if refreshed, clear stored triple and redirect to landing page.
    if (performance && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      localStorage.removeItem("rdfTriple");
      window.location.href = "/";
      return;
    }

    // If no stored triple exists, redirect to landing page.
    if (!this.storedTriple) {
      window.location.href = "/";
      return;
    }

    // Link each category's array to the corresponding reactive property.
    this.categories.forEach(cat => {
      if (cat.key === "works") cat.array = this.worksUris;
      else if (cat.key === "author") cat.array = this.authorUris;
      else if (cat.key === "copyist") cat.array = this.copyistUris;
      else if (cat.key === "rubricator") cat.array = this.rubricatorUris;
      else if (cat.key === "miniaturist") cat.array = this.miniaturistUris;
      else if (cat.key === "illuminator") cat.array = this.illuminatorUris;
      else if (cat.key === "bookbinder") cat.array = this.bookbinderUris;
      else if (cat.key === "placeOrigin") cat.array = this.placeOriginUris;
    });
  },
  methods: {
    closeUriPopup() {
      this.uriPopupVisible = false;
      this.popupMessage = "";
    },
    // External navigation.
    searchWikidata() {
      window.open("https://www.wikidata.org/wiki/Wikidata:Main_Page", "_blank");
    },
    searchEuropeana() {
      window.open("https://www.europeana.eu/en", "_blank");
    },
    goToManuscriptTraditionPage() {
      // it uses Vue Router to navigate to the physical characteristics page.
      this.$router.push({ name: "physicalCharacteristics" });
    },
    // Validate a URI value; if invalid, it shows a popup and add to the invalid set.
    validateURI(value, category, index) {
      const trimmed = value.trim();
      const uriPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      if (!trimmed) {
        // If empty, remove any invalid flag.
        this.invalidURIs.delete(`${category}-${index}`);
        return true;
      }
      if (!uriPattern.test(trimmed)) {
        this.showUriError("Invalid URI format! Please enter a correctly structured URI.", category, index);
        return false;
      }
      this.invalidURIs.delete(`${category}-${index}`);
      return true;
    },
    showUriError(message, category, index) {
      this.uriPopupVisible = true;
      this.popupMessage = message;
      this.invalidURIs.add(`${category}-${index}`);
      setTimeout(() => {
        this.closeUriPopup();
      }, 3000);
    },
    // Handle blur event on an input: validate and (if valid) update RDF.
    handleBlur(category, index) {
      // Validate the field; if invalid, do not update RDF.
      if (this.validateURI(this.categories.find(c => c.key === category).array[index], category, index)) {
        // No need to explicitly call updateRDF because rdfContent is computed.
      }
    },
    // this adds a new empty field for the given category.
    addUri(category) {
      if (category === "works") this.worksUris.push("");
      else if (category === "author") this.authorUris.push("");
      else if (category === "copyist") this.copyistUris.push("");
      else if (category === "rubricator") this.rubricatorUris.push("");
      else if (category === "miniaturist") this.miniaturistUris.push("");
      else if (category === "illuminator") this.illuminatorUris.push("");
      else if (category === "bookbinder") this.bookbinderUris.push("");
      else if (category === "placeOrigin") this.placeOriginUris.push("");
    },
    // Remove the field at the given index from the specified category.
    removeUri(category, index) {
      let arr;
      if (category === "works") arr = this.worksUris;
      else if (category === "author") arr = this.authorUris;
      else if (category === "copyist") arr = this.copyistUris;
      else if (category === "rubricator") arr = this.rubricatorUris;
      else if (category === "miniaturist") arr = this.miniaturistUris;
      else if (category === "illuminator") arr = this.illuminatorUris;
      else if (category === "bookbinder") arr = this.bookbinderUris;
      else if (category === "placeOrigin") arr = this.placeOriginUris;

      if (arr) {
        if (arr.length > 1) {
          arr.splice(index, 1);
        } else {
          arr[0] = "";
        }
      }
    }
  }
};
</script>

<style scoped>

header{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  background:#23263C;
  color:#fff;
  text-align:center;
  padding:20px 0;
  text-transform:uppercase;
  letter-spacing:1px;
  font-weight:bold;
  z-index:1000;
}

.content{
  height:calc(100vh - 80px);
  display:flex;
  gap:20px;
  padding:20px;
  overflow-x:hidden;
}

.container-left,
.container-right{
  /* may grow (=1), may shrink (=1), base width 45 % */
  flex:1 1 45%;
  max-width:45%;
  min-width:0;
  min-height:0;
  background:#fff;
  padding:20px;
  border-radius:12px;
  box-shadow:0 4px 20px rgba(0,0,0,.1);
  display:flex;
  flex-direction:column;
  overflow-y:auto;
  box-sizing:border-box;
}


.container-left{
  padding-right:1rem;
}

.rdf-container{
  padding:10px;
  margin-bottom:10px;
  background:#f9f9f9;
  border-radius:8px;
  box-shadow:0 2px 10px rgba(0,0,0,.1);
  font-family:"Courier New",Courier,monospace;
  max-height:300px;
  overflow:auto;
  white-space:pre-wrap;
}


.rdf-container pre,
#dynamic-rdf{
  white-space:pre-wrap;
  overflow-wrap:anywhere;
  word-break:break-all;
  overflow-x:auto;
  font-size: 0.85em;
  line-height: 1.4;
}

.container-left h1,
.container-right h1{
  margin-bottom:20px;
  font-size:2em;
  color:#23263C;
  text-transform:uppercase;
  letter-spacing:1px;
  font-weight:bold;
  text-align:center;
  line-height:1.2;
}


.custom-info {
  background-color: #f0f7ff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #1E3A8A;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 0.9em;
  line-height: 1.6em;
  color: #333;
  margin-bottom: 20px;
  text-align: justify;
}

p {
  font-size: 1em;
  line-height: 1.6;
  color: #333;
}


.main-button {
  display: inline-block;
  background-color: #23263C;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  text-align: center;
  margin-bottom: 20px;
  margin-right: 10px;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.main-button:hover {
  background-color: #23263C;
  transform: translateY(-2px);
}

.main-button.wikidata {
  background-color:  #23263C;
}
.main-button.wikidata:hover {
  background-color:  #23263C;
}
.main-button.europeana {
  background-color:  #23263C;
}
.main-button.europeana:hover {
  background-color:  #23263C;
}

.popup {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}


.form-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.form-group input {
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s ease;
}
.form-group input:focus {
  border-color: #23263C;
  outline: none;
}


.add-button {
  background-color: #23263C;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  text-transform: uppercase;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.add-button:hover {
  background-color: #1B1E2A;
  transform: translateY(-2px);
}
.remove-button {
  background-color: #B0BEC5;
  color: #23263C;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.remove-button:hover {
  background-color: #90A4AE;
  transform: translateY(-2px);
}
</style>
