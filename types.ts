export interface InstagramPost {
  id: string;
  username: string;
  userAvatar: string;
  image: string;
  likes: number;
  caption: string;
  commentsCount: number;
  timestamp: string;
  location?: string;
  permalink?: string; // Link to the actual Instagram post
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
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
  socialLinks?: SocialLink[];
  publicSlug: string;
  updatedAt: string;
}

export interface SocialLink {
  platform: string;
  url?: string;
  handle?: string;
}

export interface Member {
  id: string;
  instagram: string;
  country: string;
  car: string;
  age: number;
  role: 'Member' | 'Admin' | 'VIP';
}