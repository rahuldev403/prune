"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

type NotifyLeadFormProps = {
  auditId: string;
};

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

const CONFETTI_PIECES = [
  { x: -36, y: -26, rotate: 18, color: "var(--primary)" },
  { x: 12, y: -34, rotate: 42, color: "var(--primary)" },
  { x: 38, y: -12, rotate: 70, color: "var(--foreground)" },
  { x: -28, y: 16, rotate: -12, color: "var(--foreground)" },
  { x: 22, y: 24, rotate: 28, color: "var(--primary)" },
  { x: -8, y: 34, rotate: -36, color: "var(--primary)" },
  { x: 6, y: -6, rotate: 8, color: "var(--foreground)" },
];

export function NotifyLeadForm({ auditId }: NotifyLeadFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!showConfetti) return;
    const timeout = setTimeout(() => setShowConfetti(false), 900);
    return () => clearTimeout(timeout);
  }, [showConfetti]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !auditId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, auditId }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send email");
      }

      setEmail("");
      setToast({ type: "success", message: "Gmail sent successfully." });
      setShowConfetti(true);
    } catch (error) {
      console.error("Lead capture failed:", error);
      setToast({
        type: "error",
        message: "We could not send that email. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="founder@startup.com"
            className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg  transition disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary-foreground/30 ${
              isSubmitting
                ? "border-t-primary-foreground animate-spin"
                : "border-primary-foreground/50"
            }`}
            aria-hidden
          />
          <span className="tracking-[0.2em] uppercase text-xs">
            {isSubmitting ? "Sending" : "Notify me"}
          </span>
          <span
            aria-hidden
            className="hidden text-base transition-transform duration-300 group-hover:translate-x-0.5 sm:inline"
          >
            →
          </span>
          {showConfetti && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              {CONFETTI_PIECES.map((piece, index) => (
                <span
                  key={index}
                  className="confetti-piece"
                  style={
                    {
                      "--confetti-x": `${piece.x}px`,
                      "--confetti-y": `${piece.y}px`,
                      "--confetti-rotate": `${piece.rotate}deg`,
                      "--confetti-color": piece.color,
                      "--confetti-delay": `${index * 30}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </span>
          )}
        </button>
      </form>

      {toast && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50">
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur animate-in fade-in slide-in-from-bottom-3 duration-300 ${
              toast.type === "success"
                ? "border-primary/30 bg-background/90 text-foreground"
                : "border-destructive/40 bg-background/90 text-foreground"
            }`}
            role="status"
            aria-live="polite"
          >
            <span
              className={`mt-0.5 inline-flex h-2.5 w-2.5 rounded-full ${
                toast.type === "success" ? "bg-primary" : "bg-destructive"
              }`}
              aria-hidden
            />
            <div className="text-sm font-medium">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
