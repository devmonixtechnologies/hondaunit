import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { buildAdminHtml, buildVisitorHtml, ContactFormPayload } from '../lib/emailTemplates';

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;
const toEmail = process.env.RESEND_TO_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ensureConfig = () => {
  if (!resend || !fromEmail || !toEmail) {
    throw new Error('Missing Resend configuration. Set RESEND_API_KEY, RESEND_FROM_EMAIL, and RESEND_TO_EMAIL.');
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    ensureConfig();

    const payload = req.body as ContactFormPayload;

    if (!payload?.name || !payload?.email || !payload?.message) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const [adminResponse, confirmationResponse] = await Promise.all([
      resend!.emails.send({
        from: `Hondaunit Contact <${fromEmail}>`,
        to: [toEmail!],
        reply_to: payload.email,
        subject: `Legendary Hondaunit contact from ${payload.name}`,
        html: buildAdminHtml(payload)
      }),
      resend!.emails.send({
        from: `Hondaunit Team <${fromEmail}>`,
        to: [payload.email],
        subject: 'Hondaunit: We will be in touch within 24 hours',
        html: buildVisitorHtml(payload.name)
      })
    ]);

    return res.status(200).json({ adminResponse, confirmationResponse });
  } catch (error) {
    console.error('Contact API error:', error);
    const message = error instanceof Error ? error.message : 'Unexpected error sending contact email.';
    return res.status(500).json({ message });
  }
}
