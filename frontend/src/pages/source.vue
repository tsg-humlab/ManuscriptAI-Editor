<template>
  <div class="material-information">
    <header>Manuscript-AI</header>

    <div class="content">
      <!-- LEFT PANEL -->
      <div class="container-left">
        <section id="manuscript-tradition">
          <h1>Manuscript Tradition</h1>
          <p class="custom-info">
            Is your description derived from a specific catalogue or source? If so, please provide the details below.
            If you already have a URI/IRI, click the button on the left (Use URI/IRI for Source). Otherwise, you can create a new one by clicking the button on the right (Create URI/IRI for Source).
          </p>
          <div class="tradition-buttons">
            <button
              class="main-button"
              :disabled="useUriDisabled"
              @click="useTraditionIRI"
            >
              Use URI/IRI for Source
            </button>
            <button
              class="main-button"
              :disabled="createButtonDisabled"
              @click="createTradition"
            >
              Create URI/IRI for Source
            </button>
          </div>

          <!-- Use URI/IRI Section -->
          <div
            v-if="traditionMode === 'use'"
            id="tradition-iri-section"
          >
            <div class="form-group">
              <label for="tradition-manifestation-uri">Source URI/IRI:</label>
              <input
                id="tradition-manifestation-uri"
                v-model="traditionIRI"
                type="url"
                placeholder="Enter valid URI"
                required
                @blur="validateURI"
              >
            </div>
            <button
              class="save-button"
              :disabled="traditionIRIDisabled"
              @click="saveTraditionDetails"
            >
              Confirm
            </button>
          </div>

          <!-- Create New URI/IRI Section -->
          <div
            v-if="traditionMode === 'create'"
            id="create-tradition-section"
          >
            <div class="form-group">
              <label for="tradition-identifier">ID Namespace:</label>
              <input
                id="tradition-identifier"
                type="url"
                value="http://www.example.org/"
                readonly
              >
            </div>
            <div class="form-group">
              <label for="tradition-id">ID:</label>
              <input
                id="tradition-id"
                v-model="traditionId"
                type="text"
                placeholder="Enter Tradition ID"
              >
            </div>
            <div class="form-group">
              <label for="tradition-description">Source:</label>
              <textarea
                id="tradition-description"
                v-model="traditionDescription"
                placeholder="Enter Source"
              />
            </div>
            <button
              class="create-button"
              :disabled="traditionCreated"
              @click="createNewTradition"
            >
              Create Source
            </button>
          </div>

          <div class="next-button-container">
            <button
              class="next-button"
              @click="goToNext"
            >
              Next
            </button>
          </div>
        </section>
      </div>

      <!-- RIGHT PANEL: RDF Display -->
      <div class="container-right">
        <section id="rdf-section">
          <h1>Turtle RDF Syntax</h1>
          <div class="rdf-container">
            <p>Prefixes used:</p>
            <pre
              v-pre
              id="static-rdf"
            >
@prefix ex: &lt;http://www.example.org/&gt; .
@prefix rdf: &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#&gt; .
@prefix rdfs: &lt;http://www.w3.org/2000/01/rdf-schema#&gt; .
@prefix xsd: &lt;http://www.w3.org/2001/XMLSchema#&gt; .
@prefix MS4AI: &lt;http://ontology.tno.nl/manuscriptAI/&gt; .
            </pre>
          </div>
          <div
            class="rdf-container"
            style="overflow:auto; max-height: 800px;"
          >
            <p>Knowledge Graph:</p>
            <pre
              id="dynamic-rdf"
              v-html="dynamicRdf"
            />
          </div>
        </section>
      </div>
    </div>

    <!-- Popup for invalid URI -->
    <!-- Popup for invalid URI -->
    <div
      v-if="showPopup"
      class="popup"
    >
      <h3 class="popup-title">
        Invalid URI
      </h3>
      <p>Please enter a correctly structured URI.</p>
      <button @click="closePopup">
        Close
      </button>
    </div>
    <div
      v-if="showPopup"
      class="overlay"
    />
  </div>
</template>

