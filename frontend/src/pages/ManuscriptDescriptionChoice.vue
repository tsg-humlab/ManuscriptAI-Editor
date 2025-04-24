<template>
  <div class="description-choice-page">
    <header>Manuscript-AI</header>
    <div class="content">
      <div class="choice-container">
        <div class="padded-group">
          <h1>Define Your Manuscript's Journey</h1>
          <p class="intro">
            At this stage, you have two options: you can delve into a detailed
            description of your manuscript, breaking it down into specific
            segments, or you can skip it, simply confirm the source from which
            the manuscript's information was derived and proceed to download
            your knowledge graph. Please make a choice by selecting one of the
            options below.
          </p>
        </div>
        <div class="options">
          <div
            class="option-card"
            @click="describeSpecifics"
          >
            <div class="option-icon">
              <i class="fas fa-pencil-alt" />
            </div>
            <h2>Describe Manuscript Specifics</h2>
            <p>
              Utilize Manuscript-AI to provide a detailed description of your
              manuscript by segmenting it into specific parts via the
              <strong
                class="locus-link"
                @click.stop="openLocusModal($event)"
              >locus</strong>
              concept. A locus can represent anything from paragraphs to
              sentences or individual words, offering a detailed breakdown of
              your manuscript's contents.
            </p>
            <button class="main-button">
              Describe Specifics
            </button>
          </div>
          <div
            class="option-card"
            @click="registerSource"
          >
            <div class="option-icon" />
            <h2>Describe Source Information</h2>
            <p>
              If you choose to keep your manuscript description simple, just
              record where your manuscript's details were obtained. This
              approach allows you to document the source of your information
              without the need for an extensive breakdown.
            </p>
            <button class="main-button">
              Register Source
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- The Modal -->
    <div
      v-if="showLocusModal"
      class="modal-overlay"
      @click="closeLocusModal"
    >
      <div
        class="modal-content"
        @click.stop
      >
        <span
          class="close-button"
          @click="closeLocusModal"
        >&times;</span>
        <h2>Locus Explanation</h2>
        <div class="padded-group">
          <p>
            Below is a visual example of what a locus can be – such as a
            paragraph, a sentence, or even a single word – and how a locus (such
            as an initial) can be described using the Manuscript-AI ontology.
          </p>
        </div>

        <!-- Image Container (no max-height) -->
        <div class="manuscript-image-container">
          <img
            src="@/assets/Manus.jpg"
            alt="Manuscript Example"
            @load="onImageLoad"
          >

          <!-- Sentence -->
          <div
            v-if="imageLoaded"
            class="locus-highlight"
            :style="{ top: '30px', left: '150px', width: '180px', height: '30px' }"
          >
            <span>Sentence. Locus ID: 4567</span>
          </div>

          <!-- Initial -->
          <div
            v-if="imageLoaded"
            class="locus-highlight"
            :style="{ top: '60px', left: '30px', width: '140px', height: '120px' }"
          >
            <span>Initial. Locus ID: 7890</span>
          </div>

          <!-- Word -->
          <div
            v-if="imageLoaded"
            class="locus-highlight"
            :style="{ top: '220px', left: '310px', width: '50px', height: '25px' }"
          >
            <span>Word. Locus ID: 5432</span>
          </div>
        </div>

        <!-- Boxed Text with Code Snippet -->
        <div class="locus-code-container">
          <p>A Initial can be represented as Manuscript-AI 'Locus' as follows:</p>
          <pre>
ex:RICC289 rdf:type MS4AI:Manuscript ;
    MS4AI:shelfmark "Riccardiano 289"^^xsd:string ;
    MS4AI:includesLocus ex:7890.

ex:7890 rdf:type MS4AI:Locus ;
    MS4AI:concernsFeature MS4AI:initial ;
    MS4AI:includesText "s"^^xsd:string.
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManuscriptDescriptionChoice",
  data() {
    return {
      showLocusModal: false,
      imageLoaded: false,
    };
  },
  mounted() {
    // Prevent going back
    history.pushState(null, null, location.href);
    window.onpopstate = () => history.go(1);

    // Detect page refresh: If refreshed, clear stored RDF and redirect
    if (
      performance &&
      performance.navigation.type === performance.navigation.TYPE_RELOAD
    ) {
      console.log("Page refreshed! Clearing RDF triple and redirecting.");
      localStorage.removeItem("rdfTriple");
      window.location.href = "/";
    }
  },
  methods: {
    describeSpecifics() {
      this.$router.push({ name: "locus" });
    },
    registerSource() {
      this.$router.push({ name: "source" });
    },
    openLocusModal(event) {
      event.stopPropagation();
      this.showLocusModal = true;
    },
    closeLocusModal() {
      this.showLocusModal = false;
    },
    onImageLoad() {
      console.log("Manuscript image has fully loaded.");
      this.imageLoaded = true;
    },
  },
};
</script>

<style scoped>
.description-choice-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f7f7, #e2e2e2);
  color: #333;
}


header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #23263c;
  color: white;
  text-align: center;
  padding: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  z-index: 1000;
}

.content {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.choice-container {
  background: #fff;
  padding: 50px;
  border-radius: 12px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: fadeIn 0.6s ease-in-out;
}

.padded-group {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.intro {
  font-size: 1.1em;
  margin-top: 30px;
  margin-bottom: 30px;
  line-height: 1.6;
}

.options {
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: stretch;
}


.option-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 350px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
.option-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.option-icon {
  font-size: 3em;
  margin-bottom: 10px;
  color: #f39c12;
}

.option-card h2 {
  margin-bottom: 15px;
  font-size: 1.6em;
  color: #23263c;
}
.option-card p {
  font-size: 1em;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #555;
}

.main-button {
  background: #23263c;
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: 0.3s;
  text-align: center;
  display: block;
  margin-top: auto;
  min-height: 45px;
}
.main-button:hover {
  background-color: #1b1e2a;
  transform: translateY(-2px);
}

.locus-link {
  color: #f39c12;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}
.locus-link:hover {
  color: #d98507;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding-top: 120px;
  padding-bottom: 50px;
  animation: fadeIn 0.3s ease-in-out;
}


.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  text-align: left;
  margin-bottom: 40px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5em;
  cursor: pointer;
  color: #888;
  transition: color 0.3s ease;
}
.close-button:hover {
  color: #333;
}


.manuscript-image-container {
  position: relative;
  display: block;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
}
.manuscript-image-container img {
  max-width: 100%;
  height: auto;
}


.locus-highlight {
  position: absolute;
  border: 2px solid #f39c12;
  border-radius: 4px;
  pointer-events: none;
  box-sizing: border-box;
}
.locus-highlight span {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  background: #ff4500;
  color: #fff;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}


.locus-code-container {
  background-color: #f1f1f1;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.locus-code-container p {
  margin-bottom: 10px;
  font-weight: bold;
}
.locus-code-container pre {
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  max-height: 200px;
  font-size: 0.9em;
  font-family: "Courier New", Courier, monospace;
}


@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}


@media (max-width: 600px) {
  .options {
    flex-direction: column;
  }
  .modal-content {
    width: 95%;
  }
}
</style>
