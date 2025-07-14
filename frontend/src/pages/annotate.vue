<template>
  <v-container
    fluid
    class="content-container"
  >
    <!-- Heading -->
    <div class="header-box">
      <h1 class="text-center">
        Manuscript-AI Annotation Desk
      </h1>
    </div>

    <v-row
      justify="center"
      class="mt-4"
    >
      <v-col
        cols="12"
        style="width: 90%; max-width: 1200px; margin-bottom: 2rem;"
      >
        <v-card class="padded-box">
          <v-card-text>
            <p>
              Please fill the fields for the description of the manuscript.
              You can either copy and paste snippets or directly type into
              the form fields. You can describe up to 5 manuscripts at a time.
              <strong>Note:</strong> If you fill any fields for a given manuscript,
              remember to provide a shelfmark as <em>ID</em> (or simply an ID).
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="panels-wrapper">
      <!-- Left Panel: extracted text for highlight-based selection -->
      <div
        id="leftPanel"
        class="raw-text-panel"
        @mouseup="captureSelection"
      >
        <h3 class="panel-title">
          Manuscript Data
        </h3>
        <!-- We'll render either an HTML table (for CSV/TSV) or a <pre> (other formats) -->
        <div v-html="highlightedData" />
      </div>

      <!-- Right Panel: form area with top tabs for multiple manuscripts -->
      <div class="right-panel">
        <div class="manuscript-tabs">
          <button
            v-for="(col, idx) in columns"
            :key="idx"
            :class="['tab-button', { active: activeManuscript === idx }]"
            @click="activeManuscript = idx"
          >
            Manuscript {{ idx + 1 }}
          </button>
        </div>

        <div class="form-area">
          <div class="top-selection">
            <div class="field-selection">
              <label class="field-label">Select a Field:</label>
              <select
                v-model="selectedFields[activeManuscript]"
                class="field-select"
              >
                <option
                  disabled
                  value=""
                >
                  -- Choose a field --
                </option>
                <option
                  v-for="field in manuscriptFields"
                  :key="field"
                  :value="field"
                >
                  {{ formatFieldName(field) }}
                </option>
              </select>

              <button
                class="assignButton secondary-btn"
                @click="appendSnippet(activeManuscript)"
              >
                ADD SELECTED TEXT
              </button>
            </div>
            <hr>
          </div>

          <div class="scrollable-fields">
            <div
              v-for="field in manuscriptFields"
              :id="`field-container-${activeManuscript}-${field}`"
              :key="field"
              class="field-container"
            >
              <p><strong>{{ formatFieldName(field) }}:</strong></p>
              <div class="editable-container">
                <textarea
                  v-model="columns[activeManuscript][field]"
                  class="editable-field"
                  placeholder="No data added yet"
                />
                <button
                  v-if="columns[activeManuscript][field]"
                  class="clear-btn"
                  @click="clearField(activeManuscript, field)"
                >
                  ✖
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="submit-container">
      <v-btn
        color="mainBg"
        class="primary-btn"
        :disabled="isLoading"
        @click="submitManuscripts"
      >
        <template v-if="isLoading">
          <v-progress-circular
            indeterminate
            size="20"
            width="2"
            color="white"
            class="mr-2"
          />
          Processing...
        </template>
        <template v-else>
          Send to Agent Framework
        </template>
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app.js";
import { convertToRdf } from "@/services/ApiServices.js";

const store = useAppStore();
const router = useRouter();

// Spinner state for sending data
const isLoading = ref(false);

// The entire raw text from the file (PDF, DOCX, CSV, etc.) is in store.fileContent.content
// We'll show it either as an HTML table (CSV/TSV) or a <pre> (others).
const highlightedData = ref("");
const lastSelection = ref("");
const highlightedDataBackup = ref("");

// We support up to 5 manuscripts, each with the same set of fields
const columns = ref([{}, {}, {}, {}, {}]);
const activeManuscript = ref(0);
const selectedFields = ref(["", "", "", "", ""]);

// The crucial "manuscript_ID" field is part of our list:
const manuscriptFields = [
  "manuscript_ID",
  "century_of_creation",
  "support_type",
  "handwriting_form",
  "decorations",
  "binding",
  "ink",
  "format",
  "total_folia_count",
  "dimensions_of_the_manuscript.width",
  "dimensions_of_the_manuscript.length",
  "dimensions_of_the_manuscript.thickness",
  "contained_works",
  "incipit",
  "explicit",
  "authors",
  "copyists",
  "miniaturists",
  "bookbinders",
  "illuminators",
  "rubricators",
  "restoration_history",
  "ownership_history",
  "additional_notes"
];

/** Escape HTML to avoid injection issues. */
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Convert CSV or TSV content to an HTML table. */
function convertCsvOrTsvToTable(content, delimiter = ",") {
  const lines = content.split(/\r?\n/).filter((l) => l.trim() !== "");
  let html = `<table style="border-collapse: collapse;">`;
  lines.forEach((line) => {
    const cells = line.split(delimiter);
    html += "<tr>";
    cells.forEach((cell) => {
      html += `<td style="border: 1px solid #ccc; padding: 4px;">${escapeHtml(cell.trim())}</td>`;
    });
    html += "</tr>";
  });
  html += "</table>";
  return html;
}

onMounted(() => {
  const text = store.fileContent.content || "No data available.";
  const ext = (store.fileContent.extension || "").toLowerCase();

  // If CSV or TSV, parse into a table:
  if (ext === "csv") {
    highlightedData.value = convertCsvOrTsvToTable(text, ",");
  } else if (ext === "tsv") {
    highlightedData.value = convertCsvOrTsvToTable(text, "\t");
  } else {
    // For everything else, wrap in <pre>
    highlightedData.value = `<pre style="white-space: pre-wrap;">${escapeHtml(text)}</pre>`;
  }
});

