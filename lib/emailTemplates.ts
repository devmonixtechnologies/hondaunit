export interface ContactFormPayload {
  name: string;
  email: string;
  handle?: string;
  message: string;
}

interface EmailTemplateParts {
  preheader: string;
  title: string;
  accentLabel: string;
  body: string;
  footerNote?: string;
}

const buildEmailTemplate = ({ preheader, title, accentLabel, body, footerNote }: EmailTemplateParts) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #050505;
          color: #ffffff;
        }
        .preheader {
          display: none !important;
          visibility: hidden;
          opacity: 0;
          color: transparent;
          height: 0;
          width: 0;
        }
        .wrapper {
          padding: 32px 16px;
          background: radial-gradient(circle at top, rgba(220, 38, 38, 0.15), transparent 55%);
        }
        .card {
          max-width: 640px;
          margin: 0 auto;
          background: #101010;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
          border-radius: 18px;
          overflow: hidden;
        }
        .hero {
          padding: 32px;
          background: linear-gradient(135deg, #dc2626, #7f1d1d);
        }
        .hero-label {
          text-transform: uppercase;
          letter-spacing: 0.4em;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.7);
        }
        .hero h1 {
          margin: 12px 0 0;
          font-size: 28px;
          line-height: 1.3;
        }
        .content {
          padding: 32px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          margin: 24px 0;
        }
        .footer {
          padding: 24px 32px 32px;
          background: #090909;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.65);
        }
        .footer a {
          color: #f87171;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <span class="preheader">${preheader}</span>
      <div class="wrapper">
        <div class="card">
          <section class="hero">
            <div class="hero-label">${accentLabel}</div>
            <h1>${title}</h1>
          </section>
          <section class="content">
            ${body}
          </section>
          <div class="footer">
            ${footerNote || 'Hondaunit · Legendary builds only'}
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const buildAdminHtml = (payload: ContactFormPayload) => {
  const detailsTable = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 8px 0; color: rgba(255,255,255,0.75);">Name</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 600;">${payload.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: rgba(255,255,255,0.75);">Email</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 600;">${payload.email}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: rgba(255,255,255,0.75);">IG Handle</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 600;">${payload.handle || 'N/A'}</td>
      </tr>
    </table>
  `;

  const body = `
    <p style="font-size: 16px; color: rgba(255,255,255,0.85); margin: 0 0 20px;">A new submission just dropped. Review the intel below and follow up within 24 hours.</p>
    ${detailsTable}
    <div class="divider"></div>
    <p style="text-transform: uppercase; letter-spacing: 0.3em; font-size: 11px; color: rgba(248,113,113,0.8);">Message</p>
    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 18px; border-radius: 14px; line-height: 1.6; font-size: 15px;">
      ${payload.message.replace(/\n/g, '<br />')}
    </div>
  `;

  return buildEmailTemplate({
    preheader: 'Fresh Hondaunit contact submission',
    title: 'New Contact: Action Required',
    accentLabel: 'Pit Wall Alert',
    body,
    footerNote: 'Stay legendary · Hondaunit Ops Console'
  });
};

export const buildVisitorHtml = (name: string) => {
  const body = `
    <p style="font-size: 16px; color: rgba(255,255,255,0.85);">Yo ${name || 'legend'},</p>
    <p style="font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.6;">Your message just hit the Hondaunit command center. The crew is already reviewing your build intel and we’ll be in touch within 24 hours.</p>
    <div style="margin: 24px 0; text-align: center;">
      <a href="https://hondaunit.vercel.app" style="display: inline-block; padding: 14px 32px; background: #dc2626; color: #fff; text-transform: uppercase; letter-spacing: 0.2em; font-size: 12px; border-radius: 999px; text-decoration: none;">Explore the Legacy</a>
    </div>
    <p style="font-size: 15px; color: rgba(255,255,255,0.75);">Meanwhile, keep fueling the inspiration—tag us on <a href="https://instagram.com/hondaunit" style="color: #f87171; text-decoration: none;">@hondaunit</a> so we can spot your build.</p>
    <p style="margin-top: 24px; font-size: 15px; color: rgba(255,255,255,0.85);">Stay legendary,<br/>The Hondaunit Team</p>
  `;

  return buildEmailTemplate({
    preheader: 'We received your message—expect a reply within 24 hours.',
    title: 'We Got Your Message',
    accentLabel: 'Hondaunit HQ',
    body,
    footerNote: 'Hondaunit · Community · Culture · Craft'
  });
};
