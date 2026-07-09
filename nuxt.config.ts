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
  ],

  css: ["~/assets/css/main.css"],

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
