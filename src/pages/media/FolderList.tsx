import { Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faRotateRight,
  faFolder,
  faArrowUp,
  faEllipsisVertical,
  faThumbtack,
  faUpload,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../Components/common/PageHeader";
import CustomButton from "../../Components/ui/Button";
import FolderModal from "../../Components/modal/media/FolderModal";
import ImageRenameModal from "../../Components/modal/media/ImageRenameModal";
import FolderSkeleton from "../../Components/skeleton/FolderSkeleton";
import { LibraryImageThumb } from "./components/LibraryImageThumb";
import { useFolderListPage } from "./hooks/useFolderListPage";

const FolderList = () => {
  const {
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
  } = useFolderListPage();

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-hidden
        onChange={handleImageFileChange}
      />
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
            <CustomButton
              variant="primary"
              size="sm"
              loading={uploading}
              disabled={uploading}
              icon={<FontAwesomeIcon icon={faUpload} />}
              onClick={handlePickImage}
              title="Select one or more images"
            >
              Upload
            </CustomButton>
          </div>
        </div>

        <div className="p-4 min-h-[320px]">
          {busy ? (
            <FolderSkeleton />
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
                    className={`relative flex items-stretch gap-3 rounded-md border bg-white/80 p-3 text-left transition-all select-none border-gray-200! ${
                      inactive
                        ? "cursor-default opacity-70 hover:bg-white/80 hover:border-gray-200"
                        : "cursor-pointer hover:bg-white hover:border-primary bg-primary/10 border-gray-200!"
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

              {libraryImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative flex items-stretch gap-3 rounded-md border border-white/50 bg-primary/10 p-3 text-left shadow-sm transition-all duration-200 select-none hover:-translate-y-px hover:border-primary hover:bg-white"
                >
                  <button
                    type="button"
                    title="Open in new tab"
                    className="relative flex h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-50 ring-1 ring-gray-200 border-gray-200! transition-[transform,box-shadow] duration-200 hover:ring-primary/30 group-hover:shadow-inner"
                    onClick={() =>
                      window.open(img.url, "_blank", "noopener,noreferrer")
                    }
                  >
                    <LibraryImageThumb
                      src={img.url}
                      alt={img.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </button>
                  <div className="min-w-0 flex-1 flex flex-col justify-center pr-6">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900 truncate">
                        {img.name}
                      </span>
                      <FontAwesomeIcon
                        icon={faImage}
                        className="text-[10px] text-gray-300 opacity-60"
                      />
                    </div>
                    <span className="text-xs text-gray-500 truncate leading-snug">
                      {pathSubtitle}
                    </span>
                  </div>

                  <div className="absolute right-1 top-1">
                    <Dropdown
                      menu={{ items: imageMenuItems(img) }}
                      trigger={["click"]}
                    >
                      <button
                        type="button"
                        className="rounded-md p-1.5 text-gray-400 opacity-80 transition-opacity hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Image actions"
                      >
                        <FontAwesomeIcon
                          icon={faEllipsisVertical}
                          className="text-xs"
                        />
                      </button>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!busy &&
            !imagesLoading &&
            currentFolders.length === 0 &&
            libraryImages.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              This folder is empty. Click <strong>New folder</strong> or{" "}
              <strong>Upload</strong> to add files.
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 px-1">
        Tip: click an active folder to open it (inactive folders cannot be opened). Use{" "}
        <strong>New folder</strong> to create inside the current location. Use the ⋮ menu to
        rename or delete.
      </p>

      <ImageRenameModal
        open={renameTarget !== null}
        image={renameTarget}
        onClose={() => setRenameTarget(null)}
        onSave={handleSaveImageRename}
        saving={isRenamingImage}
      />

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
