// types/index.ts

// 1. واجهة الإحصائيات السريعة (الجديدة)
export interface QuickStat {
  id: string;      // معرف فريد للسحب والإفلات
  label: string;   // مثال: "زيادة سرعة التحميل"
  value: string;   // مثال: "80%"
}

// 2. واجهة النقطة (تم تحديثها لدعم نوع التخطيط والمعرف)
export interface ProjectFeature {
  id: string;      // معرف فريد للسحب والإفلات
  title: string;
  content: string;
  layout_type?: 'default' | 'image_left' | 'image_right' | 'hero'; // نوع تصميم النقطة
  video_url?: string | null;
  image_urls?: string[];
}

// 3. واجهة الفصل (الجديدة)
export interface ProjectChapter {
  id: string;      // معرف فريد للسحب والإفلات
  title: string;
  description?: string;
  features: ProjectFeature[]; // النقاط التابعة لهذا الفصل
}

// 4. واجهة المشروع الشاملة
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
  
  // البيانات القديمة (نحتفظ بها مؤقتاً للتوافقية)
  features?: ProjectFeature[];
  
  // البيانات الجديدة
  chapters?: ProjectChapter[];
  quick_stats?: QuickStat[];
}