<template>
  <v-container
    class="content-container"
    fluid
  >
    <!-- Header -->
    <v-row
      justify="center"
      class="mt-10"
    >
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
              Use <b>Drop &amp; Classify</b> function to upload your cataloging data
              on medieval manuscripts. We will transform it into Linked
              Open Data (LOD) using the <b>ManuscriptAI ontology</b> and our LLM-powered agent framework.
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
                Upload your manuscript data in
                <b>.json, .xml, .csv, .txt, .tsv, .ttl, .pdf, .docx</b>. Each file
                can contain information about multiple manuscripts. Please note that
                this is a preliminary engineering framework for an initial pilot
                release. We recommend avoiding large or resource-intensive uploads
                at this stage and encourage starting with <b>smaller files</b> (max 100KB per time) for initial
                testing and exploration. <b>Please note that the processing may take some time,
                  especially for larger or more complex files.</b>
                <br><br>
                <b>Note:</b> The performance of this function relies heavily on data quality. For best results, please provide clean data.
                If you're uploading text-based files, consider isolating only the sections containing manuscript information
                to help the system interpret them accurately.
              </p>
              <v-divider class="my-5" />
            </div>

            <!-- v-file-input for selecting the file -->
            <v-file-input
              v-model="selectedFile"
              label="Choose your file"
              prepend-icon="mdi-upload"
              :show-size="true"
              :truncate-length="25"
              accept=".csv,.tsv,.txt,.xml,.ttl,.json,.xlsx,.pdf,.docx"
            />

            <!-- Show file name if a file is selected -->
            <div
              v-if="fileName"
              class="file-preview"
            >
              <strong>File selected: </strong>{{ fileName }}
            </div>

            <!-- Button to parse & send file -->
            <v-btn
              color="primary"
              class="mt-5"
              :disabled="!selectedFile || isLoading"
              @click="inspectFile"
            >
              <!-- If we're not loading, show normal text. Otherwise, show spinner + static text -->
              <template v-if="!isLoading">
                Send To Agent Framework
              </template>
              <template v-else>
                <v-progress-circular
                  indeterminate
                  size="20"
                  color="white"
                  class="mr-2"
                />
                Processing...
              </template>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
/** ===============================================
 *  Imports
 * =============================================== */
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// PDF.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// Mammoth (for docx)
import * as mammoth from 'mammoth'

import { dropClassify } from '@/services/ApiServices.js'

/** ===============================================
 *  Reactive State & Router
 * =============================================== */
const router = useRouter()

const selectedFile = ref(null)
const fileName = ref('')
// Loading state
const isLoading = ref(false)

/** ===============================================
 *  Watchers
 * =============================================== */
watch(selectedFile, (newVal) => {
  if (!newVal) {
    fileName.value = ''
    return
  }
  const file = Array.isArray(newVal) ? newVal[0] : newVal
  if (file) {
    fileName.value = file.name
  }
})

/** ===============================================
 *  Main Methods
 * =============================================== */
function inspectFile() {
  const file = Array.isArray(selectedFile.value)
    ? selectedFile.value[0]
    : selectedFile.value
  if (!file) return

  // Start loading UI
  isLoading.value = true

  const extension = (fileName.value.split('.').pop() || '').toLowerCase()

  if (extension === 'pdf') {
    handlePdf(file)
  } else if (extension === 'docx') {
    handleDocx(file)
  } else {
    handleGenericText(file, extension)
  }
}

/** ===============================================
 *  Parsing Functions
 * =============================================== */

/** PDF => parse with PDF.js => send content to server */
async function handlePdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ''
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const content = await page.getTextContent()
      const strings = content.items.map((item) => item.str)
      fullText += strings.join(' ') + '\n\n'
    }

    await sendContentToBackend(fullText, 'pdf')
  } catch (err) {
    console.error('PDF parsing error:', err)
    alert('Could not parse PDF. Please check console for details.')
    isLoading.value = false
  }
}

/** DOCX => parse with Mammoth => send content to server */
async function handleDocx(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    const docxText = result.value // plain text

    await sendContentToBackend(docxText, 'docx')
  } catch (err) {
    console.error('DOCX parsing error:', err)
    alert('Could not parse DOCX. Check console for details.')
    isLoading.value = false
  }
}

/** Generic => readAsText => send content to server */
function handleGenericText(file, extension) {
  const reader = new FileReader()

  reader.onload = async (e) => {
    const text = e.target?.result || ''
    await sendContentToBackend(text, extension)
  }

  reader.onerror = (err) => {
    console.error('Error reading file as text:', err)
    alert('Could not read file as text.')
    isLoading.value = false
  }

  reader.readAsText(file)
}

/** ===============================================
 *  Server Communication
 * =============================================== */
async function sendContentToBackend(text, extension) {
  try {
    // Call your new function from ApiServices
    const resultJson = await dropClassify({
      content: text,
      extension: extension
    })

    // resultJson might look like: { "structured_data": [ ... ] }
    isLoading.value = false

    // Just navigate to /results, passing data
    router.push({
      name: 'results',
      query: {
        data: JSON.stringify(resultJson, null, 2) // or however you prefer
      }
    })
  } catch (err) {
    console.error('Backend request error:', err)
    alert('An error occurred while sending data to the server:\n\n' + err)
    isLoading.value = false
  }
}
</script>

<style scoped>
/* ========= Layout & Container ========= */
.content-container {
  padding-top: 20px;
  padding-bottom: 50px;
}

/* ========= Cards ========= */
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

/* ========= Text Blocks ========= */
.file-guidelines-box {
  margin-bottom: 20px;
}

.description-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  text-align: justify;
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

/* ========= Response Display ========= */
.response-preview {
  white-space: pre-wrap;
  background: #f9f9f9;
  border: 1px dashed #ccc;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 8px;
}
</style>
