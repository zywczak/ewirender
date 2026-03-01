import { Box, Switch as MuiSwitch, styled } from "@mui/material";

type SwitchProps = {
  readonly leftLabel: string;
  readonly rightLabel: string;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
};

const trackWidth = 160;
const trackHeight = 36;
const thumbSize = 24;

const StyledSwitch = styled(MuiSwitch)(() => ({
  width: trackWidth,
  height: trackHeight,
  padding: 0,

  "& .MuiSwitch-switchBase": {
    padding: 6,
    transition: "transform 0.3s ease",
  },

  "& .MuiSwitch-thumb": {
    width: thumbSize,
    height: thumbSize,
    boxShadow: "none",
    backgroundColor: "#fff",
  },

  "& .MuiSwitch-track": {
    borderRadius: trackHeight / 2,
    opacity: 1,
    boxSizing: "border-box",
    backgroundColor: "#48D858",
  },

  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#8B959A",
  },
}));

export function Switch({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: SwitchProps) {
  const handleToggle = () => {
    onChange(!value);
  };

  const translateX = value ? trackWidth - thumbSize - 16 : 0;

  // value=false → kciuk po LEWEJ  → tekst po PRAWEJ  (rightLabel, flex-end)
  // value=true  → kciuk po PRAWEJ → tekst po LEWEJ   (leftLabel,  flex-start)
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        width: trackWidth,
        cursor: "pointer",
      }}
      onClick={handleToggle}
    >
      <StyledSwitch
        checked={value}
        sx={{
          "& .MuiSwitch-switchBase": {
            transform: `translateX(${translateX}px)`,
          },
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 22,
          right: 22,
          display: "flex",
          justifyContent: value ? "flex-start" : "flex-end",
          transform: "translateY(-50%)",
          fontSize: "16px",
          fontWeight: 700,
          color: "#333",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {value ? leftLabel : rightLabel}
      </Box>
    </Box>
  );
}