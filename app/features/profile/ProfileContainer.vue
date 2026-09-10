<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "./constants";
import { CalendarDate } from "@internationalized/date";
import { FetchError } from "ofetch";
import { ref } from "vue";
import InputCalendar from "~/components/Custom/InputCalendar.vue";
import UploadImage from "~/components/Custom/UploadImage.vue";
import SelectDesa from "~/components/Options/SelectDesa.vue";
import SelectKecamatan from "~/components/Options/SelectKecamatan.vue";
import SelectKota from "~/components/Options/SelectKota.vue";
import SelectProvinsi from "~/components/Options/SelectProvinsi.vue";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { presignAndUploadFile } from "~/utils/upload";
import { initFormData, schema } from "./constants";

const { data, refresh } = await useFetch("/api/v1/users/me");

const state = ref(initFormData(data?.value)) as Ref<Schema>;
const isLoading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!state.value.foto && !state.value.file) {
    useToastError("Submit Gagal", "Foto profil wajib diunggah");
    return;
  }

  isLoading.value = true;

  try {
    let fileKey: string | undefined;

    if (state.value.file) {
      fileKey = await presignAndUploadFile("user-image", state.value.file);
    }

    const body: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(
      event.data as Record<string, unknown>,
    )) {
      if (value === undefined || value === null || value === "" || key === "file") {
        continue;
      }

      body[key] = value instanceof CalendarDate ? value.toString() : value;
    }

    if (fileKey) {
      body.file = fileKey;
    }

    await $fetch("/api/v1/users/me", {
      body,
      method: "PATCH",
    });

    useToastSuccess("Submit Berhasil", "Data berhasil diperbarui");
    await refresh();
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Submit Gagal", error.data.message);
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
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Card Profile User -->
    <div class="min-w-0 md:col-span-4">
      <section aria-labelledby="profile-card-name" class="isolate overflow-hidden rounded-3xl border border-default bg-default shadow-xl shadow-primary/5">
        <div class="relative h-36 overflow-hidden bg-primary-900 px-6 pt-6">
          <svg aria-hidden="true" class="pointer-events-none absolute inset-0 h-full w-full text-primary-300" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="310" cy="70" r="106" stroke="currentColor" stroke-width="32" opacity="0.1" />
            <circle cx="220" cy="148" r="106" stroke="currentColor" stroke-width="1" opacity="0.45" />
            <circle cx="310" cy="70" r="80" stroke="currentColor" stroke-width="1" opacity="0.35" />
          </svg>
          <div class="relative flex items-center gap-2 text-primary-100">
            <UIcon name="i-lucide-user-round" class="size-4" aria-hidden="true" />
            <span class="text-xs font-semibold tracking-[0.18em] uppercase">Profil saya</span>
          </div>
        </div>

        <div class="relative -mt-16 flex flex-col items-center px-5 pb-6 text-center lg:px-6">
          <div class="rounded-2xl bg-default p-2 shadow-lg shadow-primary/10 ring-1 ring-default">
            <UploadImage
              v-model:file="state.file"
              v-model:foto="state.foto"
              :disabled="isLoading"
            />
          </div>

          <h2 id="profile-card-name" class="mt-5 w-full text-2xl font-bold tracking-tight wrap-break-word text-highlighted">
            {{ data?.name || '-' }}
          </h2>
          <p class="mt-2 flex max-w-full items-start justify-center gap-2 text-sm text-muted">
            <UIcon name="i-lucide-briefcase-business" class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span class="min-w-0 wrap-break-word">{{ data?.pekerjaan || 'Belum ada pekerjaan' }}</span>
          </p>

          <div v-if="data?.kodeUser" class="mt-4 inline-flex max-w-full items-center gap-2 rounded-full bg-primary/10 px-3.5 py-2 text-xs text-primary ring-1 ring-inset ring-primary/15">
            <UIcon name="i-lucide-fingerprint" class="size-4 shrink-0" aria-hidden="true" />
            <span class="min-w-0 wrap-break-word">ID Anggota <span class="ml-1 font-mono font-semibold">{{ data.kodeUser }}</span></span>
          </div>

          <div class="mt-7 w-full border-t border-default pt-5 text-left">
            <h3 class="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">
              Informasi kontak
            </h3>
            <dl class="space-y-2">
              <div class="relative rounded-2xl bg-muted/60 p-3 pl-16">
                <dt class="text-xs text-muted">
                  <span class="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-default text-primary ring-1 ring-default">
                    <UIcon name="i-lucide-mail" class="size-4.5" aria-hidden="true" />
                  </span>
                  Email
                </dt>
                <dd class="mt-0.5 text-sm font-medium wrap-anywhere text-default">
                  {{ data?.email || 'Belum ditambahkan' }}
                </dd>
              </div>
              <div class="relative rounded-2xl bg-muted/60 p-3 pl-16">
                <dt class="text-xs text-muted">
                  <span class="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl bg-default text-primary ring-1 ring-default">
                    <UIcon name="i-lucide-phone" class="size-4.5" aria-hidden="true" />
                  </span>
                  Nomor telepon
                </dt>
                <dd class="mt-0.5 text-sm font-medium wrap-anywhere text-default">
                  {{ data?.noTelepon || 'Belum ditambahkan' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div class="flex items-start gap-2.5 border-t border-default bg-muted/40 px-5 py-4 text-xs leading-relaxed text-muted lg:px-6">
          <UIcon name="i-lucide-camera" class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p>Gunakan foto terbaik Anda. Klik <span class="font-semibold text-default">Simpan Profil</span> setelah mengganti foto.</p>
        </div>
      </section>
    </div>

    <div class="md:col-span-8">
      <div class="bg-white rounded-xl border border-gray-200 p-8 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <UAlert
          v-if="!data?.kodeUser"
          icon="i-lucide-alert-triangle"
          color="warning"
          variant="subtle"
          title="Profil Belum Lengkap"
          description="Silakan lengkapi profil Anda terlebih dahulu agar dapat melihat anggota lain dan mencari pasangan."
          class="mb-6"
        />
        <UAlert
          icon="i-lucide-shield-check"
          color="info"
          variant="subtle"
          title="Kerahasiaan & Privasi Data Terjaga"
          description="Data pribadi dan informasi profil Anda disimpan secara aman dan rahasia. Kami menjamin data Anda tidak akan pernah disebarluaskan kepada pihak mana pun tanpa persetujuan Anda."
          class="mb-6"
        />
        <UForm
          id="form-profile"
          class="space-y-8"
          :state="state"
          :schema="schema"
          @submit="onSubmit"
        >
          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-user-round" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Data Pribadi
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
              <UFormField label="Tanggal Lahir" name="tanggalLahir">
                <InputCalendar
                  v-model="state.tanggalLahir"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Jenis Kelamin" name="gender">
                <USelect
                  v-model="state.gender"
                  :items="['Laki-laki', 'Perempuan']"
                  :disabled="isLoading"
                  placeholder="Pilih Jenis Kelamin"
                />
              </UFormField>
              <UFormField label="Status Kawin" name="statusKawin">
                <USelect
                  v-model="state.statusKawin"
                  :items="['Belum Kawin', 'Kawin', 'Cerai']"
                  placeholder="Pilih Status Kawin"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Agama" name="agama">
                <USelect
                  v-model="state.agama"
                  :items="['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu']"
                  placeholder="Pilih Agama"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-map-pin" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Lokasi & Kontak
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
              <UFormField label="Provinsi" name="provinsi">
                <ClientOnly>
                  <SelectProvinsi
                    v-model="state.provinsi"
                    :disabled="isLoading"
                  />
                  <template #fallback>
                    <UInput placeholder="Pilih Provinsi" disabled loading />
                  </template>
                </ClientOnly>
              </UFormField>
              <UFormField label="Kabupaten/Kota" name="kota">
                <ClientOnly>
                  <SelectKota
                    v-model="state.kota"
                    :provinsi-id="state.provinsi"
                    :disabled="isLoading"
                  />
                  <template #fallback>
                    <UInput placeholder="Pilih Kota / Kabupaten" disabled loading />
                  </template>
                </ClientOnly>
              </UFormField>
              <UFormField label="Kecamatan" name="kecamatan">
                <ClientOnly>
                  <SelectKecamatan
                    v-model="state.kecamatan"
                    :kota-id="state.kota"
                    :disabled="isLoading"
                  />
                  <template #fallback>
                    <UInput placeholder="Pilih Kecamatan" disabled loading />
                  </template>
                </ClientOnly>
              </UFormField>
              <UFormField label="Kelurahan" name="kelurahan">
                <ClientOnly>
                  <SelectDesa
                    v-model="state.kelurahan"
                    :kecamatan-id="state.kecamatan"
                    :disabled="isLoading"
                  />
                  <template #fallback>
                    <UInput placeholder="Pilih Kelurahan / Desa" disabled loading />
                  </template>
                </ClientOnly>
              </UFormField>
              <UFormField label="Instagram" name="instagram" class="md:col-span-2">
                <UInput
                  v-model="state.instagram"
                  placeholder="@username"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-users" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Keluarga & Fisik
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
              <UFormField label="Nama Ayah" name="namaAyah">
                <UInput
                  v-model="state.namaAyah"
                  placeholder="Masukkan Nama Ayah"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Suku" name="suku">
                <UInput
                  v-model="state.suku"
                  placeholder="Contoh: Jawa, Sunda, dll."
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Anak Ke" name="anakKe">
                <UInputNumber
                  v-model="state.anakKe"
                  placeholder="Contoh: 1"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Dari Bersaudara" name="dariBersaudara">
                <UInputNumber
                  v-model="state.dariBersaudara"
                  placeholder="Contoh: 3"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Tinggi Badan (cm)" name="tinggi">
                <UInputNumber
                  v-model="state.tinggi"
                  placeholder="Contoh: 170"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Berat Badan (kg)" name="berat">
                <UInputNumber
                  v-model="state.berat"
                  placeholder="Contoh: 65"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField name="perokok" class="md:col-span-2">
                <UCheckbox
                  v-model="state.perokok"
                  label="Saya seorang perokok"
                  :disabled="isLoading"
                />
              </UFormField>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-briefcase" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Pendidikan & Pekerjaan
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
              <UFormField label="Pendidikan Terakhir" name="pendidikan">
                <UInput
                  v-model="state.pendidikan"
                  placeholder="Contoh: S1, SMA"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Jurusan" name="jurusan">
                <UInput
                  v-model="state.jurusan"
                  placeholder="Contoh: Teknik Informatika"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Pekerjaan" name="pekerjaan">
                <UInput
                  v-model="state.pekerjaan"
                  placeholder="Contoh: Software Engineer"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Estimasi Gaji" name="gaji">
                <UInputNumber
                  v-model="state.gaji"
                  placeholder="Contoh: 5000000"
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
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-lucide-heart" class="size-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Preferensi Tambahan
              </h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 dark:border-gray-800 pt-5">
              <UFormField label="Hobi" name="hobi">
                <UInput
                  v-model="state.hobi"
                  placeholder="Contoh: Membaca, Olahraga"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Kriteria Pasangan" name="kriteria">
                <UInput
                  v-model="state.kriteria"
                  placeholder="Masukkan Kriteria Pasangan"
                  :disabled="isLoading"
                />
              </UFormField>
              <UFormField label="Deskripsi Diri" name="deskripsi" class="md:col-span-2">
                <UTextarea
                  v-model="state.deskripsi"
                  :rows="4"
                  placeholder="Ceritakan tentang diri Anda"
                  :disabled="isLoading"
                  autoresize
                />
              </UFormField>
            </div>
          </div>

          <div class="flex justify-end gap-4 border-t border-gray-100 dark:border-gray-800 pt-6 mt-8">
            <UButton type="submit" :loading="isLoading">
              Simpan Profil
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>
