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
import { ref, onMounted, watch, computed } from 'vue';
// Import necessary CodeMirror 6 modules
import { EditorView, basicSetup } from 'codemirror';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';
import { EditorState, StateEffect } from '@codemirror/state';
import { xml } from "@codemirror/lang-xml"
import { json } from "@codemirror/lang-json"
import { markdown } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { StreamLanguage } from '@codemirror/language';
import { turtle } from '@codemirror/legacy-modes/mode/turtle';
import { useAppStore} from "@/stores/app.js";

const store = useAppStore()

const editorContainer = ref(null);

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

// state effects to manage highlights
const highlightEffect = StateEffect.define();
const removeHighlightEffect = StateEffect.define();

const highlightDecoration = Decoration.mark({
   class: 'highlight',
});

class ActionButtonWidget extends WidgetType {
  constructor(text) {
    super();
    this.text = text;
  }

  toDOM() {
    const div = document.createElement('div');
    div.className = 'btn-container';
    const btn1 = document.createElement('button');
    btn1.textContent = '+';
    btn1.className = 'highlight-btn';
    btn1.title = 'Create a new manuscript containing the highlighted content';  // Tooltip text for button 1
    btn1.addEventListener('click', () => {
      // copy the content
      copyContent(this.text)
      let createdMan = { title:null, content: this.text, id: null }
      // create a new manuscript & paste the content in it
      const data = store.addManToListOfCreatedManuscripts(createdMan)
      // set the manuscript as selected in the list of manuscripts
      store.setSelCreatedManuscript(data)
    });
    div.appendChild(btn1);

    const btn2 = document.createElement('button');
    btn2.innerHTML = '&#10063;';
    btn2.className = 'highlight-btn';
    btn2.title = 'Copy the highlighted content';  // Tooltip text for button 2
    btn2.addEventListener('click', () => {
      // copy the content
      copyContent(this.text);
      // show notification
      store.setNotification({color:'info', showNot: true, time:100, text: 'Content has been copied. You can paste it to the manuscript location!'})
    });
    div.appendChild(btn2);

    return div;
  }
  ignoreEvent() {
    return false;
  }
}

const highlightPlugin = ViewPlugin.fromClass(class {
    constructor(view) {
      this.decorations = Decoration.none;
    }

    update(update) {
      for (let tr of update.transactions) {
        for (let effect of tr.effects) {
          if (effect.is(highlightEffect)) {
            const { from, to } = effect.value;
            const deco = [
              highlightDecoration.range(from, to),
              Decoration.widget({
                widget: new ActionButtonWidget(editorView.value.state.doc.sliceString(from, to)),
                side: -1,
              }).range(from)
            ];
            this.decorations = Decoration.set(deco, true);
          }
          if (effect.is(removeHighlightEffect)) {
            this.decorations = Decoration.none;
          }
        }
      }
    }

    destroy() {}

    get decorations() {
      return this._decorations;
    }

    set decorations(value) {
      this._decorations = value;
    }
  }, {
  decorations: v => v.decorations
});

const copyContent = (text) => {
  navigator.clipboard.writeText(text).then(() => {
        console.log('Text copied to clipboard:', text);
      }).catch(err => {
        console.error('Failed to copy text:', err);
      });
}

const initializeEditor = () => {

  editorView.value = new EditorView({
    state: EditorState.create({
      doc: content.value,
      extensions: [
        basicSetup,
        langConfig.value,
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        EditorView.domEventHandlers({
          mouseup(event, view) {
            console.log("button 1 or button 2: ", view, event)
            const sel = view.state.selection.main;
            if (!sel.empty) {
              view.dispatch({
                effects: highlightEffect.of({ from: sel.from, to: sel.to })
              });
            }
          }
        }),
        highlightPlugin,
      ]
    }),
    parent: editorContainer.value // attach editor to the DOM
  });
}

onMounted(() => {
  console.log("mounting the editor!")
  initializeEditor()
});

watch(content, (newValue, oldValue) => {
  console.log(`keyB changed from ${oldValue} to ${newValue}`);
  if(editorView.value) editorView.value.destroy()
  initializeEditor();
});

</script>

<style>
.editor-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  min-height: 200px;
  font-family: monospace;
  overflow: auto;
  height: 675px;
  padding: 2px;
}

.highlight {
  background-color: #FFECB3 !important;
  border-radius: 3px !important;
  padding: 1px 2px !important;
}

.highlight-btn {
  background: #fffbe6;
  border: 1px solid #999;
  border-radius: 4px;
  padding: 2px 5px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 4px;
}

.btn-container{
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
