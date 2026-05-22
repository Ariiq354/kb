import "./shared/env";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-security",
    "@pinia/nuxt",
  ],

  css: ["~/assets/css/main.css"],

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