export const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const mapSortOrderToAria = (order: "asc" | "desc" | undefined) => {
  if (order === "asc") return "ascending";
  if (order === "desc") return "descending";
  return "none";
};
