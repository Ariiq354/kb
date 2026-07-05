<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
useHead({
  title: "Profil User",
});

const toast = useToast();
const { session } = await useAuthSession();
const userId = computed(() => session.value?.user?.id);
const profileId = ref<number | null>(null); // Used to track if profile already exists

const state = reactive({
  kodeUser: "",
  statusKawin: "",
  tanggalLahir: "",
  kelurahan: "",
  gender: "Laki-laki",
  kecamatan: "",
  kota: "",
  provinsi: "",
  namaAyah: "",
  anakKe: 1,
  dariBersaudara: 1,
  suku: "",
  pendidikan: "",
  pekerjaan: "",
  jurusan: "",
  tinggi: 160,
  berat: 60,
  hobi: "",
  instagram: "",
  kriteria: "",
  perokok: false,
  gaji: 0,
  agama: "",
  deskripsi: "",
  file: undefined as FileList | undefined,
});

const isSubmitting = ref(false);

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.length) {
    state.file = target.files;
  }
}

async function onSubmit() {
  if (!userId.value)
    return toast.add({ title: "User tidak ditemukan", color: "red" });

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append("kodeUser", state.kodeUser);
    formData.append("userId", String(userId.value));
    formData.append("statusKawin", state.statusKawin);
    formData.append("tanggalLahir", state.tanggalLahir);
    formData.append("kelurahan", state.kelurahan);
    formData.append("gender", state.gender);
    formData.append("kecamatan", state.kecamatan);
    formData.append("kota", state.kota);
    formData.append("provinsi", state.provinsi);
    formData.append("namaAyah", state.namaAyah);
    formData.append("anakKe", String(state.anakKe));
    formData.append("dariBersaudara", String(state.dariBersaudara));
    formData.append("suku", state.suku);
    formData.append("pendidikan", state.pendidikan);
    formData.append("pekerjaan", state.pekerjaan);
    formData.append("jurusan", state.jurusan);
    formData.append("tinggi", String(state.tinggi));
    formData.append("berat", String(state.berat));
    formData.append("hobi", state.hobi);
    formData.append("instagram", state.instagram);
    formData.append("kriteria", state.kriteria);
    formData.append("perokok", String(state.perokok));
    formData.append("gaji", String(state.gaji));
    formData.append("agama", state.agama);
    formData.append("deskripsi", state.deskripsi);

    if (state.file && state.file.length > 0) {
      formData.append("file", state.file[0]);
    }

    if (profileId.value) {
      await $fetch(`/api/v1/user-profile/${profileId.value}`, {
        method: "PATCH",
        body: formData,
      });
      toast.add({ title: "Profil berhasil diperbarui" });
    }
    else {
      await $fetch("/api/v1/user-profile", {
        method: "POST",
        body: formData,
      });
      toast.add({ title: "Profil berhasil dibuat" });
    }
  }
  catch (e: any) {
    toast.add({ title: "Terjadi kesalahan", description: e.data?.message || e.message, color: "red" });
  }
  finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Profil
      </h1>
    </div>

    <UCard>
      <UForm :state="state" class="space-y-6" @submit="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Kode User" name="kodeUser" required>
            <UInput v-model="state.kodeUser" placeholder="Masukkan kode user" />
          </UFormGroup>

          <UFormGroup label="Foto Profil" name="file" :required="!profileId">
            <UInput type="file" accept="image/*" @change="onFileChange" />
          </UFormGroup>

          <UFormGroup label="Tanggal Lahir" name="tanggalLahir" required>
            <UInput v-model="state.tanggalLahir" type="date" />
          </UFormGroup>

          <UFormGroup label="Gender" name="gender" required>
            <USelectMenu v-model="state.gender" :options="['Laki-laki', 'Perempuan']" />
          </UFormGroup>

          <UFormGroup label="Status Kawin" name="statusKawin" required>
            <UInput v-model="state.statusKawin" placeholder="Belum Kawin / Kawin / Cerai" />
          </UFormGroup>

          <UFormGroup label="Agama" name="agama">
            <UInput v-model="state.agama" placeholder="Agama" />
          </UFormGroup>
        </div>

        <UDivider label="Lokasi & Kontak" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Provinsi" name="provinsi" required>
            <UInput v-model="state.provinsi" placeholder="Provinsi" />
          </UFormGroup>

          <UFormGroup label="Kota/Kabupaten" name="kota" required>
            <UInput v-model="state.kota" placeholder="Kota" />
          </UFormGroup>

          <UFormGroup label="Kecamatan" name="kecamatan" required>
            <UInput v-model="state.kecamatan" placeholder="Kecamatan" />
          </UFormGroup>

          <UFormGroup label="Kelurahan" name="kelurahan" required>
            <UInput v-model="state.kelurahan" placeholder="Kelurahan" />
          </UFormGroup>

          <UFormGroup label="Instagram" name="instagram" required>
            <UInput v-model="state.instagram" placeholder="@username" />
          </UFormGroup>
        </div>

        <UDivider label="Keluarga & Fisik" />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UFormGroup label="Nama Ayah" name="namaAyah" required>
            <UInput v-model="state.namaAyah" placeholder="Nama Ayah" />
          </UFormGroup>

          <UFormGroup label="Suku" name="suku" required>
            <UInput v-model="state.suku" placeholder="Suku" />
          </UFormGroup>

          <UFormGroup label="Anak Ke" name="anakKe" required>
            <UInput v-model="state.anakKe" type="number" />
          </UFormGroup>

          <UFormGroup label="Dari Berapa Bersaudara" name="dariBersaudara" required>
            <UInput v-model="state.dariBersaudara" type="number" />
          </UFormGroup>

          <UFormGroup label="Tinggi Badan (cm)" name="tinggi" required>
            <UInput v-model="state.tinggi" type="number" />
          </UFormGroup>

          <UFormGroup label="Berat Badan (kg)" name="berat" required>
            <UInput v-model="state.berat" type="number" />
          </UFormGroup>
        </div>

        <UDivider label="Pendidikan & Pekerjaan" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Pendidikan" name="pendidikan" required>
            <UInput v-model="state.pendidikan" placeholder="Pendidikan Terakhir" />
          </UFormGroup>

          <UFormGroup label="Jurusan" name="jurusan" required>
            <UInput v-model="state.jurusan" placeholder="Jurusan" />
          </UFormGroup>

          <UFormGroup label="Pekerjaan" name="pekerjaan" required>
            <UInput v-model="state.pekerjaan" placeholder="Pekerjaan" />
          </UFormGroup>

          <UFormGroup label="Gaji" name="gaji">
            <UInput v-model="state.gaji" type="number" placeholder="Estimasi Gaji" />
          </UFormGroup>
        </div>

        <UDivider label="Preferensi Tambahan" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Hobi" name="hobi" required>
            <UInput v-model="state.hobi" placeholder="Hobi Anda" />
          </UFormGroup>

          <UFormGroup label="Kriteria Pasangan" name="kriteria" required>
            <UInput v-model="state.kriteria" placeholder="Kriteria" />
          </UFormGroup>

          <UFormGroup label="Status Perokok" name="perokok">
            <UCheckbox v-model="state.perokok" label="Saya seorang perokok" />
          </UFormGroup>
        </div>

        <UFormGroup label="Deskripsi Diri" name="deskripsi">
          <UTextarea v-model="state.deskripsi" placeholder="Ceritakan tentang diri Anda..." />
        </UFormGroup>

        <div class="flex justify-end">
          <UButton type="submit" color="primary" :loading="isSubmitting">
            Simpan Profil
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
