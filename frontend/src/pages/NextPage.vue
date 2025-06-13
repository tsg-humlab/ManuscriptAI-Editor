<template>
  <div>
    <header>
      Manuscript-AI
    </header>
    <div class="content">
      <div class="container-left">
        <h1>Manuscript Information</h1>

        <div class="custom-info">
          <p>
            To uniquely identify each manuscript, please provide the
            <strong>shelfmark</strong> of the manuscript in the field below without
            any spaces or punctuation marks. For example, enter
            <em>"L1234"</em> instead of <em>"L 1234"</em> or <em>"L-1234"</em>.
            This identifier will be used to create a unique URI for the manuscript
            in the knowledge graph, just as the user ID is used to identify users.
          </p>
        </div>

        <!-- Shelfmark Field -->
        <div class="form-group">
          <label for="shelfmark">Shelfmark<span class="required">*</span></label>
          <input
            id="shelfmark"
            v-model="shelfmark"
            type="text"
            name="shelfmark"
            placeholder="Enter shelfmark"
            :disabled="creationTime !== null"
            @input="checkShelfmark"
          >
        </div>

        <div class="btn-container">
          <!-- Next Button -->
          <button
            id="next-btn"
            class="btn1"
            :disabled="disableNextBtn"
            :style="{ display: nextBtnVisible ? 'block' : 'none' }"
            @click="processShelfmark"
          >
            Next
          </button>
        </div>

        <!-- Additional fields displayed only after pressing Next -->
        <div
          v-if="isAuthorFieldsVisible"
          id="author-fields"
          :class="{ hidden: !isAuthorFieldsVisible }"
        >
          <p class="custom-info">
            Please fill in the information below. If something is unknown or not
            applicable, you may leave the field(s) empty.
          </p>

          <div class="form-group">
            <label for="attributed-date">Attributed Date of the Manuscript</label>
            <input
              id="attributed-date"
              v-model="attributedDate"
              type="text"
              name="attributed-date"
              placeholder="Enter attributed date"
              @input="updateRDF"
            >
          </div>
          <div class="form-group">
            <label for="place-of-origin">Attributed Place of Origin of the Manuscript</label>
            <input
              id="place-of-origin"
              v-model="placeOfOrigin"
              type="text"
              name="place-of-origin"
              placeholder="Enter place of origin"
              @input="updateRDF"
            >
          </div>
          <div class="form-group">
            <label for="includes-works">Includes Work(s)</label>
            <input
              id="includes-works"
              v-model="includesWorks"
              type="text"
              name="includes-works"
              placeholder="Enter works included in the manuscript"
              @input="updateRDF"
            >
          </div>
          <div class="form-group">
            <label for="author">Author(s)</label>
            <input
              id="author"
              v-model="author"
              type="text"
              name="author"
              placeholder="Enter author name"
              @input="updateRDF"
            >
          </div>
          <div class="form-group">
            <label for="copyist">Copyist(s)</label>
            <input
              id="copyist"
              v-model="copyist"
              type="text"
              name="copyist"
              placeholder="Enter copyist"
              @input="updateRDF"
            >
          </div>
          <div class="form-group">
            <label for="miniaturist">Miniaturist(s)</label>
            <input
              id="miniaturist"
              v-model="miniaturist"
              type="text"
              name="miniaturist"
              placeholder="Enter miniaturist"
              @input="updateRDF"
            >
          </div>
          <div class="form-group">
            <label for="bookbinder">Bookbinder(s)</label>
            <input
              id="bookbinder"
              v-model="bookbinder"
              type="text"
              name="bookbinder"
              placeholder="Enter bookbinder"
              @input="updateRDF"
            >
          </div>
          <div class="form-group">
            <label for="illuminator">Illuminator(s)</label>
            <input
              id="illuminator"
              v-model="illuminator"
              type="text"
              name="illuminator"
              placeholder="Enter illuminator"
              @input="updateRDF"
            >
          </div>
          <div class="form-group">
            <label for="rubricator">Rubricator(s)</label>
            <input
              id="rubricator"
              v-model="rubricator"
              type="text"
              name="rubricator"
              placeholder="Enter rubricator"
              @input="updateRDF"
            >
          </div>
          <div class="form-group">
            <label for="history-of-ownership">History of Ownership</label>
            <input
              id="history-of-ownership"
              v-model="historyOfOwnership"
              type="text"
              name="history-of-ownership"
              placeholder="Enter history of ownership"
              @input="updateRDF"
            >
          </div>

          <div class="btn-container">
            <!-- Expand Data Connections -->
            <button
              class="btn1"
              @click="goToMaterialPage"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div class="container-right">
        <h1>Turtle RDF Syntax</h1>
        <div
          class="rdf-container"
          style="overflow:auto; max-height: 300px;"
        >
          <p>Prefixes used:</p>
          <pre id="static-rdf">
