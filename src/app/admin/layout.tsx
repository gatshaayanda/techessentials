// src/app/admin/layout.tsx
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Tech Essentials – Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // ✅ works whether cookies() is typed as async or sync in your Next version
  const token = (await cookies()).get("admin_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return <>{children}</>;
}
