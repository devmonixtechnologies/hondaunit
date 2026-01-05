import { API_BASE_URL } from './config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  title?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  coverImage?: string;
  description?: string;
  age?: number;
  instagram?: string;
  machine?: string;
  socialLinks?: Array<{
    platform: string;
    url?: string;
    handle?: string;
  }>;
  publicSlug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  est: string;
  members: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  coverImage?: string;
  description?: string;
  age?: number;
  instagram?: string;
  machine?: string;
  socialLinks?: any[];
  publicSlug: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  name?: string;
  title?: string;
  bio?: string;
  location?: string;
  description?: string;
  age?: number;
  instagram?: string;
  machine?: string;
  avatarUrl?: string;
  coverImage?: string;
  socialLinks?: Array<{
    platform: string;
    url?: string;
    handle?: string;
  }>;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export interface PublicEvent {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  coverImage?: string;
  isPublished: boolean;
}

export interface UsersResponse {
  users: Array<{
    id: string;
    name: string;
    title?: string;
    bio?: string;
    location?: string;
    avatarUrl?: string;
    description?: string;
    age?: number;
    instagram?: string;
    machine?: string;
    publicSlug: string;
    updatedAt: string;
  }>;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

class ApiService {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async getPublicEvents(): Promise<PublicEvent[]> {
    const response = await fetch(`${API_BASE_URL}/events/public`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    return data.events;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  }

  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    const data = await response.json();
    return data.user;
  }

  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }

    const result = await response.json();
    return result.user;
  }

  async getBranches(): Promise<Branch[]> {
    const response = await fetch(`${API_BASE_URL}/branches`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }

    const data = await response.json();
    return data.branches || data;
  }

  async getPublicUsers(page = 1, search?: string): Promise<UsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    });

    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/users?${params}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }

  async getPublicProfile(slug: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/users/${slug}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Profile not found');
    }

    return response.json();
  }

  async getAdminUsers(page = 1, search?: string): Promise<{ users: any[], pagination: any }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    });

    if (search) {
      params.append('search', search);
    }

    const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin users');
    }

    return response.json();
  }

  async adminCreateUser(userData: { name: string, email: string, password: string, role?: string }): Promise<{ user: any }> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    return response.json();
  }

  async adminUpdateUser(id: string, userData: { name?: string, email?: string, role?: string, isActive?: boolean }): Promise<{ user: any }> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    return response.json();
  }

  async adminDeleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

export const apiService = new ApiService();
