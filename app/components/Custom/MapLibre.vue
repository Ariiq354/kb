<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import * as maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
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

maplibregl.setWorkerUrl(workerUrl);

interface Props {
  mapStyle?: string;
  center?: [number, number];
  zoom?: number;
}

const mapContainer = ref<HTMLElement | null>(null);
const map = ref<any>(null);
const marker = ref<maplibregl.Marker | null>(null);
const isMapReady = ref(false);
let resizeObserver: ResizeObserver | null = null;

function setMarker(lng: number, lat: number) {
  if (!map.value)
    return;

  if (marker.value) {
    marker.value.setLngLat([lng, lat]);
  }
  else {
    marker.value = new maplibregl.Marker({ color: "#3b82f6" })
      .setLngLat([lng, lat])
      .addTo(map.value);
  }
}

watch(() => props.center, (newCenter) => {
  if (!map.value)
    return;
  map.value.flyTo({ center: [...newCenter], essential: true });
  setMarker(newCenter[0], newCenter[1]);
}, { deep: true });

watch(() => props.zoom, (newZoom) => {
  if (!map.value)
    return;
  map.value.flyTo({ zoom: newZoom, essential: true });
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

  searchResults.value = [];

  isProgrammaticUpdate.value = true;
  searchQuery.value = item.display_name;

  setMarker(lon, lat);

  if (map.value) {
    map.value.flyTo({ center: [lon, lat], zoom: 16, essential: true });
  }

  emit("update:location", { lat, lng: lon, displayName: item.display_name });
}

// Click on map to place/move marker
async function handleMapClick(event: maplibregl.MapMouseEvent) {
  const { lng, lat } = event.lngLat;

  setMarker(lng, lat);

  if (map.value) {
    map.value.flyTo({ center: [lng, lat], essential: true });
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

onMounted(() => {
  const testCanvas = document.createElement("canvas");
  const hasGL = !!(
    testCanvas.getContext("webgl2") || testCanvas.getContext("webgl")
  );
  if (!hasGL) {
    console.warn("[MapLibre] WebGL tidak tersedia; map mungkin tidak dirender.");
  }
});

function initMap(container: HTMLElement) {
  map.value = new maplibregl.Map({
    container,
    style: props.mapStyle,
    center: [...props.center],
    zoom: props.zoom,
  });

  map.value.addControl(new maplibregl.NavigationControl(), "top-right");

  map.value.on("error", (err: { error?: unknown }) => {
    console.warn("[MapLibre] map error:", err?.error ?? err);
  });

  map.value.on("load", () => {
    isMapReady.value = true;
    map.value?.resize();
    requestAnimationFrame(() => map.value?.resize());
    setMarker(props.center[0], props.center[1]);
  });

  map.value.on("click", handleMapClick);

  resizeObserver = new ResizeObserver(() => {
    map.value?.resize();
  });
  resizeObserver.observe(container);
}

// Kunci fix-nya: watch ref, bukan andalkan onMounted timing
watch(mapContainer, (el) => {
  if (el && !map.value) {
    initMap(el);
  }
}, { immediate: true });

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (map.value) {
    map.value.off("click", handleMapClick);
    marker.value?.remove();
    map.value.remove();
    map.value = null;
  }
});
</script>

<template>
  <ClientOnly>
    <div class="relative w-full rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
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
      <div
        ref="mapContainer"
        class="w-full"
        style="min-height: 350px; width: 100%;"
      />
    </div>
    <template #fallback>
      <div class="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center" style="min-height: 350px;">
        <span class="text-sm text-neutral-500">Loading map...</span>
      </div>
    </template>
  </ClientOnly>
</template>
