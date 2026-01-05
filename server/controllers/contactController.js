import { Resend } from 'resend';
import { z } from 'zod';

import ContactMessage from '../models/contactModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/httpError.js';
import { buildAdminHtml, buildVisitorHtml } from '../services/emailTemplates.js';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().email('Valid email is required.'),
  handle: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.')
});

const updateContactSchema = z
  .object({
    status: z.enum(['new', 'in_progress', 'resolved']).optional(),
    adminNotes: z.string().trim().max(2000).optional(),
    archived: z.boolean().optional(),
    respondedAt: z
      .preprocess(value => {
        if (!value) return undefined;
        const date = value instanceof Date ? value : new Date(value);
        return Number.isNaN(date.getTime()) ? undefined : date;
      }, z.date())
      .optional()
  })
  .refine(data => Object.keys(data).length > 0, { message: 'Provide at least one field to update.' });

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const resendToEmail = process.env.RESEND_TO_EMAIL;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

const canSendEmails = () => Boolean(resendClient && resendFromEmail && resendToEmail);

const deliverNotifications = async payload => {
  if (!canSendEmails()) {
    return;
  }

  try {
    await Promise.all([
      resendClient.emails.send({
        from: `Hondaunit Contact <${resendFromEmail}>`,
        to: [resendToEmail],
        reply_to: payload.email,
        subject: `Legendary Hondaunit contact from ${payload.name}`,
        html: buildAdminHtml(payload)
      }),
      resendClient.emails.send({
        from: `Hondaunit Team <${resendFromEmail}>`,
        to: [payload.email],
        subject: 'Hondaunit: We will be in touch within 24 hours',
        html: buildVisitorHtml(payload.name)
      })
    ]);
  } catch (error) {
    console.error('Contact notification delivery failed:', error.message || error);
  }
};

export const submitContactMessage = asyncHandler(async (req, res) => {
  const payload = contactSchema.parse(req.body || {});
  const messageDoc = await ContactMessage.create(payload);

  await deliverNotifications(payload);

  res.status(201).json({
    message: 'We received your message—expect a reply within 24 hours.',
    contactId: messageDoc._id
  });
});

export const adminListContactMessages = asyncHandler(async (req, res) => {
  const filters = {};

  if (req.query.status) {
    filters.status = req.query.status;
  }

  if (req.query.archived) {
    filters.archived = req.query.archived === 'true';
  }

  const messages = await ContactMessage.find(filters).sort({ createdAt: -1 });
  res.json({ messages });
});

export const adminUpdateContactMessage = asyncHandler(async (req, res) => {
  const payload = updateContactSchema.parse(req.body || {});
  const messageDoc = await ContactMessage.findById(req.params.id);

  if (!messageDoc) {
    throw new HttpError(404, 'Contact message not found.');
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      messageDoc[key] = value;
    }
  });

  if (payload.status === 'resolved' && !messageDoc.respondedAt) {
    messageDoc.respondedAt = new Date();
  }

  await messageDoc.save();
  res.json({ message: messageDoc });
});
