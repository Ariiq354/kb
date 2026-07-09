<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { Schema } from "../constants";
import { FetchError } from "ofetch";
import InputCalendar from "~/components/Custom/InputCalendar.vue";
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
async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true;

  try {
    const isEdit = !!state.value.id;
    const url = `/api/v1/diskon/${isEdit ? state.value.id : ""}`;

    await $fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: {
        ...event.data,
        batasWaktu: event.data.batasWaktu.toString(),
      },
    });

    useToastSuccess("Sukses", "Data berhasill diubah");
    openModel.value = false;
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Submit Failed", error.data.message);
    }
    else {
      useToastError("Submit Failed", "Internal Server Error");
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
    title="Tambah Pengeluaran"
    class="max-w-4xl"
  >
    <template #body>
      <UForm
        id="form"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Kode" name="kode">
          <UInput
            v-model="state.kode"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Persen" name="persen">
          <UInputNumber
            v-model="state.persen"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Batas Waktu" name="batasWaktu">
          <InputCalendar
            v-model="state.batasWaktu"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField label="Batas Pemakai" name="batasPemakai">
          <UInputNumber
            v-model="state.batasPemakai"
            :disabled="isLoading"
          />
        </UFormField>
        <UFormField name="status">
          <USwitch
            v-model="state.status"
            label="Status"
            :disabled="isLoading"
          />
        </UFormField>
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
        form="form"
      >
        Simpan
      </UButton>
    </template>
  </LazyUModal>
</template>
