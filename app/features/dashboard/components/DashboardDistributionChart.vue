<script setup lang="ts">
import { computed } from "vue";
import { DonutChart, UIcon } from "#components";

interface DistributionProps {
  distribution: Array<{
    type: string;
    label: string;
    count: number;
    percentage: number;
  }>;
}

const props = defineProps<DistributionProps>();

const chartData = computed(() => {
  return props.distribution.map(item => item.count || 1);
});

const categories = computed(() => {
  const colors = ["#10b981", "#0284c7", "#f59e0b"];
  const res: Record<string, { name: string; color: string }> = {};
  props.distribution.forEach((item, index) => {
    res[index.toString()] = {
      name: item.label,
      color: colors[index % colors.length] || "#10b981",
    };
  });
  return res;
});
</script>

<template>
  <div class="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-6 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <UIcon name="i-lucide-pie-chart" class="w-5 h-5 text-sky-500" />
        Portofolio Pembelian
      </h3>
      <span class="text-xs text-slate-500 dark:text-slate-400">Distribusi Kategori</span>
    </div>

    <!-- Nuxt Chart: DonutChart -->
    <div class="flex justify-center items-center py-2">
      <DonutChart
        :data="chartData"
        :categories="categories"
        :radius="75"
        :height="170"
        :arc-width="22"
      />
    </div>

    <!-- Breakdown Legend -->
    <div class="mt-4 space-y-2">
      <div
        v-for="(item, idx) in props.distribution"
        :key="item.type"
        class="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs"
      >
        <div class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-full"
            :class="[
              idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-sky-600' : 'bg-amber-500',
            ]"
          />
          <span class="font-medium text-slate-700 dark:text-slate-200">{{ item.label }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-semibold text-slate-900 dark:text-white">{{ item.count }} Item</span>
          <span class="text-slate-500 dark:text-slate-400 w-10 text-right">{{ item.percentage }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
