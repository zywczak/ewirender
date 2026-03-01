import { compressImage } from "./Imagecompression";

const API_URL = "https://veen-e.ewipro.com:7443/aidriver/edit_house";
const API_KEY = "51e904be14b69f404b782149c16681c3";

export type RenderType = "render" | "brick";
export type ModeType = "strict" | "creative";

export const getCacheKey = (
  colourId: number,
  renderType: RenderType,
  mode: ModeType,
  source: string
) => {
  // For data URLs, use a hash of part of the data to keep key manageable
  const sourceKey = source.startsWith("data:") 
    ? source.substring(0, 100) + source.length
    : source;
  return `${colourId}_${renderType}_${mode}_${sourceKey}`;
};

const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, base64] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(header)?.[1] ?? "image/jpeg";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    const codePoint = binary.codePointAt(i);
    bytes[i] = codePoint ?? 0;
  }

  return new Blob([bytes], { type: mime });
};

export const generateColour = async (
  sourceUrl: string,
  colourValue: string,
  mode: ModeType,
  renderType: RenderType,
  signal: AbortSignal
): Promise<string> => {
  if (!sourceUrl) throw new Error("sourceUrl is empty");

  let imageBlob: Blob;
  if (sourceUrl.startsWith("data:")) {
    imageBlob = dataUrlToBlob(sourceUrl);
    console.log("[generateColour] Converted data URL to blob:", imageBlob.size);
  } else {
    const res = await fetch(sourceUrl, { signal });
    if (!res.ok) throw new Error(`Failed to fetch source image: ${res.status}`);
    imageBlob = await res.blob();
    console.log("[generateColour] Fetched blob from URL:", imageBlob.size);
  }

  if (!imageBlob || imageBlob.size === 0) {
    throw new Error("Image blob is empty after conversion");
  }

  imageBlob = await compressImage(imageBlob);

  if (!imageBlob || imageBlob.size === 0) {
    throw new Error("Image blob is empty after compression");
  }

  console.log("[generateColour] Before sending:", {
    blobSize: imageBlob.size,
    blobType: imageBlob.type,    mode: mode.toUpperCase(),
    material: renderType === "brick" ? "BRICK_SLIP" : "RENDER",
    colourValue,
  });

  // Create a File object instead of using Blob directly - some backends expect File
  const file = new File([imageBlob], "custom_house.jpg", { 
    type: "image/jpeg",
    lastModified: Date.now()
  });

  console.log("[generateColour] Created file:", {
    name: file.name,
    size: file.size,
    type: file.type,
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("mode", mode.toUpperCase());
  formData.append("material", renderType === "brick" ? "BRICK_SLIP" : "RENDER");
  formData.append("colour_code", colourValue ?? "");

  // Log FormData contents
  console.log("[generateColour] FormData entries:");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}: File(name=${value.name}, size=${value.size}, type=${value.type})`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: API_KEY },
    body: formData,
    signal,
  });

  if (!res.ok) {
    let errorMessage = `AI generation failed: ${res.status}`;
      const errorText = await res.text();
      if (errorText) errorMessage += ` - ${errorText}`;
    console.error("[generateColour] API error:", {
      status: res.status,
      statusText: res.statusText,
      mode,
      renderType,
      colourValue,
      fileSize: imageBlob.size,
      fileType: imageBlob.type,
    });
    throw new Error(errorMessage);
  }

  const resultBlob = await res.blob();
  
  // Convert blob to base64 data URL so it can be sent to backend
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to convert image to base64"));
    reader.readAsDataURL(resultBlob);
  });
};