@prefix ex: &lt;<span class="ex">http://www.example.org/</span>&gt; .
@prefix rdf: &lt;<span class="rdf">http://www.w3.org/1999/02/22-rdf-syntax-ns#</span>&gt; .
@prefix rdfs: &lt;<span class="rdfs">http://www.w3.org/2000/01/rdf-schema#</span>&gt; .
@prefix xsd: &lt;<span class="xsd">http://www.w3.org/2001/XMLSchema#</span>&gt; .
@prefix MS4AI: &lt;<span class="ms4ai">http://ontology.tno.nl/manuscriptAI/</span>&gt; .
          </pre>
        </div>
        <div
          class="rdf-container"
          style="overflow:auto; max-height: 800px;"
        >
          <p>Knowledge Graph:</p>
          <pre
            id="dynamic-rdf"
            v-html="dynamicRdf"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManuscriptInfo',

  data() {
    return {
      creationTime: null,

      // Form fields
      shelfmark: '',
      attributedDate: '',
      placeOfOrigin: '',
      includesWorks: '',
      author: '',
      copyist: '',
      miniaturist: '',
      bookbinder: '',
      illuminator: '',
      rubricator: '',
      historyOfOwnership: '',

      storedRdfTriple: '',
      dynamicRdf: '',

      nextBtnVisible: false,
      uniqueId: null,
    };
  },

  computed: {
    isAuthorFieldsVisible() {
      return this.creationTime !== null;
    },
    disableNextBtn() {
      return !this.shelfmark.trim() || this.creationTime !== null;
    },
  },

  mounted() {
    // 1) BLOCK BACK: Prevent going back to the previous page
    history.pushState(null, null, location.href);
    window.onpopstate = () => {
      history.go(1);
    };

    // 2) DETECT PAGE REFRESH & CLEAR DATA
    // A page refresh typically has performance.navigation.type === 1
    // (modern browsers might use performance.getEntriesByType('navigation')[0].type === 'reload')
    if (performance && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      // Clear data for this page
      localStorage.removeItem('rdfTriple'); // remove the triple so user can't continue
      // Go to the first page, effectively "canceling" what's been done for this page
      window.location.href = '/';
      return;
    }

    // 3) If no triple is found, forcibly go to the first page
    const rdfTriple = localStorage.getItem('rdfTriple');
    if (!rdfTriple) {
      window.location.href = '/';
      return;
    }

    // 4) Attempt to find a uniqueId from the triple
    const matchId = rdfTriple.match(/MS4AI:performs\s+ex:([^<\s]+)/);
    if (!matchId) {
      // invalid triple => go back
      localStorage.removeItem('rdfTriple');
      window.location.href = '/';
      return;
    }

    // 5) If valid, store it and show it
    this.uniqueId = matchId[1];
    this.storedRdfTriple = rdfTriple;
    this.dynamicRdf = rdfTriple;
  },

  methods: {
    checkShelfmark() {
      this.shelfmark = this.shelfmark.replace(/[^a-zA-Z0-9]/g, '');
      this.nextBtnVisible = this.shelfmark.trim() !== '';
    },

    processShelfmark() {
      if (this.shelfmark.trim() !== '' && !this.creationTime) {
        this.creationTime = new Date().toISOString();
        this.updateRDF();
      }
    },

    updateRDF() {
      let rdfContent = this.storedRdfTriple || '';
      const id = this.uniqueId;
      const s = this.shelfmark.trim();

      // Append creation/manuscript statements if we haven't done so yet
      if (id && s !== '') {
        rdfContent += `
\n<span class="ex">ex:${id}</span> <span class="rdf">rdf:type</span> <span class="ms4ai">MS4AI:CreationManuscriptDescription</span> ;
    <span class="ms4ai">MS4AI:timeOfCreation</span> <span class="xsd">"${this.creationTime}"^^xsd:dateTime</span> ;
    <span class="ms4ai">MS4AI:generatesRecordAbout</span> <span class="ex">ex:${s}</span> .`;

        rdfContent += `
\n<span class="ex">ex:${s}</span> <span class="rdf">rdf:type</span> <span class="ms4ai">MS4AI:Manuscript</span> ;
    <span class="ms4ai">MS4AI:shelfmark</span> <span class="xsd">"${s}"^^xsd:string</span>`;
      }

      // Helper to append triple statements if not empty
      const appendTriple = (predicateClass, predicate, value) => {
        const val = value.trim();
        if (val !== '') {
          if (!rdfContent.endsWith('.')) {
            rdfContent += ' ;';
          } else {
            rdfContent = rdfContent.slice(0, -1) + ';';
          }
          rdfContent += `
    <span class="${predicateClass}">${predicate}</span> <span class="xsd">"${val}"^^xsd:string</span>`;
        }
      };

      appendTriple('ms4ai', 'MS4AI:containedWork', this.includesWorks);
      appendTriple('ms4ai', 'MS4AI:attributedAuthor', this.author);
      appendTriple('ms4ai', 'MS4AI:attributedCopyist', this.copyist);
      appendTriple('ms4ai', 'MS4AI:attributedMiniaturist', this.miniaturist);
      appendTriple('ms4ai', 'MS4AI:attributedBookbinder', this.bookbinder);
      appendTriple('ms4ai', 'MS4AI:attributedIlluminator', this.illuminator);
      appendTriple('ms4ai', 'MS4AI:attributedRubricator', this.rubricator);
      appendTriple('ms4ai', 'MS4AI:attributedPlaceOfOrigin', this.placeOfOrigin);
      appendTriple('ms4ai', 'MS4AI:historyOfOwnership', this.historyOfOwnership);
      appendTriple('ms4ai', 'MS4AI:attributedDate', this.attributedDate);

      rdfContent += ' .';

      this.dynamicRdf = rdfContent;
      localStorage.setItem('rdfTriple', rdfContent);
    },

    goToMaterialPage() {
      localStorage.setItem('rdfTriple', this.dynamicRdf);
      this.$router.push({ name: 'mentionInformation' });
  // OR this.$router.push('/mention-information');
      },
  },
};

