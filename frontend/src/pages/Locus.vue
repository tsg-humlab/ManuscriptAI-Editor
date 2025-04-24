<template>
  <div>

    <div class="content">
      <!-- LEFT PANEL -->
      <div class="container-left">
        <h1>Locus Information</h1>

        <div class="pad">
          <div class="pad-inner">
            <p class="custom-info">
              In ManuscriptAI, a Locus represents a distinct element within the
              manuscript, such as text, a decoration, or an annotation. Each locus
              precisely identifies these components. Multiple Loci can exist within
              a manuscript, and a locus may contain other loci, much like a sentence
              within a paragraph. Please describe all the loci you intend to use for
              your detailed analysis and description of the manuscript.
            </p>

            <!-- Locus ID Input & Confirm Button -->
            <div class="form-group">
              <label>
                <strong
                  class="locus-link"
                  @click.stop="openLocusModal"
                >
                  Locus ID
                </strong>
                <span class="required">*</span>
              </label>

              <input
                id="locus"
                v-model="locus"
                type="text"
                :disabled="locusDisabled"
                :class="locusDisabled ? 'disabled-input' : 'white-input'"
                placeholder="Enter locus identifier"
                @input="checkLocusID"
              >

              <div class="action-buttons-card">
                <button
                  id="confirm-locus"
                  class="main-button"
                  :disabled="confirmDisabled"
                  @click="confirmLocusID"
                >
                  Confirm Locus ID
                </button>
              </div>

              <!-- Show Locus Details button -->
              <button
                id="toggle-details"
                class="main-button"
                :disabled="toggleDetailsDisabled"
                @click="toggleLocusDetails"
              >
                Locus Details
              </button>

              <!-- Locus Details -->
              <div
                id="locus-details"
                :style="{ display: locusDetailsVisible ? 'block' : 'none' }"
              >
                <div class="form-group">
                  <label for="locus-description">Locus Description<span class="required">*</span></label>
                  <input
                    id="locus-description"
                    v-model="locusDescription"
                    type="text"
                    name="locus-description"
                    placeholder="Enter locus description"
                    :disabled="descriptionDisabled"
                    class="white-input"
                    @input="onDescriptionInput"
                  >
                </div>

                <div class="form-group">
                  <label for="Locus-name">At Folium/Folia</label>
                  <input
                    id="Locus-name"
                    v-model="foliumFolia"
                    type="text"
                    placeholder="Enter Folium/Folia"
                    :disabled="descriptionNotFilled || foliumDisabled"
                    :class="(descriptionNotFilled || foliumDisabled) ? 'disabled-input' : 'white-input'"
                    @input="appendLocusDescriptionTriple"
                  >
                </div>

                <div class="form-group">
                  <label for="concern">Locus Concerns:</label>
                  <div class="multiselect-container">
                    <select
                      id="locus-concern"
                      v-model="locusConcern"
                      :disabled="concernDisabled"
                      :class="(descriptionNotFilled || concernDisabled) ? 'disabled-input' : 'white-input'"
                      @input="appendLocusDescriptionTriple"
                    >
                      <optgroup label="Textual Features">
                        <option value="character">
                          Character
                        </option>
                        <option value="word">
                          Word
                        </option>
                        <option value="number">
                          Number
                        </option>
                        <option value="abbreviationMark">
                          Abbreviation Mark
                        </option>
                        <option value="punctuationMark">
                          Punctuation Mark
                        </option>
                        <option value="incipit">
                          Incipit
                        </option>
                        <option value="explicit">
                          Explicit
                        </option>
                        <option value="textualVariant">
                          Textual Variant
                        </option>
                        <option value="correction">
                          Correction
                        </option>
                      </optgroup>
                      <optgroup label="Layout Feature">
                        <option value="line">
                          Line
                        </option>
                        <option value="column">
                          Column
                        </option>
                        <option value="margin">
                          Margin
                        </option>
                        <option value="intercolumn">
                          Intercolumn
                        </option>
                        <option value="justification">
                          Justification
                        </option>
                        <option value="interlinearSpace">
                          Interlinear Space
                        </option>
                        <option value="initial">
                          Initial
                        </option>
                        <option value="subsidiaryInitial">
                          Subsidiary Initial
                        </option>
                        <option value="secondaryInitial">
                          Secondary Initial
                        </option>
                        <option value="section">
                          Section
                        </option>
                        <option value="paragraph">
                          Paragraph
                        </option>
                      </optgroup>
                      <optgroup label="Paratextual Feature">
                        <option value="title">
                          Title
                        </option>
                        <option value="rubrication">
                          Rubrication
                        </option>
                        <option value="header">
                          Header
                        </option>
                        <option value="number">
                          Number
                        </option>
                        <option value="catchword">
                          Catchword
                        </option>
                        <option value="marginalNote">
                          Marginal Note
                        </option>
                        <option value="interlinearNote">
                          Interlinear Note
                        </option>
                        <option value="capitula">
                          Capitula
                        </option>
                        <option value="index">
                          Index
                        </option>
                        <option value="colophon">
                          Colophon
                        </option>
                      </optgroup>
                      <optgroup label="Material Marking">
                        <option value="seal">
                          Seal
                        </option>
                        <option value="watermark">
                          Watermark
                        </option>
                        <option value="boundingLines">
                          Bounding Lines
                        </option>
                        <option value="prickingRuling">
                          Pricking Ruling
                        </option>
                        <option value="repair">
                          Repair
                        </option>
                        <option value="damage">
                          Damage
                        </option>
                      </optgroup>
                      <optgroup label="Codicological Feature">
                        <option value="quireStructure">
                          Quire Structure
                        </option>
                        <option value="composite">
                          Composite
                        </option>
                        <option value="insert">
                          Insert
                        </option>
                        <option value="pasteDown">
                          Paste Down
                        </option>
                        <option value="flyLeaf">
                          Fly Leaf
                        </option>
                      </optgroup>
                      <optgroup label="Attributional Features">
                        <option value="writtenDate">
                          Date Written
                        </option>
                        <option value="origin">
                          Written Place
                        </option>
                        <option value="authorship">
                          Written Author Name
                        </option>
                        <option value="artisanAttribution">
                          Written Artisan Name
                        </option>
                      </optgroup>
                      <option value="other">
                        Other
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="Locus-text">Includes Text</label>
                  <input
                    id="Locus-Text"
                    v-model="includesText"
                    type="text"
                    placeholder="Enter Text"
                    :disabled="descriptionNotFilled || textDisabled"
                    :class="(descriptionNotFilled || textDisabled) ? 'disabled-input' : 'white-input'"
                    @input="appendLocusDescriptionTriple"
                  >
                </div>

                <!-- Person URIs -->
                <div
                  id="person-uris"
                  class="multiple-uris"
                >
                  <div
                    v-for="(personField, pIndex) in personUris"
                    :key="'person-'+pIndex"
                    class="form-group"
                  >
                    <label
                      v-if="pIndex===0"
                      for="Locus-person-0"
                    >Includes Mention of Person (URI/IRI)</label>
                    <input
                      :id="'Locus-person-'+pIndex"
                      v-model="personField.value"
                      type="text"
                      name="Locus-person[]"
                      placeholder="Enter URI"
                      :disabled="descriptionNotFilled || personField.disabled"
                      :class="(descriptionNotFilled || personField.disabled) ? 'disabled-input' : 'white-input'"
                    >
                    <button
                      v-if="!personField.disabled"
                      class="add-button"
                      @click="savePersonUriField(pIndex)"
                    >
                      Confirm
                    </button>
                  </div>
                </div>

                <!-- Place URIs -->
                <div
                  id="place-uris"
                  class="multiple-uris"
                >
                  <div
                    v-for="(placeField, plIndex) in placeUris"
                    :key="'place-'+plIndex"
                    class="form-group"
                  >
                    <label
                      v-if="plIndex===0"
                      for="Locus-place-0"
                    >Includes Mention of Place (URI/IRI)</label>
                    <input
                      :id="'Locus-place-'+plIndex"
                      v-model="placeField.value"
                      type="text"
                      name="Locus-place[]"
                      placeholder="Enter URI"
                      :disabled="descriptionNotFilled || placeField.disabled"
                      :class="(descriptionNotFilled || placeField.disabled) ? 'disabled-input' : 'white-input'"
                    >
                    <button
                      v-if="!placeField.disabled"
                      class="add-button"
                      @click="savePlaceUriField(plIndex)"
                    >
                      Confirm
                    </button>
                  </div>
                </div>

                <!-- Work URIs -->
                <div
                  id="work-uris"
                  class="multiple-uris"
                >
                  <div
                    v-for="(workField, wIndex) in workUris"
                    :key="'work-'+wIndex"
                    class="form-group"
                  >
                    <label
                      v-if="wIndex===0"
                      for="Locus-work-0"
                    >Concerns Work (URI/IRI)</label>
                    <input
                      :id="'Locus-work-'+wIndex"
                      v-model="workField.value"
                      type="text"
                      name="Locus-work[]"
                      placeholder="Enter URI"
                      :disabled="descriptionNotFilled || workField.disabled"
                      :class="(descriptionNotFilled || workField.disabled) ? 'disabled-input' : 'white-input'"
                    >
                    <button
                      v-if="!workField.disabled"
                      class="add-button"
                      @click="saveWorkUriField(wIndex)"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>

              <!-- Collapsible Button -->
              <button
                id="collapsible-button"
                class="main-button"
                :disabled="collapsibleDisabled"
                @click="toggleCollapsible"
              >
                Material Information
              </button>
            </div>

            <!-- Collapsible Content -->
            <div
              id="collapsible-content"
              :style="{ display: collapsibleVisible ? 'block' : 'none' }"
            >
              <h1>Physical Characteristics</h1>
              <!-- SCRIPT selection -->
              <div class="padded-group">
                <div class="form-group">
                  <label for="script">Script</label>
                  <div class="multiselect-container">
                    <select
                      id="predefined-script"
                      v-model="selectedScript"
                      :disabled="scriptDisabled"
                    >
                      <option value="">
                        Select a predefined script
                      </option>
                      <option value="uncial">
                        Uncial
                      </option>
                      <option value="half-uncial">
                        Half-uncial
                      </option>
                      <option value="carolingianMinuscule">
                        Carolingian Minuscule
                      </option>
                      <option value="textualis">
                        Textualis
                      </option>
                      <option value="cursiva">
                        Cursiva
                      </option>
                      <option value="bastarda">
                        Bastarda
                      </option>
                      <option value="mercantesca">
                        Mercantesca
                      </option>
                      <option value="angloSaxonMinuscule">
                        Anglo-Saxon Minuscule
                      </option>
                      <option value="rotunda">
                        Rotunda
                      </option>
                      <option value="notarile">
                        Notarile
                      </option>
                      <option value="humanistic">
                        Humanistic
                      </option>
                      <option value="insularScript">
                        Insular Script
                      </option>
                      <option value="visigothic">
                        Visigothic
                      </option>
                      <option value="beneventan">
                        Beneventan
                      </option>
                      <option value="merovingian">
                        Merovingian
                      </option>
                      <option value="luxueilMinuscule">
                        Luxueil Minuscule
                      </option>
                      <option value="ashuriScript">
                        Ashuri Script
                      </option>
                      <option value="byzantineMinuscule">
                        Byzantine Minuscule
                      </option>
                      <option value="kufic">
                        Kufic
                      </option>
                      <option value="maghrebi">
                        Maghrebi
                      </option>
                      <option value="nandinagari">
                        Nandinagari
                      </option>
                      <option value="brahmi">
                        Brahmi
                      </option>
                      <option value="kana">
                        Kana
                      </option>
                      <option value="pallava">
                        Pallava
                      </option>
                      <option value="baybayin">
                        Baybayin
                      </option>
                      <option value="nahuatlWriting">
                        Nahuatl Writing
                      </option>
                      <option value="chanceryHand">
                        Chancery Hand
                      </option>
                      <option value="cyrillicScript">
                        Cyrillic Script
                      </option>
                      <option value="naskh">
                        Naskh
                      </option>
                      <option value="devanagari">
                        Devanagari
                      </option>
                      <option value="chineseCalligraphy">
                        Chinese Calligraphy
                      </option>
                      <option value="phagsPa">
                        Phags-pa
                      </option>
                      <option value="khmer">
                        Khmer
                      </option>
                      <option value="geez">
                        Ge'ez
                      </option>
                      <option value="mayaHieroglyphs">
                        Maya Hieroglyphs
                      </option>
                    </select>
                    <button
                      class="tick-button"
                      :disabled="scriptDisabled"
                      @click="updateRDF1('script')"
                    >
                      ✔
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label for="additional-info-script">(Additional) Information about Script</label>
                  <input
                    id="additional-info-script"
                    v-model="additionalInfoScript"
                    type="text"
                    name="additional-info-script"
                    placeholder="Enter information about the script"
                    :disabled="additionalInfoScriptDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="additionalInfoScriptDisabled"
                    @click="updateRDF1('additionalInfoScript')"
                  >
                    ✔
                  </button>
                </div>
              </div>

              <!-- SUPPORT -->
              <div class="padded-group">
                <div class="form-group">
                  <label for="support">Support</label>
                  <div class="multiselect-container">
                    <select
                      id="predefined-support"
                      v-model="selectedSupport"
                      :disabled="supportDisabled"
                    >
                      <option value="">
                        Select a predefined support
                      </option>
                      <option value="papyrus">
                        Papyrus
                      </option>
                      <option value="parchment">
                        Parchment
                      </option>
                      <option value="silk">
                        Silk
                      </option>
                      <option value="bark">
                        Bark
                      </option>
                      <option value="palmLeaves">
                        Palm Leaves
                      </option>
                      <option value="paper">
                        Paper
                      </option>
                      <option value="vellum">
                        Vellum
                      </option>
                      <option value="donkeySkin">
                        Donkey Skin
                      </option>
                      <option value="marbledPaper">
                        Marbled Paper
                      </option>
                      <option value="uterineVellum">
                        Uterine Vellum
                      </option>
                      <option value="russiaLeather">
                        Russia Leather
                      </option>
                      <option value="calico">
                        Calico
                      </option>
                      <option value="canvas">
                        Canvas
                      </option>
                      <option value="sheepskin">
                        Sheepskin
                      </option>
                      <option value="velvet">
                        Velvet
                      </option>
                      <option value="naturalGoatskin">
                        Natural Goatskin
                      </option>
                      <option value="roughskin">
                        Roughskin
                      </option>
                      <option value="satin">
                        Satin
                      </option>
                      <option value="deerskin">
                        Deer Skin
                      </option>
                      <option value="pigskin">
                        Pigskin
                      </option>
                      <option value="morocco">
                        Morocco
                      </option>
                    </select>
                    <button
                      class="tick-button"
                      :disabled="supportDisabled"
                      @click="updateRDF1('support')"
                    >
                      ✔
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label for="additional-info-support">(Additional) Information about Support</label>
                  <input
                    id="additional-info-support"
                    v-model="additionalInfoSupport"
                    type="text"
                    name="additional-info-support"
                    placeholder="Enter information about the support"
                    :disabled="additionalInfoSupportDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="additionalInfoSupportDisabled"
                    @click="updateRDF1('additionalInfoSupport')"
                  >
                    ✔
                  </button>
                </div>
              </div>

              <!-- DECORATION -->
              <div class="padded-group">
                <div class="form-group">
                  <label for="decoration">Includes Decoration</label>
                  <div class="multiselect-container">
                    <select
                      id="predefined-decoration"
                      v-model="selectedDecoration"
                      :disabled="decorationDisabled"
                    >
                      <option value="">
                        Select a predefined decoration
                      </option>
                      <option value="illumination">
                        Illumination
                      </option>
                      <option value="miniature">
                        Miniature
                      </option>
                      <option value="historiatedInitial">
                        Historiated Initial
                      </option>
                      <option value="borderDesign">
                        Border Design
                      </option>
                      <option value="drollerie">
                        Drollerie
                      </option>
                      <option value="bindingDecoration">
                        Binding Decoration
                      </option>
                      <option value="tooling">
                        Tooling
                      </option>
                      <option value="embossing">
                        Embossing
                      </option>
                      <option value="decoratedInitial">
                        Decorated Initial
                      </option>
                      <option value="schematicDrawing">
                        Schematic Drawing
                      </option>
                      <option value="penworkInitial">
                        Penwork Initial
                      </option>
                      <option value="coloredDrawing">
                        Colored Drawing
                      </option>
                      <option value="figure">
                        Figure
                      </option>
                      <option value="ornamentation">
                        Ornamentation
                      </option>
                      <option value="illustrationCycle">
                        Illustration Cycle
                      </option>
                      <option value="panel">
                        Panel
                      </option>
                      <option value="fastener">
                        Fastener
                      </option>
                      <option value="clasp">
                        Clasp
                      </option>
                    </select>
                    <button
                      class="tick-button"
                      :disabled="decorationDisabled"
                      @click="updateRDF1('decoration')"
                    >
                      ✔
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label for="additional-info-decoration">(Additional) Information about Decoration(s)</label>
                  <input
                    id="additional-info-decoration"
                    v-model="additionalInfoDecoration"
                    type="text"
                    name="additional-info-decoration"
                    placeholder="Enter information about the decoration(s)"
                    :disabled="additionalInfoDecorationDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="additionalInfoDecorationDisabled"
                    @click="updateRDF1('additionalInfoDecoration')"
                  >
                    ✔
                  </button>
                </div>
              </div>

              <!-- FORMAT -->
              <div class="padded-group">
                <div class="form-group">
                  <label for="format">Format</label>
                  <div class="multiselect-container">
                    <select
                      id="predefined-format"
                      v-model="selectedFormat"
                      :disabled="formatDisabled"
                    >
                      <option value="">
                        Select a predefined format
                      </option>
                      <option value="quarto">
                        Quarto (4to)
                      </option>
                      <option value="folio">
                        Folio (2to)
                      </option>
                      <option value="octavo">
                        Octavo (8vo)
                      </option>
                      <option value="duodecimo">
                        Duodecimo (12mo)
                      </option>
                      <option value="sextodecimo">
                        Sextodecimo (16mo)
                      </option>
                    </select>
                    <button
                      class="tick-button"
                      :disabled="formatDisabled"
                      @click="updateRDF1('format')"
                    >
                      ✔
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label for="additional-info-format">(Additional) Information about Format</label>
                  <input
                    id="additional-info-format"
                    v-model="additionalInfoFormat"
                    type="text"
                    name="additional-info-format"
                    placeholder="Enter information about the format"
                    :disabled="additionalInfoFormatDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="additionalInfoFormatDisabled"
                    @click="updateRDF1('additionalInfoFormat')"
                  >
                    ✔
                  </button>
                </div>
              </div>

              <!-- INK -->
              <div class="padded-group">
                <div class="form-group">
                  <label for="ink">Ink</label>
                  <div class="multiselect-container">
                    <select
                      id="predefined-ink"
                      v-model="selectedInk"
                      :disabled="inkDisabled"
                    >
                      <option value="">
                        Select a predefined ink
                      </option>
                      <option value="carbonInk">
                        Carbon Ink
                      </option>
                      <option value="invisibleInk">
                        Invisible Ink
                      </option>
                      <option value="copperGallInk">
                        Copper Gall Ink
                      </option>
                      <option value="redInk">
                        Red Ink
                      </option>
                      <option value="ironGallInk">
                        Iron Gall Ink
                      </option>
                      <option value="coloredInk">
                        Colored Ink
                      </option>
                      <option value="organicInk">
                        Organic Ink
                      </option>
                    </select>
                    <button
                      class="tick-button"
                      :disabled="inkDisabled"
                      @click="updateRDF1('ink')"
                    >
                      ✔
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label for="additional-info-ink">(Additional) Information about Ink</label>
                  <input
                    id="additional-info-ink"
                    v-model="additionalInfoInk"
                    type="text"
                    name="additional-info-ink"
                    placeholder="Enter information about the ink"
                    :disabled="additionalInfoInkDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="additionalInfoInkDisabled"
                    @click="updateRDF1('additionalInfoInk')"
                  >
                    ✔
                  </button>
                </div>
              </div>

              <!-- BINDING -->
              <div class="padded-group">
                <div class="form-group">
                  <label for="binding-technique">Binding Technique</label>
                  <div class="multiselect-container">
                    <select
                      id="predefined-binding-technique"
                      v-model="selectedBindingTechnique"
                      :disabled="bindingTechniqueDisabled"
                    >
                      <option value="">
                        Select a predefined binding technique
                      </option>
                      <option value="copticBinding">
                        Coptic Binding
                      </option>
                      <option value="carolingianBinding">
                        Carolingian Binding
                      </option>
                      <option value="romanesqueBinding">
                        Romanesque Binding
                      </option>
                      <option value="gothicBinding">
                        Gothic Binding
                      </option>
                      <option value="limpVellumBinding">
                        Limp Vellum Binding
                      </option>
                      <option value="sewnOnCordsBinding">
                        Sew-on-Cords Binding
                      </option>
                    </select>
                    <button
                      class="tick-button"
                      :disabled="bindingTechniqueDisabled"
                      @click="updateRDF1('binding')"
                    >
                      ✔
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label for="additional-info-binding-technique">(Additional) Information about Binding Technique</label>
                  <input
                    id="additional-info-binding-technique"
                    v-model="additionalInfoBindingTechnique"
                    type="text"
                    name="additional-info-binding-technique"
                    placeholder="Enter information about the binding technique"
                    :disabled="additionalInfoBindingTechniqueDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="additionalInfoBindingTechniqueDisabled"
                    @click="updateRDF1('additionalInfoBinding')"
                  >
                    ✔
                  </button>
                </div>
              </div>

              <!-- Dimensions -->
              <div class="padded-group">
                <div class="form-group">
                  <label for="width">Width in Millimeters</label>
                  <input
                    id="width"
                    v-model="width"
                    type="text"
                    name="width"
                    placeholder="Enter dimension"
                    :disabled="widthDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="widthDisabled"
                    @click="updateRDF1('width')"
                  >
                    ✔
                  </button>
                </div>
              </div>
              <div class="padded-group">
                <div class="form-group">
                  <label for="lenght">Lenght in Millimeters</label>
                  <input
                    id="lenght"
                    v-model="length"
                    type="text"
                    name="lenght"
                    placeholder="Enter dimension"
                    :disabled="lengthDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="lengthDisabled"
                    @click="updateRDF1('lenght')"
                  >
                    ✔
                  </button>
                </div>
              </div>
              <div class="padded-group">
                <div class="form-group">
                  <label for="thickness">Thickness in Millimeters</label>
                  <input
                    id="thickness"
                    v-model="thickness"
                    type="text"
                    name="thickness"
                    placeholder="Enter dimension"
                    :disabled="thicknessDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="thicknessDisabled"
                    @click="updateRDF1('thickness')"
                  >
                    ✔
                  </button>
                </div>
              </div>
              <div class="padded-group">
                <div class="form-group">
                  <label for="conservation-interventions">Conservation Interventions</label>
                  <input
                    id="conservation-interventions"
                    v-model="conservationInterventions"
                    type="text"
                    name="conservation-interventions"
                    placeholder="Enter conservation interventions information"
                    :disabled="conservationInterventionsDisabled"
                  >
                  <button
                    class="tick-button"
                    :disabled="conservationInterventionsDisabled"
                    @click="updateRDF1('conservation-interventions')"
                  >
                    ✔
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Insert Locus / Add Locus Buttons -->
          <div class="action-buttons-card">
            <button
              id="insert-locus-button"
              class="main-button"
              :disabled="insertDisabled"
              @click="insertLocus"
            >
              Confirm and Insert Locus within Current Locus
            </button>
            <button
              id="add-locus-button"
              class="main-button"
              :disabled="addDisabled"
              @click="addLocus"
            >
              Confirm and Add New Locus
            </button>
          </div>
        </div>

        <!-- Next Button -->
        <div style="margin: 20px;">
          <button
            class="main-button next-button"
            type="button"
            @click="goToNext"
          >
            Next
          </button>
        </div>
      </div>

      <!-- RIGHT PANEL: RDF Display -->
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
          style="overflow:auto; max-height: 2000px;"
        >
          <p>Knowledge Graph:</p>
          <pre
            id="dynamic-rdf"
            v-html="dynamicRdf"
          />
        </div>
      </div>
    </div>

    <!-- ############### MODAL ############### -->
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
        <h2>What is a Locus ID?</h2>
        <div class="padded-group">
          <p>
            A locus ID is a unique identifier for the locus to ensure meaningful identification, better organization, and easier reference within the different parts of the manuscript. For example, you may use an ID such as LOC12345. Note that empty spaces and punctuation marks are not accepted.
          </p>
        </div>
      </div>
    </div>
    <!-- ############### END MODAL ############### -->
  </div>
