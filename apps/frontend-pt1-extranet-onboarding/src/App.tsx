import { useMockPrototypeIsAuthenticated } from "@procertus-ui/ui-pt1-prototype";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedAppShell } from "./layouts/AuthenticatedAppShell";
import { PublicAppShell } from "./layouts/PublicAppShell";
import { RequestsOverviewPage } from "./pages/RequestsOverviewPage";
import { RequestCreationPage } from "./pages/RequestCreationPage";
import { RequestDetailPage } from "./pages/RequestDetailPage";
import { RequestEditPage } from "./pages/RequestEditPage";
import { CategorizationDemoPage } from "./pages/CategorizationDemoPage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { AnonymousOnboardingFlow } from "./features/onboarding/AnonymousOnboardingFlow";
import { AppPlaceholderPage } from "./pages/AppPlaceholderPage";
import { WelcomePage } from "./pages/WelcomePage";
import { OrganizationPage } from "./pages/OrganizationPage";
import { RequireAuth } from "./routes/RequireAuth";
import { PROTOTYPE_NAV_GROUPS } from "./navConfig";

const placeholderNavItems = PROTOTYPE_NAV_GROUPS.flatMap((group) => group.items);
const certificatesNavItem = placeholderNavItems.find((item) => item.key === "certificates-attestations");
const ordersNavItem = placeholderNavItems.find((item) => item.key === "orders");
const invoicesNavItem = placeholderNavItems.find((item) => item.key === "invoices");

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
          <Route path="/requests" element={<RequestsOverviewPage />} />
          <Route path="/requests/create" element={<RequestCreationPage />} />
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
          <Route path="/requests/:requestId/edit" element={<RequestEditPage />} />
          <Route
            path="/app/certificates-attestations"
            element={
              <AppPlaceholderPage
                title="Certificaten & Attesten"
                description="Bekijk straks de certificaten en attesten die aan je organisatie zijn gekoppeld."
                icon={certificatesNavItem!.icon}
              />
            }
          />
          <Route
            path="/app/orders"
            element={
              <AppPlaceholderPage
                title="Bestellingen"
                description="Volg straks je openstaande en afgeronde bestellingen op."
                icon={ordersNavItem!.icon}
              />
            }
          />
          <Route
            path="/app/invoices"
            element={
              <AppPlaceholderPage
                title="Facturen"
                description="Raadpleeg straks facturen en betaalstatussen voor je organisatie."
                icon={invoicesNavItem!.icon}
              />
            }
          />
          <Route path="/app/organization" element={<OrganizationPage />} />
          <Route path="/app/categorization" element={<CategorizationDemoPage />} />
          <Route path="/app/design-system" element={<DesignSystemPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}