</script>

<style scoped>

header{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  background:#23263C;
  color:#fff;
  text-align:center;
  padding:20px 0;
  text-transform:uppercase;
  letter-spacing:1px;
  font-weight:bold;
  z-index:1000;
}

.content{
  height:calc(100vh - 80px);
  display:flex;
  gap:20px;
  padding:20px;
  overflow-x:hidden;
  justify-content:center;
}

.container-left,
.container-right{
  /* may grow (=1), may shrink (=1), base width 45 % */
  flex:1 1 45%;
  max-width:45%;
  min-width:0;
  min-height:0;
  background:#fff;
  padding:20px;
  border-radius:12px;
  box-shadow:0 4px 20px rgba(0,0,0,.1);
  display:flex;
  flex-direction:column;
  overflow-y:auto;
  box-sizing:border-box;
}


.container-left{
  padding-right:1rem;
}

.rdf-container{
  padding:10px;
  margin-bottom:10px;
  background:#f9f9f9;
  border-radius:8px;
  box-shadow:0 2px 10px rgba(0,0,0,.1);
  font-family:"Courier New",Courier,monospace;
  max-height:300px;
  overflow:auto;
  white-space:pre-wrap;
}


.rdf-container pre,
#dynamic-rdf{
  white-space:pre-wrap;
  overflow-wrap:anywhere;
  word-break:break-all;
  overflow-x:auto;
  font-size: 0.85em;
  line-height: 1.4;
}


.container-left h1,
.container-right h1{
  margin-bottom:20px;
  font-size:2em;
  color:#23263C;
  text-transform:uppercase;
  letter-spacing:1px;
  font-weight:bold;
  text-align:center;
  line-height:1.2;
}

.form-group{
  margin-bottom:20px;
  display:flex;
  flex-direction:column;
}

label{
  margin-bottom:8px;
  font-weight:bold;
  color:#333;
  font-size:1em;
}

input{
  padding:12px;
  border:1px solid #ccc;
  border-radius:5px;
  font-size:1em;
  width:100%;
  box-sizing:border-box;
  transition:border-color .3s ease;
  white-space:normal;
  overflow-wrap:anywhere;
  word-break:break-all;
}

input:focus{
  border-color:#23263C;
  outline:none;
}

.btn-container{
  width:100%;
  margin:20px auto;
}

.btn1{
  display:block;
  width:100%;
  padding:12px 20px;
  font-size:1.1em;
  color:#fff;
  background:#23263C;
  border:none;
  border-radius:5px;
  cursor:pointer;
  text-transform:uppercase;
  letter-spacing:1px;
  margin:20px 0;
  text-align:center;
  transition:background-color .3s ease,transform .3s ease;
}

.btn1:disabled{
  background:#B0BEC5;
  cursor:not-allowed;
}

.btn1:hover:not(:disabled){
  background:#1B1E2A;
  transform:translateY(-2px);
}

.custom-info{
  background:#f0f7ff;
  padding:20px;
  border-radius:8px;
  border-left:4px solid #1E3A8A;
  box-shadow:0 2px 10px rgba(0,0,0,.1);
  font-size:.9em;
  line-height:1.6em;
  color:#333;
  margin-bottom:20px;
  text-align:justify;
}

.hidden{display:none;}
.required{color:red;}
</style>


