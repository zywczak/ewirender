import React, { useEffect, useState, useRef } from "react";
import { Box, Card, Typography } from "@mui/material";
import ResponsiveCalculatorWrapper from "../components/FormWrapper";
import Options from "../components/options/Options";
import HouseType from "../components/houseType/HouseType";
import Form from "../components/form/Form";
import EwiproLogo from "../assets/EWI-Pro-Render-Systems.png";
import PhotoUploadInfo from "../components/form/uploadPhotoInfo";
import QuoteFormModal from "../components/Quoteformmodal";
import ActionButton from "../components/common/actionButton";

const Render: React.FC = () => {
  const [renderValue, setRenderValue] = useState<boolean>(false);
  const [modeValue, setModeValue] = useState<boolean>(false);
  const [selectedHouseType, setSelectedHouseType] = useState<number>(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 705);
  const [isSmallerTitle, setIsSmallerTitle] = useState(window.innerWidth <= 900);
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedColourImage, setSelectedColourImage] = useState<string>("");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [customHouseImage, setCustomHouseImage] = useState<string | null>(null);
  const [generatedHouseImage, setGeneratedHouseImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 705);
      setIsSmallerTitle(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Box sx={{ textAlign: "center", py: "16px" }}>
        <Typography
          sx={{
            fontSize: isSmallerTitle ? "32px" : "48px",
            fontWeight: "extraLight",
            mb: "8px",
            transition: "font-size 240ms ease, transform 240ms ease",
            transform: isSmallerTitle ? "scale(0.95)" : "scale(1)",
            willChange: "font-size, transform",
          }}
        >
          Quote Smarter.
        </Typography>
        <Typography
          sx={{
            fontSize: isSmallerTitle ? "32px" : "48px",
            fontWeight: 700,
            transition: "font-size 240ms ease, transform 240ms ease",
            transform: isSmallerTitle ? "scale(0.98)" : "scale(1)",
            willChange: "font-size, transform",
          }}
        >
          Use Our Material Calculator
        </Typography>
      </Box>

      <ResponsiveCalculatorWrapper
        defaultWidth={1225}
        defaultHeight={680}
        mobileBreakpoint={700}
      >
        <Box sx={{ px: isMobileView ? "0px" : "1px", pb: "1px" }}>
          <Card
            ref={cardRef}
            elevation={0}
            sx={{
              position: "relative",
              m: "auto",
              my: "24px",
              pb: isMobileView ? "60px" : "0px",
              width: isMobileView ? "100%" : "1225px",
              height: isMobileView ? null : "820px",
              boxSizing: "border-box",
              borderRadius: "20px",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Options
              renderValue={renderValue}
              setRenderValue={setRenderValue}
              modeValue={modeValue}
              setModeValue={setModeValue}
            />

            {!isMobileView && (
              <PhotoUploadInfo />
            )}

            <Box
              sx={{
                display: isMobileView ? 'block' : 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <HouseType
                selectedHouseType={selectedHouseType}
                setSelectedHouseType={setSelectedHouseType}
                colorImage={selectedColourImage}
                isMobile={isMobileView}
              />
              <Form
                isMobile={isMobileView}
                renderValue={renderValue}
                selectedHouseType={selectedHouseType}
                setSelectedColourImage={setSelectedColourImage}
                modeValue={modeValue}
                setGeneratedHouseImage={setGeneratedHouseImage}
                setIsGeneratingImage={setIsGeneratingImage}
              />
            </Box>

            {!isMobileView &&
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: "32px", mt: "32px" }}>
                <img
                  src={EwiproLogo}
                  alt="Ewipro Logo"
                  style={{ height: "40px" }}
                />
              </Box>
            }
            <Box sx={{
              position: "absolute",
              bottom: isMobileView ? "10px" : "28px",
              right: isMobileView ? "calc(50% - 56px)" : undefined,
              left: isMobileView ? undefined : "24px",
              zIndex: 10
            }}>
              <ActionButton
                variant="contact"
                onClick={() => setIsQuoteModalOpen(true)}
                disabled={
                  !selectedColourImage || isGeneratingImage
                }
                isMobile={isMobileView}
              />
            </Box>
          </Card>
        </Box>
      </ResponsiveCalculatorWrapper>
      <QuoteFormModal
        open={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        generatedHouseImage={generatedHouseImage}
        renderValue={renderValue}
        selectedHouseType={selectedHouseType}
      />
    </>
  );
};

export default Render;