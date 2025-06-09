<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/app.js";

const store = useAppStore()

const selectedManuscript = computed(()=>{
  return store.getSelectedManuscript
})


const manuscriptFields = [
  "manuscript_ID", "century_of_creation", "support_type",
  "dimensions_of_the_manuscript_width", "dimensions_of_the_manuscript_length", "dimensions_of_the_manuscript_thickness",
  "contained_works", "incipit", "explicit", "handwriting_form", "decorations", "binding_type", "format", "total_folia", "ink_type",
  "authors", "copyists", "miniaturists", "bookbinders", "illuminators", "rubricators",
  "restoration_history", "additional_notes", "ownership_history"
];

/** Utility to format field labels */
const formatFieldName = (field) => {
  return field
    .replace(/dimensions_of_the_manuscript\./, "Dimensions of the manuscript ")
    .replace(/_/g, " ")
    .replace(/\./g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (m) => m.toUpperCase());
};
</script>

<template>
  <div id="manuscript-data">
    <v-card
      v-if="selectedManuscript"
      class="pa-3"
      variant="text"
    >
      <v-card-title>
        <div />
      </v-card-title>
      <v-card-actions>
        <strong>Actions:</strong>
        <v-btn
          size="small"
          variant="flat"
          @click="()=>{console.log('selectedManuscript:', selectedManuscript);selectedManuscript.reviewed = true;}"
        >
          Mark as reviewed
        </v-btn>
      </v-card-actions>
      <v-divider />
      <v-card-item>
        <p><strong>Extracted properties</strong></p>
      </v-card-item>
      <v-card-item id="property-container">
        <!-- All fields for the active manuscript -->
        <div
          v-for="field in manuscriptFields"
          :key="field"
          class="field-container"
        >
          <span class="section-label"><strong>{{ formatFieldName(field) }}:</strong></span>
          <div class="textarea-container d-flex flex-row justify-start align-center">
            <v-text-field
              v-model="selectedManuscript[field].value"
              max-width="400"
              class="mr-2"
              rows="1"
              placeholder="No data added yet"
              :disabled="selectedManuscript[field].disabled"
              clearable
              hide-details
            />
            <v-btn
              v-if="selectedManuscript[field].disabled"
              size="small"
              :disabled="!selectedManuscript[field].disabled"
              @click="()=>{ selectedManuscript[field].disabled = false; }"
            >
              Edit
            </v-btn>
            <v-btn
              v-if="!selectedManuscript[field].disabled"
              size="small"
              :disabled="selectedManuscript[field].disabled"
              @click="()=>{ selectedManuscript[field].disabled = true; }"
            >
              Save
            </v-btn>
          </div>
        </div>
      </v-card-item>
    </v-card>
    <v-card
      v-else
      variant="text"
      class="pa-10"
    >
      No selected manuscript. Please select a manuscript from the list of extracted manuscripts on the left.
    </v-card>
  </div>
</template>

<style scoped>
#property-container{
  max-height: 57vh;
  overflow-y: auto;
}
.field-container{
  margin-bottom: 16px;
}

</style>
