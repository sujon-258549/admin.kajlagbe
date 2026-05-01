export const config = {
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  },
  superAdminEmail: import.meta.env.VITE_SUPER_ADMIN_EMAIL,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
};
