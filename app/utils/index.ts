import type { CalendarDate } from "@internationalized/date";
import { getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function ObjectAssign<T extends object>(data: T, patchData: Partial<T>): T {
  return Object.assign(data, patchData);
}

export function formatDateIndo(value: string | Date | null) {
  if (!value)
    return "-";

  return format(new Date(value), "d MMMM yyyy", {
    locale: id,
  });
}

export function formatTanggal(tanggal: CalendarDate) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(tanggal.toDate(getLocalTimeZone()));
};
