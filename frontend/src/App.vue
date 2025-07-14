<template>
  <v-app>
    <app-nav-bar />
    <v-main>
      <v-container
        max-width="1500"
        class="d-flex flex-column align-center justify-start fill-height"
      >
        <bread-crumbs v-if="route.name!==undefined" class="align-self-start" />
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import AppNavBar from "@/components/AppNavBar.vue";
  import BreadCrumbs from "@/components/BreadCrumbs.vue";
  import { useRoute } from 'vue-router';
  import {onMounted} from "vue";

  const route = useRoute()
  onMounted(()=>{
    console.log("page loaded: ", route.name)
  })
</script>
