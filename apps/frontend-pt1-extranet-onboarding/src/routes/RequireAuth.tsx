import { Navigate, Outlet } from "react-router-dom";

import { useMockPrototypeIsAuthenticated } from "@procertus-ui/ui-pt1-prototype";

export function RequireAuth() {
  const isAuthenticated = useMockPrototypeIsAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  return <Outlet />;
}
