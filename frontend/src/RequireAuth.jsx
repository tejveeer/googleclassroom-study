import { Navigate, Outlet } from "react-router";
import { useUser } from "./pages/home/api/queries";

export function RequireAuth() {
  const { isLoading, isError } = useUser()
  if (isLoading) {
    return <div>Checking session…</div>;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
