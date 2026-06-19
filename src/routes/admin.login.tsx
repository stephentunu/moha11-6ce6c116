// This route is kept only so that any old bookmarks or links pointing to
// /admin/login don't dead-end. Admin and regular-user sign-in now happens
// through one unified page at /signin — entering the admin email/password
// there logs the admin straight into the dashboard with no extra click.

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Moha Delivers" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginRedirect,
});

function AdminLoginRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/signin", replace: true });
  }, [navigate]);
  return null;
}