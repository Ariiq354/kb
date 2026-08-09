<script setup lang="ts">
import type { MapMouseEvent, StyleSpecification } from "maplibre-gl";
import { onClickOutside } from "@vueuse/core";
import { Marker, Map as MlMap, NavigationControl, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import "maplibre-gl/dist/maplibre-gl.css";

const props = withDefaults(defineProps<Props>(), {
  mapStyle: "https://tiles.openfreemap.org/styles/bright",
  center: () => [106.827153, -6.175110], // Jakarta coordinates
  zoom: 12,
});

const emit = defineEmits<{
  (e: "update:location", data: { lat: number; lng: number; displayName: string }): void;
}>();

setWorkerUrl(workerUrl);

interface Props {
  mapStyle?: StyleSpecification | string;
  center?: [number, number];
  zoom?: number;
}

const mapContainer = ref<HTMLElement>();
const map = shallowRef<MlMap | null>(null);
const marker = shallowRef<Marker | null>(null);

const mapCenter = ref<[number, number]>([...props.center]);
const mapZoom = ref<number>(props.zoom);
const markerCoordinates = ref<[number, number] | null>([...props.center]);

onMounted(async () => {
  await nextTick();

  if (!mapContainer.value)
    return;

  const mlMap = new MlMap({
    container: mapContainer.value,
    style: props.mapStyle,
    center: mapCenter.value,
    zoom: mapZoom.value,
  });

  map.value = mlMap;
  mlMap.on("error", (e) => {
    console.error("MapLibre error:", e.error);
  });

  mlMap.addControl(new NavigationControl(), "top-right");

  if (markerCoordinates.value) {
    marker.value = new Marker({ color: "#3b82f6" })
      .setLngLat(markerCoordinates.value)
      .addTo(mlMap);
  }

  mlMap.on("click", handleMapClick);
});

watch(() => props.center, (newCenter) => {
  if (map.value) {
    map.value.flyTo({
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
  if (map.value) {
    map.value.flyTo({
      zoom: newZoom,
      essential: true,
    });
  }
  else {
    mapZoom.value = newZoom;
  }
});

watch(markerCoordinates, (coordinates) => {
  if (marker.value && coordinates) {
    marker.value.setLngLat(coordinates);
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
      searchResults.value = data as SearchResult[];
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

  if (map.value) {
    map.value.flyTo({
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
function handleMapClick(event: MapMouseEvent) {
  const lngLat = event.lngLat;
  if (!lngLat)
    return;
  const { lng, lat } = lngLat;

  markerCoordinates.value = [lng, lat];

  if (map.value) {
    map.value.flyTo({
      center: [lng, lat],
      essential: true,
    });
  }
  else {
    mapCenter.value = [lng, lat];
  }

  reverseGeocode(lat, lng);
}

async function reverseGeocode(lat: number, lng: number) {
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
      applyLocation(lat, lng, data.display_name);
    }
    else {
      applyLocation(lat, lng, coordinateName(lat, lng));
    }
  }
  catch (error) {
    console.error("Reverse geocoding failed:", error);
    applyLocation(lat, lng, coordinateName(lat, lng));
  }
}

function coordinateName(lat: number, lng: number) {
  return `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function applyLocation(lat: number, lng: number, displayName: string) {
  searchResults.value = [];
  isProgrammaticUpdate.value = true;
  searchQuery.value = displayName;
  emit("update:location", { lat, lng, displayName });
}

onUnmounted(() => {
  if (map.value) {
    map.value.off("click", handleMapClick);
    map.value.remove();
  }
  marker.value = null;
  map.value = null;
});
</script>

<template>
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
    <div ref="mapContainer" class="w-full h-full" />
  </div>
</template>
