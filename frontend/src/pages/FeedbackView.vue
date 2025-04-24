<script setup>
import ListOfExtractedManuscripts from "@/components/ListOfExtractedManuscripts.vue";
</script>

<template>
  <v-container
    id="feedback-view"
    fluid
  >
    <v-card
      variant="flat"
      color="transparent"
    >
      <v-card-title>Reviewing the structured data</v-card-title>
      <v-card-text>In this step of the process, you have received structured data by the Structurer agent. Review the quality of the provided data and provide feedback. Upon completion, you can mark a manuscript as reviewed. Once all the manuscripts have been reviewed you can convert to RDF.</v-card-text>
    </v-card>
    <v-row>
      <v-col cols="3">
        <!-- list of extracted manuscripts -->
        <list-of-extracted-manuscripts />
      </v-col>
      <v-divider
        vertical
        class="my-3"
      />
      <v-col>
        <!-- property area per manuscript -->
        <manuscript-data />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
