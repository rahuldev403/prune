"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SpendInputForm } from "@/components/forms/SpendInputForm";

const MODAL_STORAGE_KEY = "prune_audit_modal_open";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(MODAL_STORAGE_KEY);
    if (saved === "true") {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
    localStorage.setItem(MODAL_STORAGE_KEY, "true");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    localStorage.setItem(MODAL_STORAGE_KEY, "false");
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 w-2xl">
        <div className="absolute  right-[-12%] h-104 w-120 rounded-[42%] bg-primary/10 blur-[160px]" />
      </div>

      <section className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 py-12 text-left">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Credex - Prune
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
              Your AI spend, rebuilt for clarity.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Identify redundant tools, overpriced tiers, and missed pricing
              efficiencies in minutes. Get a financial-grade audit tailored to
              how your team actually uses AI.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={openModal}
                className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground cursor-pointer"
              >
                Run the audit
              </button>
              <button
                type="button"
                onClick={openModal}
                className="h-12 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground hover:bg-muted cursor-pointer"
              >
                See how it works
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-muted/10">
              <Image
                src="/illustration.png"
                alt="Team reviewing AI usage with an assistant"
                width={900}
                height={720}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              title: "Precision pricing",
              description:
                "Benchmarks against retail tiers and flags spend leakage fast.",
              icon: (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              ),
            },
            {
              title: "Overlap detection",
              description:
                "Highlights redundant tools and consolidates your AI stack.",
              icon: (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="12" r="5" />
                  <circle cx="15" cy="12" r="5" />
                </svg>
              ),
            },
            {
              title: "Actionable savings",
              description:
                "Clear next steps with monthly and annual impact totals.",
              icon: (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 18h16" />
                  <path d="M7 18V9" />
                  <path d="M12 18V6" />
                  <path d="M17 18v-4" />
                </svg>
              ),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  {item.icon}
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Use cases
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card/70 px-3 py-4">
            <div className="flex w-max gap-3 animate-[prune-carousel_22s_linear_infinite]">
              {[
                "Cut redundant IDE seats in 1 audit",
                "Unify ChatGPT + Claude costs",
                "Verify retail pricing vs. spend",
                "Surface unused premium tiers",
                "Monthly AI spend health check",
              ].map((copy) => (
                <div
                  key={copy}
                  className="min-w-55 rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-xs font-semibold text-foreground"
                >
                  {copy}
                </div>
              ))}
              {[
                "Cut redundant IDE seats in 1 audit",
                "Unify ChatGPT + Claude costs",
                "Verify retail pricing vs. spend",
                "Surface unused premium tiers",
                "Monthly AI spend health check",
              ].map((copy) => (
                <div
                  key={`dup-${copy}`}
                  className="min-w-55 rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-xs font-semibold text-foreground"
                >
                  {copy}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes prune-carousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
              aria-label="Close audit form"
            >
              ×
            </button>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                Audit input
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Enter your stack details
              </h2>
              <p className="text-sm text-muted-foreground">
                Your progress persists on reload until you explicitly close the
                form.
              </p>
            </div>
            <div className="mt-6">
              <SpendInputForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
