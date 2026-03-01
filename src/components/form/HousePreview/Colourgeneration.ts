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
    bytes[i] = binary.codePointAt(i) ?? 0;
  }

  return new Blob([bytes], { type: mime });
};

const fetchImageBlob = async (sourceUrl: string, signal: AbortSignal): Promise<Blob> => {
  if (sourceUrl.startsWith("data:")) {
    const blob = dataUrlToBlob(sourceUrl);
    return blob;
  }

  const res = await fetch(sourceUrl, { signal });
  if (!res.ok) throw new Error(`Failed to fetch source image: ${res.status}`);
  const blob = await res.blob();
  return blob;
};

const buildFormData = (
  imageBlob: Blob,
  mode: ModeType,
  renderType: RenderType,
  colourValue: string
): FormData => {
  const file = new File([imageBlob], "custom_house.jpg", {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("mode", mode.toUpperCase());
  
  // material only for strict mode
  if (mode === "strict") {
    formData.append("material", renderType === "brick" ? "BRICK_SLIP" : "RENDER");
  }
  
  formData.append("colour_code", colourValue ?? "");

  return formData;
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to convert image to base64"));
    reader.readAsDataURL(blob);
  });

export const generateColour = async (
  sourceUrl: string,
  colourValue: string,
  mode: ModeType,
  renderType: RenderType,
  signal: AbortSignal
): Promise<string> => {
  if (!sourceUrl) throw new Error("sourceUrl is empty");

  let imageBlob = await fetchImageBlob(sourceUrl, signal);

  if (imageBlob.size === 0) throw new Error("Image blob is empty after conversion");

  imageBlob = await compressImage(imageBlob);

  if (imageBlob.size === 0) throw new Error("Image blob is empty after compression");

  const formData = buildFormData(imageBlob, mode, renderType, colourValue);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: API_KEY },
    body: formData,
    signal,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[generateColour] API error:", {
      status: res.status,
      statusText: res.statusText,
      mode,
      renderType,
      colourValue,
      fileSize: imageBlob.size,
      fileType: imageBlob.type,
    });
    throw new Error(`AI generation failed: ${res.status}${errorText}`);
  }

  return blobToDataUrl(await res.blob());
};