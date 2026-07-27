<script setup lang="ts">
import { DUMMY_COURSE } from "~/features/landing/products/constant";
import UserCourseCard from "./components/UserCourseCard.vue";
</script>

<template>
  <div class="py-2">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <UserCourseCard
        v-for="item in DUMMY_COURSE"
        :id="item.id"
        :key="item.id"
        :title="item.title"
        :total-video="item.totalVideo"
        :harga="item.harga"
        :image="item.image"
      />
    </div>
  </div>
</template>
