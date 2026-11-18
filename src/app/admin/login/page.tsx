import type { Metadata } from "next";
import Image from "next/image";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Staff login",
};

export default function AdminLoginPage() {
  return (
    <main className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden px-4 py-12 text-cream">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%] opacity-55"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(36,26,27,0.25)_0%,rgba(10,5,6,0.72)_50%,rgba(10,5,6,0.95)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,5,6,0.55)_0%,transparent_35%,rgba(10,5,6,0.88)_100%)]" />
        <div className="absolute -left-1/4 top-1/4 size-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(232,120,48,0.16)_0%,transparent_65%)] blur-2xl" />
        <div className="absolute inset-x-[12%] bottom-[-5%] h-[40%] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_80%,rgba(246,244,242,0.12)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-[1] w-full max-w-md">
        <div className="mb-7 flex flex-col items-center text-center">
          <span className="relative mb-4 flex size-14 items-center justify-center rounded-full border border-cream/25 bg-cream/10 shadow-[0_0_32px_rgba(94,15,29,0.35)] backdrop-blur-sm">
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="size-9 object-contain brightness-0 invert"
              priority
            />
          </span>
          <p className="font-eyebrow text-[10px] font-semibold tracking-[0.22em] text-cream/55 uppercase">
            Staff kitchen
          </p>
          <h1 className="font-display mt-2 text-4xl leading-none tracking-tight text-[#F3EADB] uppercase sm:text-5xl">
            Markhor admin
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/65">
            Enter the kitchen password to manage live orders and the board.
          </p>
        </div>

        <AdminLoginForm />

        <p className="mt-6 text-center font-mono text-[10px] tracking-[0.16em] text-cream/40 uppercase">
          Smoked low · Slow · Served hot
        </p>
      </div>
    </main>
  );
}
