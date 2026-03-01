import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { BRICK_SLIPS_COLOURS, RENDER_COLOURS } from "./Colourdata";

export interface InputProps {
  value: string | number;
  onChange: (value: string, image: string, id: number, index?: number) => void;
  isMobile?: boolean;
  isBrickSlips: boolean;
  disabled?: boolean;
}

const ITEMS_PER_PAGE = 18;

type ColourItem = {
  id: number;
  value: string;
  label: string;
  image: string;
};


const ColourInput: React.FC<InputProps> = ({
  value,
  onChange,
  isMobile = false,
  isBrickSlips,
  disabled = false,
}) => {
  const [page, setPage] = useState(0);
  const [colors, setColors] = useState<ColourItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* ✅ NORMALIZACJA DANYCH — JEDNA STRUKTURA */
  useEffect(() => {
    setLoading(true);

    const mappedColors: ColourItem[] = (
  isBrickSlips ? BRICK_SLIPS_COLOURS : RENDER_COLOURS
  ).map((color) => ({
    id: color.id,
    // prefer json_value (payload expected by backend), fallback to option_value
    value: color.json_value || color.option_value,
    label: color.option_value || color.json_value,
    image: color.image,
  }));

    setColors(mappedColors);
    setPage(0);
    setLoading(false);
  }, [isBrickSlips]);

  const totalPages = Math.ceil(colors.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;

  const currentPageColors = colors.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSelect = (color: ColourItem & { id: number }, index: number) => {
    if (disabled) return;
    onChange(color.value, color.image, color.id, index); // ✅ przekaż id
  };

  const nextPage = () =>
    setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const prevPage = () =>
    setPage((prev) => Math.max(prev - 1, 0));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: isMobile ? "calc(100% - 48px)" : "240px",
        mx: "24px",
        mt: "12px",
        pb: isMobile ? "24px" : 0,
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: 700,
          mb: 1,
        }}
      >
        Select colour
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: "12px" }}>
          <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#333" }}>
            Page <span style={{ color: "#333" }}>{page + 1}</span>
            <span style={{ color: "#aaa" }}>/{totalPages}</span>
          </Typography>
          <Box sx={{ flexGrow: 1, height: "1px", backgroundColor: "#ccc", mx: "10px" }} />
          <Box display="flex" alignItems="center" gap={"32px"}>
            <IconButton onClick={prevPage} disabled={page === 0 || disabled} sx={{ backgroundColor: "#c4c4c4", height: "30px", width: "30px", "&:hover": { backgroundColor: "#D0D0D0" }, "&.Mui-disabled": { backgroundColor: "#E0E0E0", color: "#aaa" } }}>
              <ArrowBackRoundedIcon sx={{ fontSize: 18, color: "#fff", "&.Mui-disabled": { color: "#aaa" } }} />
            </IconButton>
            <IconButton onClick={nextPage} disabled={page === totalPages - 1 || disabled} sx={{ backgroundColor: "#c4c4c4", height: "30px", width: "30px", "&:hover": { backgroundColor: "#D0D0D0" }, "&.Mui-disabled": { backgroundColor: "#e0e0e0ff", color: "#aaa" } }}>
              <ArrowForwardRoundedIcon sx={{ fontSize: 18, color: "#fff", "&.Mui-disabled": { color: "#aaa" } }} />
            </IconButton>
          </Box>
        </Box>

      {/* GRID */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "repeat(4, 1fr)" : "repeat(3, 1fr)"}
        gap="8px"
      >
        {currentPageColors.map((color, index) => {
          const isSelected = value === color.value;

          return (
            <Box
              key={color.value}
              onClick={disabled ? undefined : () => handleSelect(color, index)}
              role="button"
              aria-disabled={disabled}
              sx={{
                aspectRatio: "73/48",
                borderRadius: "12px",
                cursor: disabled ? "not-allowed" : "pointer",
                overflow: "hidden",
                position: "relative",
                transition: "transform 0.15s ease-in-out, opacity 0.15s",
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? "none" : "auto",
                "&:hover": disabled ? {} : { transform: "scale(1.03)" },
              }}
            >
              <img
                src={color.image}
                alt={color.label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {isSelected && (
                <Box
                  sx={{
                    position: "absolute",
                    borderRadius: "10px", 
                    inset: 0,
                    backgroundColor: "#3333339d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    my: "4px" 
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                  >
                    {color.label}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ColourInput;
