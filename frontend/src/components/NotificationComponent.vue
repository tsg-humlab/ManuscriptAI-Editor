<script setup>
import {computed, ref, watch } from "vue";
import { useAppStore } from "@/stores/app.js";

const store = useAppStore()

const color = computed(() => store.getNotificationInfo.color);
const text = computed(() => store.getNotificationInfo.text);
const show = computed({
  get() {
    return store.getNotificationInfo.showNot
  },
  set(newV){
    console.log("newV:", newV)
    store.setNotification({show:newV, color:"info", time:100})
  }
});
const time = computed(()=> store.getNotificationInfo.time)
const timer = 4000

const timeout = ref(4000)

watch(time, (newValue, oldValue) => {
  console.log(`color changed from ${oldValue} to ${newValue}`);
  timeout.value = newValue === -1 ? -1 : timer;

});

</script>

<template>
  <div id="notification-panel">
    <v-snackbar
      v-model="show"
      location="top"
      :timeout="timeout"
      :content-class="color === 'success' ? 'custom-success' : color=== 'error' ? 'custom-error' : 'custom-info'"
    >
      <template #text>
        <div class="d-flex justify-start align-center">
          <div v-if="color==='success'">
            <v-icon color="success">
              mdi-check-circle
            </v-icon>
          </div>
          <div v-else-if="color==='error'">
            <v-icon color="error">
              mdi-alert-circle-outline
            </v-icon>
          </div><div v-else>
            <v-icon color="info">
              mdi-information
            </v-icon>
          </div>
          <div class="ml-2">{{ text }}</div>
        </div>
      </template>
      <template
        #actions
      >
        <v-btn
          :color="color"
          variant="text"
          @click="store.setNotification({showNot: false, text: text, color:color})"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
  ::v-deep(.custom-info) {
    background-color: #E8F0FE !important;
    border-left: 4px solid #1A3C87 !important;
    color: #1A3C87 !important;
  }
  ::v-deep(.custom-error) {
    background-color: #ffe9e9 !important;
    border-left: 4px solid #ff6b6b !important;
    color: #a94442 !important;
  }
  ::v-deep(.custom-success) {
    background-color: #e6f9f5 !important;
    border-left: 4px solid #00bfa6 !important;
    color: #006a5c !important;
  }
</style>