<script>
export default {
  name: "MaterialInformation",
  data() {
    return {
      dynamicRdf: localStorage.getItem("rdfTriple") || "",
      traditionMode: null,
      traditionIRI: "",
      traditionIRIDisabled: false,
      traditionId: "",
      traditionDescription: "",
      traditionCreated: false,
      showPopup: false,
      popupTimer: null,
      createButtonDisabled: false,
      useUriDisabled: false,
    };
  },
  mounted() {
    history.pushState(null, null, location.href);
    window.onpopstate = () => history.go(1);

    // Detect page refresh: if refreshed, clear stored triple and redirect to landing page.
    if (performance && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      localStorage.removeItem("rdfTriple");
      window.location.href = "/";
    }

    const stored = localStorage.getItem("rdfTriple");
    if (stored) {
      this.dynamicRdf = stored;
    }
  },
  methods: {
    useTraditionIRI() {
      this.traditionMode = "use";
    },
    createTradition() {
      this.traditionMode = "create";
    },
    validateURI() {
      const trimmedUri = this.traditionIRI.trim();
      console.log("Trimmed URI:", trimmedUri);
      const isValidURI = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(trimmedUri);
      if (trimmedUri && !isValidURI) {
        this.showPopupMessage();
        this.traditionIRI = "";
      } else if (trimmedUri) {
        this.updateRDFWithSource(trimmedUri);
      }
    },
    showPopupMessage() {
      clearTimeout(this.popupTimer);
      this.showPopup = true;
      this.popupTimer = setTimeout(() => {
        this.closePopup();
      }, 3000);
    },
    closePopup() {
      this.showPopup = false;
    },
    updateRDFWithSource(uri) {
      this.processTraditionIRI(uri);
      this.updateRDF();
    },

    saveTraditionDetails() {
      const uriInput = this.traditionIRI.trim();
      if (uriInput) {
        this.updateRDFWithSource(uriInput);
        this.traditionIRIDisabled = true;
        this.createButtonDisabled = true;  // Disable the create button
        alert("Tradition details have been added to the knowledge graph.");
      } else {
        alert("Please enter a valid URI before saving.");
      }
    },

    processTraditionIRI(uri) {
      const rawRdf = this.dynamicRdf.replace(/<[^>]+>/g, '').trim();
      console.log(rawRdf);
      const matchId = rawRdf.match(/MS4AI:performs\s+ex:([^<\s]+)/);

      if (!matchId) {
        console.error("Error: Could not find the MS4AI:performs triple or uniqueId.");
        return;
      }

      const uniqueId = matchId[1];  // this captures uniqueId

      if (uniqueId && uri) {
        console.log("URI being appended:", uri);
        const blockRegex = new RegExp(
          `(ex:${uniqueId}\\s+rdf:type\\s+MS4AI:CreationManuscriptDescription\\s*;\\s*[^;]+;)([\\s\\S]*?)(MS4AI:generatesRecordAbout\\s+ex:[^<\\s]+\\s*\\.)`
        );

        if (blockRegex.test(rawRdf)) {
          let updatedRdf = rawRdf.replace(blockRegex, (match, p1, p2, p3) => {
            const newTriple = `    MS4AI:sourcedFrom ${uri} ;`;
            return `${p1}\n${newTriple}${p2}${p3}`;
          });

          // Now we re-embed the RDF back into the HTML (restoring span tags)
          updatedRdf = updatedRdf.replace(/ex:/g, '<span class="ex">ex:</span>');
          updatedRdf = updatedRdf.replace(/MS4AI:/g, '<span class="ms4ai">MS4AI:</span>');
          updatedRdf = updatedRdf.replace(/rdf:/g, '<span class="rdf">rdf:</span>');
          updatedRdf = updatedRdf.replace(/xsd:/g, '<span class="xsd">xsd:</span>');

          document.getElementById('dynamic-rdf').innerHTML = updatedRdf;
          localStorage.setItem('rdfTriple', updatedRdf);
        } else {
          console.error("Could not find the correct RDF block to append the triple.");
        }
      } else {
        console.error("Error: uniqueId or URI is missing");
      }
    },


    updateRDF() {
      localStorage.setItem("rdfTriple", this.dynamicRdf);
    },


createNewTradition() {
  const id = this.traditionId.trim();
  const description = this.traditionDescription.trim();
  if (!id) {
    alert("Please enter a valid Tradition ID before creating.");
    return;
  }

  const rawRdf = this.dynamicRdf.replace(/<[^>]+>/g, '').trim();
  const matchId = rawRdf.match(/MS4AI:performs\s+ex:([^<\s]+)/);

  if (!matchId) {
    console.error("Error: Could not find the MS4AI:performs triple or uniqueId.");
    return;
  }

  const uniqueId = matchId[1];  // The captured uniqueId

  const blockRegex = new RegExp(
    `(ex:${uniqueId}\\s+rdf:type\\s+MS4AI:CreationManuscriptDescription\\s*;\\s*[^;]+;)([\\s\\S]*?)(MS4AI:generatesRecordAbout\\s+ex:[^<\\s]+\\s*\\.)`
  );

  if (blockRegex.test(rawRdf)) {
    let updatedRdf = rawRdf.replace(blockRegex, (match, p1, p2, p3) => {
      const newTriple = `    MS4AI:sourcedFrom ex:${id} ;`;
      return `${p1}\n${newTriple}${p2}${p3}`;
    });

    updatedRdf += `\n\nex:${id} rdfs:label "${description}"^^xsd:string .\n`;

    // Now re-embed the RDF back into the HTML (restoring span tags)
    updatedRdf = updatedRdf.replace(/ex:/g, '<span class="ex">ex:</span>');
    updatedRdf = updatedRdf.replace(/MS4AI:/g, '<span class="ms4ai">MS4AI:</span>');
    updatedRdf = updatedRdf.replace(/rdf:/g, '<span class="rdf">rdf:</span>');
    updatedRdf = updatedRdf.replace(/xsd:/g, '<span class="xsd">xsd:</span>');

    this.dynamicRdf = updatedRdf;
    localStorage.setItem('rdfTriple', updatedRdf);
    alert("New Tradition has been created.");
    this.traditionCreated = true;
    this.useUriDisabled = true;
  } else {
    console.error("Could not find the correct RDF block to append the triple.");
  }
},


    goToNext() {
      localStorage.setItem("rdfTriple", this.dynamicRdf);
      this.$router.push({ name: "download" });
    }
  }
};
</script>

