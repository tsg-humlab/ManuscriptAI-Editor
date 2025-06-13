<template>
  <div class="video-wrapper mb-8">
    <!-- if it's an MP4, render a <video> -->
    <template v-if="isMp4">
      <video
        controls
        width="100%"
        height="400"
      >
        <source :src="src" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </template>

    <!-- otherwise fall back to iframe (YouTube, etc.) -->
    <template v-else>
      <iframe
        :src="src"
        width="100%"
        height="400"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  src: { type: String, required: true }
})

// simple check for mp4 extension
const isMp4 = props.src.trim().toLowerCase().endsWith('.mp4')
</script>

<style scoped>
.video-wrapper {
  text-align: center;
}
.mb-8 {
  margin-bottom: 2rem;
}
</style>
