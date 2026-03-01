import React from "react";
import { Box } from "@mui/material";
import { Switch } from "./Swtitch";

type OptionsProps = {
  renderValue: boolean;
  setRenderValue: (value: boolean) => void;
  modeValue: boolean;
  setModeValue: (value: boolean) => void;
};

const Options: React.FC<OptionsProps> = ({
  renderValue,
  setRenderValue,
  modeValue,
  setModeValue,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#EEEEEE",
        height: "75px",
        px: 4,
        mb: "12px",
      }}
    >
      {/* Switch 1 */}
      <Switch
        leftLabel="BRICK SLIPS"
        rightLabel="RENDER"
        value={renderValue}
        onChange={setRenderValue}
      />

      {/* Switch 2 */}
      <Switch
        leftLabel="CREATIVE"
        rightLabel="STRICT"
        value={modeValue}
        onChange={setModeValue}
      />
    </Box>
  );
};

export default Options;
