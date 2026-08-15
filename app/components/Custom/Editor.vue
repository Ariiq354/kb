<script setup lang="ts">
import type { EditorToolbarItem } from "@nuxt/ui";
import Underline from "@tiptap/extension-underline";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    placeholder?: string;
    disabled?: boolean;
    minHeight?: string;
  }>(),
  {
    modelValue: "",
    placeholder: "Tulis konten detail di sini...",
    disabled: false,
    minHeight: "220px",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const content = computed({
  get: () => props.modelValue ?? "",
  set: (val: string) => emit("update:modelValue", val),
});

const customExtensions = [Underline];

const toolbarItems: EditorToolbarItem[][] = [
  [
    { kind: "undo", icon: "i-lucide-undo", tooltip: { text: "Undo" } },
    { kind: "redo", icon: "i-lucide-redo", tooltip: { text: "Redo" } },
  ],
  [
    { kind: "paragraph", icon: "i-lucide-pilcrow", tooltip: { text: "Paragraph" } },
    { kind: "heading", level: 1, icon: "i-lucide-heading-1", tooltip: { text: "Heading 1" } },
    { kind: "heading", level: 2, icon: "i-lucide-heading-2", tooltip: { text: "Heading 2" } },
    { kind: "heading", level: 3, icon: "i-lucide-heading-3", tooltip: { text: "Heading 3" } },
  ],
  [
    { kind: "mark", mark: "bold", icon: "i-lucide-bold", tooltip: { text: "Tebal (Bold)" } },
    { kind: "mark", mark: "italic", icon: "i-lucide-italic", tooltip: { text: "Miring (Italic)" } },
    { kind: "mark", mark: "underline", icon: "i-lucide-underline", tooltip: { text: "Garis Bawah (Underline)" } },
    { kind: "mark", mark: "strike", icon: "i-lucide-strikethrough", tooltip: { text: "Coret (Strikethrough)" } },
  ],
  [
    { kind: "bulletList", icon: "i-lucide-list", tooltip: { text: "Daftar Poin (Bullet List)" } },
    { kind: "orderedList", icon: "i-lucide-list-ordered", tooltip: { text: "Daftar Nomor (Numbered List)" } },
    { kind: "blockquote", icon: "i-lucide-quote", tooltip: { text: "Kutipan (Blockquote)" } },
    { kind: "horizontalRule", icon: "i-lucide-minus", tooltip: { text: "Garis Pemisah (Divider)" } },
  ],
  [
    { kind: "link", icon: "i-lucide-link", tooltip: { text: "Tautan (Link)" } },
    { kind: "clearFormatting", icon: "i-lucide-remove-formatting", tooltip: { text: "Hapus Format" } },
  ],
];
</script>

<template>
  <div
    class="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 overflow-hidden"
    :class="{ 'opacity-60 cursor-not-allowed': disabled }"
  >
    <UEditor
      v-slot="{ editor }"
      v-model="content"
      content-type="html"
      :placeholder="placeholder"
      :editable="!disabled"
      :extensions="customExtensions"
      :starter-kit="{
        horizontalRule: {},
      }"
      :ui="{
        root: 'flex flex-col',
        base: 'p-3.5 prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px]',
      }"
    >
      <div class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 px-2 py-1.5 flex flex-wrap items-center gap-1">
        <UEditorToolbar
          :editor="editor"
          :items="toolbarItems"
          size="xs"
        />
      </div>
    </UEditor>
  </div>
</template>
