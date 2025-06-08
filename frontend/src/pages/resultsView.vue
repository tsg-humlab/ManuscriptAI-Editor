<template>
  <v-container
    fluid
    class="main-layout"
  >
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <div class="padded-container sidebar-content">
        <div class="sidebar-header">
          <v-icon color="primary">
            mdi-book-outline
          </v-icon>
          <span class="header-text">Manuscripts</span>
        </div>

        <!-- Manuscript List (scrollable) -->
        <div class="sidebar-body">
          <div
            v-for="(ms, idx) in manuscripts"
            :key="idx"
            class="ms-list-item"
            :class="{ active: selectedIndex === idx }"
          >
            <!-- Clicking on manuscript name selects it -->
            <div
              style="flex:1; cursor:pointer;"
              @click="selectManuscript(idx)"
            >
              <v-icon
                small
                class="book-icon"
              >
                mdi-book-open
              </v-icon>
              <span class="ms-list-item-text">
                {{ ms.manuscript_ID || 'Unnamed Manuscript' }}
              </span>
            </div>

            <!-- Trash icon to remove the manuscript -->
            <v-icon
              small
              color="error"
              class="trash-icon"
              title="Remove this manuscript"
              @click.stop="removeManuscript(idx)"
            >
              mdi-delete
            </v-icon>
          </div>
        </div>

        <!-- Buttons below the list -->
        <div class="buttons-below-list">
          <!-- 1) Confirm Review Button -->
          <v-btn
            color="primary"
            class="confirm-button"
            @click="confirmReview"
          >
            Confirm Review
          </v-btn>

          <!-- 2) Download JSON Button (only after review is confirmed) -->
          <v-btn
            v-if="reviewConfirmed"
            color="secondary"
            class="download-button"
            :disabled="isLoading"
            @click="sendToAgentFramework"
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
              Structure into LOD
            </template>
          </v-btn>
        </div>
      </div>
    </aside>

    <!-- Divider -->
    <div class="divider" />

    <!-- RIGHT PANEL -->
    <section class="review-panel padded-container">
      <!-- If a manuscript is selected, show its fields -->
      <div
        v-if="activeMs"
        class="ms-details"
      >
        <!-- The manuscript_ID field -->
        <h2 style="margin-top: 0;">
          Manuscript ID:
          <v-text-field
            v-model="activeMs.manuscript_ID"
            dense
            outlined
            style="max-width: 300px;"
          />
        </h2>

        <!-- Show data_analyzed (if available) in a read-only <pre> -->
        <div class="field-section">
          <h3>Raw Data (data_analyzed)</h3>
          <pre class="raw-data-panel">{{ activeMs.data_analyzed || '(no data)' }}</pre>
        </div>

        <!-- Editable fields -->
        <div class="field-section">
          <div
            v-for="field in relevantFields"
            :key="field"
            class="field-row"
          >
            <label class="field-label">{{ formatFieldName(field) }}:</label>
            <v-textarea
              :model-value="getNestedValue(activeMs, field)"
              auto-grow
              rows="1"
              class="field-input"
              @update:model-value="(val) => setNestedValue(activeMs, field, val)"
            />
          </div>
        </div>
      </div>

      <!-- If none selected -->
      <div v-else>
        <p>Please select a manuscript on the left.</p>
      </div>
    </section>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app.js'
import { convertToRdf } from '@/services/ApiServices.js'

/**
 * The list of fields to be displayed
 * Each field is matched by direct key or dot notation for nested objects.
 */
const relevantFields = [
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
]

const manuscripts = ref([])
const selectedIndex = ref(null)
const reviewConfirmed = ref(false)
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const store = useAppStore()



/** Utility to normalize the manuscript ID string (lowercase & trimmed) for merging. */
function normalizeMsId(msid) {
  if (!msid) return ''
  return msid.trim().toLowerCase()
}

/** Merge duplicates if the same manuscript_ID. */
function mergeTwoManuscripts(msA, msB) {
  const merged = { ...msA }
  for (const field in msB) {
    if (field === 'manuscript_ID') continue
    const valA = msA[field]
    const valB = msB[field]
    if (!valA && valB) {
      merged[field] = valB
    } else if (valA && valB && valA !== valB) {
      merged[field] = `${valA} / ${valB}`
    }
  }
  return merged
}

/** The currently selected manuscript object in the array, based on `selectedIndex`. */
const activeMs = computed(() => {
  return selectedIndex.value !== null ? manuscripts.value[selectedIndex.value] : null
})

