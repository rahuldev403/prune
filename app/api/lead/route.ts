import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email, auditId } = await req.json();

    if (!email || !auditId) {
      return NextResponse.json({ error: "Email and Audit ID are required" }, { status: 400 });
    }

    await db.insert(leads).values({
      email,
      auditId,
    });
    await transporter.sendMail({
      from: `"Prune Audit" <${process.env.SMTP_USER}>`, 
      to: email, 
      subject: "Your AI Spend Audit Results",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thanks for using Prune!</h2>
          <p>We've successfully saved your AI stack audit profile.</p>
          <p>You can view your shareable results and detailed breakdown here:</p>
          <p><a href="https://your-domain.com/audit/${auditId}"><strong>View Audit #${auditId.split('-')[0]}</strong></a></p>
          <br/>
          <p style="color: #666; font-size: 14px;">If your stack qualifies for secondary-market infrastructure discounts, a Credex representative will reach out shortly.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture/SMTP failed:", error);
    return NextResponse.json({ error: "Failed to process lead" }, { status: 500 });
  }
}