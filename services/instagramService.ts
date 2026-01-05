import { InstagramPost } from '../types';

// Access token should be stored in environment variables for security
const INSTAGRAM_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  if (!INSTAGRAM_TOKEN) {
    console.log("No Instagram Access Token found. Using demo mode.");
    return [];
  }

  try {
    // Fetch media items from the user's account
    // Fields: id, caption, media_type, media_url, permalink, thumbnail_url, timestamp, username
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username&access_token=${INSTAGRAM_TOKEN}&limit=9`
    );

    if (!response.ok) {
      throw new Error(`Instagram API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.data) {
        return [];
    }

    // Transform API data to our app's interface
    return data.data.map((item: any) => ({
      id: item.id,
      username: item.username || 'hondaunit',
      // The Basic Display API does not return user avatar, so we use a placeholder or logo
      userAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop', 
      // For VIDEO media, use the thumbnail_url, otherwise media_url
      image: item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url,
      // The Basic Display API does NOT return like/comment counts. 
      // We simulate these for the design aesthetic, or you'd need the Graph API (Business) for real metrics.
      likes: Math.floor(Math.random() * 2000) + 500, 
      caption: item.caption || '',
      commentsCount: Math.floor(Math.random() * 100) + 20,
      timestamp: new Date(item.timestamp).toLocaleDateString(),
      location: 'Hondaunit HQ', // Location is not available in Basic Display API
      permalink: item.permalink
    }));

  } catch (error) {
    console.error("Failed to fetch Instagram posts:", error);
    return [];
  }
};
