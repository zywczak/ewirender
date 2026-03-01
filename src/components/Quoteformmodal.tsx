// Tracking params helper
const getTrackingParams = () => {
  const urlParams = new URLSearchParams(globalThis.location.search);
  const gclid = urlParams.get("gclid");
  const fbclid = urlParams.get("fbclid");
  let referrer = null;
  if (gclid) referrer = "gclid";
  else if (fbclid) referrer = "fbclid";
  return {
    referrer,
    trackingNumber: gclid ?? fbclid ?? null,
  };
};
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#48D858" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
    text: { primary: "#1a1a1a", secondary: "#6b7280" },
  },
  typography: {
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  },
  shape: { borderRadius: 14 },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: 0,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
          maxWidth: 480,
          width: "100%",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#f9fafb",
          "& fieldset": { borderColor: "#e5e7eb" },
          "&:hover fieldset": { borderColor: "#48D858" },
          "&.Mui-focused fieldset": { borderColor: "#48D858", borderWidth: 2 },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: 0.3,
          padding: "14px 0",
        },
      },
    },
  },
});

// ─── Validation ───────────────────────────────────────────────────────────────
const FIELDS = [
  {
    key: "name",
    label: "Name",
    regex: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,100}$/,
    icon: <PersonOutlineIcon />,
    type: "text",
    errorMsg: "Please enter a valid name.",
  },
  {
    key: "phone",
    label: "Phone",
    regex: /^\+?[1-9]\d{8,14}$/,
    icon: <PhoneOutlinedIcon />,
    type: "tel",
    errorMsg: "Please enter a valid phone number (e.g. +44123456789).",
  },
  {
    key: "email",
    label: "E-mail",
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    icon: <EmailOutlinedIcon />,
    type: "email",
    errorMsg: "Please enter a valid email address.",
  },
  {
    key: "postcode",
    label: "Postcode",
    regex: /^([A-Za-z0-9\s-]{3,10})$/,
    icon: <LocationOnOutlinedIcon />,
    type: "text",
    errorMsg: "Please enter a valid postcode.",
  },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];
type FormValues = Record<FieldKey, string>;
type FormErrors = Record<FieldKey, string>;

// ─── Component ────────────────────────────────────────────────────────────────
interface QuoteFormModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly generatedHouseImage?: string | null;
  readonly renderValue?: boolean;
  readonly selectedColorJson?: any;
  readonly selectedHouseType?: number;
}

