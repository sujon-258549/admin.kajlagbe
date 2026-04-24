import { config } from "../../config";
import type { TMediaImageCreatePayload } from "../types";

const uploadImageToCloudinary = async (
  file: File,
  cloudName: string,
  uploadPreset: string,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return await response.json();
};

export const uploadProfileImage = async (file: File) => {
  const cloudName = config.cloudinary.cloudName;
  const uploadPreset = config.cloudinary.uploadPreset;

  try {
    const uploadedData = await uploadImageToCloudinary(
      file,
      cloudName,
      uploadPreset,
    );
    return uploadedData.secure_url;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

function fileBaseName(file: File): string {
  const raw = file.name.trim();
  if (!raw) return "image";
  return raw.replace(/\.[^/.]+$/i, "") || "image";
}

export type UploadMediaImageResult<T> = {
  /** API / mutation return value. */
  result: T;
  /** Cloudinary URL that was sent to the API — use to match rows after refetch. */
  publicUrl: string;
};

/**
 * 1) Upload file to Cloudinary (`uploadProfileImage`).
 * 2) Persist metadata via your API (`saveToApi`, e.g. `createImage` from RTK).
 */
export const uploadMediaImage = async <T>(
  file: File,
  folderId: string | null | undefined,
  saveToApi: (payload: TMediaImageCreatePayload) => Promise<T>,
): Promise<UploadMediaImageResult<T>> => {
  const publicUrl = await uploadProfileImage(file);
  const name = fileBaseName(file);
  const result = await saveToApi({
    name,
    url: publicUrl,
    folderId: folderId ?? null,
  });
  return { result, publicUrl };
};