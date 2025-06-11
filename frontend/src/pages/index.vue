<template id="stepper-view">
  <v-container
    fluid
    class="mt-0 pt-0"
  >
    <v-row>
      <v-col>
        <v-stepper
          v-model="step"
          elevation="0"
          bg-color="white"
        >
          <v-stepper-header>
            <v-stepper-item
              key="stepper-1"
              selected-class="selected-items"
              color="teal"
              title="Upload files"
              value="1"
              editable
              :complete="step>0"
              @click="step=0"
            />
            <v-divider />
            <v-stepper-item
              key="stepper-2"
              selected-class="selected-items"
              color="teal"
              title="Inspect files"
              value="2"
              :disabled="!fileContentExist"
              :editable="fileContentExist"
              :complete="step>1"
              @click="store.setStep(1)"
            />
            <v-divider />
            <v-stepper-item
              key="stepper-3"
              selected-class="selected-items"
              color="teal"
              title="Review files"
              value="3"
              :disabled="!dataStructuredExist"
              :editable="dataStructuredExist"
              :complete="step>2"
              @click="store.setStep(2)"
            />
            <v-divider />
            <v-stepper-item
              key="stepper-4"
              selected-class="selected-items"
              color="teal"
              title="Map Concepts"
              value="4"
              :disabled="!rdfOutputExist"
              :editable="rdfOutputExist"
              @click="store.setStep(3)"
            />
          </v-stepper-header>
          <v-stepper-window class="mt-0">
            <v-stepper-window-item
              key="window-1"
              value="1"
            >
              <FileUploadView />
            </v-stepper-window-item>
            <v-stepper-window-item
              key="window-2"
              value="2"
            >
              <InspectionView />
            </v-stepper-window-item>
            <v-stepper-window-item
              key="window-3"
              value="3"
            >
              <FeedbackView />
            </v-stepper-window-item>
            <v-stepper-window-item
              key="window-4"
              value="4"
            >
              <!-- Here goes the mapping part -->
              <mapping-concepts-view />
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
        <notification-component />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  //
  import FileUploadView from "@/pages/FileUploadView.vue";
  import { computed } from 'vue'
  import InspectionView from "@/pages/InspectionView.vue";
  import FeedbackView from "@/pages/FeedbackView.vue";
  import NotificationComponent from "@/components/NotificationComponent.vue";
  import {useAppStore} from "@/stores/app.js";
  import MappingConceptsView from "@/pages/MappingConceptsView.vue";
  // developing purpose set to 2
  // const step =
  const step = computed({
    get() {
      return store.getStep
    },
    set(value) {
      store.setStep(value)
    }
  })

  const store = useAppStore()

  const fileContentExist = computed(()=>{
    return store.recentFileContent.content !== null
  })

  const dataStructuredExist = computed(()=>{
    return store.getStructuredData.manuscripts.length > 0
  })

  const rdfOutputExist = computed(()=> {
    return !!store.getRdfOutput
  })
</script>

<style scoped>
:deep(.v-stepper-header){
 box-shadow: none;
}

.selected-items{
  font-weight: 500 !important;
}

:deep(.v-stepper-item__avatar){
  width: 2.5em !important;
  height: 2.5em !important;

  color: #f4f4f4 !important;
  font-weight: bold !important;
  font-size: .95em !important;
}


</style>
