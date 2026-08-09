# Direct maplibre-gl, no Vue/Nuxt wrapper

Status: accepted

We render maps with the bare `maplibre-gl` library (v6) driven imperatively from the `LocationPicker` component, instead of the `nuxt-maplibre` module / `vue-maplibre-gl` wrapper. The wrapper project is effectively unmaintained and peer-pins `maplibre-gl` to `^5`, blocking the v6 we want; working around it forced the `vite.optimizeDeps.include` + `vite.ssr.noExternal` hacks in `nuxt.config.ts` and pulled a second, v5 copy of maplibre-gl into the dependency tree. A direct imperative component removes the wrapper and both hacks at once.

The component statically imports maplibre-gl and instantiates the map inside a `<ClientOnly>` wrapper in `onMounted`. This is SSR-safe: maplibre-gl's module imports cleanly in Node (verified — it only touches browser globals when a `Map` is constructed, never at import time), so Nuxt can externalize it without `ssr.noExternal`. maplibre-gl's own CSS is imported at component level. We accept owning the map's lifecycle manually (create in `onMounted`, `remove()` in `onUnmounted`) in exchange for a clean config.