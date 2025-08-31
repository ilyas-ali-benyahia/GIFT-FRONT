import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import LandingPage from "./LandingPage.jsx";

// --- your custom theme (same as you wrote) ---
const theme = extendTheme({
  direction: "ltr",
  fonts: {
    heading: '"Noto Sans Arabic", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    body: '"Noto Sans Arabic", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  // ... rest of your theme
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);
