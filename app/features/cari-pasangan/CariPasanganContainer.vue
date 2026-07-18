<script setup lang="ts">
import type { MemberDetail } from "./components/MemberDetailModal.vue";
import { refDebounced } from "@vueuse/core";
import { computed, reactive, ref, toRef } from "vue";
import MemberDetailModal from "./components/MemberDetailModal.vue";
import PartnerCard from "./components/PartnerCard.vue";
import PartnerEmptyState from "./components/PartnerEmptyState.vue";
import PartnerFilterSidebar from "./components/PartnerFilterSidebar.vue";
import PartnerHeader from "./components/PartnerHeader.vue";
import PartnerSkeleton from "./components/PartnerSkeleton.vue";

// 1. Fetch current logged-in user profile to verify completion and redirect if empty
const { data: me } = await useFetch("/api/v1/users/me");
if (!me.value?.kodeUser) {
  navigateTo("/dashboard/user/profile");
}

// 2. Reactive filter states
const filters = reactive({
  search: "",
  suku: "",
  umurRange: [18, 60] as [number, number],
  pendidikan: undefined as string | undefined,
  statusKawin: undefined as string | undefined,
  agama: undefined as string | undefined,
  perokok: undefined as string | undefined, // 'semua' | 'tidak' | 'ya'
  page: 1,
  limit: 6,
});

// Debounce age range slider to prevent API overload during dragging
const umurRangeRef = toRef(filters, "umurRange");
const debouncedUmurRange = refDebounced(umurRangeRef, 1000);

// 3. Reset filters handler
function clearFilters() {
  filters.search = "";
  filters.suku = "";
  filters.umurRange = [18, 60];
  filters.pendidikan = undefined;
  filters.statusKawin = undefined;
  filters.agama = undefined;
  filters.perokok = undefined;
  filters.page = 1;
}

// 4. Computed query parameter binding
const queryParams = computed(() => {
  const params: Record<string, any> = {
    page: filters.page,
    limit: filters.limit,
  };
  if (filters.search)
    params.search = filters.search;
  if (filters.suku)
    params.suku = filters.suku;

  // Map range to min/max parameters for the API (debounced)
  params.minUmur = debouncedUmurRange.value[0];
  params.maxUmur = debouncedUmurRange.value[1];

  if (filters.pendidikan)
    params.pendidikan = filters.pendidikan;
  if (filters.statusKawin)
    params.statusKawin = filters.statusKawin;
  if (filters.agama)
    params.agama = filters.agama;

  if (filters.perokok === "ya") {
    params.perokok = true;
  }
  else if (filters.perokok === "tidak") {
    params.perokok = false;
  }

  return params;
});

// 5. Fetch members of opposite gender
const { data, error, pending } = await useFetch("/api/v1/users/opposite-gender", {
  query: queryParams,
  watch: [queryParams],
});

// 6. Selected member detail modal state
const isDetailOpen = ref(false);
const selectedMember = ref<MemberDetail | null>(null);

function viewDetail(member: MemberDetail) {
  selectedMember.value = member;
  isDetailOpen.value = true;
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Summary Card -->
    <PartnerHeader :total="data?.total || 0" />

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Filters Sidebar -->
      <div class="lg:col-span-4">
        <PartnerFilterSidebar
          v-model="filters"
          @reset="clearFilters"
        />
      </div>

      <!-- Right Members Grid -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Error Alert -->
        <UAlert
          v-if="error"
          icon="i-lucide-circle-alert"
          color="error"
          variant="subtle"
          title="Error Memuat Data"
          :description="error.message || 'Terjadi kesalahan.'"
        />

        <!-- Loading State Skeleton -->
        <PartnerSkeleton v-if="pending" />

        <!-- Loaded State -->
        <div v-else>
          <!-- Empty State -->
          <PartnerEmptyState v-if="!data?.data || data.data.length === 0" />

          <!-- Cards Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PartnerCard
              v-for="member in data.data"
              :key="member.id"
              :member="member"
              @view="viewDetail"
            />
          </div>

          <!-- Pagination -->
          <div v-if="data && data.total > filters.limit" class="flex justify-center pt-8">
            <UPagination
              v-model="filters.page"
              :total="data.total"
              :items-per-page="filters.limit"
            />
          </div>
        </div>
      </div>
    </div>

    <MemberDetailModal
      v-model="isDetailOpen"
      :member="selectedMember ?? undefined"
    />
  </div>
</template>
