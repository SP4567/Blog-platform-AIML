import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.EMAIL_FROM || "The Perceptron <onboarding@resend.dev>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

export async function sendNewsletterWelcomeEmail(recipientEmail: string): Promise<EmailResult> {
  const subject = "Welcome to The Perceptron — You're officially subscribed!";
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0f172a 100%); padding: 36px 32px; text-align: center;">
              <div style="display: inline-block; background-color: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 9999px; padding: 6px 16px; margin-bottom: 12px;">
                <span style="color: #a5b4fc; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Autonomous Intelligence & Systems</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">The Perceptron</h1>
              <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">The modern AI, machine learning & systems publication</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 700;">Welcome to the network! 🎉</h2>
              <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                Thank you for subscribing to <strong>The Perceptron</strong>. You are now connected to our weekly dispatch of in-depth machine learning breakdowns, AI advancements, and modern cloud architecture essays.
              </p>

              <!-- Highlights Box -->
              <div style="background-color: #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 28px; border-left: 4px solid #6366f1;">
                <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #334155;">What to expect each Friday:</p>
                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.7;">
                  <li style="margin-bottom: 6px;"><strong>Deep-Dive Systems & ML:</strong> Neural architectures, distributed model serving, and high-performance engineering.</li>
                  <li style="margin-bottom: 6px;"><strong>AI & Autonomous Agents:</strong> Real-world integration of on-device LLMs, transformers, and autonomous workflows.</li>
                  <li style="margin-bottom: 0;"><strong>Curated Tooling:</strong> Production-tested developer tools, libraries, and open-source releases.</li>
                </ul>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${appUrl}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);">
                  Explore Latest Articles &rarr;
                </a>
              </div>

              <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.5;">
                Have questions or ideas you'd like to explore? Reply directly to this email to get in touch with our editorial desk.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px;">
                You received this email because you subscribed to The Perceptron with <strong>${recipientEmail}</strong>.
              </p>
              <p style="margin: 0; color: #cbd5e1; font-size: 12px;">
                &copy; ${new Date().getFullYear()} The Perceptron. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textContent = `
Welcome to The Perceptron!

Thank you for subscribing to The Perceptron. You're now subscribed with ${recipientEmail}.

What to expect in your inbox every Friday:
- Deep-Dive Systems & ML architectures, model serving, and distributed engineering
- AI & Autonomous Agents with production-grade workflows
- Curated developer tooling and best practices

Explore the latest articles: ${appUrl}

© ${new Date().getFullYear()} The Perceptron. All rights reserved.
  `.trim();

  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error("Resend API delivery error:", error);
        return { success: false, error: error.message };
      }

      return { success: true, messageId: data?.id };
    } catch (err) {
      console.error("Resend execution error:", err);
      return { success: false, error: err instanceof Error ? err.message : "Unknown email error" };
    }
  }

  // Fallback: Simulation Mode when no RESEND_API_KEY is configured
  console.log(`\n========================================`);
  console.log(`[EMAIL DISPATCH SIMULATION]`);
  console.log(`To: ${recipientEmail}`);
  console.log(`From: ${fromEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`========================================\n`);

  return {
    success: true,
    simulated: true,
    messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  };
}
