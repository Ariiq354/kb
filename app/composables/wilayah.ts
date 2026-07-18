import { useState } from "#app";

export interface Provinsi {
  id: number;
  name: string;
}

export interface Kota {
  id: number;
  provinsiId: number;
  name: string;
}

export interface Kecamatan {
  id: number;
  kotaId: number;
  name: string;
}

export interface Desa {
  id: number;
  kecamatanId: number;
  name: string;
}

export function useProvinsi() {
  const provinsi = useState<Provinsi[]>("provinsi", () => []);
  const isFetching = useState<boolean>("provinsi-loading", () => false);

  const fetchProvinsi = async () => {
    if (provinsi.value.length > 0) {
      return;
    }
    if (isFetching.value) {
      return;
    }
    isFetching.value = true;
    try {
      const data = await $fetch("/api/v1/wilayah/provinsi");
      provinsi.value = data as Provinsi[];
    }
    catch (err) {
      console.error("Failed to fetch provinsi", err);
    }
    finally {
      isFetching.value = false;
    }
  };

  return {
    provinsi,
    isFetching,
    fetchProvinsi,
  };
}

export function useKota() {
  const kota = useState<Record<number, Kota[]>>("kota", () => ({}));
  const loadingStates = useState<Record<number, boolean>>("kota-loading", () => ({}));

  const fetchKota = async (provinsiId: number) => {
    if (kota.value[provinsiId]) {
      return;
    }
    if (loadingStates.value[provinsiId]) {
      return;
    }
    loadingStates.value[provinsiId] = true;
    try {
      const data = await $fetch("/api/v1/wilayah/kota", {
        query: { provinsiId },
      });
      kota.value[provinsiId] = data as Kota[];
    }
    catch (err) {
      console.error(`Failed to fetch kota for provinsi ${provinsiId}`, err);
    }
    finally {
      loadingStates.value[provinsiId] = false;
    }
  };

  return {
    kota,
    loadingStates,
    fetchKota,
  };
}

export function useKecamatan() {
  const kecamatan = useState<Record<number, Kecamatan[]>>("kecamatan", () => ({}));
  const loadingStates = useState<Record<number, boolean>>("kecamatan-loading", () => ({}));

  const fetchKecamatan = async (kotaId: number) => {
    if (kecamatan.value[kotaId]) {
      return;
    }
    if (loadingStates.value[kotaId]) {
      return;
    }
    loadingStates.value[kotaId] = true;
    try {
      const data = await $fetch("/api/v1/wilayah/kecamatan", {
        query: { kotaId },
      });
      kecamatan.value[kotaId] = data as Kecamatan[];
    }
    catch (err) {
      console.error(`Failed to fetch kecamatan for kota ${kotaId}`, err);
    }
    finally {
      loadingStates.value[kotaId] = false;
    }
  };

  return {
    kecamatan,
    loadingStates,
    fetchKecamatan,
  };
}

export function useDesa() {
  const desa = useState<Record<number, Desa[]>>("desa", () => ({}));
  const loadingStates = useState<Record<number, boolean>>("desa-loading", () => ({}));

  const fetchDesa = async (kecamatanId: number) => {
    if (desa.value[kecamatanId]) {
      return;
    }
    if (loadingStates.value[kecamatanId]) {
      return;
    }
    loadingStates.value[kecamatanId] = true;
    try {
      const data = await $fetch("/api/v1/wilayah/desa", {
        query: { kecamatanId },
      });
      desa.value[kecamatanId] = data as Desa[];
    }
    catch (err) {
      console.error(`Failed to fetch desa for kecamatan ${kecamatanId}`, err);
    }
    finally {
      loadingStates.value[kecamatanId] = false;
    }
  };

  return {
    desa,
    loadingStates,
    fetchDesa,
  };
}
