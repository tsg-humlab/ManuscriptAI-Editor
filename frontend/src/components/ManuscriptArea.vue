<script setup>
import {computed, ref , watch, onMounted, onUpdated, nextTick} from 'vue'
import { useAppStore } from "@/stores/app.js";
import { structureManuscripts } from "@/services/ApiServices.js";
const store = useAppStore()

// list of manuscripts created by the user and sent for structuring
let manuscripts = ref([])

const nrOfManuscripts = computed(()=>{
  return manuscripts.value.length
})

// the index of the selected chip
const selManuscript = ref(null)
// the text to be placed to the selected area
const setContent = (index) => {
  const selection = manuscripts.value[index]?.content
  console.log("selection:", selection)
  text.value = selection

}

// content in the textarea
const text = ref(null)

// contains the content of the file
const content = computed(()=>store.recentFileContent.content)


watch(content, (newValue, oldValue) => {
  selManuscript.value = null
  manuscripts.value = []
});

const updateContent = () => {
  console.log("I am updating this manuscript:", manuscripts.value[selManuscript.value])
  manuscripts.value[selManuscript.value].content = text.value
}

// loading indicator for the 'structure content' button
const loading = ref(false)

const sendDataToAgents = async() => {
  loading.value = true
  let manData = {}
  manuscripts.value.forEach((m)=>{
    manData[m.title] = m.content
  })
  console.log("manData", manData)

  try {
    const jsonData = await structureManuscripts(manData)

    // the structured data is expected here.

    const resp = await JSON.parse(jsonData.response)

    if (resp.manuscripts){
      resp.manuscripts.forEach((m)=>{
        flattenObject(m)
        reformat(m)
      })

      store.setStructuredData({
        "manuscripts": resp.manuscripts,
        "number_of_manuscripts": resp?.all_data?.manuscripts_analyzed
      })
    }else {
      // when the user creates one manuscript, the llm returns a single object instead of an array.
      flattenObject(resp)
      reformat(resp)
      store.setStructuredData({
        "manuscripts": new Array(resp),
        "number_of_manuscripts": resp?.all_data?.manuscripts_analyzed
      })
    }

    store.setNotification({color:'success',time:4000, showNot: true, text: 'The data was structured successfully!'})
    loading.value = false

  } catch (error) {
    store.setNotification({color:'error', showNot: true, time: -1, text:`${error}. There was an issue with the structuring of the data.`})
    loading.value = false
  }
}

// flattens the work_folia object to a simple list of properties.
const flattenObject = (obj)=> {
    for (let key in obj) {
      if (key !== 'work_folia'){
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
            let nestedObj = obj[key];
            for (let nestedKey in nestedObj) {
                if (nestedObj.hasOwnProperty(nestedKey)) {
                    obj[`${key}_${nestedKey}`] = nestedObj[nestedKey];
                }
            }
            delete obj[key]; // Optionally delete the original nested object
        }
      }

    }
    return obj;
}

// reformats the content of properties containing arrays or objects. their value is set to JSON strings.
const reformat = (obj)=>{
  for (let key in obj) {
    if (obj.hasOwnProperty(key)){
      obj[`${key}`] = {
         'value': key === 'work_folia'?JSON.stringify(obj[key]) : obj[key],
          'disabled': true,
      }
    }
  }
  return obj
}

// adding a new manuscript when the user presses the 'addManuscript' button
const addManuscript = ()=>{
  manuscripts.value.push({ title: getNextTitle(), content:null})
  selManuscript.value = manuscripts.value.length-1
}

// removes the clicked manuscript from the list of available manuscripts
const removeManuscript = (index)=> {

  console.log("about to remove: ", manuscripts.value[index], index, selManuscript.value )
  manuscripts.value.splice(index,1)
  selManuscript.value = undefined
  text.value = null
}

// get the highest id of the available manuscripts and sets the id of the new manuscript increased by one.
// consistency reasons, while creating new manuscripts.
const getNextTitle = () => {
  const highestNumber = manuscripts.value.reduce((max, obj) => {
    const number = parseInt(obj.title.split(' ')[1]);
    return number > max ? number : max;
  }, 0);
  return `Manuscript ${highestNumber + 1}`;
};

// is triggered when the textarea is clear by the clear button and removed content from the manuscript and
// the text field
const clearTextArea = () => {
  text.value=null;
  manuscripts.value[selManuscript.value].content = null
}

onUpdated(() => {
  console.log("the data has been updated!")
  console.log("nrOfMans after update: ", nrOfManuscripts.value)
  console.log("manuscripts after update: ", manuscripts.value)

})


const selectionAreaRef = ref(null);
const formAreaRef = ref(0);
const actionAreaRef = ref(null);

