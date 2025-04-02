"use client";

const MAX_FILE_SIZE_MB = 1;
const MAX_WIDTH = 500;
const MAX_HEIGHT = 500;

export const compressImage = (
  file: File
): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = (MAX_WIDTH / width) * height;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = (MAX_HEIGHT / height) * width;
          height = MAX_HEIGHT;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const mimeType = file.type || "image/png";
        const base64 = canvas.toDataURL(mimeType, 1.0);
        resolve({ base64: base64.split(",")[1], mimeType: mimeType });
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export const handleImageUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  setImage: React.Dispatch<React.SetStateAction<string | null>>,
  setMimeType: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    setError(`File is too large (max ${MAX_FILE_SIZE_MB} MB)`);
    return;
  }
  try {
    const { base64, mimeType } = await compressImage(file);
    setImage(base64);
    setMimeType(mimeType);
    setError(null);
  } catch {
    setError("Failed to process the image.");
  }
};

export const handleRemoveImage = (
  setImage: React.Dispatch<React.SetStateAction<string | null>>,
  setMimeType: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setImage(null);
  setMimeType(null);
};
