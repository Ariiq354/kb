<script setup lang="ts">
import LandingFooter from "~/components/LandingFooter.vue";
import LandingNavbar from "~/components/LandingNavbar.vue";
</script>

<template>
  <div>
    <LandingNavbar />
    <div class="py-20">
      <slot />
    </div>
    <LandingFooter />
  </div>
</template>
