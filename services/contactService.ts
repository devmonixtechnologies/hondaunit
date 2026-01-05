import type { ContactFormPayload } from '../lib/emailTemplates';
import { API_BASE_URL } from './config';

const CONTACT_FUNCTION_ENDPOINT = `${API_BASE_URL}/contact`;

export const submitContactForm = async (payload: ContactFormPayload) => {
  const response = await fetch(CONTACT_FUNCTION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message || 'Failed to submit contact form.');
  }

  return response.json();
};