/** to grab the user text selection */
function captureSelection() {
  // Grab the user’s text selection
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  // If nothing meaningful was selected, bail out
  if (!selectedText) return;

  // Back up the current HTML in case appendSnippet needs it
  highlightedDataBackup.value = highlightedData.value;

  // Store the plain text for “ADD SELECTED TEXT”
  lastSelection.value = selectedText;
}


/** Append the last selected snippet to the chosen field of the active manuscript */
async function appendSnippet(manuscriptIdx) {
  if (!lastSelection.value) {
    alert("Please highlight some text in the left panel first.");
    return;
  }
  const field = selectedFields.value[manuscriptIdx];
  if (!field) {
    alert("Please select a field to assign the text.");
    return;
  }
  const existing = columns.value[manuscriptIdx][field] || "";
  columns.value[manuscriptIdx][field] = existing
    ? existing + "\n" + lastSelection.value
    : lastSelection.value;

  // scroll into view
  await nextTick();
  const fieldContainer = document.getElementById(
    `field-container-${manuscriptIdx}-${field}`
  );
  if (fieldContainer) {
    fieldContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // restore the original HTML
  highlightedData.value = highlightedDataBackup.value;
}

/** Clear the specified field. */
function clearField(manuscriptIdx, field) {
  columns.value[manuscriptIdx][field] = "";
}

/**
 * If the user filled any fields in a manuscript, they must provide 'manuscript_ID'.
 * We'll check that before sending to the server.
 */
async function submitManuscripts() {
  isLoading.value = true;

  // Validate each manuscript
  for (let i = 0; i < columns.value.length; i++) {
    const dataObj = columns.value[i];
    // Check if user filled any fields other than manuscript_ID
    const anyOtherFieldFilled = Object.entries(dataObj).some(([key, val]) => {
      if (key === "manuscript_ID") return false; // skip the ID field in this check
      return val && val.trim() !== ""; // is not empty
    });

    // If the user filled something else, check manuscript_ID is present
    if (anyOtherFieldFilled) {
      const manuscriptIdVal = dataObj["manuscript_ID"] || "";
      if (!manuscriptIdVal.trim()) {
        alert(
          `Manuscript ${i + 1}: You have filled some data, but 'manuscript_ID' is missing. Please provide an ID.`
        );
        isLoading.value = false;
        return; // stop submission
      }
    }
  }

  // If we pass validation, build payload
  const payload = columns.value.map((columnData, idx) => {
    const dataWithNulls = {};
    for (const field of manuscriptFields) {
      const val = (columnData[field] || "").trim();
      dataWithNulls[field] = val === "" ? null : val;
    }
    return {
      manuscriptNumber: idx + 1,
      data: dataWithNulls
    };
  });

  console.log("Submitting data:", payload);

 try {
    // 3) Use your ApiServices function:
    const turtleString = await convertToRdf(payload);

    // 4) Once we get a success, set store and navigate
    store.setRdfOutput(turtleString);
    router.push({ name: "RdfPage" });
  } catch (err) {
    console.error("Error submitting data:", err);
    alert("An error occurred while sending data.");
  } finally {
    isLoading.value = false;
  }
}
/** Format field name more nicely. */
function formatFieldName(field) {
  return field
    .replace(/dimensions_of_the_manuscript\./, "Dimensions of the manuscript ")
    .replace(/_/g, " ")
    .replace(/\./g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (m) => m.toUpperCase());
}
</script>

<style scoped>
.content-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
  box-sizing: border-box;
}

.header-box {
  background-color: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.text-center {
  margin: 0;
  text-align: center;
}

.panels-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1400px;
  margin-bottom: 30px;
  gap: 20px;
}

.raw-text-panel {
  flex: 1;
  user-select: text;
  border: 2px solid #ccc;
  padding: 15px;
  height: 80vh;
  background: #f8f8f8;
  overflow-y: auto;
  border-radius: 10px;
  min-width: 400px;
}

.panel-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #23263c;
  margin-bottom: 10px;
}

.right-panel {
  flex: 1;
  height: 80vh;
  border: 2px solid #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}

.manuscript-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
}


.tab-button {
  border: 2px solid #ccc;
  border-radius: 5px;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  background: #e0e0e0;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  text-align: center;
}


@media (max-width: 768px) {
  .manuscript-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .tab-button {
    flex: 0 0 auto;
    min-width: 8rem;
  }
}


@media (min-width: 769px) {
  .manuscript-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }
  .tab-button {
    flex: 1 1 auto;
    min-width: 10rem;
  }
}

.tab-button:hover {
  background: #c8c8c8;
  border-color: #aaa;
}

.tab-button.active {
  background: #6750a4;
  color: #fff;
  border-color: #45326e;
}


.form-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-selection {
  flex-shrink: 0;
  background: #fff;
  padding: 0 1rem;
  margin-top: 1rem;
}

.scrollable-fields {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  box-sizing: border-box;
}

.field-selection {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.field-label {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}
.field-select {
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #23263c;
  background-color: #fff;
  font-size: 1rem;
}

.assignButton {
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background: #6750a4;
  color: white;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1);
}
.assignButton:hover {
  background: #5a4594;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.field-container {
  margin-bottom: 1rem;
}

.editable-container {
  display: flex;
  align-items: center;
}

.editable-field {
  width: 100%;
  padding: 8px;
  min-height: 50px;
  border: 2px solid #ccc;
  border-radius: 5px;
  background: #f8f9fa;
  resize: vertical;
}
.editable-field:focus {
  outline: none;
  border-color: #ff9800;
  background-color: #fff3cd;
}

.clear-btn {
  margin-left: 5px;
  background: red;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.submit-container {
  text-align: center;
}
</style>
