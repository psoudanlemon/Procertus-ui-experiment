import { useMockPrototypeIsAuthenticated } from "@procertus-ui/ui-pt1-prototype";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedAppShell } from "./layouts/AuthenticatedAppShell";
import { PublicAppShell } from "./layouts/PublicAppShell";
import {
  AuthenticatedHomePage,
  AuthenticatedRequestCreatePage,
  AuthenticatedRequestDetailPage,
  AuthenticatedRequestEditPage,
} from "./pages/AuthenticatedHomePage";
import { CategorizationDemoPage } from "./pages/CategorizationDemoPage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { AnonymousOnboardingFlow } from "./features/onboarding/AnonymousOnboardingFlow";
import { WelcomePage } from "./pages/WelcomePage";
import { OrganizationPage } from "./pages/OrganizationPage";
import { RequireAuth } from "./routes/RequireAuth";

function RootRedirect() {
  const isAuthenticated = useMockPrototypeIsAuthenticated();
  return <Navigate to={isAuthenticated ? "/requests" : "/welcome"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/design-system" element={<Navigate to="/app/design-system" replace />} />

      <Route element={<PublicAppShell />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/welcome/start" element={<AnonymousOnboardingFlow />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AuthenticatedAppShell />}>
          <Route path="/requests" element={<AuthenticatedHomePage />} />
          <Route path="/requests/create" element={<AuthenticatedRequestCreatePage />} />
          <Route path="/requests/:requestId" element={<AuthenticatedRequestDetailPage />} />
          <Route path="/requests/:requestId/edit" element={<AuthenticatedRequestEditPage />} />
          <Route path="/app/organization" element={<OrganizationPage />} />
          <Route path="/app/categorization" element={<CategorizationDemoPage />} />
          <Route path="/app/design-system" element={<DesignSystemPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}
