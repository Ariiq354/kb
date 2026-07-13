<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "../constants";
import { FetchError } from "ofetch";
import { computed, ref } from "vue";
import MapLibre from "~/components/Custom/MapLibre.vue";
import UploadImage from "~/components/Custom/UploadImage.vue";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { schema } from "../constants";

const emit = defineEmits(["submit"]);
const openModel = defineModel<boolean>("open", {
  required: true,
});

const state = defineModel<Partial<Schema>>("state", {
  required: true,
});

const isLoading = ref(false);

const mapCenter = computed<[number, number] | undefined>(() => {
  if (!state.value.googleMapLink)
    return undefined;
  const match = state.value.googleMapLink.match(/q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (match && match[1] && match[2]) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    return [lng, lat];
  }
  return undefined;
});

function handleLocationUpdate(data: { lat: number; lng: number; displayName: string }) {
  state.value.googleMapLink = `https://www.google.com/maps?q=${data.lat},${data.lng}`;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  try {
    const isEdit = !!state.value.id;
    const url = `/api/v1/bootcamp/${isEdit ? state.value.id : ""}`;

    const sendData = { ...event.data };
    if (sendData.tipe === "ONLINE") {
      sendData.googleMapLink = "";
    }
    else if (sendData.tipe === "OFFLINE") {
      sendData.meetingLink = "";
    }

    const formData = new FormData();

    // Append regular fields
    for (const [key, value] of Object.entries(sendData)) {
      if (value !== undefined && value !== null && key !== "file" && key !== "foto") {
        formData.append(key, value.toString());
      }
    }

    // Append file if it was uploaded
    if (state.value.file) {
      formData.append("file", state.value.file);
    }

    await $fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: formData,
    });

    useToastSuccess("Sukses", isEdit ? "Data bootcamp berhasil diubah" : "Data bootcamp berhasil ditambahkan");
    openModel.value = false;
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Submit Gagal", error.data?.message || "Terjadi kesalahan pada server");
    }
    else {
      useToastError("Submit Gagal", "Internal Server Error");
    }
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <LazyUModal
    v-model:open="openModel"
    :title="state.id ? 'Edit Bootcamp' : 'Tambah Bootcamp'"
    class="max-w-4xl"
  >
    <template #body>
      <UForm
        id="form-bootcamp"
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="space-y-4">
          <UFormField label="Flyer / Foto Bootcamp" name="file">
            <div class="flex items-center gap-4 mt-2">
              <UploadImage
                v-model:file="state.file"
                v-model:foto="state.foto"
                ratio="16:9"
                :disabled="isLoading"
              />
            </div>
          </UFormField>

          <UFormField label="Judul" name="judul">
            <UInput
              v-model="state.judul"
              placeholder="Masukkan judul bootcamp"
              class="w-full"
              :disabled="isLoading"
            />
          </UFormField>

          <!-- Row 1: Harga and Tipe -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Harga (Rp)" name="harga">
              <UInputNumber
                v-model="state.harga"
                placeholder="0"
                class="w-full"
                :disabled="isLoading"
                :format-options="{
                  style: 'currency',
                  currency: 'IDR',
                  currencyDisplay: 'symbol',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }"
              />
            </UFormField>

            <UFormField label="Tipe Bootcamp" name="tipe">
              <USelect
                v-model="state.tipe"
                :items="['ONLINE', 'OFFLINE', 'HYBRID']"
                placeholder="Pilih tipe"
                class="w-full"
                :disabled="isLoading"
              />
            </UFormField>
          </div>

          <UFormField label="Pembicara" name="pembicara">
            <UInput
              v-model="state.pembicara"
              placeholder="Nama pembicara"
              class="w-full"
              :disabled="isLoading"
            />
          </UFormField>

          <!-- Row 2: Waktu and Tempat -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="Waktu Pelaksanaan" name="waktu">
              <UInput
                v-model="state.waktu"
                placeholder="Contoh: Setiap Sabtu, 09.00 WIB"
                class="w-full"
                :disabled="isLoading"
              />
            </UFormField>

            <UFormField label="Tempat / Lokasi" name="tempat">
              <UInput
                v-model="state.tempat"
                placeholder="Contoh: Zoom Meeting / Hotel Grand"
                class="w-full"
                :disabled="isLoading"
              />
            </UFormField>
          </div>

          <!-- Map (MapLibre) - Show for OFFLINE and HYBRID -->
          <div
            v-if="state.tipe === 'OFFLINE' || state.tipe === 'HYBRID'"
            class="space-y-2"
          >
            <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">Peta Lokasi</span>
            <MapLibre
              :center="mapCenter"
              @update:location="handleLocationUpdate"
            />
          </div>

          <!-- Meeting Link - Show for ONLINE and HYBRID -->
          <UFormField
            v-if="state.tipe === 'ONLINE' || state.tipe === 'HYBRID'"
            label="Meeting Link"
            name="meetingLink"
          >
            <UInput
              v-model="state.meetingLink"
              placeholder="https://zoom.us/j/..."
              class="w-full"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField label="Deskripsi" name="deskripsi">
            <UTextarea
              v-model="state.deskripsi"
              placeholder="Detail deskripsi bootcamp..."
              class="w-full"
              :rows="4"
              :disabled="isLoading"
            />
          </UFormField>

          <UFormField name="status">
            <USwitch
              v-model="state.status"
              label="Status Aktif"
              :disabled="isLoading"
            />
          </UFormField>
        </div>
      </UForm>
    </template>
    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="isLoading"
        @click="() => { openModel = false }"
      >
        Tutup
      </UButton>
      <UButton
        type="submit"
        icon="i-lucide-check"
        :loading="isLoading"
        form="form-bootcamp"
      >
        Simpan
      </UButton>
    </template>
  </LazyUModal>
</template>
