import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { Modal } from "antd";
import type { MenuProps } from "antd";
import { toast } from "sonner";
import type {
  TFolder,
  TFolderCreateUpdatePayload,
  TFolderMeta,
  TMediaImage,
} from "../../../Components/types";
import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetAllFoldersQuery,
  useUpdateFolderMutation,
} from "../../../redux/features/folderApi/folderApi";
import {
  useCreateImageMutation,
  useDeleteImageMutation,
  useGetImagesQuery,
  useUpdateImageMutation,
} from "../../../redux/features/mediaApi/mediaApi";
import { uploadMediaImage } from "../../../Components/utils/imageUpload";
import {
  FOLDER_SEARCH_PARAM,
  resolveFolderQueryToId,
} from "../lib/folderExplorerUtils";

export function useFolderListPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [renameTarget, setRenameTarget] = useState<TMediaImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<TFolder | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const setFolderParam = useCallback(
    (nameOrNull: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (nameOrNull === null) next.delete(FOLDER_SEARCH_PARAM);
          else next.set(FOLDER_SEARCH_PARAM, nameOrNull);
          return next;
        },
        { replace: false },
      );
    },
    [setSearchParams],
  );

  const {
    data: foldersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllFoldersQuery({});

  const [createFolder] = useCreateFolderMutation();
  const [updateFolder] = useUpdateFolderMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const [createImage] = useCreateImageMutation();
  const [updateImage, { isLoading: isRenamingImage }] = useUpdateImageMutation();
  const [deleteImageMut] = useDeleteImageMutation();

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

  const folderParamRaw = useMemo(() => {
    const v = searchParams.get(FOLDER_SEARCH_PARAM);
    return v != null && v.trim() !== "" ? v.trim() : null;
  }, [searchParams]);

  const currentFolderId = useMemo(
    () => resolveFolderQueryToId(folderParamRaw, folders),
    [folderParamRaw, folders],
  );

  const { data: imagesResponse, isLoading: imagesLoading } = useGetImagesQuery(
    { folderId: currentFolderId ?? null },
  );

  const libraryImages: TMediaImage[] = useMemo(
    () => (Array.isArray(imagesResponse?.data) ? imagesResponse.data : []),
    [imagesResponse?.data],
  );

  const meta: TFolderMeta = foldersData?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  const folderById = useMemo(() => {
    const map = new Map<string, TFolder>();
    folders.forEach((f) => map.set(f.id, f));
    return map;
  }, [folders]);

  const folderOptions = useMemo(
    () =>
      folders
        .filter((f) => f.id !== editData?.id)
        .map((f) => ({ label: f.name, value: f.id })),
    [folders, editData?.id],
  );

  const parentKey = (id: string | null | undefined) =>
    id == null || id === "" ? null : id;

  const currentFolders = useMemo(
    () =>
      folders.filter(
        (f) => parentKey(f.parentId) === parentKey(currentFolderId),
      ),
    [folders, currentFolderId],
  );

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

  const parentFolder = currentFolderId ? folderById.get(currentFolderId) : null;

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (!folderParamRaw) return;
    if (folders.length === 0) return;
    if (currentFolderId === null) {
      setFolderParam(null);
      return;
    }
    if (!folderById.has(currentFolderId)) {
      setFolderParam(null);
    }
  }, [
    folderParamRaw,
    currentFolderId,
    folders.length,
    folderById,
    isLoading,
    isFetching,
    setFolderParam,
  ]);

  const pathSubtitle = useMemo(() => {
    if (currentPath.length === 0) return "All Folders";
    return ["All Folders", ...currentPath.map((n) => n.name)].join("\\");
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

  const getRecordId = (record: { id?: string; _id?: string }) =>
    record.id || record._id || "";

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null) {
      const err = error as { data?: { message?: string }; message?: string };
      return err.data?.message || err.message || "Something went wrong";
    }
    return "Something went wrong";
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e.target;
    const picked = input.files ? Array.from(input.files) : [];
    input.value = "";
    if (picked.length === 0) return;

    const imageFiles = picked.filter((f) => f.type.startsWith("image/"));
    const skipped = picked.length - imageFiles.length;
    if (skipped > 0) {
      toast.info(
        `${skipped} file${skipped === 1 ? "" : "s"} skipped (not images).`,
      );
    }
    if (imageFiles.length === 0) {
      toast.error("Please choose one or more image files.");
      return;
    }

    setUploading(true);
    let ok = 0;
    let fail = 0;
    let lastMessage = "";
    try {
      for (const file of imageFiles) {
        try {
          const res = await uploadMediaImage(file, currentFolderId, (payload) =>
            createImage(payload).unwrap(),
          );
          if (res?.success) {
            ok += 1;
          } else {
            fail += 1;
            lastMessage = res?.message || "Failed to save image.";
          }
        } catch (err: unknown) {
          fail += 1;
          lastMessage = getErrorMessage(err);
        }
      }
    } finally {
      setUploading(false);
    }

    if (ok > 0) {
      void refetch();
    }
    if (fail === 0 && ok > 0) {
      toast.success(
        ok === 1
          ? "Image uploaded successfully."
          : `${ok} images uploaded successfully.`,
      );
    } else if (ok > 0 && fail > 0) {
      toast.warning(
        `${ok} uploaded, ${fail} failed.${lastMessage ? ` ${lastMessage}` : ""}`,
      );
    } else if (fail > 0) {
      toast.error(lastMessage || "Upload failed.");
    }
  };

  const handleCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (record: TFolder) => {
    setEditData(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteFolder(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Folder deleted successfully");
        if (currentFolderId === id) setFolderParam(null);
      } else {
        toast.error(res?.message || "Failed to delete folder");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSubmit = async (
    values: TFolderCreateUpdatePayload,
  ): Promise<boolean> => {
    try {
      let res;
      if (editData) {
        res = await updateFolder({
          id: getRecordId(editData),
          data: values,
        }).unwrap();
      } else {
        res = await createFolder(values).unwrap();
      }

      if (res?.success) {
        toast.success(
          res?.message ||
            `Folder ${editData ? "updated" : "created"} successfully`,
        );
        return true;
      }

      toast.error(
        res?.message || `Failed to ${editData ? "update" : "create"} folder`,
      );
      return false;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
      return false;
    }
  };

  const stopMenuEvent = (e: {
    domEvent?: { stopPropagation?: () => void };
  }) => {
    e.domEvent?.stopPropagation?.();
  };

  const handleDeleteImage = async (id: string) => {
    try {
      const res = await deleteImageMut(id).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Image deleted");
        void refetch();
      } else {
        toast.error(res?.message || "Failed to delete image");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleSaveImageRename = async (nameInput: string) => {
    if (!renameTarget?.id) return;
    const name = nameInput.trim();
    if (!name) {
      toast.error("Enter a name");
      throw new Error("validation");
    }
    try {
      const res = await updateImage({
        id: renameTarget.id,
        data: { name },
      }).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Image updated");
        setRenameTarget(null);
        void refetch();
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const goToFolder = (id: string | null) => {
    if (id === null) {
      setFolderParam(null);
      return;
    }
    const target = folderById.get(id);
    if (!target) return;
    if (target.status === false) {
      toast.info("This folder is inactive and cannot be opened.");
      return;
    }
    setFolderParam(target.name);
  };

  const imageMenuItems = (img: TMediaImage): MenuProps["items"] => [
    {
      key: "open",
      label: "Open in new tab",
      onClick: (e) => {
        stopMenuEvent(e);
        window.open(img.url, "_blank", "noopener,noreferrer");
      },
    },
    {
      key: "copy",
      label: "Copy image URL",
      onClick: (e) => {
        stopMenuEvent(e);
        void navigator.clipboard.writeText(img.url).then(
          () => toast.success("Link copied to clipboard"),
          () => toast.error("Could not copy link"),
        );
      },
    },
    {
      key: "rename",
      label: "Rename",
      onClick: (e) => {
        stopMenuEvent(e);
        setRenameTarget(img);
      },
    },
    { type: "divider" },
    {
      key: "delete",
      danger: true,
      label: "Delete",
      onClick: (e) => {
        stopMenuEvent(e);
        Modal.confirm({
          title: "Delete image",
          content: `Delete “${img.name}”? This cannot be undone.`,
          okText: "Delete",
          okType: "danger",
          cancelText: "Cancel",
          onOk: () => handleDeleteImage(img.id),
        });
      },
    },
  ];

  const folderMenuItems = (folder: TFolder): MenuProps["items"] => [
    {
      key: "open",
      label: "Open",
      disabled: !folder.status,
      onClick: (e) => {
        stopMenuEvent(e);
        if (folder.status) goToFolder(folder.id);
      },
    },
    {
      key: "edit",
      label: "Rename / Edit",
      onClick: (e) => {
        stopMenuEvent(e);
        handleEdit(folder);
      },
    },
    { type: "divider" },
    {
      key: "delete",
      danger: true,
      label: "Delete",
      onClick: (e) => {
        stopMenuEvent(e);
        Modal.confirm({
          title: "Delete folder",
          content: `Delete “${folder.name}”? This cannot be undone.`,
          okText: "Delete",
          okType: "danger",
          cancelText: "Cancel",
          onOk: () => handleDelete(folder.id),
        });
      },
    },
  ];

  const busy = folders.length === 0 && (isLoading || isFetching);

  return {
    fileInputRef,
    uploading,
    renameTarget,
    setRenameTarget,
    modalOpen,
    setModalOpen,
    editData,
    refetch,
    meta,
    folderOptions,
    currentFolderId,
    libraryImages,
    imagesLoading,
    currentFolders,
    currentPath,
    parentFolder,
    pathSubtitle,
    busy,
    isRenamingImage,
    handlePickImage,
    handleImageFileChange,
    handleCreate,
    handleSubmit,
    goToFolder,
    folderMenuItems,
    imageMenuItems,
    getSubtitleForFolder,
    handleSaveImageRename,
  };
}
