const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_BASE_URL?.trim();

  if (envUrl) {
    return stripTrailingSlash(envUrl);
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin.replace(/\/+$/, '')}/api`;
  }

  return 'https://hondaunit-server.vercel.app/api';
};

export const API_BASE_URL = resolveApiBaseUrl();
export const ADMIN_API_BASE_URL = `${API_BASE_URL}/admin`;
