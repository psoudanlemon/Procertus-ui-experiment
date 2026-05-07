import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ModeProvider, ThemeProvider, TooltipProvider } from "@procertus-ui/ui";
import { ProcertusCategorizationProvider } from "@procertus-ui/ui-certification";

import {
  MOCK_PROTOTYPE_USERS,
  MockPrototypeAuthProvider,
  PrototypeOverlayProvider,
} from "@procertus-ui/ui-pt1-prototype";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*
      `app-wrapper` is a flex column with a fixed height (#root is h-full). The first child must
      use `flex-1 min-h-0` or the column never allocates height to the router tree — providers
      usually add no DOM, so without this wrapper `h-full` / `%` chains stop at zero height and
      docked panels (absolute inset-y-0) collapse invisibly.
    */}
    <div className="app-wrapper">
      <div className="app-height-chain flex min-h-0 w-full min-w-0 flex-1 flex-col">
        <BrowserRouter>
          <div className="app-height-chain flex min-h-0 w-full min-w-0 flex-1 flex-col">
            <ThemeProvider>
              <TooltipProvider delayDuration={300}>
                <ModeProvider>
                  <ProcertusCategorizationProvider>
                    <MockPrototypeAuthProvider users={MOCK_PROTOTYPE_USERS}>
                      <PrototypeOverlayProvider>
                        <App />
                      </PrototypeOverlayProvider>
                    </MockPrototypeAuthProvider>
                  </ProcertusCategorizationProvider>
                </ModeProvider>
              </TooltipProvider>
            </ThemeProvider>
          </div>
        </BrowserRouter>
      </div>
    </div>
  </StrictMode>,
);
