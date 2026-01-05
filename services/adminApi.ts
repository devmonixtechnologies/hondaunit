const API_BASE_URL = 'http://localhost:5000/api/admin';

export interface AdminOverview {
  users: {
    total: number;
    active: number;
    admins: number;
  };
  events: {
    total: number;
    published: number;
  };
  gallery: {
    total: number;
    featured: number;
  };
  inbox: {
    new: number;
    open: number;
  };
}

export interface AdminBranch {
  _id: string;
  name: string;
  lat: number;
  lng: number;
  est: string;
  members: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  isFeatured: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  coverImage?: string;
  isPublished: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  handle?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  adminNotes?: string;
  respondedAt?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

class AdminApiService {
  private getAuthHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  async getOverview(): Promise<AdminOverview> {
    const response = await fetch(`${API_BASE_URL}/overview`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin overview');
    }

    return response.json();
  }

  // Gallery CRUD
  async getGalleryItems(page = 1, search?: string, category?: string): Promise<PaginatedResponse<GalleryItem>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    });

    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const response = await fetch(`${API_BASE_URL}/gallery?${params}`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch gallery items');
    }

    const data = await response.json();
    return {
      data: data.items,
      pagination: data.pagination
    };
  }

  async createGalleryItem(item: Omit<GalleryItem, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<GalleryItem> {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create gallery item');
    }

    const data = await response.json();
    return data.item;
  }

  async updateGalleryItem(id: string, item: Partial<Omit<GalleryItem, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>>): Promise<GalleryItem> {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update gallery item');
    }

    const data = await response.json();
    return data.item;
  }

  async deleteGalleryItem(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete gallery item');
    }
  }

  // Events CRUD
  async getEvents(page = 1, search?: string): Promise<PaginatedResponse<Event>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    });

    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/events?${params}`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    return {
      data: data.events,
      pagination: data.pagination
    };
  }

  async createEvent(event: Omit<Event, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create event');
    }

    const data = await response.json();
    return data.event;
  }

  async updateEvent(id: string, event: Partial<Omit<Event, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update event');
    }

    const data = await response.json();
    return data.event;
  }

  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  }

  // Contact Messages CRUD
  async getContactMessages(page = 1, status?: string, search?: string): Promise<PaginatedResponse<ContactMessage>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    });

    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE_URL}/contact?${params}`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contact messages');
    }

    const data = await response.json();
    return {
      data: data.messages,
      pagination: data.pagination
    };
  }

  async updateContactMessage(id: string, message: Partial<ContactMessage>): Promise<ContactMessage> {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update contact message');
    }

    const data = await response.json();
    return data.message;
  }

  async deleteContactMessage(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete contact message');
    }
  }

  // Branches CRUD
  async getBranches(search?: string): Promise<AdminBranch[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const query = params.toString();

    const response = await fetch(`${API_BASE_URL}/branches${query ? `?${query}` : ''}`, {
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }

    const data = await response.json();
    return data.branches || data;
  }

  async createBranch(
    branch: Omit<AdminBranch, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<AdminBranch> {
    const response = await fetch(`${API_BASE_URL}/branches`, {
      method: 'POST',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(branch)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create branch');
    }

    const data = await response.json();
    return data.branch;
  }

  async updateBranch(
    id: string,
    branch: Partial<Omit<AdminBranch, '_id' | 'createdAt' | 'updatedAt'>>
  ): Promise<AdminBranch> {
    const response = await fetch(`${API_BASE_URL}/branches/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(branch)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update branch');
    }

    const data = await response.json();
    return data.branch;
  }

  async deleteBranch(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/branches/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete branch');
    }
  }
}

export const adminApiService = new AdminApiService();
