<script setup lang="ts">
import LandingFooter from "~/components/LandingFooter.vue";
import LandingNavbar from "~/components/LandingNavbar.vue";
</script>

<template>
  <div>
    <LandingNavbar />
    <slot />
    <LandingFooter />
  </div>
</template>
