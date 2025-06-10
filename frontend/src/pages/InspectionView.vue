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
      <v-card-text>In this step of the process, you can select properties/content from the right pane ("File content") and paste it to the 'Manuscript Content' pane in the middle. First, you have to 'Create a manuscript' in order to create a logical container, which will contain the relevant info for a manuscript. It is recommended to create up to five manuscripts for testing purposes and send those to the structurer agent.</v-card-text>
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
