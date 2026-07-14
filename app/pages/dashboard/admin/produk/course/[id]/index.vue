<script setup lang="ts">
import { useRoute } from "#imports";
import CurriculumContainer from "~/features/course/CurriculumContainer.vue";

useHead({
  title: "Kelola Kurikulum",
});
const route = useRoute();
</script>

<template>
  <CurriculumContainer
    :course-id="Number(route.params.id)"
  />
</template>