export default function QuoteFormModal({
  open,
  onClose,
  generatedHouseImage,
  renderValue,
  selectedColorJson,
  selectedHouseType,
}: QuoteFormModalProps) {
  const [values, setValues] = useState<FormValues>({
    name: "",
    phone: "",
    email: "",
    postcode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    phone: "",
    email: "",
    postcode: "",
  });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    phone: false,
    email: false,
    postcode: false,
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'success' }>({ 
    open: false, 
    message: '', 
    severity: 'error' 
  });

  const getApiKey = () => {
    const urlParams = new URLSearchParams(globalThis.location.search);
    return urlParams.get("apiKEY") || import.meta.env.VITE_API_KEY || "51e904be14b69f404b782149c16681c3";
  };

  const validate = (key: FieldKey, value: string): string => {
    const field = FIELDS.find((f) => f.key === key)!;
    if (!value.trim()) return "This field is required.";
    if (!field.regex.test(value)) return field.errorMsg;
    return "";
  };

  const handleChange = (key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: validate(key, value) }));
    }
  };

  const handleBlur = (key: FieldKey) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validate(key, values[key]) }));
  };

  const handleSubmit = async () => {
    const newTouched = { name: true, phone: true, email: true, postcode: true };
    const newErrors: FormErrors = {
      name: validate("name", values.name),
      phone: validate("phone", values.phone),
      email: validate("email", values.email),
      postcode: validate("postcode", values.postcode),
    };
    setTouched(newTouched);
    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e !== "")) return;

    // Przygotuj customer_details
    const customer_details = {
      name: values.name,
      phone: values.phone,
      email: values.email,
      postcode: values.postcode,
    };
    // Materiał
    const material = renderValue ? "brick_slips" : "render";
    // Kolor
    const color = selectedColorJson || null;
    // Tryb
    const mode = globalThis.sessionStorage.getItem("modeValue") === "true" ? "creative" : "strict";
    // Photo (base64 z AI)
    const photo = generatedHouseImage || null;
    // Tracking
    const trackingParams = getTrackingParams();

    let houseType = null;
    if (selectedHouseType === 1) houseType = "mid terraced";
    else if (selectedHouseType === 2) houseType = "semi-detached";
    else if (selectedHouseType === 3) houseType = "detached";

    const payload = {
      apiKEY: getApiKey(),
      customer_details,
      material,
      color,
      mode,
      photo,
      houseType,
      ...trackingParams,
    };
    console.log(payload)

    setLoading(true);
    try {
      const res = await fetch("https://veen-e.ewipro.com:7443/ewi-calculator/log.php", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error('Form submission error:', err);
      setSnackbar({
        open: true,
        message: 'Failed to send request. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      // Keep values - don't reset user's input
      setErrors({ name: "", phone: "", email: "", postcode: "" });
      setTouched({ name: false, phone: false, email: false, postcode: false });
    }, 300);
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slots={{ transition: Fade }}
        transitionDuration={300}
        disableRestoreFocus={true}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(4px)",
            },
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            alignItems: "center",
          },
          "& .MuiDialogContent-root": {
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        }}
      >
        {/* Accent bar at top */}
        <Box sx={{ height: 6, background: "linear-gradient(90deg, #48D858 0%, #22c55e 100%)" }} />

        <DialogTitle
          sx={{
            px: 4,
            pt: 3,
            pb: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, lineHeight: 1.25, mt: 0.5, color: "text.primary" }}
            >
              Receive{" "}
              <Box component="span" sx={{ color: "#48D858" }}>
                Your
              </Box>{" "}
              Personalised Quote!
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            disabled={loading}
            sx={{ mt: 0.5, color: "text.secondary", "&:hover": { color: "text.primary" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 4, pt: 2, pb: 4 }}>
          {submitted ? (
            <Fade in={submitted}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 4,
                  gap: 2,
                  textAlign: "center",
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "#48D858" }} />
                <Typography variant="h6" fontWeight={700}>
                  Quote Request Sent!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                  We&apos;ve received your details. Your personalised quote will be emailed to{" "}
                  <Box component="span" fontWeight={600} color="text.primary">
                    {values.email}
                  </Box>{" "}
                  within a few minutes.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{
                    mt: 1,
                    borderColor: "#48D858",
                    color: "#48D858",
                    "&:hover": { borderColor: "#22c55e", backgroundColor: "rgba(72,216,88,0.06)" },
                  }}
                >
                  Close
                </Button>
              </Box>
            </Fade>
          ) : (
            <Fade in={!submitted}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 3, lineHeight: 1.6 }}
                >
                  To get a personalised quote with a generous discount, please fill in your details below.
                  Your quote will be emailed to you within a few minutes.
                </Typography>

                {/* Podgląd zdjęcia jeśli przekazane */}
                {(generatedHouseImage) && (
                  <Box sx={{ mb: 2, textAlign: "center" }}>
                    <img
                      src={generatedHouseImage || ""}
                      alt="House preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "220px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                        border: "1px solid #e5e7eb"
                      }}
                    />
                  </Box>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {FIELDS.map((field) => (
                    <TextField
                      key={field.key}
                      fullWidth
                      variant="outlined"
                      label={field.label}
                      type={field.type}
                      value={values[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      onBlur={() => handleBlur(field.key)}
                      error={touched[field.key] && !!errors[field.key]}
                      helperText={touched[field.key] ? errors[field.key] : ""}
                      disabled={loading}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start" sx={{ color: "#48D858" }}>
                              {field.icon}
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    mt: 3,
                    color: "#fff",
                    background: "linear-gradient(135deg, #48D858 0%, #22c55e 100%)",
                    boxShadow: "0 4px 20px rgba(72,216,88,0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #3ec94f 0%, #16a34a 100%)",
                      boxShadow: "0 6px 24px rgba(72,216,88,0.5)",
                    },
                    "&:disabled": { opacity: 0.7 },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: "#fff" }} />
                  ) : (
                    "Contact Us"
                  )}
                </Button>
              </Box>
            </Fade>
          )}
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}