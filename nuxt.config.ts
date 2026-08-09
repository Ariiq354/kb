export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  modules: [
    "nuxt-security",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "nuxt-charts",
    "nuxt-maplibre",
  ],

  css: ["~/assets/css/main.css"],

  vite: {
    optimizeDeps: {
      include: [
        "maplibre-gl",
        "@indoorequal/vue-maplibre-gl",
      ],
    },
    ssr: {
      noExternal: ["maplibre-gl", "@indoorequal/vue-maplibre-gl"],
    },
  },

  ui: {
    colorMode: false,
  },

  imports: {
    scan: false,
  },

  components: {
    dirs: [],
  },

  security: {
    sri: false,
    headers: {
      crossOriginResourcePolicy: "same-site",
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://assets.keluargabahagia.id",
        ],
      },
    },
  },

  runtimeConfig: {
    public: {
      imageUrl: "https://assets.keluargabahagia.id",
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
});
