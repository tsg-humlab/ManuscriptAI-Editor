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
      :text="text"
      :color="color"
      location="top"
      :timeout="timeout"
      :timer="time === -1 ? false : 'white-darken-2'"
    >
      <template
        v-if="time === -1"
        #actions
      >
        <v-btn
          color="white"
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

</style>
