<script setup>
import { computed, ref, watch } from "vue"
import { useAppStore } from "@/stores/app.js";
import { structureManuscripts } from "@/services/ApiServices.js";

const store = useAppStore()

const fileContent = computed(()=>{
  return store.recentFileContent.content
})

// check for file update and resets
watch(fileContent, async(newV, oldV)=>{
  console.log("fileContent updated! Resetting values!", newV)
  selManuscript.value = null
  // store.setSelCreatedManuscript(null)
  manuscripts.value = []
})

// sets the selected manuscript. Keeps state management and local option in sync.
const selManuscript = computed({
  get() {
    const selected = store.getSelCreatedManuscript
    return selected ? [selected] : null
  },
  async set(newVal) {
    if (newVal && newVal.length > 0) {
      if (!store.getSelCreatedManuscript || store.getSelCreatedManuscript.id !== newVal[0].id) {
        await store.setSelCreatedManuscript(newVal[0])
      }
    } else {
      if (store.getSelCreatedManuscript !== null) {
        await store.setSelCreatedManuscript(null)
      }
    }
  }
})

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

// show the tooltip
const showTooltip = ref(false)

// the list containing the manuscripts which were added by the user. These manuscripts will be sent to the Agent for
// structuring
// const manuscripts = ref([])
const manuscripts = computed(()=> {
  return store.getListOfCreatedManuscripts
})

// adding a new manuscript when the user presses the 'addManuscript' button
const addManuscript = async()=>{
  // manuscripts.value.push({ title: getNextTitle(), content:null})
  const sel = store.addManToListOfCreatedManuscripts({title: null, content: null, id: null})
  console.log("sel", sel)
  selManuscript.value = [sel]
}

// removes the clicked manuscript from the list of available manuscripts
const removeManuscript = (index)=> {

  console.log("about to remove: ", manuscripts.value[index], index)
  // manuscripts.value.splice(index,1)
  store.removeManFromListOfCreatedManuscripts(index)
  console.log("after removal:", manuscripts.value)
  // selManuscript.value = null
  // store.setSelCreatedManuscript(null)
}

// loading indicator for the 'structure content' button
const loading = ref(false)

// send the created manuscripts to the Agent
const sendDataToAgents = async () => {
  loading.value = true;

  // build the request body expected by Flask
  const manData = manuscripts.value.reduce((acc, m) => {
    acc[m.title] = m.content;
    return acc;
  }, {});

  try {
    // ------------- NEW (expects .structured_results) -------
    const { structured_results } = await structureManuscripts(manData);

    // 1. unpack each `{ "Manuscript n": "<stringified JSON or JSON[]>" }`
    const parsedManuscripts = [];

    structured_results.forEach(item => {
      // the value is the first (and only) property value
      const raw = Object.values(item)[0];
      if (!raw) return;

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        console.error('Cannot parse Structurer JSON:', e, raw);
        return;
      }

      if (Array.isArray(parsed)) {
        parsedManuscripts.push(...parsed);
      } else {
        parsedManuscripts.push(parsed);
      }
    });

    // 2. flatten / decorate so the rest of the UI can bind
    parsedManuscripts.forEach(m => {
      flattenObject(m);
      reformat(m);
    });

    // 3. commit to the Pinia/Vue-X store
    store.setStructuredData({
      manuscripts: parsedManuscripts,
      number_of_manuscripts: parsedManuscripts.length
    });

    // disable selectedMan in feedback view, if any
    store.setSelectedManuscript(null)

    store.setNotification({
      color: 'success',
      showNot: true,
      text: 'The data was structured successfully!',
      time: 4000,
    });

    store.setStep(2)

  } catch (error) {
    store.setNotification({
      color: 'error',
      showNot: true,
      text: `${error}. There was an issue with the structuring of the data.`,
      time: -1,
    });
  } finally {
    loading.value = false;
  }
};


// // get the highest id of the available manuscripts and sets the id of the new manuscript increased by one.
// // consistency reasons, while creating new manuscripts.
// const getNextTitle = () => {
//   const highestNumber = manuscripts.value.reduce((max, obj) => {
//     const number = parseInt(obj.title.split(' ')[1]);
//     return number > max ? number : max;
//   }, 0);
//   return `Manuscript ${highestNumber + 1}`;
// };


</script>

<template>
  <div id="created-manuscripts">
    <v-card
      variant="text"
      subtitle="Created manuscripts"
    >
      <div id="card-content">
        <v-list
          v-model:selected="selManuscript"
          item-value="id"
          bg-color="white"
          class="mt-0 pt-0"
          max-height="600"
        >
          <div
            v-if="manuscripts.length>0"
          >
            <v-list-item
              v-for="(man,index) in manuscripts"
              :key="man.id"
              :title="`Manuscript ${index+1}`"
              :value="man"
              color="info"
              nav
            >
              <template #prepend>
                <v-avatar>
                  <v-icon>mdi-book-open-blank-variant-outline</v-icon>
                </v-avatar>
              </template>
              <template #append>
                <v-icon @click="removeManuscript(index)">
                  mdi-close-circle-outline
                </v-icon>
              </template>
            </v-list-item>
          </div>
          <div
            v-else
            class="pa-4 text-sm-body-2"
          >
            You have not created any manuscripts yet!
          </div>
<!--          <v-list-subheader>CREATED MANUSCRIPTS</v-list-subheader>-->


          <div class="text-center">
            <v-tooltip
              v-model="showTooltip"
              location="top"
            >
              <template #activator="{props}">
                <v-btn
                  icon
                  v-bind="props"
                  size="small"
                  color="secondary"
                  @click="addManuscript"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Create a manuscript. It is advised to create up to five manuscripts.</span>
            </v-tooltip>
          </div>
        </v-list>
        <v-card-actions class="justify-center">
          <v-btn
            variant="flat"
            class="primary-btn"
            color="mainBg"
            :loading="loading"
            :disabled="manuscripts.length === 0 || !manuscripts.every(m=> m.content !== null)"
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
      </div>
    </v-card>
  </div>
</template>

<style scoped>
#card-content{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 660px;
}
</style>
