<script setup lang="ts">

</script>

<template>
  <v-container class="fill-height justify-center">
    <div class="text-center">
      <v-card variant="flat" color="white">
        <v-card-title>
          <h2>Page not found</h2>
        </v-card-title>
        <v-card-item>
          <v-icon icon="mdi-alert-circle" class="text-red" size="64"/>
        </v-card-item>
        <v-card-item>
          <p class="font-weight-medium">
            Uh oh, we can't seem to find the requested page. <br />Consider
            going back to the previous page.
          </p>
          <v-btn variant="flat" href="/" color="mainBg" class="mt-4 primary-btn">
            Go to the main page!
          </v-btn>
        </v-card-item>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>

</style>