<style scoped>
.material-information {
  min-height: 100vh;
  color: #333;
}
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
  padding: 40px 20px;
}
.container-left,
.container-right {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 45%;
  box-sizing: border-box;
  margin: 10px;
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


.custom-info {
  background-color: #f0f7ff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #1E3A8A;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font-size: 0.9em;
  line-height: 1.6;
  text-align: justify;
}
.tradition-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px;
}
.next-button-container {
  text-align: center;
  margin-top: 20px;
}
.rdf-container {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  font-family: "Courier New", Courier, monospace;
  white-space: pre-wrap;
  overflow: auto;
  max-height: 300px;
}

.main-button,
.save-button,
.create-button,
.next-button {
  background-color: #23263C;
  color: #fff;
  padding: 14px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  text-transform: uppercase;
  margin: 10px 5px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-weight: 600;
  letter-spacing: 1px;
}
.main-button:hover:not(:disabled),
.save-button:hover:not(:disabled),
.create-button:hover:not(:disabled),
.next-button:hover:not(:disabled) {
  background-color: #1B1E2A;
  transform: translateY(-2px);
}
.main-button:disabled,
.save-button:disabled,
.create-button:disabled,
.next-button:disabled {
  background-color: #B0BEC5;
  cursor: not-allowed;
  box-shadow: none;
}

.popup {
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-left: 4px solid #e74c3c;
  padding: 20px 30px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  text-align: center;
}
.popup h3.popup-title {
  margin-top: 0;
  font-size: 1.2em;
  color: #e74c3c;
  margin-bottom: 10px;
}
.popup p {
  font-size: 1em;
  color: #333;
  margin-bottom: 20px;
}
.popup button {
  background-color: #23263C;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 0.8em;
}
.popup button:hover {
  background-color: #1B1E2A;
}


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}
input[type="url"],
input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}
input[type="url"]:focus,
input[type="text"]:focus,
textarea:focus {
  border-color: #D32F2F;
  outline: none;
}

#tradition-iri-section,
#create-tradition-section {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

#tradition-iri-section label,
#create-tradition-section label {
  margin-bottom: 10px;
}

</style>
