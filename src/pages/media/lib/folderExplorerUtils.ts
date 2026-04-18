import type { TFolder } from "../../../Components/types";

/** `?folder=` query value (name, slug, or legacy UUID). */
export const FOLDER_SEARCH_PARAM = "folder";

export const UUID_IN_URL_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function resolveFolderQueryToId(
  raw: string | null,
  folders: TFolder[],
): string | null {
  if (raw == null || raw.trim() === "") return null;
  const t = raw.trim();
  if (UUID_IN_URL_RE.test(t)) {
    const byId = folders.find((f) => f.id === t);
    return byId?.id ?? null;
  }
  const byName = folders.find((f) => f.name === t);
  if (byName) return byName.id;
  const bySlug = folders.find((f) => f.slug === t);
  return bySlug?.id ?? null;
}
