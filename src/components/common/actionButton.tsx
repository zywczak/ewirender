import React from "react";
import { Button } from "@mui/material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

interface ActionButtonProps {
  onClick: () => void;
  isMobile?: boolean;
  variant?: "accept" | "uploadHouse" | "contact";
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  variant = "accept",
  disabled = false,
  isMobile = false,
}) => {
  const getButtonWidth = () => {
    if (isMobile) return "100%";
    if (variant === "uploadHouse") return "260px";
    if (variant === "contact") return "212px";
    return "100px";
  };

  const getStartIcon = () => {
    if (variant === "accept") {
      return <CheckOutlinedIcon sx={{ fontSize: 20 }} />;
    }
    return null;
  };

  const getEndIcon = () => {
    if (variant === "uploadHouse") {
      return <FileUploadOutlinedIcon sx={{ fontSize: 20 }} />;
    }
    if (variant === "contact") {
      return <ContactSupportOutlinedIcon sx={{ fontSize: 20 }} />;
    }
    return null;
  };

  const getLabel = () => {
    switch (variant) {
      case "accept":
        return "Accept";
      case "uploadHouse":
        return "Upload your house photo";
      case "contact":
        return "Contact Form";
      default:
        return "";
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      startIcon={getStartIcon()}
      endIcon={getEndIcon()}
      sx={{
        backgroundColor: disabled ? "#BDBDBD" : "#48D858",
        width: getButtonWidth(),
        minWidth: isMobile ? "100%" : undefined,
        borderRadius: "999px",
        textTransform: "none",
        fontSize: "16px",
        fontWeight: 700,
        boxShadow: "none",
        color: "#fff",
        "&.Mui-disabled": {
          backgroundColor: "#BDBDBD",
          color: "#fff",
          opacity: 0.7,
        },
      }}
    >
      {getLabel()}
    </Button>
  );
};

export default ActionButton;
