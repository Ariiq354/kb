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
        "better-auth/client/plugins",
        "better-auth/vue",
        "@internationalized/date",
        "date-fns",
        "date-fns/locale",
        "zod",
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
          "https://pub-f206e0b7c19942eb86f161705065f105.r2.dev",
        ],
      },
    },
  },

  runtimeConfig: {
    public: {
      imageUrl: "https://pub-f206e0b7c19942eb86f161705065f105.r2.dev",
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
});
