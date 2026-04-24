import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ModeProvider, ThemeProvider, TooltipProvider } from "@procertus-ui/ui";

import { PrototypeSessionProvider } from "./auth/PrototypeSessionProvider";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider delayDuration={300}>
          <ModeProvider>
            <PrototypeSessionProvider>
              <App />
            </PrototypeSessionProvider>
          </ModeProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
