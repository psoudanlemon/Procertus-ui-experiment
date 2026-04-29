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
import { OnboardingRegistrationCompletePage } from "./pages/OnboardingRegistrationCompletePage";
import { SignupPage } from "./pages/SignupPage";
import { OrganizationPage } from "./pages/OrganizationPage";
import { OrganizationProfilePage } from "./pages/OrganizationProfilePage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfileChangeRequestsPage } from "./pages/ProfileChangeRequestsPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { RequireAuth } from "./routes/RequireAuth";
import { PROTOTYPE_NAV_GROUPS, PROTOTYPE_PRIMARY_NAV } from "./navConfig";

const primaryNavByKey = (key: string) => PROTOTYPE_PRIMARY_NAV.find((item) => item.key === key)!;

const placeholderNavItems = PROTOTYPE_NAV_GROUPS.flatMap((group) => group.items);
const certificatesNavItem = placeholderNavItems.find(
  (item) => item.key === "certificates-attestations",
);
const ordersNavItem = placeholderNavItems.find((item) => item.key === "orders");
const invoicesNavItem = placeholderNavItems.find((item) => item.key === "invoices");

function RootRedirect() {
  const isAuthenticated = useMockPrototypeIsAuthenticated();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/welcome"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/registratie-voltooid" element={<OnboardingRegistrationCompletePage />} />

      <Route element={<PublicAppShell />}>
        <Route path="/welcome" element={<SignupPage />} />
        <Route path="/welcome/start" element={<AnonymousOnboardingFlow />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AuthenticatedAppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/user-management"
            element={
              <AppPlaceholderPage
                title="Gebruikersbeheer"
                description="Nodig straks collega’s uit, wijs rollen toe en beheer toegang tot het extranet."
                icon={primaryNavByKey("user-management").icon}
              />
            }
          />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/organization-profile" element={<OrganizationProfilePage />} />
          <Route path="/profile-change-requests" element={<ProfileChangeRequestsPage />} />
          <Route path="/requests" element={<RequestsOverviewPage />} />
          <Route path="/requests/create" element={<RequestCreationPage />} />
          <Route path="/requests/:requestId" element={<RequestDetailPage />} />
          <Route path="/requests/:requestId/edit" element={<RequestEditPage />} />
          <Route
            path="/certificates-attestations"
            element={
              <AppPlaceholderPage
                title="Certificaten & Attesten"
                description="Bekijk straks de certificaten en attesten die aan je organisatie zijn gekoppeld."
                icon={certificatesNavItem!.icon}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <AppPlaceholderPage
                title="Bestellingen"
                description="Volg straks je openstaande en afgeronde bestellingen op."
                icon={ordersNavItem!.icon}
              />
            }
          />
          <Route
            path="/invoices"
            element={
              <AppPlaceholderPage
                title="Facturen"
                description="Raadpleeg straks facturen en betaalstatussen voor je organisatie."
                icon={invoicesNavItem!.icon}
              />
            }
          />
          <Route path="/organization" element={<OrganizationPage />} />
          <Route path="/categorization" element={<CategorizationDemoPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}
