import { SpendInputForm } from "@/components/SpendInputForm";

export default function Home() {
  return (
    <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Are you overpaying for AI?
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          Most startups leak thousands of dollars a month on redundant AI tools
          and unoptimized tiers. Run a free audit to see your actual usage-fit.
        </p>
      </div>
      <div className="border border-border rounded-xl p-6 md:p-8 bg-card text-card-foreground shadow-sm">
        <SpendInputForm />
      </div>
    </div>
  );
}
