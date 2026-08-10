# Keluarga Bahagia (KB)

The web platform of Keluarga Bahagia for community activities — most prominently bootcamps that run offline, online or hybrid, each of which may have a physical meeting place.

## Language

**Lokasi**:
The physical place where an OFFLINE or HYBRID bootcamp happens, identified by its coordinates (latitude, longitude) and a human-readable display name.
_Avoid_: googleMapLink, "Google Maps link" (that is only the persistence format, not the concept), location

**Peta Lokasi**:
The client-only map surface used to choose a Lokasi — search, marker placement and reverse geocoding — reporting back the chosen coordinates and their display name. In code this is the `LocationPicker` component.
_Avoid_: MapLibre (a rendering technology, not the concept), map

**Ringkasan Aktivitas**:
The aggregated dashboard view presenting a user's active learning progress (Courses and Bootcamps), Ta'aruf matchmaking process status, purchased products, and profile completeness metrics. In code this is served by the `/api/v1/dashboard` backend module and rendered by `DashboardContainer.vue`.
_Avoid_: userStats, summaryPage
