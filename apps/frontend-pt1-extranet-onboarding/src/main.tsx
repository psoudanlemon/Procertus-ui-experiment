import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ModeProvider, ThemeProvider } from "@procertus-ui/ui";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ModeProvider>
          <App />
        </ModeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
