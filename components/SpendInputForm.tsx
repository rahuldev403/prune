"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { spendFormSchema, type SpendFormValues, TOOL_OPTIONS, USE_CASES } from "@/lib/validations/spend";

const LOCAL_STORAGE_KEY = "prune_audit_state";

export function SpendInputForm() {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<SpendFormValues>({
    resolver: zodResolver(spendFormSchema) as any,
    defaultValues: {
      teamSize: "",
      primaryUseCase: "mixed",
      tools: [{ toolName: "ChatGPT", plan: "Plus", seats: 1, monthlySpend: 20 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tools",
  });
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (e) {
        console.error("Failed to parse saved form state");
      }
    }
  }, [form]);

  // 2. On Change: Save data to LocalStorage (PRD Requirement)
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = (data: SpendFormValues) => {
    console.log("Submitting to Audit Engine:", data);
    // Tomorrow we will pass this data to our Drizzle DB and Audit Engine API!
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) return <div className="h-64 animate-pulse bg-muted rounded-lg w-full"></div>;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
      {/* Company Context */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Team Size</label>
          <input 
            {...form.register("teamSize")} 
            placeholder="e.g., 10-50"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Use Case</label>
          <select 
            {...form.register("primaryUseCase")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {USE_CASES.map(uc => <option key={uc} value={uc}>{uc.charAt(0).toUpperCase() + uc.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Tool Stack Array */}
      <div className="space-y-4 border-t border-border pt-6">
        <h3 className="text-lg font-semibold tracking-tight">Your Stack</h3>
        
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-start bg-muted/30 p-4 rounded-lg border border-border/50">
            <select {...form.register(`tools.${index}.toolName` as const)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {TOOL_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            
            <input {...form.register(`tools.${index}.plan` as const)} placeholder="Plan (e.g. Pro)" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input {...form.register(`tools.${index}.seats` as const)} type="number" placeholder="Seats" className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input {...form.register(`tools.${index}.monthlySpend` as const)} type="number" placeholder="$ Spend" className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            
            <button type="button" onClick={() => remove(index)} className="h-10 px-3 text-red-500 hover:bg-red-500/10 rounded-md text-sm font-medium transition-colors">
              Remove
            </button>
          </div>
        ))}

        <button 
          type="button" 
          onClick={() => append({ toolName: "Cursor", plan: "", seats: 1, monthlySpend: 0 })}
          className="text-sm font-medium text-primary hover:underline"
        >
          + Add another tool
        </button>
      </div>

      <button type="submit" className="w-full bg-primary text-primary-foreground h-10 rounded-md font-medium hover:bg-primary/90 transition-colors">
        Run Audit
      </button>
    </form>
  );
}