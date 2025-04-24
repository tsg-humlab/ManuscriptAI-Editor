<template>
  <div
    v-if="route.name!=='landing'"
    class="breadcrumbs-wrapper d-flex flex-row align-baseline ml-5"
  >
    <div class="section-label mr-2">
      You are here:
    </div>
    <v-breadcrumbs class="pa-0 ma-0">
      <v-breadcrumbs-item
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        :to="crumb.to"
        :disabled="index === breadcrumbs.length - 1"
        exact
        link
      >
        {{ crumb.text }}
        <v-breadcrumbs-divider
          v-if="index !== breadcrumbs.length-1"
          divider="/"
        />
      </v-breadcrumbs-item>
    </v-breadcrumbs>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

 const route = useRoute();
   const breadcrumbs = computed(() => {
     return route.meta?.breadcrumbTrail
   });
</script>

<style scoped>

.breadcrumbs-wrapper {
  padding: 16px 24px;
}
</style>
