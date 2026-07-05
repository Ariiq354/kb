<script setup lang="ts">
import ProfileContainer from "~/features/profile/ProfileContainer.vue";

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Profil User",
    },
  },
});

useHead({
  title: "Profil User",
});
</script>

<template>
  <ProfileContainer />
</template>
