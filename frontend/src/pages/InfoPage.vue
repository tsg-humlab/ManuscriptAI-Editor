<template>
  <v-container fluid class="pt-12 pb-12 content-container">
    <!-- HERO / INTRO -->
    <v-row justify="center"  class="mb-12">
      <v-col cols="12" md="10">
        <v-card elevation="1" class="hero-card pa-8">
          <h1 class="display-1 font-weight-bold text-center hero-title">
            Tools &amp; Tutorials
          </h1>
          <div class="intro-block">
            <p><strong>Thank you for taking part in our pilot! ❤️</strong></p>
              <p>
    We’ve designed the <em>ManuscriptAI ontology</em> as an RDF(S)/OWL model to describe
    medieval manuscripts in a way both humans and machines can understand. It plugs into
    the wider cultural heritage ecosystem, aligning to CIDOC-CRM for event modeling,
    LRM for bibliographic relationships, and the Europeana Data Model for discovery. We extended these standards with new classes and properties so that Manuscripts'
    features can be described with the level of expressiveness they deserve.
    And because it’s fully alignable with vocabularies like Google Schema, Wikidata, and Biblissima, you can drive
    community-led extensions and share knowledge across platforms. ManuscriptAI can also be tailored to <em> align with and connect to your own ontological extensions</em>, just reach out to us to discuss
    your ideas!
  </p>

  <p>
    <strong>Please note</strong> that by exporting your descriptions as RDF with ManuscriptAI, you automatically create Linked Open Data (LOD). With LOD, your catalogs become machine-understandable, SPARQL-queryable, possibly linkable to datasets worldwide, while also feeding into the broader Cultural Heritage Cloud.
  </p>

  <h4 class="intro-subtitle">Why this matters:</h4>
  <ul class="intro-list">
    <li><strong>Interoperability:</strong> Connect your data with libraries, museums, and archives across the web.</li>
    <li><strong>Discoverability:</strong> Enable richer search, analytics, and mash-ups by leveraging global LOD vocabularies.</li>
    <li><strong>Future-proofing:</strong> As standards evolve, your metadata remains flexible, extensible, and usable by new tools.</li>
    <li><strong>Cultural Heritage Cloud:</strong> Feed your richly structured RDF into a shared cloud platform, powering collaborative research and preservation across institutions.</li>
</ul>

   <p>
     Whether you’re just getting started or you’re a seasoned technologist, we’ve built multiple “paths” to fit your
    needs to structure or convert your data into RDF using Manuscript-AI ontology, each tailored to different file types, data quality, and technical comfort.
     Let’s dive in and find the perfect workflow for you!

     These workflows are currently in <strong>pilot mode</strong>, giving us the chance to gather feedback and <strong>fine-tune the system before becoming fully operational</strong>.
     Below, you’ll find tutorial videos and Manuscript-AI ontology diagrams to walk you through each data-conversion path.
 </p>
</div>
        </v-card>
      </v-col>
    </v-row>

    <div class="accent-divider mb-12"></div>

    <!-- DIAGRAMS SIDE BY SIDE -->
    <v-row justify="center" class="mb-12" dense>
      <v-col cols="12" md="6">
        <v-card elevation="1" class="pa-6 diagram-card">
          <h2 class="text-h6 font-weight-medium diagram-title">Ontology Diagram</h2>
          <p class="section-caption">Click to zoom &amp; pan the high-res overview.</p>
          <v-img
            :src="ontologyDiagram"
            class="clickable-thumbnail mt-4"
            contain
            height="200"
            @click="ontologyDialog = true"
          />

