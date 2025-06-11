<template>
  <v-container
    class="content-container"
    fluid
  >
    <v-row
      justify="center"
      class="mt-10"
    >
      <!-- Title Section -->
      <v-col
        cols="12"
        md="11"
        lg="10"
      >
        <v-card class="title-card">
          <v-card-title class="text-center text-h5 font-weight-bold">
            Convert Catalogue Data on Medieval Manuscripts to Linked Open Data
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Description Section -->
    <v-row justify="center">
      <v-col
        cols="12"
        md="11"
        lg="10"
      >
        <v-card class="padded-box">
          <v-card-text>
            <p class="description-text">
              Use <b>ManuscriptAI Annotation Desk</b> to identify relevant concepts for describing and cataloging the medieval manuscripts in your dataset. We will then convert them into Linked Open Data (LOD) using the <b>ManuscriptAI ontology</b>, enabling you to download the converted data for further analysis or presentations. Additionally, we’ll help establish URIs linking your data to Wikidata, ensuring your manuscript information is semantically connected within a broader knowledge graph.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- File Upload Section -->
    <v-row justify="center">
      <v-col
        cols="12"
        md="11"
        lg="10"
      >
        <v-card class="padded-box upload-card">
          <v-card-text>
            <!-- File Format Guidelines -->
            <div class="file-guidelines-box">
              <p class="file-guidelines">
                <b>File Format Guidelines</b>
              </p>
              <p class="description-text">
                Upload your manuscript data in <b>.json, .xml, .csv, .txt, .tsv, .ttl, .pdf, .docx</b>. Each file can contain information about multiple manuscripts. Please note that this is a preliminary engineering framework for an initial pilot release. We recommend avoiding large or resource-intensive uploads at this stage and encourage starting with smaller files for initial testing and exploration (i.e. max 100KB per time).
              </p>
              <v-divider class="my-5" />
            </div>

            <!-- Example using Vuetify v-file-input -->
            <v-file-input
              v-model="selectedFile"
              label="Choose your file"
              prepend-icon="mdi-upload"
              :show-size="true"
              :truncate-length="25"
              :multiple="false"
              accept=".csv,.tsv,.txt,.xml,.ttl,.json,.xlsx,.pdf,.docx"
            />

            <div
              v-if="fileName"
              class="file-preview"
            >
              <strong>File selected: </strong>{{ fileName }}
            </div>

            <v-btn
              color="mainBg"
              class="mt-5 primary-btn"
              :disabled="!selectedFile"
              @click="inspectFile"
            >
              Inspect
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app.js";

// ---------- PDF.js imports ----------
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ---------- Mammoth import (for docx) ----------
import * as mammoth from "mammoth";

// Access the Pinia store and router
const store = useAppStore();
const router = useRouter();

// This will be bound via v-model on <v-file-input>
const selectedFile = ref(null);
// We'll display the file name in the template
const fileName = ref("");

// Watch changes from the v-file-input so we can store the file name
watch(selectedFile, (newVal) => {
  if (!newVal) {
    fileName.value = "";
    return;
  }
  const file = Array.isArray(newVal) ? newVal[0] : newVal;
  if (file) {
    fileName.value = file.name;
  }
});

/**
 * Determine the extension and pick the correct handler:
 * - PDF => parse with PDF.js
 * - DOCX => parse with Mammoth
 * - Otherwise => read as text
 */
function inspectFile() {
  const file = Array.isArray(selectedFile.value)
    ? selectedFile.value[0]
    : selectedFile.value;
  if (!file) return;

  const extension = fileName.value.split(".").pop()?.toLowerCase() || "";

  if (extension === "pdf") {
    handlePdf(file);
  } else if (extension === "docx") {
    handleDocx(file);
  } else {
    handleGenericText(file, extension);
  }
}

/** Parse PDF with PDF.js => store text => navigate */
async function handlePdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map((item) => item.str);
      fullText += strings.join(" ") + "\n\n";
    }

    // store
    store.setFileContent({
      content: fullText,
      extension: "pdf"
    });
    router.push("/annotate");
  } catch (err) {
    console.error("PDF parsing error:", err);
    alert("Could not parse PDF. Please check the console for more info.");
  }
}

/** Parse DOCX with Mammoth => store text => navigate */
async function handleDocx(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Mammoth can do 'extractRawText' or 'convertToHtml'
    const result = await mammoth.extractRawText({ arrayBuffer });
    const docxText = result.value; // pure text (no HTML)

    store.setFileContent({
      content: docxText,
      extension: "docx"
    });
    router.push("/annotate");
  } catch (err) {
    console.error("DOCX parsing error:", err);
    alert("Could not parse DOCX. Please check the console for more info.");
  }
}

/** For CSV, XML, JSON, etc => readAsText */
function handleGenericText(file, extension) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result || "";
    store.setFileContent({
      content: text,
      extension: extension
    });
    router.push("/annotate");
  };
  reader.onerror = (err) => {
    console.error("Error reading file:", err);
    alert("Could not read file as text.");
  };
  reader.readAsText(file);
}
</script>

<style scoped>
.content-container {
  padding-top: 20px;
  padding-bottom: 50px;
}

.title-card {
  padding: 20px;
  background-color: #23263c;
  text-align: center;
  color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.padded-box {
  padding: 32px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  width: 90%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.upload-card {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.file-guidelines-box {
  margin-bottom: 20px;
}

.description-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.file-guidelines {
  font-size: 1.6rem;
  line-height: 2.5em;
  font-weight: 500;
  color: #333;
  text-align: center;
  display: block;
}

.file-preview {
  margin-top: 10px;
  font-size: 0.95rem;
  color: #666;
}
</style>
