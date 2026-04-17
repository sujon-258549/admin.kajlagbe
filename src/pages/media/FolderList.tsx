import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dropdown, Modal } from "antd";
import type { MenuProps } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRotateRight,
  faFolder,
  faArrowUp,
  faEllipsisVertical,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import CustomButton from "../../Components/ui/Button";
import FolderModal from "../../Components/modal/media/FolderModal";
import type {
  TFolder,
  TFolderCreateUpdatePayload,
  TFolderMeta,
} from "../../Components/types";
import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetAllFoldersQuery,
  useUpdateFolderMutation,
} from "../../redux/features/folderApi/folderApi";
import { toast } from "sonner";

/** Explorer location: `?folder=<folder name>` (omit for root). Legacy `?folder=<uuid>` still resolves. */
const FOLDER_SEARCH_PARAM = "folder";

const UUID_IN_URL_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function resolveFolderQueryToId(
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

const FolderList = () => {
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

  const getSubtitleForFolder = (folder: TFolder) => {
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
  };

  const getRecordId = (record: { id?: string; _id?: string }) =>
    record.id || record._id || "";

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null) {
      const err = error as { data?: { message?: string }; message?: string };
      return err.data?.message || err.message || "Something went wrong";
    }
    return "Something went wrong";
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

  const stopMenuEvent = (e: { domEvent?: { stopPropagation?: () => void } }) => {
    e.domEvent?.stopPropagation?.();
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

  /** Do not hide the grid on background refetch — only block when we have no rows yet. */
  const busy =
    folders.length === 0 && (isLoading || isFetching);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Setup Menu" },
          { label: "Media" },
        ]}
        title="Media"
        subTitle="Folders — Windows-style library"
        extra={
          <div className="flex gap-3">
            <CustomButton
              variant="outline"
              size="sm"
              icon={<FontAwesomeIcon icon={faRotateRight} />}
              onClick={() => refetch()}
            >
              Refresh
            </CustomButton>
            <CustomButton
              variant="primary"
              size="sm"
              onClick={handleCreate}
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              New folder
            </CustomButton>
          </div>
        }
      />

      <div className="overflow-hidden rounded-md border border-gray-200 bg-[#f3f4f6]">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 text-sm">
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
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:inline">
              {meta.total} item{meta.total === 1 ? "" : "s"}
            </span>
            <CustomButton
              variant="outline"
              size="sm"
              icon={<FontAwesomeIcon icon={faArrowUp} />}
              onClick={() => goToFolder(parentFolder?.parentId ?? null)}
              disabled={!currentFolderId}
            >
              Up
            </CustomButton>
          </div>
        </div>

        <div className="p-4 min-h-[320px]">
          {busy ? (
            <div className="flex h-48 items-center justify-center text-gray-500 text-sm">
              Loading folders…
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <button
                type="button"
                onClick={handleCreate}
                className="group flex items-stretch gap-3 rounded-md border border-dashed border-gray-300 bg-white p-3 text-left transition-all hover:border-primary hover:bg-emerald-50/60"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FontAwesomeIcon icon={faPlus} className="text-xl" />
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <span className="font-semibold text-gray-800 truncate">
                    New folder
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {pathSubtitle}
                  </span>
                </div>
              </button>

              {currentFolders.map((folder) => {
                const inactive = folder.status === false;
                return (
                  <div
                    key={folder.id}
                    role="button"
                    tabIndex={0}
                    title={inactive ? "Inactive — cannot open" : undefined}
                    onClick={() => goToFolder(folder.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goToFolder(folder.id);
                      }
                    }}
                    className={`relative flex items-stretch gap-3 rounded-md border bg-white/80 p-3 text-left transition-all select-none border-gray-200 ${
                      inactive
                        ? "cursor-default opacity-70 hover:bg-white/80"
                        : "cursor-pointer hover:bg-white hover:border-primary bg-primary/10"
                    }`}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center">
                      <FontAwesomeIcon
                        icon={faFolder}
                        className={`text-4xl ${
                          inactive ? "text-gray-300" : "text-amber-400"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-center pr-6">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900 truncate">
                          {folder.name}
                        </span>
                        <FontAwesomeIcon
                          icon={faThumbtack}
                          className="text-[10px] text-gray-300 opacity-60"
                        />
                      </div>
                      <span className="text-xs text-gray-500 truncate leading-snug">
                        {getSubtitleForFolder(folder)}
                      </span>
                    </div>

                    <div className="absolute right-1 top-1">
                      <Dropdown
                        menu={{ items: folderMenuItems(folder) }}
                        trigger={["click"]}
                      >
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Folder actions"
                        >
                          <FontAwesomeIcon icon={faEllipsisVertical} className="text-xs" />
                        </button>
                      </Dropdown>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!busy && currentFolders.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              This folder is empty. Click <strong>New folder</strong> to add one.
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 px-1">
        Tip: click an active folder to open it (inactive folders cannot be opened). Use{" "}
        <strong>New folder</strong> to create inside the current location. Use the ⋮ menu to
        rename or delete.
      </p>

      <FolderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
        folderOptions={folderOptions}
        defaultParentId={currentFolderId ?? undefined}
      />
    </div>
  );
};

export default FolderList;
