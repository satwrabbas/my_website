// types/index.ts

export interface ProjectFeature {
  title: string;
  content: string;
  video_url?: string | null;
  image_urls?: string[];
}

export interface Project {
  id: string;
  created_at?: string;
  title: string;
  slug: string;
  tagline: string;
  description?: string;
  tech_stack?: string[];
  platforms?: string[];
  
  github_url?: string | null;
  download_url?: string | null;
  live_url?: string | null;
  play_store_url?: string | null;
  app_store_url?: string | null;
  
  role?: string | null;
  category?: string | null;
  duration?: string | null;
  client_name?: string | null;
  testimonial?: string | null;
  
  status?: string;
  is_featured?: boolean;
  brand_color?: string;

  thumbnail_url?: string | null;
  demo_url?: string | null;
  mobile_thumbnail_url?: string | null;
  mobile_demo_url?: string | null;
  
  features?: ProjectFeature[];
}