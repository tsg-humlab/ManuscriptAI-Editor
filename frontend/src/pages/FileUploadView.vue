<script setup>
import { shallowRef, ref, reactive } from 'vue'
import { formatFileSize } from "../tools/index.js";
import { useAppStore } from "@/stores/app.js";
import Papa from 'papaparse';
const store = useAppStore()

const model = shallowRef(null)

// content of the inspected file ...
const fileContent = ref(null)
// loading indication shown, while the uploaded files are being read
const isLoading = reactive([])

// resets the process and starts the process from scratch
const resetStore = async()=>{
  console.log("resetting store!")
  await store.setSelCreatedManuscript([])
  store.listOfCreatedManuscripts = []
  await store.setSelectedManuscript(null)
  await store.setRdfOutput("")
  await store.setStructuredData({"manuscripts": [], "number_of_manuscripts": 0 })
}

const inspectFile = async(file) => {
      console.log("file:", file)
      if (!file) return;

      isLoading[file.name] = true
      file.read = false
      fileContent.value = null

      const reader = new FileReader();
      let parser = null
      reader.onload = (e) => {
        const content = e.target.result;
        const ext = file.name.split('.').pop();
        try{
          switch (ext) {
            case 'json':
              file.content = JSON.stringify(JSON.parse(content), null, 2);
              store.setFileContent({content: file.content, extension: 'json', name: file.name})
              console.log("fileContent:", file.content)
              // initializeEditor(fileContent.value, json());
              break;
            case 'xml':
              console.log("xml content:", content)
              parser = new DOMParser();
              const xmlDoc = parser.parseFromString(content, "text/xml");
              const parsedContent = new XMLSerializer().serializeToString(xmlDoc);
              console.log("parsedContent:", parsedContent)
              file.content = parsedContent
              store.setFileContent({content: file.content, extension: 'xml', name: file.name})
              break;
            case 'csv':
              const data = Papa.parse(content, { header: true,
                complete: function(e){
                console.log("e", e)
                  file.content = JSON.stringify(e.data,null, 2)
                  store.setFileContent({content: file.content, extension: 'json', name: file.name})
                }
              })
              break;
            case 'ttl':
              file.content = content
              store.setFileContent({content: file.content, extension: 'ttl', name: file.name})
              break;
            default:
              alert('Unsupported file type');
          }
          resetStore()
          isLoading[file.name] = false
          file.read = true
        }catch (e) {
          isLoading[file.name] = false
          file.read = true
          store.setNotification({color:'error', showNot: true,text:`${e.message}`})
          throw Error(e)
        }
      };
      reader.readAsText(file);
}
</script>

<template>
  <!--  <v-container class="fill-height">-->
  <div
    id="file-upload-view"
    class="d-flex flex-column"
  >
    <v-card
      variant="flat"
      color="transparent"
    >
      <v-card-title>Convert digitized catalogue data on medieval manuscripts to Linked Open Data</v-card-title>
      <v-card-text>Use ManuscriptAI to identify different types of metadata on medieval manuscripts in your dataset and convert them to the ManuscriptAI standardised vocabulary. You can download the converted catalogue data and use them for further analysis or presentation of your manuscript collection.</v-card-text>
      <v-card-text><b>File format guidelines</b></v-card-text>
      <v-card-text>Upload manuscript data in .json, .xml, .csv, .xlsx, or .ttl format. Each file can contain information about multiple manuscripts.</v-card-text>
    </v-card>
    <v-card
      variant="flat"
      color="transparent"
    >
      <v-card-text>
        <v-file-upload
          v-model="model"
          clearable
          multiple
          border
          divided
          rounded
          scrim="#23263C"
          color="white"
        >
          <template #divider>
            <div style="width: 250px;">
              <v-divider color="#23263C">
                or
              </v-divider>
            </div>
          </template>
          <template #item="{ props: itemProps,file }">
            <v-file-upload-item
              v-bind="itemProps"
              lines="one"
              title=""
              nav
              slim
            >
              <template #prepend>
                <v-avatar
                  size="32"
                  rounded
                />
              </template>
              <template #subtitle />
              <template #default>
                <div class="d-flex flex-row align-center py-2 px-1">
                  <div>
                    <div class="file-name text-title-1 pb-0">
                      {{ file?.name }}
                    </div>
                    <div class="text-caption text-grey-darken-3 pt-0 mt-0">
                      {{ formatFileSize(file?.size) }}
                    </div>
                  </div>
                  <div class="ml-2">
                    <v-btn
                      v-if="store.recentFileContent.content !== file.content"
                      class="primary-btn"
                      color="mainBg"
                      variant="flat"
                      size="small"
                      :loading="isLoading[file.name] || false"
                      @click="inspectFile(file)"
                    >
                      Inspect
                    </v-btn>
                    <v-btn
                      v-if="store.recentFileContent.content === file.content"
                      class="primary-btn"
                      color="mainBg"
                      variant="flat"
                      size="small"
                      @click="store.setStep(1)"
                    >
                      Analyze
                    </v-btn>
                  </div>
                </div>
              </template>

              <template #clear="{ props: clearProps }">
                <v-btn
                  color="#23263C"
                  v-bind="clearProps"
                />
              </template>
            </v-file-upload-item>
          </template>
          <template #browse="{props: itemProps}">
            <v-btn
              variant="flat"
              color="secondary"
              rounded="small"
              v-bind="itemProps"
              class="secondary-btn"
              size="default"
            />
          </template>
        </v-file-upload>
      </v-card-text>
    </v-card>
  </div>
<!--  </v-container>-->
</template>

<style scoped>
.file-name{
  font-size: 0.8125rem;
  font-weight: 500;
}
</style>
