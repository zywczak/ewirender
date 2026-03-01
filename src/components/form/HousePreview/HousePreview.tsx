import React, { useCallback, useMemo, useRef } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import { findBestMatchingImage } from "../utils";
import { compressFileToDataUrl } from "./Imagecompression";
import { redrawCanvas, buildCompositeForBackend, Point } from "./Drawingcanvas";
import { generateColour, getCacheKey, RenderType, ModeType } from "./Colourgeneration";
import PreviewImage from "./Previewimage";
import PreviewActions from "./Previewactions";
import adress from "../../../api/adress";

interface HousePreviewProps {
  isMobile?: boolean;
  renderType: RenderType;
  mode: ModeType;
  selectedColourId: number | null;
  selectedColour?: string | null;
  houseTypeId: number;
  onCustomImageUploaded?: () => void;
  onModeChange?: () => void;
  onColourLockChange?: (locked: boolean) => void;
  onGeneratedImageChange?: (image: string | null) => void;
  onIsGeneratingChange?: (v: boolean) => void;
}

const HousePreview: React.FC<HousePreviewProps> = ({
  isMobile = false,
  renderType,
  mode,
  selectedColourId,
  selectedColour,
  houseTypeId,
  onCustomImageUploaded,
  onColourLockChange,
  onModeChange,
  onGeneratedImageChange,
  onIsGeneratingChange,
}) => {
  const [customImage, setCustomImage] = React.useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);
  const [isDrawingMode, setIsDrawingMode] = React.useState(false);
  const [outlinePoints, setOutlinePoints] = React.useState<Point[]>([]);
  const [canCompleteOutline, setCanCompleteOutline] = React.useState(false);
  const [compositeImage, setCompositeImage] = React.useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(true);
  const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string }>({ 
    open: false, 
    message: '' 
  });

  React.useEffect(() => {
    onGeneratedImageChange?.(generatedImage);
  }, [generatedImage]);

  React.useEffect(() => {
  onIsGeneratingChange?.(isGeneratingImage);
}, [isGeneratingImage]);

  const imageCache = useRef<Map<string, { imageUrl: string; timestamp: number }>>(new Map());
  const skipGenerateRef = useRef(false);
  const outlineRef = useRef<Point[]>([]);
  outlineRef.current = outlinePoints;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const colourAbortControllerRef = useRef<AbortController | null>(null);
  const prevModeRef = useRef<ModeType | null>(null);

 const clearImageCache = useCallback(() => {
  // No need to revoke URLs since we're using data URLs now, not blob URLs
  imageCache.current.clear();
}, []);

  // ─── Canvas handlers ───────────────────────────────────────────────────────

  const getPos = useCallback((clientX: number, clientY: number): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
  }, []);

  const startStroke = useCallback((p: Point) => {
    const next = [p];
    setIsDrawing(true);
    setOutlinePoints(next);
    setCanCompleteOutline(false);
    outlineRef.current = next;
    if (canvasRef.current) redrawCanvas(canvasRef.current, next);
  }, []);

  const continueStroke = useCallback((p: Point) => {
    setOutlinePoints((prev) => {
      const next = [...prev, p];
      outlineRef.current = next;
      if (canvasRef.current) redrawCanvas(canvasRef.current, next);
      setCanCompleteOutline(next.length >= 3);
      return next;
    });
  }, []);

  const endStroke = useCallback(() => {
    setIsDrawing(false);
    setCanCompleteOutline(outlineRef.current.length >= 3);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const p = getPos(e.clientX, e.clientY);
    if (p) startStroke(p);
  }, [getPos, startStroke]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const p = getPos(e.clientX, e.clientY);
    if (p) continueStroke(p);
  }, [isDrawing, getPos, continueStroke]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const t = e.touches[0];
    if (!t) return;
    const p = getPos(t.clientX, t.clientY);
    if (p) startStroke(p);
  }, [getPos, startStroke]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const t = e.touches[0];
    if (!t) return;
    const p = getPos(t.clientX, t.clientY);
    if (p) continueStroke(p);
  }, [isDrawing, getPos, continueStroke]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    endStroke();
  }, [endStroke]);

  // ─── Colour generation ─────────────────────────────────────────────────────

  const handleColourSelection = useCallback(async (colourValue: string, optionId: number) => {
    if (!customImage && !compositeImage) return;

    const sourceUrl = sessionStorage.getItem("compositeHouseImage") || compositeImage || customImage!;

    console.log("[HousePreview] handleColourSelection:", {
      hasCustomImage: !!customImage,
      hasCompositeImage: !!compositeImage,
      hasSessionStorage: !!sessionStorage.getItem("compositeHouseImage"),
      sourceUrlPreview: sourceUrl.substring(0, 100) + "...",
      colourValue,
      optionId,
    });

    colourAbortControllerRef.current?.abort();
    colourAbortControllerRef.current = null;

    const cacheKey = getCacheKey(optionId, renderType, mode, sourceUrl);
    const cached = imageCache.current.get(cacheKey);
    if (cached) {
      setGeneratedImage(cached.imageUrl);
      setIsGeneratingImage(false);
      return;
    }

    colourAbortControllerRef.current = new AbortController();
    const { signal } = colourAbortControllerRef.current;
    setIsGeneratingImage(true);

    try {
      const imageUrl = await generateColour(sourceUrl, colourValue, mode, renderType, signal);
      setGeneratedImage(imageUrl);
      imageCache.current.set(cacheKey, { imageUrl, timestamp: Date.now() });
      if (colourAbortControllerRef.current?.signal === signal) colourAbortControllerRef.current = null;
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setSnackbar({ 
        open: true, 
        message: 'Error generating image.' 
      });
    } finally {
      if (!signal.aborted) setIsGeneratingImage(false);
      if (colourAbortControllerRef.current?.signal === signal) colourAbortControllerRef.current = null;
    }
  }, [customImage, compositeImage, renderType, mode]);

  // ─── Effects ───────────────────────────────────────────────────────────────

  React.useEffect(() => {
    colourAbortControllerRef.current?.abort();
    colourAbortControllerRef.current = null;
    setIsGeneratingImage(false);
    setGeneratedImage(null); // Show original uploaded image
    skipGenerateRef.current = true;
  }, [mode, renderType]);

  React.useEffect(() => {
    if (customImage === null && compositeImage === null && colourAbortControllerRef.current) {
      colourAbortControllerRef.current.abort();
      colourAbortControllerRef.current = null;
      setIsGeneratingImage(false);
    }
  }, [customImage, compositeImage]);

  React.useEffect(() => {
    if (prevModeRef.current && prevModeRef.current !== mode) {
      colourAbortControllerRef.current?.abort();
      colourAbortControllerRef.current = null;
      setIsGeneratingImage(false);
      setGeneratedImage(null); // Show original uploaded image
      skipGenerateRef.current = true;
      onModeChange?.(); // Clear colour selection
    }
    prevModeRef.current = mode;
  }, [mode, onModeChange]);

  React.useEffect(() => {
    if (customImage === null) clearImageCache();
  }, [customImage, clearImageCache]);

  React.useEffect(() => {
    if (!customImage) return;
    colourAbortControllerRef.current?.abort();
    colourAbortControllerRef.current = null;
    setIsGeneratingImage(false);
    setCustomImage(null);
    setGeneratedImage(null);
    setIsDrawingMode(false);
    setOutlinePoints([]);
    setCanCompleteOutline(false);
    setCompositeImage(null);
    sessionStorage.removeItem("compositeHouseImage");
    onColourLockChange?.(false);
  }, [houseTypeId]);

  React.useEffect(() => {
    return () => { colourAbortControllerRef.current?.abort(); };
  }, []);

  React.useEffect(() => {
    if (!selectedColourId) return;
    if (skipGenerateRef.current) { skipGenerateRef.current = false; return; }
    if (!customImage && !compositeImage) return;
    handleColourSelection((selectedColour as string) || String(selectedColourId), selectedColourId);
  }, [selectedColourId, customImage, compositeImage, selectedColour, handleColourSelection]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleAcceptOutline = useCallback(() => {
    if (!customImage || outlineRef.current.length < 3) return;
    const pts = [...outlineRef.current];
    buildCompositeForBackend(customImage, pts, (composite) => {
      setCompositeImage(composite);
      sessionStorage.setItem("compositeHouseImage", composite);
    });
    setIsDrawingMode(false);
    setOutlinePoints([]);
    setCanCompleteOutline(false);
    onColourLockChange?.(false);
  }, [customImage, onColourLockChange]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";

    // JPEG and PNG files allowed
    const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg' || 
                   file.name.toLowerCase().endsWith('.jpg') || 
                   file.name.toLowerCase().endsWith('.jpeg');
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    
    if (!isJpeg && !isPng) {
      alert('Tylko pliki JPEG i PNG są dozwolone. Proszę wybrać plik .jpg, .jpeg lub .png');
      console.error('[HousePreview] Invalid file type:', file.type, file.name);
      return;
    }

    try {
      const dataUrl = await compressFileToDataUrl(file);
      setCustomImage(dataUrl);
      setGeneratedImage(null);
      setOutlinePoints([]);
      setCanCompleteOutline(false);
      setCompositeImage(null);
      sessionStorage.removeItem("compositeHouseImage");
      onCustomImageUploaded?.();
      if (houseTypeId === 1 || houseTypeId === 2) onColourLockChange?.(true);
      setIsDrawingMode(houseTypeId === 1 || houseTypeId === 2);
    } catch (err) {
      console.error("[HousePreview] upload compression failed:", err);
      alert('Błąd podczas wczytywania obrazu. Spróbuj ponownie.');
    }
  }, [houseTypeId, onCustomImageUploaded, onColourLockChange]);

  const handleResetToDefault = useCallback(() => {
    colourAbortControllerRef.current?.abort();
    colourAbortControllerRef.current = null;
    setIsGeneratingImage(false);
    setCustomImage(null);
    setGeneratedImage(null);
    setIsDrawingMode(false);
    setOutlinePoints([]);
    setCanCompleteOutline(false);
    setCompositeImage(null);
    sessionStorage.removeItem("compositeHouseImage");
    onColourLockChange?.(false);
    clearImageCache();
  }, [onColourLockChange, clearImageCache]);

  // ─── Derived ───────────────────────────────────────────────────────────────

  const selectedOptions = useMemo(() => {
    const options: number[] = [houseTypeId];
    if (selectedColourId) options.push(selectedColourId);
    return options;
  }, [houseTypeId, selectedColourId]);

  const previewImage = useMemo(() => findBestMatchingImage(selectedOptions), [selectedOptions]);
  const currentImage = generatedImage || customImage || previewImage;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ position: "relative" }}>
      <PreviewImage
        src={adress + currentImage || ""}
        isMobile={isMobile}
        isGenerating={isGeneratingImage}
        showRemoveButton={!!(customImage || generatedImage)}
        showHelp={showHelp}
        showCanvas={isDrawingMode && !!customImage}
        canvasRef={canvasRef}
        imgRef={imgRef}
        onRemove={handleResetToDefault}
        onShowHelp={setShowHelp}
        mouseHandlers={{ onMouseDown: handleMouseDown, onMouseMove: handleMouseMove, onMouseUp: endStroke }}
        touchHandlers={{ onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd }}
      />
      <PreviewActions
        isMobile={isMobile}
        customImage={customImage}
        isDrawingMode={isDrawingMode}
        canCompleteOutline={canCompleteOutline}
        onFileChange={handleFileChange}
        onAcceptOutline={handleAcceptOutline}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HousePreview;