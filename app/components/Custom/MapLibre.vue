<script setup lang="ts">
import { MglMap, MglMarker, MglNavigationControl, useMap } from "@indoorequal/vue-maplibre-gl";
import { onClickOutside } from "@vueuse/core";
import { onUnmounted, ref, watch } from "vue";
import InputSearch from "~/components/Custom/InputSearch.vue";

interface Props {
  mapStyle?: any;
  center?: [number, number];
  zoom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  mapStyle: "https://tiles.openfreemap.org/styles/bright",
  center: () => [106.827153, -6.175110], // Jakarta coordinates
  zoom: 12,
});

const emit = defineEmits<{
  (e: "update:location", data: { lat: number; lng: number; displayName: string }): void;
}>();

const mapCenter = ref<[number, number]>([...props.center]);
const mapZoom = ref<number>(props.zoom);
const markerCoordinates = ref<[number, number] | null>([...props.center]);

const mapInstance = useMap();

watch(() => props.center, (newCenter) => {
  if (mapInstance.map) {
    mapInstance.map.flyTo({
      center: [...newCenter],
      essential: true,
    });
  }
  else {
    mapCenter.value = [...newCenter];
  }
  markerCoordinates.value = [...newCenter];
}, { deep: true });

watch(() => props.zoom, (newZoom) => {
  if (mapInstance.map) {
    mapInstance.map.flyTo({
      zoom: newZoom,
      essential: true,
    });
  }
  else {
    mapZoom.value = newZoom;
  }
});

// Search functionality
const searchContainer = ref<HTMLElement | null>(null);
const searchQuery = ref("");
const isSearching = ref(false);
const isProgrammaticUpdate = ref(false);

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}
const searchResults = ref<SearchResult[]>([]);

onClickOutside(searchContainer, () => {
  searchResults.value = [];
});

watch(searchQuery, () => {
  if (isProgrammaticUpdate.value) {
    isProgrammaticUpdate.value = false;
    return;
  }
  handleSearch();
});

async function handleSearch() {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }
  isSearching.value = true;
  searchResults.value = [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`,
      {
        headers: {
          "User-Agent": "KeluargaBahagiaMapApp/1.0",
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      searchResults.value = data;
    }
  }
  catch (error) {
    console.error("Geocoding search failed:", error);
  }
  finally {
    isSearching.value = false;
  }
}

function selectLocation(item: SearchResult) {
  const lat = parseFloat(item.lat);
  const lon = parseFloat(item.lon);

  markerCoordinates.value = [lon, lat];
  searchResults.value = [];

  isProgrammaticUpdate.value = true;
  searchQuery.value = item.display_name;

  if (mapInstance.map) {
    mapInstance.map.flyTo({
      center: [lon, lat],
      zoom: 16,
      essential: true,
    });
  }
  else {
    mapCenter.value = [lon, lat];
    mapZoom.value = 16;
  }

  emit("update:location", { lat, lng: lon, displayName: item.display_name });
}

// Click on map to place/move marker
async function handleMapClick(event: any) {
  const lngLat = event.lngLat;
  if (!lngLat)
    return;
  const { lng, lat } = lngLat;

  markerCoordinates.value = [lng, lat];

  if (mapInstance.map) {
    mapInstance.map.flyTo({
      center: [lng, lat],
      essential: true,
    });
  }
  else {
    mapCenter.value = [lng, lat];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "KeluargaBahagiaMapApp/1.0",
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      searchResults.value = [];
      isProgrammaticUpdate.value = true;
      searchQuery.value = data.display_name;
      emit("update:location", { lat, lng, displayName: data.display_name });
    }
    else {
      const simpleName = `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      searchResults.value = [];
      isProgrammaticUpdate.value = true;
      searchQuery.value = simpleName;
      emit("update:location", { lat, lng, displayName: simpleName });
    }
  }
  catch (error) {
    console.error("Reverse geocoding failed:", error);
    const simpleName = `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    searchResults.value = [];
    isProgrammaticUpdate.value = true;
    searchQuery.value = simpleName;
    emit("update:location", { lat, lng, displayName: simpleName });
  }
}

// Bind native click event listener to MapLibre instance directly
watch(() => mapInstance.map, (map, oldMap) => {
  if (oldMap) {
    oldMap.off("click", handleMapClick);
  }
  if (map) {
    map.on("click", handleMapClick);
  }
}, { immediate: true });

onUnmounted(() => {
  if (mapInstance.map) {
    mapInstance.map.off("click", handleMapClick);
  }
});
</script>

<template>
  <ClientOnly>
    <div class="relative w-full h-87.5 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <!-- Search Bar Container -->
      <div
        ref="searchContainer"
        class="absolute top-2 left-2 z-10 w-72 sm:w-80 shadow-md rounded-md overflow-hidden"
        @mousedown.stop
        @click.stop
      >
        <InputSearch
          v-model="searchQuery"
          placeholder="Cari lokasi..."
          :loading="isSearching"
          class="w-full bg-white dark:bg-neutral-900"
        />

        <!-- Search Results Dropdown -->
        <div
          v-if="searchResults.length > 0"
          class="mt-1 max-h-60 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl text-sm divide-y divide-neutral-100 dark:divide-neutral-800"
        >
          <button
            v-for="item in searchResults"
            :key="item.place_id"
            type="button"
            class="w-full text-left px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none transition-colors block truncate text-neutral-700 dark:text-neutral-300"
            @click="selectLocation(item)"
          >
            {{ item.display_name }}
          </button>
        </div>
      </div>

      <!-- Map -->
      <MglMap
        :map-style="props.mapStyle"
        :center="mapCenter"
        :zoom="mapZoom"
        class="w-full h-full"
      >
        <MglNavigationControl position="top-right" />
        <MglMarker
          v-if="markerCoordinates"
          :coordinates="markerCoordinates"
          color="#3b82f6"
        />
      </MglMap>
    </div>
    <template #fallback>
      <div class="w-full h-87.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
        <span class="text-sm text-neutral-500">Loading map...</span>
      </div>
    </template>
  </ClientOnly>
</template>
