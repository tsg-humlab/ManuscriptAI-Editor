<template>
  <v-card variant="text" subtitle="File content">
    <div
      id="editorContainer"
      ref="editorContainer"
      class="editor-container"
    />


  </v-card>
</template>

<script setup>
// Import necessary CodeMirror 6 modules
import { ref, computed, onMounted, watch } from "vue";
import { basicSetup, EditorView } from "codemirror";
import { xml } from "@codemirror/lang-xml"
import {json} from "@codemirror/lang-json"
import {markdown} from "@codemirror/lang-markdown"
import {languages} from "@codemirror/language-data"
import { StreamLanguage } from '@codemirror/language';
import { turtle } from '@codemirror/legacy-modes/mode/turtle';
import { EditorState, StateField, StateEffect } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import { useAppStore} from "@/stores/app.js";

const store = useAppStore()

const editorContainer = ref(null)

// a computed ref
let editorView = ref(null)

const extension = computed(()=> store.recentFileContent.extension)
const content = computed(()=>store.recentFileContent.content)

const langConfig = computed(() => {
  console.log("extension:", extension.value)
  // let selection = null
  switch (extension.value) {
    case 'json':
      return json()

    case 'xml':
      return xml()

    case 'ttl':
      return StreamLanguage.define(turtle)

    default:
      return markdown({codeLanguages: languages})

  }

})

// StateEffect to manage highlights
const addHighlight = StateEffect.define();
const removeHighlight = StateEffect.define();

// StateField to store highlights persistently
const highlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(highlights, tr) {
    highlights = highlights.map(tr.changes);

    for (let effect of tr.effects) {
      if (effect.is(addHighlight)) {
        highlights = highlights.update({ add: effect.value });
      } else if (effect.is(removeHighlight)) {
        highlights = Decoration.none;
      }
    }
    return highlights;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// Function to highlight selected text
const highlightSelection = () => {
  if (!editorView.value) return;

  let { state } = editorView.value;
  let decorations = [];

  // Capture selected text and create decorations
  for (let range of state.selection.ranges) {
    if (!range.empty) {
      decorations.push(
        Decoration.mark({ class: "highlight" }).range(range.from, range.to)
      );
    }
  }

  // Apply highlights to the state
  editorView.value.dispatch({
    effects: addHighlight.of(decorations),
  });
};


const initializeEditor = () => {

  //     if (editorView) editorView.destroy();
      // Initialize the CodeMirror 6 editor
      editorView.value = new EditorView({
        state: EditorState.create({
          doc: content.value,
          extensions: [basicSetup, langConfig.value, EditorState.readOnly.of(true),highlightField],
        }),
        parent: editorContainer.value, // Attach editor to the DOM container
      })

      editorView.value.dom.addEventListener('mouseup', () => {
        const selection = editorView.value.state.selection.main;
        if (!selection.empty) {
          editorView.value.dispatch({
            selection: { anchor: selection.from, head: selection.to }
          });
          const selectedText = editorView.value.state.doc.sliceString(selection.from, selection.to);
          navigator.clipboard.writeText(selectedText).then(() => {
            console.log('Text copied to clipboard:', selectedText);
            store.setNotification({color:'info', showNot: true, time:100, text: 'Content has been copied. You can paste it to the manuscript location!'})
            highlightSelection();
          }).catch(err => {
            console.error('Failed to copy text:', err);
          });
        }
      });

}
//
onMounted(()=>{
  console.log("mounting the editor!")
  initializeEditor();
})


watch(content, (newValue, oldValue) => {
  console.log(`keyB changed from ${oldValue} to ${newValue}`);
  if(editorView.value) editorView.value.destroy()
  initializeEditor();
});



</script>

<style>
.editor-container {
  background: #f5f5f5;
  border-radius: 5px;
  padding: 10px;
  font-family: monospace;
  overflow: auto;
  height: 675px;


}

.cm-editor{
  height: 100%;
}

.highlight {
  background-color: #FFECB3 !important;
  border-radius: 3px !important;
  padding: 1px 2px !important;
}
</style>
