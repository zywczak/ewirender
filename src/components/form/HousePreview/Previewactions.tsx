import React, { useRef } from "react";
import { Box } from "@mui/material";
import ActionButton from "../../common/actionButton";

interface PreviewActionsProps {
  isMobile?: boolean;
  customImage: string | null;
  isDrawingMode: boolean;
  canCompleteOutline: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAcceptOutline: () => void;
}

const PreviewActions: React.FC<PreviewActionsProps> = ({
  isMobile, customImage, isDrawingMode, canCompleteOutline,
  onFileChange, onAcceptOutline,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {!customImage && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={onFileChange}
          />
          <Box sx={{ position: "absolute", bottom: isMobile ? "-45px" : "-55px", right: "calc(50% - 130px)", zIndex: 10 }}>
            <ActionButton variant="uploadHouse" onClick={() => fileInputRef.current?.click()} />
          </Box>
        </>
      )}

      {customImage && isDrawingMode && (
        <Box sx={{ position: "absolute", bottom: isMobile ? "-45px" : "-55px", right: isMobile ? "calc(50% - 50px)" : "240px", zIndex: 10 }}>
          <ActionButton variant="accept" onClick={onAcceptOutline} disabled={!canCompleteOutline} isMobile={isMobile} />
        </Box>
      )}
    </>
  );
};

export default PreviewActions;