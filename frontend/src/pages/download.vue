<template>
  <div
    id="main-container"
    class="container"
  >
    <h1 id="title">
      Well done! Now, it is time to download
    </h1>
    <div
      id="description"
      class="description"
    >
      The knowledge graph you’ve created leverages machine-understandable, semantic-based vocabulary terms. To enhance interoperability, select additional ontologies compatible with Manuscript-AI (which extends these ontologies). Once selected, you can download the complete knowledge graph along with the associated ontology.
    </div>

    <div class="checkbox-list">
      <label>
        <input
          id="useManuscriptAIOnly"
          v-model="useManuscriptAIOnly"
          type="checkbox"
          @change="toggleOthers"
        >
        Use <strong>Manuscript-AI</strong> only
      </label>

      <label>
        <input
          id="cidocCrm"
          v-model="cidocCrmSelected"
          type="checkbox"
          class="ontology-option"
          :disabled="useManuscriptAIOnly"
        >
        Includes alignment with <strong>CIDOC-CRM</strong>
      </label>

      <!-- to further adapt Biblissima (maybe):
      <label>
        <input
          type="checkbox"
          class="ontology-option"
          value="biblissima"
          v-model="biblissimaSelected"
          :disabled="useManuscriptAIOnly"
        >
        <strong>Biblissima</strong>
      </label> -->

      <label>
        <input
          id="lrmFrbr"
          v-model="lrmFrbrSelected"
          type="checkbox"
          class="ontology-option"
          :disabled="useManuscriptAIOnly"
        >
        Includes alignment with <strong>LRM (New FRBR Version)</strong>
      </label>

      <!-- to further adapt Europeana:
      <label>
        <input
          type="checkbox"
          class="ontology-option"
          value="europeana-datamodel"
          v-model="europeanaDatamodelSelected"
          :disabled="useManuscriptAIOnly"
        >
        <strong>Europeana Data Model</strong>
      </label> -->
    </div>

    <button
      id="downloadButton"
      class="btn1"
      :disabled="noSelectionMade"
      @click="downloadRdf"
    >
      Download
    </button>
  </div>
</template>

