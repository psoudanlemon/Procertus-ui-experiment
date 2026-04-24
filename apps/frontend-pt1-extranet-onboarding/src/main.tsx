import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ModeProvider, ThemeProvider, TooltipProvider } from "@procertus-ui/ui";

import { MockPrototypeAuthProvider } from "@procertus-ui/ui-pt1-prototype";

import App from "./App";
import { MOCK_PROTOTYPE_USERS } from "./data/mock-prototype-users";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider delayDuration={300}>
          <ModeProvider>
            <MockPrototypeAuthProvider users={MOCK_PROTOTYPE_USERS}>
              <App />
            </MockPrototypeAuthProvider>
          </ModeProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
