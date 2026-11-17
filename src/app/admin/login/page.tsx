import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Staff login",
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-10">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
        Staff
      </p>
      <h1 className="mt-1 font-heading text-2xl font-semibold text-ink">
        Markhor admin
      </h1>
      <p className="mt-2 text-sm text-muted">
        Enter the kitchen password to manage orders.
      </p>
      <div className="mt-6">
        <AdminLoginForm />
      </div>
    </main>
  );
}
