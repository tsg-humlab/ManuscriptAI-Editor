<script setup>

</script>

<template>
  <v-app-bar
    app
    color="#23263C"
    title="Manuscript AI"
    density="comfortable"
  >
    <template #prepend>
      <router-link to="/">
        <v-img
          width="50"
          height="50"
          src="@/assets/Logo_plain.svg"
          class="ml-3 my-1 pa-2"
          to="/"
        />
      </router-link>
    </template>
  </v-app-bar>
</template>

<style scoped lang="sass">

</style>