<script>
export default {
  name: "DownloadView",
  data() {
    return {
      // Checkbox states
      useManuscriptAIOnly: false,
      cidocCrmSelected: false,
      lrmFrbrSelected: false,
      europeanaDatamodelSelected: false, // included visually, no special text appended yet
      // Possibly if we want to re-enable Biblissima:
      // biblissimaSelected: false,

      storedTriple: localStorage.getItem("rdfTriple") || "",
      // The RDF from localStorage
      dynamicRdf: "",
    };
  },

  computed: {
    noSelectionMade() {
      return (
        !this.useManuscriptAIOnly &&
        !this.cidocCrmSelected &&
        !this.lrmFrbrSelected
      );
    },
  },
  mounted() {

    // Block back navigation.
    history.pushState(null, null, location.href);
    window.onpopstate = () => history.go(1);

    // Detect page refresh: if refreshed, clear stored triple and redirect to landing page.
    if (performance && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      localStorage.removeItem("rdfTriple");
      window.location.href = "/";
      return;
    }

    // If no stored triple exists, redirect to landing page.
    if (!this.storedTriple) {
      window.location.href = "/";
      return;
    }

    // Load the RDF from localStorage
    this.dynamicRdf = localStorage.getItem("rdfTriple") || "";
  },

  methods: {
    // If "Use Manuscript-AI only" is checked, disable other checkboxes
    toggleOthers() {
      if (this.useManuscriptAIOnly) {
        this.cidocCrmSelected = false;
        this.lrmFrbrSelected = false;
        this.europeanaDatamodelSelected = false;
        // this.biblissimaSelected = false;
      }
    },

    downloadRdf() {

      if (
        !this.useManuscriptAIOnly &&
        !this.cidocCrmSelected &&
        !this.lrmFrbrSelected
      ) {

        alert("Please choose at least one option to proceed with the download.");
        return;
      }
      let userRdf = (this.dynamicRdf || "").trim();

      const prefixes = `@prefix ex: <http://www.example.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix MS4AI: <http://ontology.tno.nl/manuscriptAI/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .

<http://ontology.tno.nl/manuscriptAI/>
    rdf:type owl:Ontology .

### Classes
MS4AI:AttributionalFeature rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:LocusFeature ;
    rdfs:comment "The 'AttributionalFeature' class represents features that provide attributional information about the locus..."@en ;
    rdfs:label "Attributional Feature"@en .

MS4AI:Author rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:Person ;
    rdfs:comment "The 'Author' class represents individuals or entities credited with creating the content of manuscripts."@en ;
    rdfs:label "Author"@en .

MS4AI:BindingTechnique rdf:type owl:Class ;
    rdfs:comment "The 'Binding Technique' class represents the methods or processes used to assemble..."@en ;
    rdfs:label "Binding Technique"@en .

MS4AI:Bookbinder rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:Person ;
    rdfs:comment "The 'Bookbinder' class represents individuals responsible for binding manuscript folia..."@en ;
    rdfs:label "Bookbinder"@en .

MS4AI:Copyist rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:Person ;
    rdfs:comment "The 'Copyist' class represents individuals tasked with transcribing or reproducing texts by hand..."@en ;
    rdfs:label "Copyist"@en .

MS4AI:CreationManuscriptDescription rdf:type owl:Class ;
    rdfs:subClassOf [ rdf:type owl:Restriction ;
                      owl:onProperty MS4AI:generatesRecordAbout ;
                      owl:maxQualifiedCardinality "1"^^xsd:nonNegativeInteger ;
                      owl:onClass MS4AI:Manuscript
                    ] ;
    rdfs:comment "The 'Creation Manuscript Description' class encapsulates the specific event during which a detailed description of a manuscript is produced..."@en ;
    rdfs:label "Creation Manuscript Description"@en .

MS4AI:Decoration rdf:type owl:Class ;
    rdfs:comment "The 'Decoration' class represents the artistic elements within a manuscript that enhance its visual appeal..."@en ;
    rdfs:label "Decoration"@en .

MS4AI:Entity rdf:type owl:Class ;
    rdfs:comment "The 'Entity' class represents individuals or entities involved in the detailed description..."@en ;
    rdfs:label "Entity"@en .

MS4AI:Format rdf:type owl:Class ;
    rdfs:comment "The 'Format' class represents the physical configuration and layout of a manuscript..."@en ;
    rdfs:label "Format"@en .

MS4AI:Illuminator rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:Person ;
    rdfs:comment "The 'Illuminator' class represents individuals responsible for the artistic decoration..."@en ;
    rdfs:label "Illuminator"@en .

MS4AI:Ink rdf:type owl:Class ;
    rdfs:comment "A substance used for writing or drawing in medieval manuscripts..."@en ;
    rdfs:label "Ink"@en .

MS4AI:LayoutFeature rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:LocusFeature ;
    rdfs:comment "The 'LayoutFeature' class encompasses various layout elements within the locus..."@en ;
    rdfs:label "Layout Feature"@en .

MS4AI:Locus rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:Manuscript ;
    rdfs:comment "The 'Locus' class represents the specific location within a manuscript..."@en ;
    rdfs:label "Locus"@en .

MS4AI:LocusFeature rdf:type owl:Class ;
    rdfs:comment "The 'Locus Feature' serves as a superclass for various types of features of a manuscript locus..."@en ;
    rdfs:label "Locus Feature"@en .

MS4AI:Manuscript rdf:type owl:Class ;
    rdfs:comment "The 'Manuscript' class refers to individual physical instances of manuscripts..."@en ;
    rdfs:label "Manuscript"@en .

MS4AI:MaterialMarking rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:LocusFeature ;
    rdfs:comment "The 'MaterialMarking' class represents physical markings on the manuscript material..."@en ;
    rdfs:label "Material Marking"@en .

MS4AI:Miniaturist rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:Person ;
    rdfs:comment "The 'Miniaturist' class represents individuals skilled in the art of creating miniatures..."@en ;
    rdfs:label "Miniaturist"@en .

MS4AI:ParatextualFeature rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:LocusFeature ;
    rdfs:comment "The 'ParatextualFeature' class encompasses various paratextual elements within the locus."@en ;
    rdfs:label "Paratextual Feature"@en .

MS4AI:Person rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:Entity ;
    rdfs:comment "The 'Person' class represents individuals who are relevant to the manuscript..."@en ;
    rdfs:label "Person"@en .

MS4AI:Place rdf:type owl:Class ;
    rdfs:comment "The 'Place' class represents the geographical locations associated with a manuscript's creation..."@en ;
    rdfs:label "Place"@en .

MS4AI:Rubricator rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:Person ;
    rdfs:comment "The 'Rubricator' class represents individuals responsible for adding red text or embellishments..."@en ;
    rdfs:label "Rubricator"@en .

MS4AI:Script rdf:type owl:Class ;
    rdfs:comment "The 'Script' class represents the style and form of writing used in a manuscript..."@en ;
    rdfs:label "Script"@en .

MS4AI:Support rdf:type owl:Class ;
    rdfs:comment "The manuscript support class represents the set of materials used as the physical base..."@en ;
    rdfs:label "Support"@en .

MS4AI:TextualFeature rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:LocusFeature ;
    rdfs:comment "The 'TextualFeature' class encompasses various textual elements within the locus..."@en ;
    rdfs:label "Textual Feature"@en .

MS4AI:Work rdf:type owl:Class ;
    rdfs:comment "It refers to the intellectual or creative content that is contained within the manuscript..." ;
    rdfs:label "Work" .

MS4AI:codicologicalFeature rdf:type owl:Class ;
    rdfs:subClassOf MS4AI:LocusFeature ;
    rdfs:comment "The 'CodicologicalFeature' class encompasses various codicological elements within the locus."@en ;
    rdfs:label "Codicological Feature"@en .

# Object Properties
MS4AI:concernsFeature rdf:type owl:ObjectProperty ,
                      owl:AsymmetricProperty ;
                      rdfs:domain MS4AI:Locus ;
                      rdfs:range MS4AI:LocusFeature ;
                      rdfs:label "concerns feature"@en .

MS4AI:containsLocus rdf:type owl:ObjectProperty ,
                    owl:TransitiveProperty ;
                    rdfs:domain MS4AI:Locus ;
                    rdfs:range MS4AI:Locus ;
                    rdfs:comment "The 'contains Locus' property is used to connect a 'Locus' with another 'Locus' contained within it."@en ;
                    rdfs:label "contains locus"@en .

MS4AI:generatesRecordAbout rdf:type owl:ObjectProperty ,
                           owl:FunctionalProperty ;
                           rdfs:domain MS4AI:CreationManuscriptDescription ;
                           rdfs:range MS4AI:Manuscript ;
                           rdfs:comment "The 'generatesRecordAbout' property represents the relationship between an event or activity..."@en ;
                           rdfs:label "generates record about"@en .

MS4AI:hasAttributedAuthor rdf:type owl:ObjectProperty ,
                          owl:AsymmetricProperty ;
                          rdfs:domain [ rdf:type owl:Class ;
                                        owl:unionOf ( MS4AI:Locus
                                                      MS4AI:Manuscript
                                                    )
                                      ] ;
                          rdfs:range MS4AI:Author ;
                          rdfs:comment "The 'hasAttributedAuthor' property represents the relationship between a 'Manuscript'..."@en ;
                          rdfs:label "has attributed author"@en .

MS4AI:hasAttributedBookbinder rdf:type owl:ObjectProperty ,
                              owl:AsymmetricProperty ;
                              rdfs:domain [ rdf:type owl:Class ;
                                            owl:unionOf ( MS4AI:Locus
                                                          MS4AI:Manuscript
                                                        )
                                          ] ;
                              rdfs:range MS4AI:Bookbinder ;
                              rdfs:comment "A property that links a manuscript to the bookbinder attributed..."@en ;
                              rdfs:label "has attributed bookbinder"@en .

MS4AI:hasAttributedCopyist rdf:type owl:ObjectProperty ,
                           owl:AsymmetricProperty ;
                           rdfs:domain [ rdf:type owl:Class ;
                                         owl:unionOf ( MS4AI:Locus
                                                       MS4AI:Manuscript
                                                     )
                                       ] ;
                           rdfs:range MS4AI:Copyist ;
                           rdfs:comment "The 'hasAttributedCopyist' property represents the relationship between a 'Manuscript as Item'..."@en ;
                           rdfs:label "has attributed copyist"@en .

MS4AI:hasAttributedIlluminator rdf:type owl:ObjectProperty ,
                               owl:AsymmetricProperty ;
                               rdfs:domain [ rdf:type owl:Class ;
                                             owl:unionOf ( MS4AI:Locus
                                                           MS4AI:Manuscript
                                                         )
                                           ] ;
                               rdfs:range MS4AI:Illuminator ;
                               rdfs:comment "A property that links a manuscript to the illuminator attributed..."@en ;
                               rdfs:label "has attributed illuminator"@en .

MS4AI:hasAttributedMiniaturist rdf:type owl:ObjectProperty ,
                               owl:AsymmetricProperty ;
                               rdfs:domain [ rdf:type owl:Class ;
                                             owl:unionOf ( MS4AI:Locus
                                                           MS4AI:Manuscript
                                                         )
                                           ] ;
                               rdfs:range MS4AI:Miniaturist ;
                               rdfs:comment "A property that links a manuscript to the miniaturist attributed..."@en ;
                               rdfs:label "has attributed miniaturist"@en .

MS4AI:hasAttributedRubricator rdf:type owl:ObjectProperty ,
                              owl:AsymmetricProperty ;
                              rdfs:domain [ rdf:type owl:Class ;
                                            owl:unionOf ( MS4AI:Locus
                                                          MS4AI:Manuscript
                                                        )
                                          ] ;
                              rdfs:range MS4AI:Rubricator ;
                              rdfs:comment "A property that links a manuscript to the rubricator attributed..."@en ;
                              rdfs:label "has attributed rubricator"@en .

MS4AI:hasBindingTechnique rdf:type owl:ObjectProperty ,
                          owl:AsymmetricProperty ;
                          rdfs:domain [ rdf:type owl:Class ;
                                        owl:unionOf ( MS4AI:Locus
                                                      MS4AI:Manuscript
                                                    )
                                      ] ;
                          rdfs:range MS4AI:BindingTechnique ;
                          rdfs:comment "A property that links a manuscript to the specific binding technique..."@en ;
                          rdfs:label "has binding technique"@en .

MS4AI:hasDecoration rdf:type owl:ObjectProperty ,
                    owl:AsymmetricProperty ;
                    rdfs:domain [ rdf:type owl:Class ;
                                  owl:unionOf ( MS4AI:Locus
                                                MS4AI:Manuscript
                                              )
                                ] ;
                    rdfs:range MS4AI:Decoration ;
                    rdfs:comment "The 'hasDecoration' property represents the relationship between a 'Manuscript' or 'Locus'..."@en ;
                    rdfs:label "has decoration"@en .

MS4AI:hasFormat rdf:type owl:ObjectProperty ,
                owl:AsymmetricProperty ;
                rdfs:domain [ rdf:type owl:Class ;
                              owl:unionOf ( MS4AI:Locus
                                            MS4AI:Manuscript
                                          )
                            ] ;
                rdfs:range MS4AI:Format ;
                rdfs:comment "The 'hasFormat' property represents the relationship between 'Manuscript as Item' or 'Locus'..."@en ;
                rdfs:label "has format"@en .

MS4AI:hasInk rdf:type owl:ObjectProperty ,
             owl:AsymmetricProperty ;
             rdfs:domain [ rdf:type owl:Class ;
                           owl:unionOf ( MS4AI:Locus
                                         MS4AI:Manuscript
                                       )
                         ] ;
             rdfs:range MS4AI:Ink ;
             rdfs:comment "A property that links a manuscript to the specific type of ink used..."@en ;
             rdfs:label "has Ink"@en .

MS4AI:hasPlaceOfOrigin rdf:type owl:ObjectProperty ,
                       owl:AsymmetricProperty ;
                       rdfs:domain MS4AI:Manuscript ;
                       rdfs:range MS4AI:Place ;
                       rdfs:comment "The 'hasPlaceOfOrigin' property represents the relationship between a 'Manuscript' and its place of origin..."@en ;
                       rdfs:label "has place of origin"@en .

MS4AI:hasScript rdf:type owl:ObjectProperty ,
                owl:AsymmetricProperty ;
                rdfs:domain [ rdf:type owl:Class ;
                              owl:unionOf ( MS4AI:Locus
                                            MS4AI:Manuscript
                                          )
                            ] ;
                rdfs:range MS4AI:Script ;
                rdfs:comment "The 'hasScript' property represents the relationship between a 'Manuscript' or 'Locus'..."@en ;
                rdfs:label "has script"@en .

MS4AI:hasSupport rdf:type owl:ObjectProperty ,
                 owl:AsymmetricProperty ;
                 rdfs:domain [ rdf:type owl:Class ;
                               owl:unionOf ( MS4AI:Locus
                                             MS4AI:Manuscript
                                           )
                             ] ;
                 rdfs:range MS4AI:Support ;
                 rdfs:comment "The 'hasSupport' property represents the relationship between a 'Manuscript' or 'Locus'..."@en ;
                 rdfs:label "has support"@en .

MS4AI:includesLocus rdf:type owl:ObjectProperty ;
                    rdfs:domain MS4AI:Manuscript ;
                    rdfs:range MS4AI:Locus ;
                    rdfs:comment "A property that links a manuscript to a specific locus (location or section)..."@en ;
                    rdfs:label "includes Locus"@en .

MS4AI:includesMentionOfPerson rdf:type owl:ObjectProperty ,
                              owl:AsymmetricProperty ;
                              rdfs:domain MS4AI:Locus ;
                              rdfs:range MS4AI:Person ;
                              rdfs:comment "The 'mentionOfPerson' property represents the relationship between a Locus and an individual mentioned..."@en ;
                              rdfs:label "includes mention of person"@en .

MS4AI:includesMentionOfPlace rdf:type owl:ObjectProperty ,
                             owl:AsymmetricProperty ;
                             rdfs:domain MS4AI:Locus ;
                             rdfs:range MS4AI:Place ;
                             rdfs:comment "The 'mentionOfPlace' property represents the relationship between a 'Locus' and a geographical location..."@en ;
                             rdfs:label "includes mention of place"@en .

MS4AI:includesWork rdf:type owl:ObjectProperty ;
                  rdfs:domain [ rdf:type owl:Class ;
                                owl:unionOf ( MS4AI:Locus
                                              MS4AI:Manuscript
                                            )
                              ] ;
                  rdfs:range MS4AI:Work ;
                  rdfs:comment "The 'includesWork' property represents the relationship between a 'Manuscript as Item' or 'Locus' and the 'Work' contained within it."@en ;
                  rdfs:label "includes work"@en .

MS4AI:ownedBy rdf:type owl:ObjectProperty ,
              owl:AsymmetricProperty ;
              rdfs:domain MS4AI:Manuscript ;
              rdfs:range MS4AI:Entity ;
              rdfs:comment "The 'ownedBy' property represents the relationship between a 'Manuscript as Item' and an individual or entity that owns or has owned..."@en ;
              rdfs:label "owned by"@en .

MS4AI:performs rdf:type owl:ObjectProperty ,
               owl:AsymmetricProperty ;
               rdfs:domain MS4AI:Entity ;
               rdfs:range MS4AI:CreationManuscriptDescription ;
               rdfs:comment "The 'performs' property represents the relationship between the event of creating a manuscript description..."@en ;
               rdfs:label "performs"@en .

MS4AI:referencedIn rdf:type owl:ObjectProperty ;
                  rdfs:domain MS4AI:Manuscript ;
                  rdfs:range MS4AI:Work ;
                  rdfs:comment "The 'referencedIn' property links a manuscript item to the work(s) in which it is referenced or described..."@en ;
                  rdfs:label "referenced in"@en .

MS4AI:sourcedFrom rdf:type owl:ObjectProperty ,
                  owl:AsymmetricProperty ;
                  rdfs:domain MS4AI:CreationManuscriptDescription ;
                  rdfs:range MS4AI:Work ;
                  rdfs:comment "The 'sourcedFrom' property links a 'creation manuscript description event' to a work, such as a catalogue..."@en ;
                  rdfs:label "sourced from"@en .

# Datatype properties:
MS4AI:additionalInformation rdf:type owl:DatatypeProperty ;
                            rdfs:domain MS4AI:Manuscript ;
                            rdfs:range rdfs:Literal ;
                            rdfs:comment "This property offers the possibility to register additional information"@en ;
                            rdfs:label "additional information"@en .

MS4AI:atFolium rdf:type owl:DatatypeProperty ;
               rdfs:domain MS4AI:Locus ;
               rdfs:range rdfs:Literal ;
               rdfs:comment "The 'atFolium' property indicates the specific folio or leaf number where a particular element is located."@en ;
               rdfs:label "at Folium"@en .

MS4AI:attributedAuthor rdf:type owl:DatatypeProperty ;
                       rdfs:domain [ rdf:type owl:Class ;
                                     owl:unionOf ( MS4AI:Locus
                                                   MS4AI:Manuscript
                                                 )
                                   ] ;
                       rdfs:range rdfs:Literal ;
                       rdfs:comment "The 'attributedAuthor' allows to mention the individual or entity (as a literal)..."@en ;
                       rdfs:label "attributed author"@en .

MS4AI:attributedBookbinder rdf:type owl:DatatypeProperty ;
                           rdfs:domain [ rdf:type owl:Class ;
                                         owl:unionOf ( MS4AI:Locus
                                                       MS4AI:Manuscript
                                                     )
                                       ] ;
                           rdfs:range rdfs:Literal ;
                           rdfs:comment "The 'attributedBookbinder' property for the name of the bookbinder as a literal."@en ;
                           rdfs:label "attributed bookbinder"@en .

MS4AI:attributedCopyist rdf:type owl:DatatypeProperty ;
                        rdfs:domain [ rdf:type owl:Class ;
                                      owl:unionOf ( MS4AI:Locus
                                                    MS4AI:Manuscript
                                                  )
                                    ] ;
                        rdfs:range rdfs:Literal ;
                        rdfs:comment "The 'attributedCopyist' property for the name of the copyist as a literal."@en ;
                        rdfs:label "attributed copyist"@en .

MS4AI:attributedDate rdf:type owl:DatatypeProperty ;
                     rdfs:domain MS4AI:Manuscript ;
                     rdfs:range rdfs:Literal ;
                     rdfs:comment "The 'attributedDate' property represents the date or time period that is attributed to the creation..."@en ;
                     rdfs:label "attributed date"@en .

MS4AI:attributedIlluminator rdf:type owl:DatatypeProperty ;
                            rdfs:domain [ rdf:type owl:Class ;
                                          owl:unionOf ( MS4AI:Locus
                                                        MS4AI:Manuscript
                                                      )
                                        ] ;
                            rdfs:range rdfs:Literal ;
                            rdfs:comment "The 'attributedIlluminator' property for the name of the illuminator as a literal."@en ;
                            rdfs:label "attributed illuminator"@en .

MS4AI:attributedMiniaturist rdf:type owl:DatatypeProperty ;
                            rdfs:domain [ rdf:type owl:Class ;
                                          owl:unionOf ( MS4AI:Locus
                                                        MS4AI:Manuscript
                                                      )
                                        ] ;
                            rdfs:range rdfs:Literal ;
                            rdfs:comment "The 'attributedMiniaturist' property for the name of the miniaturist as a literal."@en ;
                            rdfs:label "attributed miniaturist"@en .

MS4AI:attributedPlaceOfOrigin rdf:type owl:DatatypeProperty ;
                              rdfs:domain MS4AI:Manuscript ;
                              rdfs:range rdfs:Literal ;
                              rdfs:comment "The 'placeOfOrigin' property for the location as a literal."@en ;
                              rdfs:label "attributed place of origin"@en .

MS4AI:attributedRubricator rdf:type owl:DatatypeProperty ;
                           rdfs:domain [ rdf:type owl:Class ;
                                         owl:unionOf ( MS4AI:Locus
                                                       MS4AI:Manuscript
                                                     )
                                       ] ;
                           rdfs:range rdfs:Literal ;
                           rdfs:comment "The 'attributedRubricator' property for the name of the rubricator as a literal."@en ;
                           rdfs:label "attributed rubricator"@en .

MS4AI:binding rdf:type owl:DatatypeProperty ;
              rdfs:domain [ rdf:type owl:Class ;
                            owl:unionOf ( MS4AI:Locus
                                          MS4AI:Manuscript
                                        )
                          ] ;
              rdfs:range rdfs:Literal ;
              rdfs:comment "The 'binding' property allows you to record info regarding the binding technique."@en ;
              rdfs:label "binding"@en .

MS4AI:conservationIntervention rdf:type owl:DatatypeProperty ;
                               rdfs:domain [ rdf:type owl:Class ;
                                             owl:unionOf ( MS4AI:Locus
                                                           MS4AI:Manuscript
                                                         )
                                           ] ;
                               rdfs:range rdfs:Literal ;
                               rdfs:comment "Records the actions or processes carried out to preserve or restore the manuscript."@en ;
                               rdfs:label "conservation Intervention"@en .

MS4AI:containedWork rdf:type owl:DatatypeProperty ;
                    rdfs:domain [ rdf:type owl:Class ;
                                  owl:unionOf ( MS4AI:Locus
                                                MS4AI:Manuscript
                                              )
                                ] ;
                    rdfs:range rdfs:Literal ;
                    rdfs:comment "The specific work(s) or text(s) included within the manuscript."@en ;
                    rdfs:label "contained work"@en .

MS4AI:foliaCount rdf:type owl:DatatypeProperty ;
                 rdfs:domain MS4AI:Manuscript ;
                 rdfs:range rdfs:Literal ;
                 rdfs:comment "Refers to the total number of leaves in the manuscript."@en ;
                 rdfs:label "folia count"@en .

MS4AI:format rdf:type owl:DatatypeProperty ;
             rdfs:domain [ rdf:type owl:Class ;
                           owl:unionOf ( MS4AI:Locus
                                         MS4AI:Manuscript
                                       )
                         ] ;
             rdfs:range rdfs:Literal ;
             rdfs:comment "Offers the possibility to provide info about the physical configuration of a manuscript."@en ;
             rdfs:label "format"@en .

MS4AI:historyOfOwnership rdf:type owl:DatatypeProperty ;
                         rdfs:domain MS4AI:Manuscript ;
                         rdfs:range rdfs:Literal ;
                         rdfs:comment "A record of the successive ownerships of a manuscript over time."@en ;
                         rdfs:label "history of ownership"@en .

MS4AI:includesDecoration rdf:type owl:DatatypeProperty ;
                         rdfs:domain MS4AI:Manuscript ;
                         rdfs:range rdfs:Literal ;
                         rdfs:comment "Register additional info about decoration."@en ;
                         rdfs:label "includes decoration"@en .

MS4AI:includesText rdf:type owl:DatatypeProperty ;
                   rdfs:domain MS4AI:Locus ;
                   rdfs:range rdfs:Literal ;
                   rdfs:comment "The textual content contained within the locus."@en ;
                   rdfs:label "includes text"@en .

MS4AI:ink rdf:type owl:DatatypeProperty ;
          rdfs:domain [ rdf:type owl:Class ;
                        owl:unionOf ( MS4AI:Locus
                                      MS4AI:Manuscript
                                    )
                      ] ;
          rdfs:range rdfs:Literal ;
          rdfs:comment "Record information about the various types of ink used in the manuscript."@en ;
          rdfs:label "ink"@en .

MS4AI:length rdf:type owl:DatatypeProperty ;
             rdfs:domain [ rdf:type owl:Class ;
                           owl:unionOf ( MS4AI:Locus
                                         MS4AI:Manuscript
                                       )
                         ] ;
             rdfs:range rdfs:Literal ;
             rdfs:comment "Length in millimeters."@en ;
             rdfs:label "length"@en .

MS4AI:script rdf:type owl:DatatypeProperty ;
             rdfs:domain [ rdf:type owl:Class ;
                           owl:unionOf ( MS4AI:Locus
                                         MS4AI:Manuscript
                                       )
                         ] ;
             rdfs:range rdfs:Literal ;
             rdfs:comment "The relationship between a locus or item and the script used."@en ;
             rdfs:label "script"@en .

MS4AI:shelfmark rdf:type owl:DatatypeProperty ;
                rdfs:domain MS4AI:Manuscript ;
                rdfs:range rdfs:Literal ;
                rdfs:comment "The unique identifier assigned to a manuscript within a library."@en ;
                rdfs:label "shelfmark"@en .

MS4AI:support rdf:type owl:DatatypeProperty ;
              rdfs:domain [ rdf:type owl:Class ;
                            owl:unionOf ( MS4AI:Locus
                                          MS4AI:Manuscript
                                        )
                          ] ;
              rdfs:range rdfs:Literal ;
              rdfs:comment "The 'support' property is for recording the substrate used."@en ;
              rdfs:label "support"@en .

MS4AI:thickness rdf:type owl:DatatypeProperty ;
                rdfs:domain [ rdf:type owl:Class ;
                              owl:unionOf ( MS4AI:Locus
                                            MS4AI:Manuscript
                                          )
                            ] ;
                rdfs:range rdfs:Literal ;
                rdfs:comment "Thickness in millimeters."@en ;
                rdfs:label "thickness"@en .

MS4AI:timeOfCreation rdf:type owl:DatatypeProperty ;
                     rdfs:domain MS4AI:CreationManuscriptDescription ;
                     rdfs:range xsd:dateTimeStamp ;
                     rdfs:comment "The 'timeOfCreation' property for the event of creating a manuscript description."@en ;
                     rdfs:label "time of creation"@en .

MS4AI:width rdf:type owl:DatatypeProperty ;
            rdfs:domain [ rdf:type owl:Class ;
                          owl:unionOf ( MS4AI:Locus
                                        MS4AI:Manuscript
                                      )
                        ] ;
            rdfs:range rdfs:Literal ;
            rdfs:comment "Width in millimeters."@en ;
            rdfs:label "width"@en .

# Instances:
`;

      // CIDOC-CRM subset
      const prefix1 = `MS4AI:CreationManuscriptDescription rdfs:subClassOf <http://www.cidoc-crm.org/cidoc-crm/E65_Creation> .

MS4AI:Entity owl:equivalentClass <http://www.cidoc-crm.org/cidoc-crm/E39_Actor> .

MS4AI:Person owl:equivalentClass <http://www.cidoc-crm.org/cidoc-crm/E21_Person> .

MS4AI:LocusFeature rdfs:subClassOf <http://www.cidoc-crm.org/cidoc-crm/E26_Physical_Feature>.

MS4AI:concernsFeature rdfs:subPropertyOf <http://www.cidoc-crm.org/cidoc-crm/P56_bears_feature> .

MS4AI:includesLocus rdfs:subPropertyOf <http://www.cidoc-crm.org/cidoc-crm/P46_is_composed_of> .

###  http://www.cidoc-crm.org/cidoc-crm/E21_Person
<http://www.cidoc-crm.org/cidoc-crm/E21_Person> rdf:type owl:Class .

###  http://www.cidoc-crm.org/cidoc-crm/E39_Actor
<http://www.cidoc-crm.org/cidoc-crm/E39_Actor> rdf:type owl:Class .

###  http://www.cidoc-crm.org/cidoc-crm/E65_Creation
<http://www.cidoc-crm.org/cidoc-crm/E65_Creation> rdf:type owl:Class .

<http://www.cidoc-crm.org/cidoc-crm/E26_Physical_Feature> rdf:type owl:Class .

###  http://www.cidoc-crm.org/cidoc-crm/P46_is_composed_of
<http://www.cidoc-crm.org/cidoc-crm/P46_is_composed_of> rdf:type owl:ObjectProperty .

###  http://www.cidoc-crm.org/cidoc-crm/P56_bears_feature
<http://www.cidoc-crm.org/cidoc-crm/P56_bears_feature> rdf:type owl:ObjectProperty .

`;

      // LRM (New FRBR) subset
      const prefix2 = `<http://iflastandards.info/ns/lrm/lrmoo/F1_Work> rdf:type owl:Class ;
                                                 owl:equivalentClass :Work .

<http://iflastandards.info/ns/lrm/lrmoo/F3_Manifestation> rdf:type owl:Class .

MS4AI:referencedIn rdfs:range <http://iflastandards.info/ns/lrm/lrmoo/F3_Manifestation> .

MS4AI:sourcedFrom rdfs:range <http://iflastandards.info/ns/lrm/lrmoo/F3_Manifestation> .

`;

      // 1) If user wants only Manuscript-AI:
      if (this.useManuscriptAIOnly) {
        userRdf = prefixes + userRdf;
      } else {
        // 2) Otherwise, build it step by step
        let builtPrefixes = prefixes;

        if (this.cidocCrmSelected) {
          builtPrefixes += prefix1;
        }
        if (this.lrmFrbrSelected) {
          builtPrefixes += prefix2;
        }
        // Europeana's Data Model is not yet appended


        userRdf = builtPrefixes + userRdf;
      }

      // Remove <span> or <a> tags leftover from highlight, plus encoded < / >
      userRdf = userRdf
        .replace(/<\/?span.*?>/g, "")
        .replace(/<\/?a.*?>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();

      const blob = new Blob([userRdf], { type: "text/turtle;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "knowledge_graph.ttl";
      link.click();
    },
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
  background: #F6F6F6;
  color: #333;
}
.container {
  text-align: center;
  background-color: white;
  margin: 30px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 60%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
h1 {
  font-size: 2em;
  color:  #23263C;
}
.description {
  margin: 20px 0;
  font-size: 1.2em;
  color: #333;
  line-height: 1.6;
}
.checkbox-list {
  text-align: left;
  margin-top: 20px;
  margin-bottom: 30px;
  font-size: 1.1em;
}
.checkbox-list label {
  display: block;
  margin-bottom: 10px;
}
.btn1 {
  padding: 10px 20px;
  font-size: 1.1em;
  color: white;
  background-color:  #23263C;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.btn1:hover {
  background-color:  #23263C;
  transform: translateY(-3px);
}

button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
