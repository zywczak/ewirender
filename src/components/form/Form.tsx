// Form.tsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ColourInput from "./colour/ColourStepInput";
import HousePreview from "./HousePreview/HousePreview";

interface FormProps {
  isMobile: boolean;
  renderValue: boolean | null;
  selectedHouseType: number;
  setSelectedColourImage: (image: string) => void;
  modeValue: boolean;
  setGeneratedHouseImage: (img: string | null) => void;
  setIsGeneratingImage: (v: boolean) => void;
}

type RenderType = "render" | "brick";
type ModeType = "strict" | "creative";

const Form = ({
  isMobile,
  renderValue,
  selectedHouseType,
  setSelectedColourImage,
  modeValue,
  setGeneratedHouseImage,
  setIsGeneratingImage,
}: FormProps) => {
  const [selectedColour, setSelectedColour] = useState<string>("");
  const [selectedColourId, setSelectedColourId] = useState<number | null>(null);
  const [colourLocked, setColourLocked] = useState<boolean>(false);
  const mode: ModeType = modeValue ? "creative" : "strict";

  const isBrickSlips = renderValue === true;
  const renderType: RenderType = isBrickSlips ? "brick" : "render";

  const handleColourChange = (value: string, image: string, id: number) => {
    setSelectedColour(value);
    setSelectedColourId(id);
    setSelectedColourImage(image);
  };

  const clearColourSelection = () => {
    setSelectedColour("");
    setSelectedColourId(null);
    setSelectedColourImage("");
  };

  useEffect(() => {
    setSelectedColour("");
    setSelectedColourId(null);
    setSelectedColourImage("");
  }, [isBrickSlips]);

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : "930px",
        height: isMobile ? "auto" : "490px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        mt: isMobile ? 0 : "13px",
        mr: isMobile ? 0 : "24px",
        gap: isMobile ? "52px" : 0,
      }}
    >
       <PreviewSection
        isMobile={isMobile}
        renderType={renderType}
        mode={mode}
        selectedColourId={selectedColourId}
        selectedColour={selectedColour}
        selectedHouseType={selectedHouseType}
        clearColourSelection={clearColourSelection}
        setColourLocked={setColourLocked}
        setGeneratedHouseImage={setGeneratedHouseImage}
        setIsGeneratingImage={setIsGeneratingImage}
      />
      <ColourInputSection
        isMobile={isMobile}
        isBrickSlips={isBrickSlips}
        selectedColour={selectedColour}
        handleColourChange={handleColourChange}
        colourLocked={colourLocked}
      />
    </Box>
  );
};

const PreviewSection = ({
  isMobile,
  renderType,
  mode,
  selectedColourId,
  selectedColour,
  selectedHouseType,
  clearColourSelection,
  setColourLocked,
  setGeneratedHouseImage,
  setIsGeneratingImage,
}: {
  isMobile: boolean;
  renderType: RenderType;
  mode: ModeType;
  selectedColourId: number | null;
  selectedColour: string;
  selectedHouseType: number;
  clearColourSelection: () => void;
  setColourLocked: React.Dispatch<React.SetStateAction<boolean>>;
  setGeneratedHouseImage: (img: string | null) => void;
  setIsGeneratingImage: (v: boolean) => void;
}) => (
  <Box
    sx={{
      position: isMobile ? "relative" : "absolute",
      bottom: isMobile ? "auto" : "34px",
      right: isMobile ? "auto" : "38px",
      width: isMobile ? "100%" : "600px",
      height: isMobile ? "auto" : "450px",
      px: isMobile ? "24px" : 0,
      boxSizing: "border-box",
    }}
  >
    <HousePreview
      isMobile={isMobile}
      renderType={renderType}
      mode={mode}
      selectedColourId={selectedColourId}
      selectedColour={selectedColour}
      houseTypeId={selectedHouseType}
      onCustomImageUploaded={clearColourSelection}
      onColourLockChange={setColourLocked}
      onModeChange={clearColourSelection}
      onGeneratedImageChange={setGeneratedHouseImage}
      onIsGeneratingChange={setIsGeneratingImage}
    />
  </Box>
);

const ColourInputSection = ({
  isMobile,
  isBrickSlips,
  selectedColour,
  handleColourChange,
  colourLocked,
}: {
  isMobile: boolean;
  isBrickSlips: boolean;
  selectedColour: string;
  handleColourChange: (value: string, image: string, id: number) => void;
  colourLocked: boolean;
}) => (
  <Box
    sx={{
      width: "calc(100% - 48px)",
      height: isMobile ? "auto" : "494px",
      mt: isMobile ? "-60px" : "40px",
      pt: isMobile ? "50px" : 0,
      borderRadius: "20px",
      backgroundColor: "#f4f4f4",
      mx: isMobile ? "24px" : 0,
      overflow: "hidden",
    }}
  >
    <ColourInput
      value={selectedColour}
      onChange={handleColourChange}
      isBrickSlips={isBrickSlips}
      isMobile={isMobile}
      disabled={colourLocked}
    />
  </Box>
);

export default Form;