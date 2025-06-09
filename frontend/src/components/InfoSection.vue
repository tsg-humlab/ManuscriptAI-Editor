<template>
  <v-card class="mb-6 padded-box">
    <v-card-title class="text-h6">{{ title }}</v-card-title>
    <v-card-text>{{ text }}</v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  title: String,
  text:  String
})
</script>

<style scoped>
.padded-box {
  padding: 1.5rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
</style>