onMounted(() => {
  const raw = route.query.data || ''
  console.log('[ResultsView] raw =>', raw)

  if (!raw) {
    console.warn('No data found in route.query.data.')
    return
  }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    console.error('Could not parse JSON from route.query.data:', err)
    return
  }

  // Identify the array of manuscripts from possible keys
  let manuscriptsArray = []
  if (parsed.manuscripts && Array.isArray(parsed.manuscripts)) {
    manuscriptsArray = parsed.manuscripts
  } else if (parsed.structured_data && Array.isArray(parsed.structured_data)) {
    manuscriptsArray = parsed.structured_data
  } else if (Array.isArray(parsed)) {
    manuscriptsArray = parsed
  } else {
    console.warn('No recognizable array found in JSON. Check your agent output.')
    return
  }

// Merge duplicates if they share the same (normalized) manuscript_ID.
const mergedById = {}
for (const ms of manuscriptsArray) {
  // If still no ID, generate a unique one
  if (!ms.manuscript_ID) {
    ms.manuscript_ID = `ms-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }

  const key = normalizeMsId(ms.manuscript_ID)
  if (!mergedById[key]) {
    mergedById[key] = ms
  } else {
    mergedById[key] = mergeTwoManuscripts(mergedById[key], ms)
  }
}

  const finalManuscripts = Object.values(mergedById)
  manuscripts.value.push(...finalManuscripts)

  // Auto-select the first manuscript if available
  if (manuscripts.value.length > 0) {
    selectedIndex.value = 0
  }
})

function selectManuscript(idx) {
  selectedIndex.value = idx
}

function removeManuscript(idx) {
  manuscripts.value.splice(idx, 1)
  if (selectedIndex.value === idx) {
    selectedIndex.value = null
  } else if (selectedIndex.value > idx) {
    selectedIndex.value--
  }
}

/** Confirm the review => set flag to show "Download JSON" */
function confirmReview() {
  reviewConfirmed.value = true
  alert('Review confirmed!')
}

async function sendToAgentFramework() {
  isLoading.value = true

  try {
    // Build the payload similarly to your old downloadJson function
    const payload = manuscripts.value.map(ms => {
      // Ensure we have a valid ID
      if (!ms.manuscript_ID || !ms.manuscript_ID.trim()) {
        ms.manuscript_ID = `ms-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      }
      // Return the object under a "data" key, if that’s your preferred structure
      return { data: ms }
    })

    console.log("Sending payload to convertToRdf:", payload)

    // Call your endpoint
    const turtleString = await convertToRdf(payload)

    // Store the response in a global store so RdfPage can show it
    store.setRdfOutput(turtleString)

    // Navigate to RdfPage
    router.push({ name: 'RdfPage' })
  } catch (err) {
    console.error("Error sending data to Agent:", err)
    alert("An error occurred while sending data.")
  } finally {
    isLoading.value = false
  }
}

/** Display-friendly version of a dotted field name (e.g. "dimensions_of_the_manuscript.width"). */
function formatFieldName(field) {
  return field
    .replace(/\./g, ' ')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^./, m => m.toUpperCase())
}

/**
 * Retrieve a nested field using dot-notation. Returns "" if no value is found.
 */
function getNestedValue(obj, path) {
  if (!obj || !path) return ''
  const parts = path.split('.')
  let current = obj

  for (const p of parts) {
    if (!current || typeof current !== 'object') return ''
    current = current[p]
  }

  if (current === null) return ''
  if (Array.isArray(current) || typeof current === 'object') {
    return JSON.stringify(current)
  }
  return current || ''
}

/**
 * Set a nested field using dot-notation.
 * If the user enters the literal string "anything here", we set that field to null.
 */
function setNestedValue(obj, path, newVal) {
  if (!obj || !path) return
  const parts = path.split('.')
  let current = obj

  // Traverse or create nested objects
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i]
    if (!current[p] || typeof current[p] !== 'object') {
      current[p] = {}
    }
    current = current[p]
  }

  const finalKey = parts[parts.length - 1]

  // Special case: user typed "anything here"
  if (newVal === 'anything here') {
    current[finalKey] = null
    return
  }

  // Try to parse JSON (in case the user wants arrays or objects)
  try {
    const parsed = JSON.parse(newVal)
    current[finalKey] = parsed
  } catch (e) {
    // Otherwise, treat as plain text
    current[finalKey] = newVal
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: calc(100vh - 30px);
  margin-top: 20px;
  padding: 0;
  box-sizing: border-box;
}

.padded-container {
  padding: 1rem;
  box-sizing: border-box;
  font-family: "Helvetica", sans-serif;
}

/* Sidebar */
.sidebar {
  width: 280px;
  min-width: 280px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}
.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sidebar-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.1rem;
}
.book-icon {
  margin-right: 8px;
}
/* The "middle" area for the list items */
.sidebar-body {
  /* We remove flex:1 so that the button won't stick to the bottom */
  overflow-y: auto;
  margin-bottom: 1rem; /* spacing before the buttons */
}
.ms-list-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.ms-list-item:hover {
  background-color: #f2f2f2;
}
.ms-list-item.active {
  background-color: #e8e8e8;
  font-weight: bold;
  color: #333;
}
/* Ensure ID doesn't overflow horizontally */
.ms-list-item-text {
  display: inline-block;
  word-wrap: break-word;
  white-space: normal;
  max-width: 140px;
  margin-left: 6px;
}
.trash-icon {
  margin-left: 10px;
  cursor: pointer;
}

/* Buttons below the list */
.buttons-below-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.confirm-button,
.download-button {
  width: 200px;       /* same fixed width */
  height: 40px;       /* same fixed height */
  margin-bottom: 8px; /* keep your existing margins */
  padding: 0 24px;    /* existing horizontal padding is fine */
}
/* Divider between sidebar and main content */
.divider {
  width: 1px;
  background-color: #ddd;
  margin: 0 1rem;
}

/* Right panel */
.review-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.ms-details {
  margin-left: 0.5rem;
}
.field-section {
  background: #fafafa;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}
.raw-data-panel {
  background: #fff;
  border: 1px dashed #ccc;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.95rem;
  max-height: 250px;
  overflow-y: auto;
  white-space: pre-wrap; /* wrap lines */
}
.field-row {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.field-label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.field-input {
  width: 100%;
  font-size: 0.9rem;
}
</style>
