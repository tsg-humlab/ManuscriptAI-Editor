<template>
  <div class="content">
    <!-- Left Container (Form Section) -->
    <div class="container-left">
      <h1>Who is recording the manuscript data?</h1>
      <p class="custom-info">
        A unique URI will be generated below to identify you in the knowledge graph.
        This URI will use the namespace <b>{{ namespace }}</b> combined with the ID
        you provide. Spaces are replaced with underscores, and punctuation is not
        accepted.
      </p>

      <form @submit.prevent="goToNextPage">
        <!-- Namespace Field -->
        <div class="form-group">
          <label for="namespace">Namespace</label>
          <input
            id="namespace"
            v-model="namespace"
            type="text"
            readonly
          >
        </div>

        <!-- Identifier Field -->
        <div class="form-group">
          <label for="identifier">Identifier <span class="required">*</span></label>
          <input
            id="identifier"
            v-model="identifier"
            type="text"
            placeholder="Enter identifier"
            @input="updateIdentifier"
          >
        </div>

        <!-- Name Field -->
        <div class="form-group">
          <label for="name">Name <span class="required">*</span></label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter name"
            @input="updateRDF"
          >
        </div>

        <!-- Next Button -->
        <button
          class="btn1"
          :disabled="!isValid"
          @click="goToNextPage"
        >
          Next
        </button>
      </form>
    </div>

    <!-- Right Container (Turtle RDF Syntax) -->
    <div class="container-right">
      <h1>Turtle RDF Syntax</h1>
      <div class="rdf-container">
        <p>Prefixes used:</p>
        <pre id="static-rdf">
@prefix ex: &lt;{{ namespace }}&gt; .
@prefix rdf: &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#&gt; .
@prefix rdfs: &lt;http://www.w3.org/2000/01/rdf-schema#&gt; .
@prefix xsd: &lt;http://www.w3.org/2001/XMLSchema#&gt; .
@prefix MS4AI: &lt;http://ontology.tno.nl/manuscriptAI/&gt; .
        </pre>
      </div>
      <div class="rdf-container">
        <p>Knowledge Graph:</p>
        <pre
          v-if="rdfContent"
          id="dynamic-rdf"
        >{{ rdfContent }}</pre>
        <p
          v-else
          class="rdf-placeholder"
        >
          Enter identifier and name to generate RDF
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// Reactive state
const router = useRouter();
const namespace = ref("http://www.example.org/");
const identifier = ref("");
const name = ref("");
const rdfContent = ref("");

// We'll store a "uniqueId" so the second page can match `MS4AI:performs ex:uniqueId`.
const uniqueId = ref("");

// Is form valid? Both fields non-empty
const isValid = computed(() => identifier.value.trim() !== "" && name.value.trim() !== "");

// 1) this replaces spaces with underscores + remove punctuation from identifier
const updateIdentifier = () => {
  identifier.value = identifier.value
    // Replace spaces with underscores
    .replace(/\s+/g, "_")
    // Remove punctuation (keep alphanumerics and underscores)
    .replace(/[^\w\s]/g, "");

  updateRDF();
};

// 2) this generate a random unique ID
function generateUniqueId() {
  return "id" + Math.random().toString(36).substr(2, 9);
}

// 3) this builds the RDF triple
const updateRDF = () => {
  if (!isValid.value) {
    // Clear RDF if form invalid
    return (rdfContent.value = "");
  }

  // If we haven't set a uniqueId yet, do so.
  if (!uniqueId.value) {
    uniqueId.value = generateUniqueId();
  }

  // The triple with MS4AI:performs ex:${uniqueId.value}
  rdfContent.value = `
ex:${identifier.value} rdf:type MS4AI:Entity ;
    MS4AI:performs ex:${uniqueId.value} ;
    rdfs:label "${name.value}"^^xsd:string .
`.trim();
};

// 4) On Next: store RDF in localStorage, navigate to next page
const goToNextPage = () => {
  localStorage.setItem("rdfTriple", rdfContent.value);
  console.log("Navigating to /nextpage");
  router.push({ name:'nextpage'} );
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

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
  font-size: 1em;
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  width: 100%;
}

input:focus {
  border-color: #23263C;
  outline: none;
}

.btn1 {
  padding: 12px 25px;
  font-size: 1.1em;
  color: white;
  background-color: #23263C;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 20px;
  margin-bottom: 30px;
  text-align: center;
  display: block;
}

.btn1:disabled {
  background-color: #B0BEC5;
  cursor: not-allowed;
}

.btn1:hover:not(:disabled) {
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
}

.rdf-container p {
  margin: 0 0 5px 0;
  font-family: Arial, sans-serif;
  font-size: 0.9em;
  color: #555;
}

.rdf-container pre {
  margin: 0;
  line-height: 1.4;
  font-size: 1em;
}

.rdf-placeholder {
  font-size: 1rem;
  color: #777;
  text-align: center;
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

.required {
  color: red;
}
</style>
