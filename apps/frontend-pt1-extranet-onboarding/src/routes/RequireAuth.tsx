import { Navigate, Outlet } from "react-router-dom";

import { usePrototypeSession } from "../auth/usePrototypeSession";

export function RequireAuth() {
  const { isAuthenticated } = usePrototypeSession();
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  return <Outlet />;
}
