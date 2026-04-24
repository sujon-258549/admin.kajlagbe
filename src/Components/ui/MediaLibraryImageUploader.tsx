import { useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages,
  faPlus,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import MediaLibraryPickerModal from "../modal/media/MediaLibraryPickerModal";
import type { TMediaImage } from "../types";

type BaseUploaderProps = {
  disabled?: boolean;
  pickerTitle?: string;
  pickerOkText?: string;
  emptyLabel?: string;
  /** Tooltip on single preview hover (bottom chip). */
  changeHoverLabel?: string;
  className?: string;
  /** When `isMulti` is true, max images user can tick in one library visit (see `MediaLibraryPickerModal`). */
  maxSelection?: number;
};

/** Default: one URL. Omit `isMulti` or `isMulti={false}` — one image at a time. */
export type MediaLibraryImageUploaderSingleProps = BaseUploaderProps & {
  isMulti?: false;
  value?: string | null;
  onChange?: (url: string, id?: string) => void;
};

/** Many URLs: `isMulti={true}` — multi-select in the library + `string[]` value/onChange. */
export type MediaLibraryImageUploaderMultiProps = BaseUploaderProps & {
  isMulti: true;
  value?: string[];
  onChange?: (urls: string[], ids?: string[]) => void;
};

export type MediaLibraryImageUploaderProps =
  | MediaLibraryImageUploaderSingleProps
  | MediaLibraryImageUploaderMultiProps;

const box = "h-40 w-40 shrink-0";
const thumb = "h-32 w-32 shrink-0";
const addTile = "h-32 w-32 shrink-0";

/** Fills a square frame without gray letterboxing (object-cover + block img). */
const previewImgClass =
  "pointer-events-none block h-full w-full min-h-0 min-w-0 object-cover select-none";

function urlsFromImages(images: TMediaImage[]): string[] {
  const out: string[] = [];
  for (const img of images) {
    const u = img.url?.trim();
    if (u) out.push(u);
  }
  return out;
}

function MediaLibraryImageUploaderSingle({
  value,
  onChange,
  disabled = false,
  pickerTitle = "Media library",
  pickerOkText = "Use this image",
  emptyLabel = "Upload Image",
  changeHoverLabel = "Change",
  className = "",
}: MediaLibraryImageUploaderSingleProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const url = typeof value === "string" ? value.trim() : "";
  const hasImage = Boolean(url);

  const applyUrl = useCallback(
    (next: string, id?: string) => {
      onChange?.(next, id);
    },
    [onChange],
  );

  const handleConfirm = useCallback(
    (images: TMediaImage[]) => {
      const pickedUrl = images[0]?.url?.trim();
      const pickedId = images[0]?.id;
      if (pickedUrl) applyUrl(pickedUrl, pickedId);
    },
    [applyUrl],
  );

  const openPicker = useCallback(() => {
    if (!disabled) setPickerOpen(true);
  }, [disabled]);

  return (
    <>
      <div className={`flex ${className}`.trim()}>
        {hasImage ? (
          <div
            className={`relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 shadow-sm ring-1 ring-gray-200/80 ${box}`}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={openPicker}
              aria-label="Change image"
              title="Change image"
              className="group relative z-0 block h-full w-full overflow-hidden p-0 text-left transition hover:ring-2 hover:ring-inset hover:ring-[#052e16]/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#052e16] disabled:pointer-events-none disabled:opacity-60"
            >
              <img src={url} alt="" className={previewImgClass} />
              <div
                className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/25"
                aria-hidden
              />
              <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-white/95 p-1 shadow-md ring-1 ring-gray-200/90">
                <FontAwesomeIcon icon={faImages} className="text-sm text-[#052e16]" />
              </div>
              <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                {changeHoverLabel}
              </span>
            </button>
            <button
              type="button"
              disabled={disabled}
              aria-label="Remove image"
              title="Remove image"
              className="absolute right-2 top-2 z-10 rounded-md bg-white/95 p-1.5 shadow-md ring-1 ring-gray-200/90 transition hover:bg-red-50 hover:ring-red-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:pointer-events-none disabled:opacity-60"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                applyUrl("");
              }}
            >
              <FontAwesomeIcon icon={faTrash} className="text-sm text-red-600" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={openPicker}
            aria-label="Open media library to upload or choose image"
            className={`group flex ${box} flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-[#fafafa] p-2 text-center transition-all duration-300 hover:border-[#052e16]/45 hover:bg-emerald-50/50 hover:shadow-md active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#052e16]/30 disabled:pointer-events-none disabled:opacity-60`}
          >
            <FontAwesomeIcon
              icon={faUpload}
              className="text-3xl text-slate-400 transition-colors duration-300 group-hover:text-[#052e16]"
            />
            <span className="text-sm font-semibold text-slate-500 transition-colors duration-300 group-hover:text-[#052e16]">
              {emptyLabel}
            </span>
          </button>
        )}
      </div>

      <MediaLibraryPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple={false}
        title={pickerTitle}
        okText={pickerOkText}
        onConfirm={handleConfirm}
      />
    </>
  );
}

