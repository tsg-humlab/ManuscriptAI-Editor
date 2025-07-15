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
        :disabled="index === breadcrumbs.length - 1"
        exact
        link
        @click="onBreadcrumbClick(crumb.to)"


      >
        <div class="breadcrumb-component">{{ crumb.text }}</div>
        <v-breadcrumbs-divider
          v-if="index !== breadcrumbs.length-1"
          class="breadcrumb-divider"
          divider="/"
        />
      </v-breadcrumbs-item>
    </v-breadcrumbs>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from "@/stores/app.js";

const store = useAppStore()
const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
  return route.meta?.breadcrumbTrail
});

function onBreadcrumbClick(targetRoute){
  // check the page the user is coming from
  const fromRouteName = route.name;
  // if the user comes from 'stepper' refresh the props
  if (fromRouteName === 'stepper'){
    // resets the process and starts the process from scratch
    store.setSelCreatedManuscript([])
    store.listOfCreatedManuscripts = []
    store.setSelectedManuscript(null)
    store.setRdfOutput("")
    store.setStructuredData({"manuscripts": [], "number_of_manuscripts": 0 })
    store.setStep(0)
    store.setFileContent({content: null, extension: null, name: null})
  }
  // Navigate to the breadcrumb target route
  router.push(targetRoute);
}
</script>

<style scoped>

.breadcrumbs-wrapper {
  padding: 16px 24px;
}

.breadcrumb-component:hover  {
  text-decoration: underline !important;
  cursor: pointer !important;
}



</style>
