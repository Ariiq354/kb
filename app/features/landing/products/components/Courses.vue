<script setup lang="ts">
import { DUMMY_COURSE } from "../constant";
import CardCourse from "./CardCourse.vue";
</script>

<template>
  <div class="flex items-center gap-3 border-b border-gray-300 pb-2">
    <UIcon name="i-lucide-file-video-camera" class="text-3xl text-primary" />
    <h2 class="text-2xl text-black font-medium">
      Courses
    </h2>
  </div>

  <div class="py-5">
    <UCarousel
      v-slot="{ item }"
      :items="DUMMY_COURSE"
      :ui="{ item: 'basis-1/3' }"
      arrows
    >
      <CardCourse
        :id="item.id"
        :key="item.title"
        :title="item.title"
        :total-video="item.totalVideo"
        :harga="item.harga"
        :image="item.image"
      />
    </UCarousel>
  </div>
</template>
