<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/app.js";

const store = useAppStore()

const selectedManuscript = computed(()=>{
  return store.getSelectedManuscript
})

const showDialog = ref(false)

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

const markAsReviewed = () =>{
  console.log("marking as reviewed!", selectedManuscript.value, )
  if(!selectedManuscript.value.manuscript_ID.value){
    showDialog.value = true
    return
  }
  selectedManuscript.value.reviewed = true;
}

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
          v-if="!selectedManuscript.reviewed"
          size="small"
          variant="flat"
          class="secondary-btn"
          color="secondary"
          rounded="small"
          @click="markAsReviewed"
        >
          Mark as reviewed
        </v-btn>
        <v-btn
          v-else
          size="small"
          variant="flat"
          class="secondary-btn"
          color="secondary"
          rounded="small"
          @click="()=>{console.log('selectedManuscript:', selectedManuscript);selectedManuscript.reviewed = false;}"
        >
          Undo review
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
              color="secondary"
              variant="flat"
              class="secondary-btn"
              rounded="small"
              :disabled="!selectedManuscript[field].disabled || selectedManuscript.reviewed"
              @click="()=>{ selectedManuscript[field].disabled = false; }"
            >
              Edit
            </v-btn>
            <v-btn
              v-if="!selectedManuscript[field].disabled"
              size="small"
              color="secondary"
              variant="flat"
              class="secondary-btn"
              rounded="small"
              :disabled="selectedManuscript[field].disabled ||  selectedManuscript.reviewed"
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
      class="pa-10 text-body-2"
    >
      No selected manuscript. Please select a manuscript from the list of extracted manuscripts on the left.
    </v-card>
    <v-dialog
      v-model="showDialog"
      max-width="500"
    >
      <v-card prepend-icon="mdi-alert-box" title="Warning">
        <v-divider></v-divider>
        <v-card-text>
          You are about to mark as reviewed a manuscript without an ID. An ID is an essential field. Please fill in an ID for this manuscript.
        </v-card-text>
        <v-card-actions>
          <v-btn
            variant="text"
            color="black"
            @click="showDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<style scoped>
#property-container{
  //max-height: 52vh;
  overflow-y: auto;
}
.field-container{
  margin-bottom: 16px;
}

</style>
