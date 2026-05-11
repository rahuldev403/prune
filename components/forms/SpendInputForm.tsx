"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  spendFormSchema,
  type SpendFormValues,
  TOOL_OPTIONS,
  USE_CASES,
} from "@/lib/validations/spend";
import { PRICING_DB, type ToolName } from "@/lib/pricing";

const LOCAL_STORAGE_KEY = "prune_audit_state";

export function SpendInputForm() {
  const [isMounted, setIsMounted] = useState(false);
  const form = useForm<SpendFormValues>({
    resolver: zodResolver(spendFormSchema) as any,
    defaultValues: {
      teamSize: "",
      primaryUseCase: "mixed",
      tools: [
        { toolName: "ChatGPT", plan: "Plus", seats: 1, monthlySpend: 20 },
      ],
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

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: SpendFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.auditId) {
        localStorage.removeItem("prune_audit_state");

        router.push(`/audit/${result.auditId}`);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted)
    return (
      <div className="h-64 animate-pulse bg-muted rounded-lg w-full"></div>
    );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 w-full">
      <div className="grid gap-6 rounded-xl border border-border bg-muted/20 p-6 md:grid-cols-2 items-start">
        <div className="flex h-full flex-col gap-2">
          <label className="text-sm font-semibold leading-tight">
            Team Size
          </label>
          <p className="min-h-[32px] text-xs leading-tight text-muted-foreground">
            Headcount range helps contextualize recommendations.
          </p>
          <input
            {...form.register("teamSize")}
            placeholder="e.g., 10-50"
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex h-full flex-col gap-2">
          <label className="text-sm font-semibold leading-tight">
            Primary Use Case
          </label>
          <p className="min-h-[32px] text-xs leading-tight text-muted-foreground">
            Determines which optimizations matter most.
          </p>
          <input type="hidden" {...form.register("primaryUseCase")} />
          <DropdownSelect
            label="Primary Use Case"
            value={form.watch("primaryUseCase")}
            options={USE_CASES.map((uc) => ({
              label: uc.charAt(0).toUpperCase() + uc.slice(1),
              value: uc,
            }))}
            onChange={(value) => form.setValue("primaryUseCase", value)}
          />
        </div>
      </div>
      <div className="space-y-4 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Your Stack</h3>
            <p className="text-sm text-muted-foreground">
              Add each tool with plan, seats, and actual spend.
            </p>
          </div>
        </div>

        {fields.map((field, index) =>
          (() => {
            const selectedTool = form.watch(`tools.${index}.toolName`) as
              | ToolName
              | undefined;
            const planOptions = selectedTool
              ? Object.keys(PRICING_DB[selectedTool] ?? {})
              : [];

            return (
              <div
                key={field.id}
                className="grid gap-4 rounded-lg border border-border/50 bg-muted/30 p-4 md:grid-cols-[1.1fr_1fr_0.6fr_0.8fr_auto]"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Tool
                  </label>
                  <input
                    type="hidden"
                    {...form.register(`tools.${index}.toolName` as const)}
                  />
                  <DropdownSelect
                    label="Tool"
                    value={form.watch(`tools.${index}.toolName` as const)}
                    options={TOOL_OPTIONS.map((tool) => ({
                      label: tool,
                      value: tool,
                    }))}
                    onChange={(value) =>
                      form.setValue(`tools.${index}.toolName` as const, value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Plan
                  </label>
                  <input
                    type="hidden"
                    {...form.register(`tools.${index}.plan` as const)}
                  />
                  <DropdownSelect
                    label="Plan"
                    value={form.watch(`tools.${index}.plan` as const)}
                    placeholder="Select plan"
                    options={planOptions.map((planOption) => ({
                      label: planOption,
                      value: planOption,
                    }))}
                    onChange={(value) =>
                      form.setValue(`tools.${index}.plan` as const, value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Seats
                  </label>
                  <input
                    {...form.register(`tools.${index}.seats` as const)}
                    type="number"
                    min={1}
                    placeholder="1"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Monthly Spend
                  </label>
                  <input
                    {...form.register(`tools.${index}.monthlySpend` as const)}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="$0"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-6 h-11 rounded-md border border-red-500/30 px-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            );
          })(),
        )}

        <button
          type="button"
          onClick={() =>
            append({ toolName: "Cursor", plan: "", seats: 1, monthlySpend: 0 })
          }
          className="inline-flex items-center justify-center rounded-md border border-dashed border-primary/40 px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10 cursor-pointer"
        >
          + Add another tool
        </button>
      </div>

      <button
        type="submit"
        className="h-12 w-full rounded-md bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer"
      >
        {isSubmitting ? "Running Audit..." : "Run Audit"}
      </button>
    </form>
  );
}

type SelectOption = { label: string; value: string };

type DropdownSelectProps = {
  label: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
};

function DropdownSelect({
  label,
  value,
  options,
  placeholder = "Select",
  onChange,
}: DropdownSelectProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const selected = options.find((option) => option.value === value);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  };

  return (
    <details ref={detailsRef} className="relative">
      <summary className="flex h-11 w-full cursor-pointer list-none items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm">
        <span
          className={selected ? "text-foreground" : "text-muted-foreground"}
        >
          {selected ? selected.label : placeholder}
        </span>
        <span className="text-xs text-muted-foreground">▼</span>
      </summary>
      <div className="absolute top-full mt-2 max-h-56 w-full overflow-auto rounded-md border border-border bg-background shadow-lg">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
        <div className="border-t border-border" />
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
          >
            {option.label}
            {option.value === value && (
              <span className="text-xs text-primary">Selected</span>
            )}
          </button>
        ))}
        {options.length === 0 && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No plans available.
          </div>
        )}
      </div>
    </details>
  );
}