const manuscriptAreaRef= ref(null)
// Function to recalculate content height
function calculateContentHeight() {
  const headerH = selectionAreaRef.value?.offsetHeight || 0;
  const footerH = actionAreaRef.value?.offsetHeight || 0;

  formAreaRef.value = manuscriptAreaRef.value?.offsetHeight - headerH - footerH;
  console.log("the height is:", formAreaRef.value, selectionAreaRef.value?.offsetHeight, actionAreaRef.value.offsetHeight, manuscriptAreaRef.value.offsetHeight)
}

onMounted(async () => {
  await nextTick();
  calculateContentHeight();
  window.addEventListener('resize', calculateContentHeight);
});

</script>

<template>
  <div
    ref="manuscriptAreaRef"
    class="manuscript-area"
  >
    <!--      <div class="action-area">-->
    <!--      <v-card variant="text">-->
    <!--        <v-card-item>-->
    <!--          <b>Actions:</b>-->
    <!--          <v-btn variant="flat" rounded="small" class="btn ml-2" color="#E76F51" size="small" text="Add Manuscript" @click="addManuscript"></v-btn>-->
    <!--        </v-card-item>-->
    <!--      </v-card>-->
    <!--    </div>-->
    <div
      id="selection-area"
      ref="selectionAreaRef"
    >
      <v-card variant="text">
        <v-card-title>Manuscripts</v-card-title>
        <v-card-item v-if="manuscripts.length>0">
          <span class="section-label">Choose a manuscript:</span>
          <v-chip-group
            v-model="selManuscript"
            column
          >
            <v-chip
              v-for="(manuscript,index) in manuscripts"
              :key="manuscript.title"
              color="primary"
              variant="tonal"
              :append-icon="manuscript.content ? 'mdi-check' : null"
              prepend-icon="mdi-book-open-blank-variant-outline"
              closable
              @click="setContent(index)"
              @click:close="removeManuscript(index)"
            >
              {{ manuscript.title }}
            </v-chip>
          </v-chip-group>
        </v-card-item>
        <v-card-item v-else>
          <p>No selected manuscripts!</p>
        </v-card-item>
      </v-card>
    </div>
    <div
      ref="actionAreaRef"
      class="action-area"
    >
      <v-card variant="text">
        <v-card-item>
          <span class="section-label">Actions:</span>
          <v-btn
            variant="flat"
            class="btn ml-2"
            color="primary"
            size="small"
            :disabled="manuscripts.length===5"
            @click="addManuscript"
          >
            Add Manuscript
            <v-tooltip
              activator="parent"
              location="top"
            >
              <span>You can create up to 5 manuscripts and edit its content.</span>
            </v-tooltip>
          </v-btn>
        </v-card-item>
      </v-card>
    </div>
    <div
      v-if="manuscripts.length>0 && selManuscript>=0"
      id="form-area"
      ref="formAreaRef"
    >
      <v-card
        variant="text"
        :disabled="selManuscript === null || selManuscript === undefined"
      >
        <v-card-title>Manuscript Content</v-card-title>
        <v-card-item
          id="text-box-container"
          ref="textBoxContainerRef"
        >
          <v-textarea
            id="text-box"
            ref="textBoxRef"
            v-model="text"
            variant="outlined"
            :style="{ height: formAreaRef-150 + 'px' }"
            auto-grow
          >
            <template #append-inner>
              <div id="btns">
                <div id="clearable-btn">
                  <v-btn
                    variant="text"
                    icon="mdi-close-circle"
                    color="#232302"
                    :disabled="!text"
                    @click="clearTextArea"
                  />
                </div>
                <v-spacer />
                <div id="save-btn">
                  <v-btn
                    variant="text"
                    text="save"
                    color="#232302"
                    density="compact"
                    size="small"
                    :disabled="!text"
                    @click="updateContent"
                  />
                </div>
              </div>
            </template>
          </v-textarea>
        </v-card-item>
      </v-card>
      <v-card
        :disabled="!manuscripts.every(m=> m.content !== null)"
        variant="text"
      >
        <v-card-actions class="justify-center">
          <v-btn
            variant="flat"
            class="btn"
            color="primary"
            :loading="loading"
            @click="sendDataToAgents"
          >
            Structure content
            <v-tooltip
              activator="parent"
              location="top"
            >
              <span>Send the created manuscripts to be structured.</span>
            </v-tooltip>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
#btns{
  display: flex !important;
  flex-direction: column !important;
  align-self: stretch !important;
  align-items: center;
}

#clearable-btn{
  margin-top: -10px;
}

#save-btn{
  margin-bottom: 10px;
}

.manuscript-area{
  height: 900px;
  display: flex;
  flex-direction: column;
}

#selection-area{
 flex-shrink: 0;
}
</style>