</template>

<script>
export default {
  name: "LocusInformation",

  data() {
    return {

      showLocusModal: false,
      // The RDF content
      dynamicRdf: "",
      // The local 'locus' string
      locus: "",
      // Whether the "Confirm Locus" button is disabled
      confirmDisabled: true,
      // Whether the locus input is disabled
      locusDisabled: false,

      // Whether "Show Locus Details" is disabled
      toggleDetailsDisabled: true,
      // Whether the locus details are visible
      locusDetailsVisible: false,

      // Locus description field
      locusDescription: "",
      descriptionDisabled: true,

      // Folium / Folia
      foliumFolia: "",
      foliumDisabled: true,

      // Locus concerns
      locusConcern: "",
      concernDisabled: true,

      // "Includes Text"
      includesText: "",
      textDisabled: true,

      // The collapsible section
      collapsibleDisabled: true,
      collapsibleVisible: false,

      // Person URIs
      personUris: [
        {value: "", disabled: true}
      ],
      // Place URIs
      placeUris: [
        {value: "", disabled: true}
      ],
      // Work URIs
      workUris: [
        {value: "", disabled: true}
      ],

      // Insert & Add Locus
      insertDisabled: true,
      addDisabled: true,

      // Physical Characteristics
      selectedScript: "",
      scriptDisabled: false,

      additionalInfoScript: "",
      additionalInfoScriptDisabled: false,

      selectedSupport: "",
      supportDisabled: false,

      additionalInfoSupport: "",
      additionalInfoSupportDisabled: false,

      selectedDecoration: "",
      decorationDisabled: false,

      additionalInfoDecoration: "",
      additionalInfoDecorationDisabled: false,

      selectedFormat: "",
      formatDisabled: false,

      additionalInfoFormat: "",
      additionalInfoFormatDisabled: false,

      selectedInk: "",
      inkDisabled: false,

      additionalInfoInk: "",
      additionalInfoInkDisabled: false,

      selectedBindingTechnique: "",
      bindingTechniqueDisabled: false,

      additionalInfoBindingTechnique: "",
      additionalInfoBindingTechniqueDisabled: false,

      width: "",
      widthDisabled: false,

      length: "",
      lengthDisabled: false,

      thickness: "",
      thicknessDisabled: false,

      conservationInterventions: "",
      conservationInterventionsDisabled: false,
    };
  },

  computed: {
    descriptionNotFilled() {
      // true when no description is provided
      return !this.locusDescription.trim();
    }
  },

watch: {
    locusConcern(newVal, oldVal) {
      // If you only want to run this if the value truly changed
      if (newVal !== oldVal) {
        this.appendLocusDescriptionTriple();
      }
    },
  },

  mounted() {
    // 1) Prevent going back in history:
  history.pushState(null, null, location.href);
  window.onpopstate = () => {
    history.go(1);
  };

  // 2) Detect a page refresh and redirect to home (or initial page):
  if (performance && performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    localStorage.removeItem("rdfTriple"); // Clear your data or keep what you need
    window.location.href = "/";           // Or wherever your "home" route is
  }
    // Retrieve existing triple from localStorage
    const stored = localStorage.getItem("rdfTriple");
    if (stored) {
      this.dynamicRdf = stored;
    }
  },

  methods: {

    //-------------------------------------------
    // for the modal (pop-up) at locus id
    //-------------------------------------------

    openLocusModal() {
      this.showLocusModal = true;
    },
    closeLocusModal() {
      this.showLocusModal = false;
    },
    //-------------------------------------------
    // 1) checkLocusID => on input of Locus ID
    //-------------------------------------------
    checkLocusID() {
      const pattern = /^[a-zA-Z0-9]+$/;
      if (!pattern.test(this.locus)) {
        // Invalid => disable confirm
        this.confirmDisabled = true;
      } else {
        // Valid => enable confirm
        this.confirmDisabled = false;
      }
    },

    //-------------------------------------------
    // 2) confirmLocusID => user clicks confirm
    //-------------------------------------------
    confirmLocusID() {
      if (!this.locus) {
        alert("Locus ID cannot be empty.");
        return;
      }
      // Disable locus input
      this.locusDisabled = true;
      this.confirmDisabled = true;

      // Enable Locus Description field
      this.descriptionDisabled = false;

      // Enable "Show Locus Details"
      this.toggleDetailsDisabled = false;

      // Enable Insert / Add Locus
      this.insertDisabled = false;
      this.addDisabled = false;

       this.personUris = this.personUris.map(field => ({ ...field, disabled: false }));
       this.placeUris = this.placeUris.map(field => ({ ...field, disabled: false }));
       this.workUris = this.workUris.map(field => ({ ...field, disabled: false }));


      // Update the RDF to add <ex:locus> if not present
      this.updateRDF();
    },

    //-------------------------------------------
    // 3) checkDescriptionFilled => on input of locusDescription
    //-------------------------------------------
    onDescriptionInput() {
      // also call appendLocusDescriptionTriple if we want to auto-update
      this.checkDescriptionFilled();
      this.appendLocusDescriptionTriple();
    },

    checkDescriptionFilled() {
  if (this.locusDescription.trim()) {
    this.foliumDisabled = false;
    this.concernDisabled = false;
    this.textDisabled = false;
    this.collapsibleDisabled = false;
  } else {
    this.foliumDisabled = true;
    this.concernDisabled = true;
    this.textDisabled = true;
    this.collapsibleDisabled = true;
  }
},


    //-------------------------------------------
    // 4) updateRDF => when Locus is confirmed
    //-------------------------------------------
    updateRDF() {
  let rdfContent = this.dynamicRdf;
  if (!this.locus) {
    console.error("Locus ID is missing");
    return;
  }

  // Looks for the place where "MS4AI:shelfmark" is declared
  const blockRegex = new RegExp(
    `<span class="ms4ai">MS4AI:shelfmark</span>\\s*<span class="xsd">"([^"]+)"\\^\\^xsd:string</span>`,
    "g"
  );

  if (blockRegex.test(rdfContent)) {
    rdfContent = rdfContent.replace(blockRegex, (match) => {
      // If the "includesLocus ex:xxx" statement is already there, skip
      const locusPattern = new RegExp(
        `<span class="ms4ai">MS4AI:includesLocus</span>\\s*<span class="ex">ex:${this.locus}</span>`
      );
      if (locusPattern.test(rdfContent)) {
        console.log(`Locus ${this.locus} already exists. Not appending.`);
        return match;
      }

      // 1) Remove any trailing period that might be at the end of the match
      let updatedMatch = match.replace(/\.\s*$/, "");

      // 2) Ensure it ends with a semicolon so we can chain the next property
      if (!updatedMatch.trim().endsWith(";")) {
        updatedMatch += " ;";
      }

      // 3) Append the new property (NO semicolon at the end if you want more props)
      const newTripleLine = `\n    <span class="ms4ai">MS4AI:includesLocus</span> <span class="ex">ex:${this.locus}</span>`;
      updatedMatch += newTripleLine;

      return updatedMatch;
    });

    this.dynamicRdf = rdfContent;
    localStorage.setItem("rdfTriple", rdfContent);
  } else {
    console.error("Could not find shelfmark triple or Locus ID missing.");
  }
},


    //-------------------------------------------
    // 5) appendLocusDescriptionTriple => modifies the ex:locus triple
    //-------------------------------------------
    appendLocusDescriptionTriple() {
  // Only require a Locus ID, not the description
  if (!this.locus) {
    return;
  }

  let rdfContent = this.dynamicRdf;

  // 1) Remove the *entire* triple for ex:thisLocus so we can rebuild it fresh
  //    (This is simpler than matching comment/folia/concern patterns exactly)
  const removeRegex = new RegExp(
    `<span class="ex">ex:${this.locus}</span>\\s*<span class="rdf">rdf:type</span>\\s*<span class="ms4ai">MS4AI:Locus</span>[^.]*\\.`,
    "gs"
  );
  rdfContent = rdfContent.replace(removeRegex, "").trim();

  // 2) Start building a brand-new triple for ex:thisLocus
  let newTriple = `\n<span class="ex">ex:${this.locus}</span> <span class="rdf">rdf:type</span> <span class="ms4ai">MS4AI:Locus</span>`;

  // If you do have a description, add rdfs:comment
  if (this.locusDescription.trim()) {
    newTriple += ` ;
    <span class="rdfs">rdfs:comment</span> <span class="xsd">"${this.locusDescription.trim()}"^^xsd:string</span>`;
  }

  // If Folium is filled
  if (this.foliumFolia.trim()) {
    newTriple += ` ;
    <span class="ms4ai">MS4AI:atFolium</span> <span class="xsd">"${this.foliumFolia.trim()}"^^xsd:string</span>`;
  }


  if (this.locusConcern) {
    newTriple += ` ;
    <span class="ms4ai">MS4AI:concernsFeature</span> <span class="ms4ai">MS4AI:${this.locusConcern}</span>`;
  }


  if (this.includesText.trim()) {
    newTriple += ` ;
    <span class="ms4ai">MS4AI:includesText</span> <span class="xsd">"${this.includesText.trim()}"^^xsd:string</span>`;
  }


  newTriple += " .";


  rdfContent += `\n${newTriple}`;
  this.dynamicRdf = rdfContent;
  localStorage.setItem("rdfTriple", rdfContent);
},


    //-------------------------------------------
    // 6) toggleLocusDetails => Show/Hide Locus Details
    //-------------------------------------------
    toggleLocusDetails() {
      this.locusDetailsVisible = !this.locusDetailsVisible;
    },

    //-------------------------------------------
    // 7) toggleCollapsible => show/hide physical characteristics
    //-------------------------------------------
    toggleCollapsible() {
      this.collapsibleVisible = !this.collapsibleVisible;
      // If we show the collapsible, we hide the locus details
      if (this.collapsibleVisible) {
        this.descriptionDisabled = true;
        this.foliumDisabled = true;
        //this.concernDisabled = true;
        this.textDisabled = true;
        this.locusDetailsVisible = false;
      } else {
        if (this.locusDescription.trim()) {
          this.foliumDisabled = false;
          this.concernDisabled = false;
          this.textDisabled = false;
        }
      }
    },

    //-------------------------------------------
    // 8) disableAndGreyField => replaced by dynamic approach
    //-------------------------------------------
    // Instead of direct button, we handle each "Save" for URIs below

    //-------------------------------------------
    // 9) validateAndAppendUriById => in Vue, we do it with methods
    //-------------------------------------------
    validateAndAppendUri(uriValue, type) {
      let rdfContent = this.dynamicRdf;
      const trimmed = uriValue.trim();
      if (!trimmed) return rdfContent; // do nothing if empty

      const pattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;
      if (!pattern.test(trimmed)) {
        alert("Invalid URI format. Please enter a valid URI.");
        return null;
      }

      // If we are good, we append a triple
      let predicate = "";
      if (type === "person") {
        predicate = "MS4AI:includesMentionOfPerson";
      } else if (type === "place") {
        predicate = "MS4AI:includesMentionOfPlace";
      } else if (type === "work") {
        predicate = "MS4AI:includesWork";
      }
      if (!predicate) return rdfContent;

      // If current RDF doesn't end with '.', we turn last '.' into ';'
      if (!rdfContent.endsWith(".")) {
        // likely ends with ; or nothing
      } else {
        rdfContent = rdfContent.slice(0, -1) + ";";
      }
      rdfContent += `\n    <span class="ms4ai">${predicate}</span> <span class="uri">&lt;${trimmed}&gt;</span> .`;

      return rdfContent;
    },

    //-------------------------------------------
    // 10) Person URIs array handling
    //-------------------------------------------
    savePersonUriField(index) {
      const field = this.personUris[index];
      const updated = this.validateAndAppendUri(field.value, "person");
      if (updated === null) return; // invalid => do nothing
      this.dynamicRdf = updated;
      localStorage.setItem("rdfTriple", updated);
      // disable the input
      field.disabled = true;
    },
    addPersonUriField() {
      this.personUris.push({value: "", disabled: false});
    },
    removePersonUriField(index) {
      if (index > 0) {
        this.personUris.splice(index, 1);
      }
    },

    //-------------------------------------------
    // 11) Place URIs array handling
    //-------------------------------------------
    savePlaceUriField(index) {
      const field = this.placeUris[index];
      const updated = this.validateAndAppendUri(field.value, "place");
      if (updated === null) return;
      this.dynamicRdf = updated;
      localStorage.setItem("rdfTriple", updated);
      field.disabled = true;
    },
    addPlaceUriField() {
      this.placeUris.push({value: "", disabled: false});
    },
    removePlaceUriField(index) {
      if (index > 0) {
        this.placeUris.splice(index, 1);
      }
    },

    //-------------------------------------------
    // 12) Work URIs array handling
    //-------------------------------------------
    saveWorkUriField(index) {
      const field = this.workUris[index];
      const updated = this.validateAndAppendUri(field.value, "work");
      if (updated === null) return;
      this.dynamicRdf = updated;
      localStorage.setItem("rdfTriple", updated);
      field.disabled = true;
    },
    addWorkUriField() {
      this.workUris.push({value: "", disabled: false});
    },
    removeWorkUriField(index) {
      if (index > 0) {
        this.workUris.splice(index, 1);
      }
    },

    //-------------------------------------------
    // 13) insertLocus => Insert sub-locus
    //-------------------------------------------
    insertLocus() {
      if (!this.locus) {
        alert("No parent locus ID found.");
        return;
      }
      const sub = prompt("Enter Sub-Locus ID:") || "";
      const subLocus = sub.trim();
      if (!subLocus) {
        alert("Sub-Locus ID cannot be empty.");
        return;
      }

      let rdfContent = this.dynamicRdf;
      // Insert MS4AI:containsLocus ex:subLocus into the ex:parentLocus triple
      const parentPattern = new RegExp(
        `(<span class="ex">ex:${this.locus}</span>\\s*<span class="rdf">rdf:type</span>\\s*<span class="ms4ai">MS4AI:Locus</span>)`,
        "g"
      );
      rdfContent = rdfContent.replace(parentPattern, (match) => {
        return `${match} ;\n    <span class="ms4ai">MS4AI:containsLocus</span> <span class="ex">ex:${subLocus}</span>`;
      });

      this.dynamicRdf = rdfContent;
      localStorage.setItem("rdfTriple", rdfContent);

      alert(`Sub-locus ${subLocus} has been associated with the parent Locus ${this.locus}.`);

      // Now we reset everything for sub-locus
      this.resetFieldsForNewLocus(subLocus);

      alert("You can now click 'Show Locus Details' to restart the process for the sub-locus.");
    },

    //-------------------------------------------
    // 14) addLocus => user finishes current locus, starts new
    //-------------------------------------------
addLocus() {
  // Save/finish the info for the *current* locus if needed ...
  alert(
    "The information for the current locus has been saved. " +
    "You can now add information for a new locus."
  );

  // 1) Prompt (or somehow get) a new Locus ID from the user
  const newLocusID = prompt("Enter the new Locus ID:") || "";
  const trimmed = newLocusID.trim();
  if (!trimmed) {
    alert("No Locus ID provided, so no new Locus was created.");
    return;
  }

  // 2) Set your data property to the *new* Locus ID
  this.locus = trimmed;

  // 3) Call updateRDF() to append "MS4AI:includesLocus ex:trimmed"
  //    to the shelfmark triple if it isn't already there
  this.updateRDF();

  // 4) Reset the form fields for a "fresh" new Locus
  //    (this takes 'trimmed' and sets up all the data so the user can fill details)
  this.resetFieldsForNewLocus(trimmed);

  alert(
    `Locus "${trimmed}" was created. You can now fill in its details.`
  );
},


    //-------------------------------------------
    // 15) goToNext => user goes to next page
    //-------------------------------------------
    goToNext() {
      localStorage.setItem("rdfTriple", this.dynamicRdf);
      this.$router.push({ name: "source" });
    },

    //-------------------------------------------
    // 16) updateRDF1 => for the physical characteristics
    //-------------------------------------------
    updateRDF1(type) {
      let rdfContent = this.dynamicRdf;
      if (!rdfContent) rdfContent = "";

      // Because we replicate the old approach:
      switch (type) {
        case "script": {
          if (!this.selectedScript.trim()) {
            alert("Please select a script before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:hasScript", `MS4AI:${this.selectedScript.trim()}`);
          this.scriptDisabled = true;
          break;
        }
        case "additionalInfoScript": {
          if (!this.additionalInfoScript.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:script", this.additionalInfoScript.trim());
          this.additionalInfoScriptDisabled = true;
          break;
        }
        case "support": {
          if (!this.selectedSupport.trim()) {
            alert("Please select a support before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:hasSupport", `MS4AI:${this.selectedSupport.trim()}`);
          this.supportDisabled = true;
          break;
        }
        case "additionalInfoSupport": {
          if (!this.additionalInfoSupport.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:support", this.additionalInfoSupport.trim());
          this.additionalInfoSupportDisabled = true;
          break;
        }
        case "decoration": {
          if (!this.selectedDecoration.trim()) {
            alert("Please select a decoration before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:hasDecoration", `MS4AI:${this.selectedDecoration.trim()}`);
          this.decorationDisabled = true;
          break;
        }
        case "additionalInfoDecoration": {
          if (!this.additionalInfoDecoration.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:includesDecoration", this.additionalInfoDecoration.trim());
          this.additionalInfoDecorationDisabled = true;
          break;
        }
        case "format": {
          if (!this.selectedFormat.trim()) {
            alert("Please select a format before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:hasFormat", `MS4AI:${this.selectedFormat.trim()}`);
          this.formatDisabled = true;
          break;
        }
        case "additionalInfoFormat": {
          if (!this.additionalInfoFormat.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:format", this.additionalInfoFormat.trim());
          this.additionalInfoFormatDisabled = true;
          break;
        }
        case "ink": {
          if (!this.selectedInk.trim()) {
            alert("Please select an ink before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:hasInk", `MS4AI:${this.selectedInk.trim()}`);
          this.inkDisabled = true;
          break;
        }
        case "additionalInfoInk": {
          if (!this.additionalInfoInk.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:ink", this.additionalInfoInk.trim());
          this.additionalInfoInkDisabled = true;
          break;
        }
        case "binding": {
          if (!this.selectedBindingTechnique.trim()) {
            alert("Please select a binding technique before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:hasBindingTechnique", `MS4AI:${this.selectedBindingTechnique.trim()}`);
          this.bindingTechniqueDisabled = true;
          break;
        }
        case "additionalInfoBinding": {
          if (!this.additionalInfoBindingTechnique.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:binding", this.additionalInfoBindingTechnique.trim());
          this.additionalInfoBindingTechniqueDisabled = true;
          break;
        }
        case "width": {
          if (!this.width.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:width", this.width.trim());
          this.widthDisabled = true;
          break;
        }
        case "lenght": {
          if (!this.length.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:length", this.length.trim());
          this.lengthDisabled = true;
          break;
        }
        case "thickness": {
          if (!this.thickness.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:thickness", this.thickness.trim());
          this.thicknessDisabled = true;
          break;
        }
        case "conservation-interventions": {
          if (!this.conservationInterventions.trim()) {
            alert("Please enter valid data before saving.");
            return;
          }
          rdfContent = this.appendPhysicalTriple(rdfContent, "MS4AI:conservationInterventions", this.conservationInterventions.trim());
          this.conservationInterventionsDisabled = true;
          break;
        }
        default:
          console.error("Unknown RDF update type: ", type);
          return;
      }

      this.dynamicRdf = rdfContent;
      localStorage.setItem("rdfTriple", rdfContent);
    },

    //-------------------------------------------
    // Helper to append a triple to the RDF
    //-------------------------------------------
    appendPhysicalTriple(rdf, predicate, value) {
      if (!rdf.endsWith(".")) {
        // do nothing or adjust
      } else {
        // replace trailing '.' with ';'
        rdf = rdf.slice(0, -1) + ";";
      }

      // if value starts with "MS4AI:", treat as URI
      let triple = "";
      if (value.startsWith("MS4AI:")) {
        triple = `\n    <span class="ms4ai">${predicate}</span> <span class="ms4ai">${value}</span> .`;
      } else {
        triple = `\n    <span class="ms4ai">${predicate}</span> <span class="xsd">"${value}"^^xsd:string</span> .`;
      }
      return rdf.trim() + triple;
    },

    resetFieldsForNewLocus(newLocus) {
    // Set new locus ID and reset the basic fields
    this.locus = newLocus;
    this.locusDisabled = true;
    this.confirmDisabled = true;
    this.locusDetailsVisible = false;
    this.toggleDetailsDisabled = false;
    this.locusDescription = "";
    this.descriptionDisabled = false;
    this.foliumFolia = "";
    this.foliumDisabled = true;
    this.locusConcern = "";
    this.concernDisabled = true;
    this.includesText = "";
    this.textDisabled = true;
    this.collapsibleVisible = false;
    this.collapsibleDisabled = true;

    // Reset URI arrays
    this.personUris = [{ value: "", disabled: false }];
    this.placeUris = [{ value: "", disabled: false }];
    this.workUris = [{ value: "", disabled: false }];

    // Reset all physical characteristic disabled flags to re-enable fields and ticks:
    this.scriptDisabled = false;
    this.additionalInfoScriptDisabled = false;
    this.supportDisabled = false;
    this.additionalInfoSupportDisabled = false;
    this.decorationDisabled = false;
    this.additionalInfoDecorationDisabled = false;
    this.formatDisabled = false;
    this.additionalInfoFormatDisabled = false;
    this.inkDisabled = false;
    this.additionalInfoInkDisabled = false;
    this.bindingTechniqueDisabled = false;
    this.additionalInfoBindingTechniqueDisabled = false;
    this.widthDisabled = false;
    this.lengthDisabled = false;
    this.thicknessDisabled = false;
    this.conservationInterventionsDisabled = false;

    // Also clear physical characteristic values:
    this.selectedScript = "";
    this.additionalInfoScript = "";
    this.selectedSupport = "";
    this.additionalInfoSupport = "";
    this.selectedDecoration = "";
    this.additionalInfoDecoration = "";
    this.selectedFormat = "";
    this.additionalInfoFormat = "";
    this.selectedInk = "";
    this.additionalInfoInk = "";
    this.selectedBindingTechnique = "";
    this.additionalInfoBindingTechnique = "";
    this.width = "";
    this.length = "";
    this.thickness = "";
    this.conservationInterventions = "";
  },



  },
}

</script>

<style scoped>

body,
html {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: Arial, sans-serif;
  background: #F6F6F6;
  color: #333;
  display: flex;
  flex-direction: column;
}

header,
footer {
  background-color: #23263C;
  color: white;
  text-align: center;
  padding: 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.container-left,
.container-right {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 45%;
  width: 100%;
  box-sizing: border-box;
  margin: 10px;
  display: flex;
  flex-direction: column;
}

.container-left h1,
.container-right h1 {
  margin-bottom: 20px;
  font-size: 2em;
  color: #23263C;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
}

.pad {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pad-inner {
  padding: 15px;
  margin-bottom: 20px;
  background-color: #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.custom-info {
  background-color: #f0f7ff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #1E3A8A;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 0.9em;
  line-height: 1.6em;
  color: #333;
  margin-bottom: 20px;
  text-align: justify;
}


.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
  font-size: 1em;
}

.white-input {
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  margin-bottom: 8px;
}
.white-input:focus {
  border-color: #23263C;
  outline: none;
}

.disabled-input {
  background-color: #cccccc;
  color: #666;
  border: 1px solid #999;
  padding: 12px;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 8px;
}

.required {
  color: red;
  margin-left: 5px;
}

.multiselect-container {
  position: relative;
}

.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-bottom: 5px;
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: #23263C;
  color: white;
  text-align: center;
  border-radius: 5px;
  padding: 5px 8px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #23263C transparent transparent transparent;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}


.main-button,
#confirm-locus,
#toggle-details,
#collapsible-button {
  display: inline-block;
  background-color: #23263C;
  color: #fff;
  padding: 14px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  text-align: center;
  margin: 10px 10px 10px 0;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-weight: 600;
  letter-spacing: 1px;
}
.main-button:hover:not(:disabled),
#confirm-locus:hover:not(:disabled),
#toggle-details:hover:not(:disabled),
#collapsible-button:hover:not(:disabled) {
  background-color: #1B1E2A;
  transform: translateY(-2px);
}
.main-button:disabled,
#confirm-locus:disabled,
#toggle-details:disabled,
#collapsible-button:disabled {
  background-color: #B0BEC5;
  cursor: not-allowed;
  box-shadow: none;
}


.next-button {
  display: block;
  width: 100%;
  padding: 12px 20px;
  font-size: 1.1em;
  color: white;
  background-color: #23263C;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
.next-button:hover:not(:disabled) {
  background-color: #23263C;
  transform: translateY(-2px);
}
.next-button:disabled {
  background-color: #B0BEC5;
  cursor: not-allowed;
  box-shadow: none;
}

/* ---------------------------
   6) Smaller Buttons (Save/Tick)
--------------------------- */

.add-button {
  background-color: #23263C;
  color: #fff;
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
  text-transform: uppercase;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 10px;
}
.add-button:hover:not(:disabled) {
  background-color: #1B1E2A;
  transform: translateY(-2px);
}
.add-button:disabled {
  background-color: #B0BEC5;
  cursor: not-allowed;
  box-shadow: none;
}

/* Tick button for Material Information fields */
.tick-button {
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  margin-left: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.tick-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
}
.tick-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.5);
}
.tick-button:active {
  transform: translateY(0);
  background-color: #1e7e34;
}

.rdf-container {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: "Courier New", Courier, monospace;
  white-space: pre-wrap;
  overflow: auto;
  max-height: 300px;
}

.rdf-container p {
  margin: 0 0 5px 0;
  font-family: Arial, sans-serif;
  font-size: 0.9em;
  color: #555;
}

.action-buttons-card {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}


.action-buttons-card .main-button {
  flex: 1 1 0;
  min-width: 150px;
  text-align: center;
}
.padded-group {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.padded-group label {
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.padded-group select,
.padded-group input[type="text"],
.padded-group .selected-items {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
    background-color: #fff;
}

.padded-group select:focus,
.padded-group input[type="text"]:focus,
.padded-group .selected-items:focus {
    border-color: #D32F2F;
    outline: none;
}

.padded-group .selected-items {
    min-height: 38px;
    background-color: #f9f9f9;
    padding: 10px;
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
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  padding: 20px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px; right: 15px;
  font-size: 1.5em;
  cursor: pointer;
  color: #888;
}
.close-button:hover {
  color: #333;
}


</style>


