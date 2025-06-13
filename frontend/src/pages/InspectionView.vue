<script setup>
import ManuscriptContent from "@/components/ManuscriptContent.vue";
import Editor from "@/components/Editor.vue";
import ListOfCreatedManuscripts from "@/components/ListOfCreatedManuscripts.vue";

</script>

<template>
  <div
    id="inspection-view"
    class="ga-3"
  >
    <v-card
      variant="flat"
      color="transparent"
    >
      <v-card-title>Inspect the content of the uploaded file</v-card-title>
      <v-card-text><p>In this step, you can select properties/content from the uploaded file (in the <strong>"File content"</strong> pane) and assign them to a manuscript (in the <strong>"Created manuscripts"</strong> pane). A manuscript is a logical container that holds relevant information for a manuscript.</p>
        <p class="mt-1">You can do this in two ways:</p>
        <ul>
          <li class="ml-5"><strong>After selecting the relevant properties in the "File content" pane</strong>, click the <strong>+ button</strong>. This creates a new manuscript and adds the selected properties to it.</li>
          <li class="ml-5"><strong>Alternatively, create a manuscript first and activate it</strong>. Then, copy the relevant properties by pressing the <strong>&#128203; button</strong> next to the highlighted content in the "File content" pane and paste them in the "Manuscript Content" pane.</li>
        </ul>
        <p class="mt-1">It is recommended to create up to five manuscripts for testing purposes and send them to the structurer agent.</p>
      </v-card-text>
    </v-card>
    <v-row class="mt-2">
      <v-col cols="3">
        <list-of-created-manuscripts />
      </v-col>
      <v-col>
        <!-- The manuscript editing area goes here. The prev version is in the ManuscriptArea component. -->
        <ManuscriptContent />
      </v-col>
      <v-col cols="6">
        <!-- New annotation mechanism -->
        <Editor />
      </v-col>
    </v-row>
  </div>
</template>
