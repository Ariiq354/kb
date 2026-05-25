import "./shared/env";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-security",
    "@pinia/nuxt",
    "@nuxt/image",
  ],

  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: false,
  },

  security: {
    headers: {
      crossOriginResourcePolicy: "same-site",
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          "data:",
          "https://assets.ppg.web.id",
        ],
      },
    },
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  eslint: {
    config: {
      standalone: false,
    },
  },
});
