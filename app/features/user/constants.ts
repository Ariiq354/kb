import type { TableColumn } from "@nuxt/ui";
import type { UserRepo } from "~~/server/modules/users/repo";
import { h } from "vue";
import { UAvatar, UBadge } from "#components";
import { formatDateIndo } from "~/utils";

export type UserDetail = NonNullable<Awaited<ReturnType<typeof UserRepo.findById>>>;

export const columns: TableColumn<any>[] = [
  {
    accessorKey: "kodeUser",
    header: "Kode Anggota",
    cell: ({ row }) => {
      return h(
        "span",
        { class: "font-mono font-semibold text-gray-700 dark:text-gray-300" },
        row.original.kodeUser || "-",
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const config = useRuntimeConfig();
      return h("div", { class: "flex items-center gap-3" }, [
        h(UAvatar, {
          src: row.original.image ? `${config.public.imageUrl}/${row.original.image}` : undefined,
          alt: row.original.name,
          size: "sm",
          class: "bg-gray-100 dark:bg-gray-800",
        }),
        h("span", { class: "font-medium text-gray-900 dark:text-white" }, row.original.name),
      ]);
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "noTelepon",
    header: "No. Telepon",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      if (row.original.gender) {
        return h(
          UBadge,
          {
            color: row.original.gender === "Laki-laki" ? "primary" : "secondary",
            variant: "subtle",
            size: "sm",
          },
          () => row.original.gender,
        );
      }
      return h("span", { class: "text-gray-400" }, "-");
    },
  },
  {
    accessorKey: "createdAt",
    header: "Terdaftar Pada",
    cell: ({ row }) => formatDateIndo(row.original.createdAt),
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      return h(
        UBadge,
        {
          color: row.original.banned ? "error" : "success",
          variant: "subtle",
          size: "sm",
        },
        () => (row.original.banned ? "Banned" : "Aktif"),
      );
    },
  },
];
