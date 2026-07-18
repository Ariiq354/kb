<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div
      v-for="i in 4"
      :key="i"
      class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 shadow-xs"
    >
      <div class="flex items-center gap-4">
        <USkeleton class="size-16 rounded-xl" />
        <div class="space-y-2 flex-1">
          <USkeleton class="h-5 w-1/2" />
          <USkeleton class="h-4 w-1/3" />
        </div>
      </div>
      <USkeleton class="h-12 w-full rounded-lg" />
      <div class="flex justify-between items-center pt-2">
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-8 w-24 rounded-lg" />
      </div>
    </div>
  </div>
</template>
