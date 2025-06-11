<script setup>
import { computed, reactive } from "vue";
import { useAppStore } from "@/stores/app.js";
import {convertToRdf} from "@/services/ApiServices.js";

const store = useAppStore()

const fileName = computed(()=>{
  return store.recentFileContent.name
})

const numberOfManuscripts = computed(()=>{
  return store.getStructuredData.number_of_manuscripts
})

const manuscripts = computed(()=>{
  return store.getStructuredData.manuscripts
})

const updateSelection = (e) => {
  console.log("selected Manuscript", e.id)
  store.setSelectedManuscript(e.id)
}

const selManuscript = ref(null)

watch(selManuscript,async(newV, oldV)=>{
  console.log("sel manuscript newV: ", newV[0])
  newV[0]?store.setSelectedManuscript(newV[0]) :store.setSelectedManuscript(null)

})

// convert arrays to comma separated values, and send values..
const reformatData = (val) => {
  // check if it is an array
  if(Array.isArray(val)){
    return val.join(',')
  }else if(val === "") {
    return null
  }else {
    return val
  }
}

const columnsToKeep = ["manuscript_ID", "century_of_creation","support_type", "handwriting_form", "decorations",
"binding", "ink_type", "format", "total_folia", "dimensions_of_the_manuscript_width", "dimensions_of_the_manuscript_length",
  "dimensions_of_the_manuscript_thickness", "contained_works", "incipit", "explicit", "authors", "copyists",  "miniaturists",
  "bookbinders", "illuminators", "rubricators", "restoration_history", "ownership_history",
  "additional_notes"
]

const loading = ref(false)

const convertManuscriptsToRDF = async(e) => {
  console.log("sending data for conversion!", manuscripts.value)
  loading.value = true

  const data = manuscripts.value.map((m, idx)=> {
    console.log("m:", m)
    const manData = {}
    for (const [key, value] of Object.entries(m)) {
      if (!columnsToKeep.includes(key)) continue;
      console.log("field:", key)
      console.log("value:", value?.value)

      const newVal =  reformatData(value?.value)
      manData[key] = newVal

      // const val = (m[key].value || "").trim();
      // dataWithNulls[key] = value.value === "" ? null : val

    }

    console.log("dataWithNulls:", manData)

    return {
      manuscriptNumber: idx + 1,
      data: manData
    }

  })
  console.log("reformatted data:",data)

  try{
    const ttlString = await convertToRdf(data)
    store.setRdfOutput(ttlString)
    store.setNotification({color:'success', showNot: true,time:100, text: 'The data was converted to RDF successfully!'})
    store.setStep(3)

  } catch(err){
    console.log("err", err)
    store.setNotification({color:'red', showNot: true,text:`${err}. There was in issue with the conversion of the manuscript data to RDF.`})
  }
    loading.value = false



}


</script>

<template>
  <div id="extracted-manuscripts">
    <v-card variant="text">
      <!--      <v-card-item>-->
      <!--        <div class="d-flex flex-row justify-start align-center">-->
      <!--          &lt;!&ndash; file icon &ndash;&gt;-->
      <!--          <div>-->
      <!--            <v-icon size="x-large">mdi-file-document-outline</v-icon>-->
      <!--          </div>-->
      <!--          &lt;!&ndash; file content &ndash;&gt;-->
      <!--          <div class="d-flex flex-column justify-center ml-2">-->
      <!--            &lt;!&ndash; filename &ndash;&gt;-->
      <!--            <div class="mb-0 pb-0">File: <span class="font-weight-bold">{{fileName}}</span></div>-->
      <!--            &lt;!&ndash; number of manuscripts &ndash;&gt;-->
      <!--            <div class="mt-0 pt-0">Manuscripts: <span class="font-weight-bold">{{ numberOfManuscripts }}</span></div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </v-card-item>-->
      <v-list
        lines="two"
        bg-color="white"
      >
        <v-list-item
          :title="`File: ${fileName}`"
          :subtitle="`Manuscripts: ${numberOfManuscripts}`"
        >
          <template #prepend>
            <v-avatar>
              <v-icon size="x-large">
                mdi-file-document-outline
              </v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
      <v-divider />
      <!--      <v-card-title>Extracted manuscripts</v-card-title>-->
      <div id="card-content">
        <v-list
          v-model:selected="selManuscript"
          bg-color="white"
        >
          <v-list-subheader>EXTRACTED MANUSCRIPTS</v-list-subheader>
          <v-list-item
            v-for="(man,index) in manuscripts"
            :key="'manuscript'+index"
            :title="man.manuscript_ID.value? man.manuscript_ID.value : 'Manuscript'+index+1"
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
              <v-icon v-if="man?.reviewed">
                mdi-bookmark-check-outline
              </v-icon>
            </template>
          </v-list-item>
        </v-list>
        <v-card-actions class="justify-center">
        <v-btn
          :disabled="!manuscripts.every((m)=> m.reviewed === true)"
          :loading="loading"
          color="mainBg"
          class="primary-btn"
          size="default"
          variant="flat"
          @click="convertManuscriptsToRDF"
        >
          Convert to turtle
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
  //height: 55vh;
}

</style>
