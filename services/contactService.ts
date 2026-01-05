import type { ContactFormPayload } from '../lib/emailTemplates';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
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
