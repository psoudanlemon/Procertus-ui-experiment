import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ModeProvider, ThemeProvider, TooltipProvider } from "@procertus-ui/ui";
import { ProcertusCategorizationProvider } from "@procertus-ui/ui-certification";

import { MOCK_PROTOTYPE_USERS, MockPrototypeAuthProvider } from "@procertus-ui/ui-pt1-prototype";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider delayDuration={300}>
          <ModeProvider>
            <ProcertusCategorizationProvider>
              <MockPrototypeAuthProvider users={MOCK_PROTOTYPE_USERS}>
                <App />
              </MockPrototypeAuthProvider>
            </ProcertusCategorizationProvider>
          </ModeProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
