<script setup>

// content in the textarea
import {ref,computed, onMounted} from "vue";
import { useAppStore } from "@/stores/app.js";
const store = useAppStore()


const text = ref(null)

// the selected manuscript from the list in the left
const selectedManuscript = computed(()=>{
  return store.getSelCreatedManuscript
})

watch(selectedManuscript, async(newV,oldV)=>{
  text.value = newV?.content
})


// is triggered when the textarea is clear by the clear button and removed content from the manuscript and
// the text field
const clearTextArea = () => {
  text.value=null;
  selectedManuscript.value.content = text.value
  console.log("after deletion:", selectedManuscript.value)
  // manuscripts.value[selManuscript.value].content = null
}

const updateContent = () => {
  console.log("text.value to update", text.value)
  selectedManuscript.value.content = text.value
  console.log("I am updating this manuscript:",selectedManuscript.value)
  // manuscripts.value[selManuscript.value].content = text.value
}

</script>

<template>
  <div id="manuscript-content-area">
    <v-card
      variant="text"
      subtitle="Manuscript Content"
    >
          <v-textarea
            id="text-box"
            ref="textBoxRef"
            v-model="text"
            variant="outlined"
            class="mx-1"
            style="height: 700px;"
            center-affix
            placeholder="Paste the properties copied from the uploaded file (editor pane) into this element for the selected manuscript on the left."
            :disabled="!selectedManuscript?.title"
          >
            <template #append-inner>
              <div id="btns">
                <div id="clearable-btn">
                  <v-btn
                    variant="text"
                    icon="mdi-close-circle"
                    color="#232302"
                    density="compact"
                    size="small"
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

      </v-card>
  </div>
</template>

<style scoped>
#btns{
  display: flex !important;
  flex-direction: column !important;
  align-self: stretch !important;
  align-items: flex-end !important;
}

#text-box{
  height: 100%;
}

#clearable-btn{
  margin-top: 0px;
  margin-right: 5px;

}

#save-btn{
  padding-bottom: 5px;
  margin-bottom: 5px;

}

</style>
