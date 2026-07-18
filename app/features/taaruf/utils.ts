export function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "warning";
    case "APPROVED":
    case "PROFILE_EXCHANGE":
    case "TAARUF":
      return "primary";
    case "MARRIED":
      return "success";
    case "REJECTED":
    case "CANCELLED":
    default:
      return "error";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Menunggu Persetujuan";
    case "APPROVED":
      return "Disetujui Admin";
    case "PROFILE_EXCHANGE":
      return "Pertukaran CV / Biodata";
    case "TAARUF":
      return "Sedang Ta'aruf";
    case "MARRIED":
      return "Sudah Menikah";
    case "REJECTED":
      return "Ditolak";
    case "CANCELLED":
      return "Dibatalkan";
    default:
      return status;
  }
}
