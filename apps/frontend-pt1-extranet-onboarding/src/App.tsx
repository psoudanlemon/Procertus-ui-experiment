import { useMockPrototypeIsAuthenticated } from "@procertus-ui/ui-pt1-prototype";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedAppShell } from "./layouts/AuthenticatedAppShell";
import { PublicAppShell } from "./layouts/PublicAppShell";
import { AuthenticatedHomePage } from "./pages/AuthenticatedHomePage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { OnboardingEntryPlaceholderPage } from "./pages/OnboardingEntryPlaceholderPage";
import { WelcomePage } from "./pages/WelcomePage";
import { RequireAuth } from "./routes/RequireAuth";

function RootRedirect() {
  const isAuthenticated = useMockPrototypeIsAuthenticated();
  return <Navigate to={isAuthenticated ? "/app" : "/welcome"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/design-system" element={<Navigate to="/app/design-system" replace />} />

      <Route element={<PublicAppShell />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/welcome/start" element={<OnboardingEntryPlaceholderPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AuthenticatedAppShell />}>
          <Route path="/app" element={<AuthenticatedHomePage />} />
          <Route path="/app/design-system" element={<DesignSystemPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}