<div class="legend-card mt-4">
  <h3 class="legend-title">Legend</h3>
  <ul class="legend-list detailed-legend">
    <li>
      <!-- Classes as rectangles -->
      <span class="legend-icon class-icon">
        <svg width="18" height="18"><rect x="1" y="1" width="16" height="10" fill="#FFF" stroke="#000" stroke-width="1"/></svg>
      </span>
      <strong>Classes</strong>: Shown as rectangles.
    </li>
    <li>
      <!-- Object properties as solid arrows -->
      <span class="legend-icon prop-icon">
        <svg width="24" height="16" viewBox="0 0 24 16">
          <line x1="0" y1="8" x2="16" y2="8" stroke="#000" stroke-width="2"/>
          <polygon points="16,4 24,8 16,12" fill="#000"/>
        </svg>
      </span>
      <strong>Object Properties</strong>: Arrows with solid black arrowheads connecting classes.
    </li>
    <li>
      <!-- Subclass relationships as hollow arrows -->
      <span class="legend-icon rel-icon">
        <svg width="24" height="16" viewBox="0 0 24 16">
          <line x1="0" y1="8" x2="16" y2="8" stroke="#000" stroke-width="2"/>
          <polygon points="16,4 24,8 16,12" fill="#FFF" stroke="#000" stroke-width="2"/>
        </svg>
      </span>
      <strong>Subclass Relationships</strong>: Arrows with hollow (white) arrowheads.
    </li>
    <li>
      <!-- Datatype properties as small rectangles -->
      <span class="legend-icon dtprop-icon">
        <svg width="16" height="10"><rect x="1" y="1" width="14" height="8" fill="#FFF" stroke="#000" stroke-width="0.5"/></svg>
      </span>
      <strong>Datatype Properties </strong>: Smaller rectangles attached beneath their classes.
    </li>

<li>
  <span class="legend-icon indiv-icon">
    <svg width="24" height="24" viewBox="0 0 24 24">
      <!-- Skewed rectangle: top & bottom horizontal, sides slanted -->
      <polygon
        points="4,6 20,6 16,14 0,14"
        fill="#FFF"
        stroke="#000"
        stroke-width="1"
      />
      <!-- Dotted arrow shaft from bottom-center of the parallelogram -->
      <line
        x1="8" y1="14"
        x2="8" y2="22"
        stroke="#000"
        stroke-width="1"
        stroke-dasharray="2,2"
      />
      <!-- Arrowhead -->
      <polyline
        points="6,20 8,22 10,20"
        fill="none"
        stroke="#000"
        stroke-width="1"
      />
    </svg>
  </span>
  <strong>Individuals</strong> : Small, skewed rectangles linked to their class with a dotted arrow.
</li>


  </ul>
</div>

        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="1" class="pa-6 diagram-card">
          <h2 class="text-h6 font-weight-medium diagram-title">Alignment Overview</h2>
          <p class="section-caption">How ManuscriptAI aligns with CIDOC-CRM, LRM &amp; others.</p>
          <v-img
            :src="alignmentDiagram"
            class="clickable-thumbnail mt-4"
            contain
            height="200"
            @click="alignmentDialog = true"
          />
          <div class="legend-card mt-4">
            <h3 class="legend-title">Legend</h3>
            <ul class="legend-list">
              <li><span class="legend-color-box crm-color"></span> CIDOC-CRM</li>
              <li><span class="legend-color-box lrm-color"></span> LRM</li>
              <li><span class="legend-color-box bib-color"></span> Biblissima</li>
              <li><span class="legend-color-box google-schema"></span> Google Schema</li>
              <li><span class="legend-color-box wikidata"></span> Wikidata</li>
              <li><span class="legend-color-box vibibframe"></span> Bibframe</li>

            </ul>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div class="accent-divider mb-12"></div>

    <!-- VIDEO GRID -->
    <v-row justify="center" align="stretch" class="mb-12">
      <v-col
        v-for="item in videoPaths"
        :key="item.title"
        cols="12"
        md="6"
        class="d-flex"
      >
        <v-card class="video-card d-flex flex-column justify-space-between pa-6"  height="800px">
          <InfoSection :title="item.title" :text="item.text" />

            <v-responsive aspect-ratio="16/9">
              <VideoPlayer :src="item.src" />

                </v-responsive>

        </v-card>
      </v-col>
    </v-row>

    <div class="accent-divider mb-12"></div>

    <!-- LIGHTBOX DIALOGS -->
    <v-dialog v-model="ontologyDialog" max-width="90vw" max-height="90vh" persistent>
      <v-card flat class="dialog-card">
        <v-toolbar dense flat class="dialog-toolbar">
          <v-btn icon @click="ontologyZoom = Math.max(ontologyZoom - 0.25, 0.5)">
            <v-icon>mdi-magnify-minus</v-icon>
          </v-btn>
          <span class="zoom-label">{{ (ontologyZoom * 100).toFixed(0) }}%</span>
          <v-btn icon @click="ontologyZoom = Math.min(ontologyZoom + 0.25, 5)">
            <v-icon>mdi-magnify-plus</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn icon @click="ontologyDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="dialog-content">
          <div
            ref="ontologyPan"
            class="pan-container"
            @mousedown="startPan($event,'ontology')"
          >
            <img
              :src="ontologyDiagram"
              class="full-res-image"
              :style="{ transform: `scale(${ontologyZoom})` }"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="alignmentDialog" max-width="90vw" max-height="90vh" persistent>
      <v-card flat class="dialog-card">
        <v-toolbar dense flat class="dialog-toolbar">
          <v-btn icon @click="alignmentZoom = Math.max(alignmentZoom - 0.25, 0.5)">
            <v-icon>mdi-magnify-minus</v-icon>
          </v-btn>
          <span class="zoom-label">{{ (alignmentZoom * 100).toFixed(0) }}%</span>
          <v-btn icon @click="alignmentZoom = Math.min(alignmentZoom + 0.25, 5)">
            <v-icon>mdi-magnify-plus</v-icon>
          </v-btn>
          <v-spacer />
          <v-btn icon @click="alignmentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="dialog-content">
          <div
            ref="alignmentPan"
            class="pan-container"
            @mousedown="startPan($event,'alignment')"
          >
            <img
              :src="alignmentDiagram"
              class="full-res-image"
              :style="{ transform: `scale(${alignmentZoom})` }"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import InfoSection      from '@/components/InfoSection.vue'