function MediaLibraryImageUploaderMulti({
  value,
  onChange,
  disabled = false,
  pickerTitle = "Media library",
  pickerOkText = "Use selected",
  emptyLabel = "Upload images",
  className = "",
  maxSelection,
}: MediaLibraryImageUploaderMultiProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const urls = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean);
  }, [value]);

  const applyUrls = useCallback(
    (next: string[], nextIds?: string[]) => {
      onChange?.(next, nextIds);
    },
    [onChange],
  );

  const handleConfirm = useCallback(
    (images: TMediaImage[]) => {
      const pickedUrls = urlsFromImages(images);
      const pickedIds = images.map(img => img.id).filter(Boolean) as string[];
      if (pickedUrls.length === 0) return;

      const mergedUrls: string[] = [...urls];
      for (const p of pickedUrls) {
        if (!mergedUrls.includes(p)) mergedUrls.push(p);
      }
      // For IDs, it's a bit trickier since we only have URLs in 'value' (urls).
      // If we want to maintain IDs, we'd need them in 'value' too.
      // For now, let's just pass the newly picked IDs alongside the URLs.
      applyUrls(mergedUrls, pickedIds);
    },
    [applyUrls, urls],
  );

  const openPicker = useCallback(() => {
    if (!disabled) setPickerOpen(true);
  }, [disabled]);

  const removeAt = useCallback(
    (index: number) => {
      applyUrls(urls.filter((_, i) => i !== index));
    },
    [applyUrls, urls],
  );

  const hasAny = urls.length > 0;

  return (
    <>
      <div className={`flex flex-wrap items-start gap-3 ${className}`.trim()}>
        {hasAny ? (
          <>
            {urls.map((u, idx) => (
              <div
                key={`${u}-${idx}`}
                className={`relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 shadow-sm ring-1 ring-gray-200/80 ${thumb}`}
              >
                <img src={u} alt="" className={previewImgClass} />
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`Remove image ${idx + 1}`}
                  title="Remove"
                  className="absolute right-1 top-1 z-10 rounded-md bg-white/95 p-1 shadow-md ring-1 ring-gray-200/90 transition hover:bg-red-50 hover:ring-red-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:pointer-events-none disabled:opacity-60"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeAt(idx);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-xs text-red-600" />
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={disabled}
              onClick={openPicker}
              aria-label="Add more images from media library"
              className={`group flex ${addTile} flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-[#fafafa] text-center transition-all hover:border-[#052e16]/45 hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#052e16]/30 disabled:pointer-events-none disabled:opacity-60`}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="text-2xl text-slate-400 transition-colors group-hover:text-[#052e16]"
              />
              <span className="text-xs font-semibold text-slate-500 group-hover:text-[#052e16]">Add</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={openPicker}
            aria-label="Open media library to upload or choose images"
            className={`group flex ${box} flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-[#fafafa] p-2 text-center transition-all hover:border-[#052e16]/45 hover:bg-emerald-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#052e16]/30 disabled:pointer-events-none disabled:opacity-60`}
          >
            <FontAwesomeIcon
              icon={faUpload}
              className="text-3xl text-slate-400 transition-colors group-hover:text-[#052e16]"
            />
            <span className="text-sm font-semibold text-slate-500 transition-colors group-hover:text-[#052e16]">
              {emptyLabel}
            </span>
          </button>
        )}
      </div>

      <MediaLibraryPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple
        maxSelection={maxSelection}
        title={pickerTitle}
        okText={pickerOkText}
        onConfirm={handleConfirm}
      />
    </>
  );
}

/**
 * Pick or upload images via the media library modal.
 *
 * - **Single (default):** omit `isMulti` or `isMulti={false}` — `value` is `string`, `onChange(url)`.
 * - **Multi:** `isMulti={true}` — `value` is `string[]`, `onChange(urls)`; each confirm **merges** new URLs (deduped).
 */
export default function MediaLibraryImageUploader(props: MediaLibraryImageUploaderProps) {
  if (props.isMulti === true) {
    return <MediaLibraryImageUploaderMulti {...props} />;
  }
  return <MediaLibraryImageUploaderSingle {...props} />;
}
