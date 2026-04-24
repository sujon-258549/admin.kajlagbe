import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faFolder,
  faImage,
  faRotateRight,
  faThumbtack,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../../ui/Button";
import CustomCheckbox from "../../ui/Checkbox";
import ModalHeader from "../../common/ModalHeader";
import { LibraryImageThumb } from "../../../pages/media/components/LibraryImageThumb";
import { useGetAllFoldersQuery } from "../../../redux/features/folderApi/folderApi";
import {
  useCreateImageMutation,
  useGetImagesQuery,
} from "../../../redux/features/mediaApi/mediaApi";
import { uploadMediaImage } from "../../utils/imageUpload";
import type { TFolder, TMediaImage } from "../../types";
import FolderSkeleton from "../../skeleton/FolderSkeleton";

export type MediaLibraryPickerModalProps = {
  open: boolean;
  onClose: () => void;
  /** Selected rows from the media library (after user clicks OK). */
  onConfirm: (images: TMediaImage[]) => void;
  /** Allow more than one image. */
  multiple?: boolean;
  /** When `multiple` is true, cap selection (omit for unlimited). */
  maxSelection?: number;
  title?: string;
  okText?: string;
};

const parentKey = (id: string | null | undefined) =>
  id == null || id === "" ? null : id;

/** Match DB row to Cloudinary URL after refetch (query params / trailing slash may differ). */
function urlMatchKey(u: string): string {
  const t = u.trim();
  try {
    const x = new URL(t);
    return `${x.origin}${x.pathname}`.toLowerCase();
  } catch {
    return t.toLowerCase();
  }
}

function coerceRecordId(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  return null;
}

function pickImageUrlFromRecord(r: Record<string, unknown>): string | null {
  const u = r.url ?? r.secureUrl ?? r.secure_url;
  return typeof u === "string" && u.trim() ? u.trim() : null;
}

function getImageListFromQueryPayload(body: unknown): TMediaImage[] {
  if (!body || typeof body !== "object") return [];
  const o = body as Record<string, unknown>;
  if (Array.isArray(o.data)) return o.data as TMediaImage[];
  return [];
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const err = error as { data?: { message?: string }; message?: string };
    return err.data?.message || err.message || "Something went wrong";
  }
  return "Something went wrong";
}

function normalizeCreatedRow(
  partial: Partial<TMediaImage> & { id: string; url: string; name: string },
): TMediaImage {
  return {
    id: partial.id,
    name: partial.name,
    url: partial.url,
    folderId: partial.folderId ?? null,
    slug: partial.slug ?? partial.name,
    status: partial.status !== false,
    createdAt: partial.createdAt ?? "",
    updatedAt: partial.updatedAt,
  };
}

/** Parse POST upload-image response so we can auto-select and show the new row immediately. */
function extractCreatedImageRow(res: unknown): TMediaImage | null {
  if (!res || typeof res !== "object") return null;
  const o = res as Record<string, unknown>;
  const tryRow = (raw: unknown): TMediaImage | null => {
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    const idStr = coerceRecordId(r.id);
    const urlStr = pickImageUrlFromRecord(r);
    if (idStr && urlStr) {
      const name = typeof r.name === "string" && r.name.trim() ? r.name : "Image";
      return normalizeCreatedRow(
        { ...r, id: idStr, url: urlStr, name } as Partial<TMediaImage> & {
          id: string;
          url: string;
          name: string;
        },
      );
    }
    return null;
  };
  const direct = tryRow(o);
  if (direct) return direct;
  const fromData = tryRow(o.data);
  if (fromData) return fromData;
  const data = o.data;
  if (data && typeof data === "object" && "data" in data) {
    return tryRow((data as Record<string, unknown>).data);
  }
  return null;
}

function extractCreatedImageId(res: unknown): string | null {
  const row = extractCreatedImageRow(res);
  if (row) return row.id;
  if (!res || typeof res !== "object") return null;
  const o = res as Record<string, unknown>;
  const pickId = (v: unknown): string | null => {
    if (!v || typeof v !== "object") return null;
    const r = v as Record<string, unknown>;
    return coerceRecordId(r.id);
  };
  return pickId(o.data) ?? pickId(o);
}

/**
 * Browse folders + images like the Media page, pick rows with checkboxes,
 * upload new files to the current folder, then confirm selection.
 */
