import React, { useEffect } from "react";
import { Box, Slide, Typography } from "@mui/material";
import EwiproLogo from "../../assets/EWI-Pro-Render-Systems.png";
import OPTION_IDS from "../form/colour/optionIds";

interface HouseTypeProps {
  selectedHouseType: number;
  setSelectedHouseType: (type: number) => void;
  colorImage: string;
  isMobile?: boolean;
}

const houseOptions = [
  {
    id: OPTION_IDS.HOUSE.DETACHED,
    label: "Detached",
  },
  {
    id: OPTION_IDS.HOUSE.SEMI_DETACHED,
    label: "Semi Detached",
  },
  {
    id: OPTION_IDS.HOUSE.TERRACED,
    label: "Mid Terrace",
  },
];

const HouseType: React.FC<HouseTypeProps> = ({
  selectedHouseType,
  setSelectedHouseType,
  colorImage,
  isMobile = false,
}) => {
  useEffect(() => {
    if (!selectedHouseType) {
      setSelectedHouseType(OPTION_IDS.HOUSE.DETACHED);
    }
  }, [selectedHouseType, setSelectedHouseType]);

  return (
    <Box
      sx={{
        px: "24px",
        width: isMobile ? null : "260px",
        height: isMobile ? "auto" : "490px",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? undefined : "space-between",
          mt: isMobile ? "24px" : "64px",
        }}
      >
        {isMobile && (
          <Box sx={{ marginLeft: "auto" }}>
            <img
              src={EwiproLogo}
              alt="Ewipro Logo"
              style={{ height: "30px" }}
            />
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          mt: "-5px",
          fontSize: "20px",
          fontWeight: 700,
          textAlign: "center",
          mb: "16px",
        }}
      >
        Type of House
      </Typography>

      <Box sx={{gap: "12px", display: "flex", flexDirection: "column", mb: isMobile ? "24px" : 0,}}>
        {houseOptions.map((option) => {
          const isSelected = selectedHouseType === option.id;

          return (
            <Box
              key={option.id}
              onClick={() => setSelectedHouseType(option.id)}
              sx={{
                cursor: "pointer",
                display: "flex",
                height: "45px",
                alignItems: "center",
                position: "relative",

                backgroundColor: isSelected ? "#48D858" : "transparent",
                border: isSelected ? "none" : "2px solid #E0E0E0",
                color: isSelected ? "#fff" : "#000",
                fontWeight: isSelected ? 700 : 400,
                borderRadius: "20px",

                transition: `
                  background-color 0.4s ease,
                  color 0.4s ease,
                  font-weight 0.4s ease
                `,

                "&:hover": {
                  backgroundColor: isSelected ? "#48D858" : "#8B959A",
                  color: "#fff",
                },

                "&:hover::before": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  fontWeight: isSelected ? 700 : 400,
                  fontSize: "16px",
                }}
              >
                {option.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {!isMobile && colorImage && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            bottom: "-7px",
            width: "212px",
            height: "200px",
            overflow: "hidden",
            ml: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "20px",
            zIndex: 2,
          }}
        >
          <Slide
            direction="left"
            in={!!colorImage}
            key={colorImage}
            timeout={600}
            easing={{ enter: "ease-in" }}
            appear
          >
            <Box sx={{ width: "100%", height: "100%" }}>
              <img
                src={colorImage}
                alt="Color"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            </Box>
          </Slide>
        </Box>
      )}
    </Box>
  );
};

export default HouseType;
