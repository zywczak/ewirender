import React from "react";
import ReactDOM from "react-dom/client";
import reactToWebComponent from "react-to-webcomponent";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import Render from "./pages/Render";

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
});

const ThemedForm = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Render />
  </ThemeProvider>
);

const FormWidget = reactToWebComponent(ThemedForm, React, ReactDOM, {
  shadow: undefined,
});

customElements.define("form-widget", FormWidget);
