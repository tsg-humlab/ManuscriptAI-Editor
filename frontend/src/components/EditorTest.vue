<template>
  <div ref="editorContainer" class="editor-container" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';
import { EditorState, StateEffect } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';

const editorContainer = ref(null);

let view = null;

onMounted(() => {
  const highlightEffect = StateEffect.define();
  const removeHighlightEffect = StateEffect.define();

  const highlightDecoration = Decoration.mark({
    class: 'cm-highlight-yellow',
  });

  class ActionButtonWidget extends WidgetType {
    constructor(text) {
      super();
      this.text = text;
    }

    toDOM() {
      const btn1 = document.createElement('button');
      btn1.textContent = '🔍';
      btn1.className = 'highlight-btn';
      btn1.addEventListener('click', () => {
        alert(`You selected: "${this.text}"`);
      });


      return btn1;
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
                widget: new ActionButtonWidget(view.state.doc.sliceString(from, to)),
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

  view = new EditorView({
    state: EditorState.create({
      doc: 'Select any part of this text to highlight it. The editor is read-only.',
      extensions: [
        basicSetup,
        EditorView.editable.of(false),
        EditorView.domEventHandlers({
          mouseup(event, view) {
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
    parent: editorContainer.value
  });
});
</script>

<style>
.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 200px;
  font-family: monospace;
}

.cm-highlight-yellow {
  background-color: yellow;
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
</style>
