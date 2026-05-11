import { db } from "./../../../index";
import { NextResponse } from "next/server";
import { runAuditEngine } from "@/lib/engine";
import { audits } from "@/db/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const engineResult = runAuditEngine(body);
    let aiSummary = `Your stack audit is complete. We identified $${engineResult.totalMonthlySavings} in potential monthly savings by eliminating redundant seats and optimizing tiers. Review the breakdown below for specific actions.`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert SaaS financial auditor. Write a punchy, professional 100-word summary for an engineering manager. Their total monthly AI overspend is $${engineResult.totalMonthlySavings}. Briefly mention these specific recommendations: ${JSON.stringify(engineResult.recommendations.map((r) => r.recommendedAction))}. Do not use pleasantries. Be direct.`;

        const result = await model.generateContent(prompt);
        aiSummary = result.response.text();
      } catch (aiError) {
        console.error("Gemini API failed, falling back to template.", aiError);
      }
    }

    const [newAudit] = await db
      .insert(audits)
      .values({
        inputData: body,
        engineResults: engineResult,
        totalMonthlySavings: engineResult.totalMonthlySavings,
        aiSummary: aiSummary,
      })
      .returning({ id: audits.id });

    return NextResponse.json({ success: true, auditId: newAudit.id });
  } catch (error) {
    console.error("Audit processing failed:", error);
    return NextResponse.json(
      { error: "Failed to process audit" },
      { status: 500 },
    );
  }
}