import VideoPlayer      from '@/components/VideoPlayer.vue'
import ontologyDiagram  from '@/assets/ontology-diagram.png'
import alignmentDiagram from '@/assets/alignment-diagram.png'

const ontologyDialog   = ref(false)
const alignmentDialog  = ref(false)
const ontologyZoom     = ref(1)
const alignmentZoom    = ref(1)
const ontologyPan      = ref(null)
const alignmentPan     = ref(null)

const videoPaths = [
  {
    title: 'Create LOD',
    text:  'This path allows you to explore the Manuscript AI ontology and build RDF data from scratch using Manuscript-AI ontology.',
    src:   '/videos/FirstPath.mp4'
  },
  {
    title: 'Manuscript Annotation Desk',
    text:  'Use this path to select or fill values for predefined categories and convert your data into RDF using the Manuscript AI ontologies.  \n' +
           'This path leverages an LLM-powered agent framework to suggest ontology instances for manuscript material information and retrieve matching URIs/IRIs from Wikidata.  \n' +
           'Along the way, you’ll clean and validate your metadata before exporting it as Linked Open Data.',
    src:   '/videos/SecondPath.mp4'
  },
  {
    title: 'Select and Convert',
    text:  'Use this path to select a chunk of information in your data regarding one or more specific manuscripts. The Manuscript-AI powered agent framework will harvest the specified data categories of interest and structure them into RDF using the Manuscript-AI ontology.',
    src:   '/videos/ThirdPath.mp4'
  },
  {
    title: 'Drop & Classify',
    text: 'Drag and drop your data (up to 100 KB per batch) into our testing environment, and let custom-functions and the LLM-powered Manuscript-AI agent framework handle the rest, automatically mapping your content to RDF using the Manuscript AI ontology.',
    src: '/videos/lastPath.mp4'
  }
]

let panState = { mode: null, isPanning: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 }

function startPan(e, mode) {
  panState.mode      = mode
  panState.isPanning = true
  const container    = mode === 'ontology' ? ontologyPan.value : alignmentPan.value
  panState.startX    = e.pageX - container.offsetLeft
  panState.startY    = e.pageY - container.offsetTop
  panState.scrollLeft= container.scrollLeft
  panState.scrollTop = container.scrollTop
  container.style.cursor = 'grabbing'
}

