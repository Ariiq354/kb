<script setup lang="ts">
import LandingFooter from "~/components/LandingFooter.vue";
import LandingNavbar from "~/components/LandingNavbar.vue";
</script>

<template>
  <div>
    <LandingNavbar />
    <div class="mt-21">
      <slot />
    </div>
    <LandingFooter />
  </div>
</template>