export default function MediaLibraryPickerModal({
  open,
  onClose,
  onConfirm,
  multiple = true,
  maxSelection,
  title = "Media library",
  okText = "Use selected",
}: MediaLibraryPickerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  /** Rows from upload response until GET list catches up — keeps checkbox selected on the new card. */
  const [pendingUploaded, setPendingUploaded] = useState<TMediaImage[]>([]);

  const {
    data: foldersData,
    isLoading: foldersLoading,
    isFetching: foldersFetching,
    refetch: refetchFolders,
  } = useGetAllFoldersQuery({}, { skip: !open });

  const [createImage] = useCreateImageMutation();

  const folders: TFolder[] = useMemo(() => {
    const d = foldersData?.data;
    if (Array.isArray(d)) return d;
    if (
      d &&
      typeof d === "object" &&
      Array.isArray((d as { folders?: unknown }).folders)
    ) {
      return (d as { folders: TFolder[] }).folders;
    }
    return [];
  }, [foldersData]);

  const folderById = useMemo(() => {
    const map = new Map<string, TFolder>();
    folders.forEach((f) => map.set(f.id, f));
    return map;
  }, [folders]);

  const currentPath = useMemo(() => {
    if (!currentFolderId) return [];
    const path: TFolder[] = [];
    let node: TFolder | null | undefined = folderById.get(currentFolderId);
    while (node) {
      path.unshift(node);
      node = node.parentId ? folderById.get(node.parentId) : undefined;
    }
    return path;
  }, [currentFolderId, folderById]);

  const currentFolders = useMemo(
    () =>
      folders.filter(
        (f) => parentKey(f.parentId) === parentKey(currentFolderId),
      ),
    [folders, currentFolderId],
  );

  const parentFolder = currentFolderId ? folderById.get(currentFolderId) : null;

  const { data: imagesResponse, isLoading: imagesLoading, refetch: refetchImages } =
    useGetImagesQuery(
      { folderId: currentFolderId ?? null },
      { skip: !open },
    );

  const libraryImages: TMediaImage[] = useMemo(
    () => (Array.isArray(imagesResponse?.data) ? imagesResponse.data : []),
    [imagesResponse?.data],
  );

  useEffect(() => {
    setPendingUploaded((prev) =>
      prev.filter((p) => !libraryImages.some((img) => img.id === p.id)),
    );
  }, [libraryImages]);

  const displayLibraryImages = useMemo(() => {
    const cid = parentKey(currentFolderId);
    const ids = new Set(libraryImages.map((i) => i.id));
    const extra = pendingUploaded.filter(
      (p) => parentKey(p.folderId) === cid && !ids.has(p.id),
    );
    return [...libraryImages, ...extra];
  }, [libraryImages, pendingUploaded, currentFolderId]);

  const pathSubtitle = useMemo(() => {
    if (currentPath.length === 0) return "All Folders";
    return ["All Folders", ...currentPath.map((n) => n.name)].join(" / ");
  }, [currentPath]);

  const getSubtitleForFolder = useCallback(
    (folder: TFolder) => {
      if (!folder.parentId) return "All Folders";
      const parts: string[] = ["All Folders"];
      let p: TFolder | undefined = folderById.get(folder.parentId);
      const stack: string[] = [];
      while (p) {
        stack.unshift(p.name);
        p = p.parentId ? folderById.get(p.parentId) : undefined;
      }
      parts.push(...stack);
      return parts.join("\\");
    },
    [folderById],
  );

  const busy = foldersLoading || foldersFetching;

  useEffect(() => {
    if (!open) return;
    setCurrentFolderId(null);
    setSelectedIds(new Set());
    setPendingUploaded([]);
  }, [open]);

  const goToFolder = useCallback((id: string | null) => {
    setCurrentFolderId(id);
    setSelectedIds(new Set());
  }, []);

  const toggleImage = useCallback(
    (img: TMediaImage) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(img.id)) {
          next.delete(img.id);
          return next;
        }
        if (!multiple) {
          return new Set([img.id]);
        }
        if (maxSelection != null && next.size >= maxSelection) {
          message.warning(`You can select at most ${maxSelection} image(s).`);
          return prev;
        }
        next.add(img.id);
        return next;
      });
    },
    [multiple, maxSelection],
  );

  const handlePickFiles = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const picked = input.files ? Array.from(input.files) : [];
    input.value = "";
    if (picked.length === 0) return;

    const imageFiles = picked.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      message.error("Please choose image files.");
      return;
    }

    setUploading(true);
    let ok = 0;
    let fail = 0;
    let lastMessage = "";
    const uploadedIds: string[] = [];
    const newPendingRows: TMediaImage[] = [];
    const uploadedPublicUrls: string[] = [];
    try {
      for (const file of imageFiles) {
        try {
          const { result: res, publicUrl } = await uploadMediaImage(
            file,
            currentFolderId,
            (payload) => createImage(payload).unwrap(),
          );
          uploadedPublicUrls.push(publicUrl);
          const row = extractCreatedImageRow(res);
          if (row) {
            uploadedIds.push(row.id);
            newPendingRows.push(row);
          } else {
            const newId = extractCreatedImageId(res);
            if (newId) uploadedIds.push(newId);
          }
          ok += 1;
        } catch (err: unknown) {
          fail += 1;
          lastMessage = getErrorMessage(err);
        }
      }
    } finally {
      setUploading(false);
    }

    if (ok > 0) {
      if (newPendingRows.length > 0) {
        setPendingUploaded((prev) => {
          const m = new Map([...prev, ...newPendingRows].map((r) => [r.id, r]));
          return [...m.values()];
        });
      }
      await refetchFolders();
      const refetchResult = await refetchImages();
      const freshList = getImageListFromQueryPayload(refetchResult.data);
      const idByUrlKey = new Map<string, string>();
      for (const img of freshList) {
        if (typeof img.url === "string" && img.url.trim()) {
          idByUrlKey.set(urlMatchKey(img.url), img.id);
        }
      }
      const idsFromUrls: string[] = [];
      for (const u of uploadedPublicUrls) {
        const id = idByUrlKey.get(urlMatchKey(u));
        if (id) idsFromUrls.push(id);
      }
      const mergedIds = [...new Set([...uploadedIds, ...idsFromUrls])];
      if (mergedIds.length > 0) {
        setSelectedIds((prev) => {
          if (!multiple) {
            const last = mergedIds[mergedIds.length - 1];
            return last ? new Set([last]) : prev;
          }
          const next = new Set(prev);
          for (const id of mergedIds) {
            if (maxSelection != null && next.size >= maxSelection) break;
            next.add(id);
          }
          return next;
        });
      }
    }
    if (fail === 0 && ok > 0) {
      message.success(ok === 1 ? "Image uploaded." : `${ok} images uploaded.`);
    } else if (ok > 0 && fail > 0) {
      message.warning(`${ok} uploaded, ${fail} failed. ${lastMessage}`);
    } else if (fail > 0) {
      message.error(lastMessage || "Upload failed.");
    }
  };

  const handleConfirm = () => {
    const selected = displayLibraryImages.filter((img) => selectedIds.has(img.id));
    if (selected.length === 0) {
      message.warning("Select at least one image.");
      return;
    }
    onConfirm(selected);
    onClose();
  };

  const handleRefresh = () => {
    void refetchFolders();
    void refetchImages();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={960}
      centered
      destroyOnClose
      zIndex={1100}
      styles={{
        body: { padding: 0, maxHeight: "82vh", overflow: "hidden" },
      }}
      title={
        <ModalHeader
          title={title}
          subTitle="Folders, images, upload from PC — check images then confirm."
          center={false}
        />
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />

      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-sm">
        <span className="font-semibold text-gray-700 shrink-0">Path:</span>
        <button
          type="button"
          className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
            currentFolderId === null
              ? "bg-primary/10 text-primary"
              : "text-gray-600 hover:bg-gray-100 hover:text-primary"
          }`}
          onClick={() => goToFolder(null)}
        >
          All Folders
        </button>
        {currentPath.map((node) => (
          <span key={node.id} className="flex items-center gap-2 text-gray-400">
            <span>/</span>
            <button
              type="button"
              className={`rounded-md px-2 py-0.5 font-medium transition-colors ${
                currentFolderId === node.id
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={() => goToFolder(node.id)}
            >
              {node.name}
            </button>
          </span>
        ))}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">
            {selectedIds.size} selected
            {!multiple ? " (single)" : ""}
          </span>
          <CustomButton
            variant="outline"
            size="sm"
            icon={<FontAwesomeIcon icon={faRotateRight} />}
            onClick={handleRefresh}
          >
            Refresh
          </CustomButton>
          <CustomButton
            variant="outline"
            size="sm"
            icon={<FontAwesomeIcon icon={faArrowUp} />}
            onClick={() => goToFolder(parentFolder?.parentId ?? null)}
            disabled={!currentFolderId}
          >
            Up
          </CustomButton>
          <CustomButton
            variant="primary"
            size="sm"
            loading={uploading}
            disabled={uploading}
            icon={<FontAwesomeIcon icon={faUpload} />}
            onClick={handlePickFiles}
          >
            Upload
          </CustomButton>
        </div>
      </div>

      <div className="max-h-[min(56vh,520px)] overflow-y-auto p-4 bg-[#f3f4f6]">
        {busy ? (
          <FolderSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {currentFolders.map((folder) => {
              const inactive = folder.status === false;
              return (
                <div
                  key={folder.id}
                  role="button"
                  tabIndex={0}
                  title={inactive ? "Inactive — cannot open" : undefined}
                  onClick={() => {
                    if (!inactive) goToFolder(folder.id);
                  }}
                  onKeyDown={(e) => {
                    if (inactive) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goToFolder(folder.id);
                    }
                  }}
                  className={`relative flex min-h-[72px] items-stretch gap-3 rounded-md border bg-white/80 p-3 text-left transition-all select-none border-gray-200! ${
                    inactive
                      ? "cursor-default opacity-70 hover:border-gray-200 hover:bg-white/80"
                      : "cursor-pointer border-gray-200! bg-primary/10 hover:border-primary hover:bg-white"
                  }`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center">
                    <FontAwesomeIcon
                      icon={faFolder}
                      className={`text-4xl ${inactive ? "text-gray-300" : "text-amber-400"}`}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center pr-6">
                    <div className="flex items-center gap-1">
                      <span className="truncate font-semibold text-gray-900">{folder.name}</span>
                      <FontAwesomeIcon
                        icon={faThumbtack}
                        className="text-[10px] text-gray-300 opacity-60"
                      />
                    </div>
                    <span className="truncate text-xs leading-snug text-gray-500">
                      {getSubtitleForFolder(folder)}
                    </span>
                  </div>
                </div>
              );
            })}

            {displayLibraryImages.map((img) => {
              const checked = selectedIds.has(img.id);
              return (
                <div
                  key={img.id}
                  role="checkbox"
                  aria-checked={checked}
                  aria-label={`Select ${img.name}`}
                  tabIndex={0}
                  onClick={() => toggleImage(img)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleImage(img);
                    }
                  }}
                  className={`group relative flex min-h-[72px] cursor-pointer items-stretch gap-3 rounded-md border p-3 text-left shadow-sm outline-none transition-all duration-200 select-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    checked
                      ? "border-primary bg-white ring-2 ring-primary/45 hover:-translate-y-px hover:border-primary"
                      : "border-white/50 bg-primary/10 hover:-translate-y-px hover:border-primary hover:bg-white"
                  }`}
                >
                  <div
                    className={`relative flex h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-50 ring-1 ring-gray-200 transition-shadow duration-200 border-gray-200! ${
                      checked ? "ring-2 ring-primary ring-offset-0" : ""
                    }`}
                  >
                    <LibraryImageThumb
                      src={img.url}
                      alt=""
                      className="h-full w-full object-cover pointer-events-none transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                    <div
                      className="pointer-events-none absolute left-1 top-1 z-10 rounded-md bg-white/95 p-0.5 shadow-md ring-1 ring-gray-200/90"
                      aria-hidden
                    >
                      <CustomCheckbox
                        checked={checked}
                        onChange={() => {}}
                        tabIndex={-1}
                        className="m-0!"
                      />
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center pr-2">
                    <div className="flex items-center gap-1">
                      <span className="truncate font-semibold text-gray-900">{img.name}</span>
                      <FontAwesomeIcon
                        icon={faImage}
                        className="text-[10px] text-gray-300 opacity-60"
                      />
                    </div>
                    <span className="truncate text-xs leading-snug text-gray-500">{pathSubtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!busy &&
          !imagesLoading &&
          currentFolders.length === 0 &&
          displayLibraryImages.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              This folder is empty. Upload images or open another folder.
            </p>
          )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-200 bg-white px-4 py-3">
        <CustomButton variant="outline" size="sm" onClick={onClose}>
          Cancel
        </CustomButton>
        <CustomButton
          variant="primary"
          size="sm"
          onClick={handleConfirm}
          disabled={selectedIds.size === 0}
          style={{ backgroundColor: "#052e16", borderColor: "#052e16" }}
        >
          {okText}
          {selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
        </CustomButton>
      </div>
    </Modal>
  );
}