function onPanMove(e) {
  if (!panState.isPanning) return
  const container = panState.mode === 'ontology' ? ontologyPan.value : alignmentPan.value
  e.preventDefault()
  const x = e.pageX - container.offsetLeft
  const y = e.pageY - container.offsetTop
  container.scrollLeft = panState.scrollLeft - (x - panState.startX)
  container.scrollTop  = panState.scrollTop  - (y - panState.startY)
}

function endPan() {
  if (!panState.isPanning) return
  const container = panState.mode === 'ontology' ? ontologyPan.value : alignmentPan.value
  container.style.cursor = 'grab'
  panState.isPanning = false
}

onMounted(() => {
  document.addEventListener('mousemove', onPanMove)
  document.addEventListener('mouseup', endPan)
})
</script>

<style scoped>
/* Container & Hero */
.content-container { background: #F7F7F7; }
.hero-card { background: #FFFFFF; border-left: 6px solid #23263C; }
.hero-title { color: #2C3E50; }
.intro-block {
  background: #ffffff;
  padding: 2rem;
  margin: 2rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.intro-block p {
  margin-bottom: 1.25rem;
  line-height: 1.65;
  font-size: 1.05rem;
  text-align: justify;
  color: #333;
}

.intro-title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #1a2530;
  text-align: center;
}

.intro-subtitle {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.15rem;
  color: #1a2530;
}

.intro-list {
  list-style: disc outside;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.intro-list li {
  margin-bottom: 0.8rem;
  line-height: 1.55;
}

.intro-block em {
  font-style: normal;
  color: #2a6f97;
  font-weight: 500;
}

/* Divider */
.accent-divider { height: 3px; background: #23263C; margin: 3rem 0; }

/* Diagrams */
.diagram-card { background: #FFFFFF; }
.diagram-title { color: #2C3E50; }
.section-caption { font-size: 0.9rem; color: #7F8C8D; }

/* Legend */
.legend-card { background: #F0F0F0; border-radius: 4px; padding: 1rem; }
.legend-title { font-weight: 600; margin-bottom: 0.5rem; color: #2C3E50; }
.legend-list { list-style: none; padding: 0; margin: 0; }
.legend-list li { display: flex; align-items: center; margin-bottom: 0.5rem; color: #2C3E50; }
.legend-color-box { width: 12px; height: 12px; margin-right: 0.75rem; border-radius: 2px; }

.detailed-legend {
  list-style: none;
  padding: 0;
  margin: 0;
}
.detailed-legend li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #2C3E50;
}
.legend-icon {
  flex-shrink: 0;
  width: 24px;
  margin-right: 0.75rem;
  margin-top: 2px;
}
.legend-icon svg {
  display: block;
}



.crm-color    { background: #9B59B6; }
.lrm-color    { background: #3498db; }
.bib-color    { background: #D4AF37; }
.vibibframe {
  background: #E74C3C;
}
.wikidata {
  background: #95A5A6;
}
.google-schema {
  background: #27AE60;
}


/* Videos */
.video-card { background: #FFFFFF; overflow: hidden; }
.faq-card   { background: #FFFFFF; }
.faq-title  { color: #2C3E50; }
.faq-list   { margin-top: 1rem; padding-left: 1.2rem; color: #4A4A4A; }

/* Thumbnails */
.clickable-thumbnail { cursor: zoom-in; border-radius: 4px; transition: box-shadow .2s; }
.clickable-thumbnail:hover { box-shadow: 0 6px 20px rgba(0,0,0,.15); }

/* Dialogs */
.dialog-card    { display: flex; flex-direction: column; height: 90vh; overflow: hidden; }
.dialog-toolbar { background: #2C3E50; color: #FFFFFF; }
.zoom-label     { color: #FFFFFF; margin: 0 12px; font-weight: 500; }
.dialog-content { flex: 1; padding: 0; overflow: auto; }
.pan-container  { width: 100%; height: 100%; overflow: auto; cursor: grab; position: relative; }
.full-res-image { display: block; transform-origin: top center; user-select: none; pointer-events: none; }

/* Spacing helpers */
.mb-12 { margin-bottom: 3rem; }
.pt-12 { padding-top: 3rem; }
.pb-12 { padding-bottom: 3rem; }
</style>
