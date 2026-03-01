import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import PhotoUploadInfoMobile from "./uploadPhotoInfoMobile";

interface PreviewImageProps {
  src: string;
  isMobile?: boolean;
  isGenerating: boolean;
  showRemoveButton: boolean;
  showHelp: boolean;
  showCanvas: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imgRef: React.RefObject<HTMLImageElement | null>;
  onRemove: () => void;
  onShowHelp: (v: boolean) => void;
  mouseHandlers: {
    onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    onMouseUp: () => void;
  };
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
    onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
    onTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  };
}

const PreviewImage: React.FC<PreviewImageProps> = ({
  src, isMobile, isGenerating, showRemoveButton, showHelp,
  showCanvas, canvasRef, imgRef, onRemove, onShowHelp,
  mouseHandlers, touchHandlers,
}) => (
  <Box
    sx={{
      position: "relative", flex: 1, display: "flex",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden", borderRadius: "20px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
      width: isMobile ? "100%" : "615px",
      height: isMobile ? "auto" : "460px",
      aspectRatio: isMobile ? "4/3" : undefined,
      backgroundColor: "#FFFFFF",
    }}
  >
    {src ? (
      <Box
        component="img"
        ref={imgRef}
        src={src}
        alt="house preview"
        sx={{
          width: "100%", height: "100%", objectFit: "cover",
          borderRadius: isMobile ? 2 : 3,
          opacity: isGenerating ? 0.6 : 1,
          transition: "opacity 0.3s ease",
          filter: isGenerating ? "blur(4px)" : "none",
        }}
      />
    ) : null}

    {isMobile && !showHelp && (
      <IconButton
        onClick={() => onShowHelp(true)}
        sx={{
          position: "absolute", top: 10, right: 10, zIndex: 110,
          backgroundColor: "white", color: "#333",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
        size="small"
      >
        <QuestionMarkOutlinedIcon fontSize="small" />
      </IconButton>
    )}

    {isMobile && showHelp && (
      <PhotoUploadInfoMobile onClose={() => onShowHelp(false)} />
    )}

    {showRemoveButton && (
      <IconButton
        size="small" onClick={onRemove}
        sx={{
          position: "absolute", top: 10, left: 10, zIndex: 100,
          backgroundColor: "white", color: "#333",
          "&:hover": { backgroundColor: "rgba(255,255,255,1)", color: "#d32f2f" },
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    )}

    {isGenerating && (
      <Box
        sx={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          borderRadius: "20px",
          background: "linear-gradient(90deg, transparent 0%, rgba(33,150,243,0.3) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "scan 2s linear infinite",
          pointerEvents: "none", zIndex: 60,
          "@keyframes scan": {
            "0%": { backgroundPosition: "200% 0" },
            "100%": { backgroundPosition: "-200% 0" },
          },
        }}
      />
    )}

    {showCanvas && (
      <canvas
        ref={canvasRef}
        onMouseDown={mouseHandlers.onMouseDown}
        onMouseMove={mouseHandlers.onMouseMove}
        onMouseUp={mouseHandlers.onMouseUp}
        onMouseLeave={mouseHandlers.onMouseUp}
        onTouchStart={touchHandlers.onTouchStart}
        onTouchMove={touchHandlers.onTouchMove}
        onTouchEnd={touchHandlers.onTouchEnd}
        style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          borderRadius: isMobile ? 8 : 12,
          cursor: "crosshair", zIndex: 50,
        }}
      />
    )}
  </Box>
);

export default PreviewImage;