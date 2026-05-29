-- ==============================================================================
-- 1. تنظيف الجداول القديمة (للبدء من الصفر بنظافة)
-- ==============================================================================
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.articles;
DROP TABLE IF EXISTS public.projects;
DROP TABLE IF EXISTS public.admins;
DROP FUNCTION IF EXISTS public.is_admin;
DROP FUNCTION IF EXISTS public.update_updated_at_column;

-- ==============================================================================
-- 2. إعداد دوال المساعدة (Helper Functions)
-- ==============================================================================
-- دالة تحديث الوقت
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- 3. جدول المدراء (Admins) لحماية لوحة التحكم
-- ==============================================================================
CREATE TABLE public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'admin', -- مستقبلاً يمكن أن يكون (admin, editor)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- دالة للتحقق مما إذا كان المستخدم الحالي مديراً (نستخدمها في الحماية)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 4. إنشاء الجداول الأساسية (Projects, Articles, Messages)
-- ==============================================================================
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT,
    platforms TEXT[] DEFAULT '{}',
    tech_stack TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    image_urls TEXT[] DEFAULT '{}',
    app_store_url TEXT,
    play_store_url TEXT,
    github_url TEXT,
    download_url TEXT,
    qr_code_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'Live',
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();



-- ==============================================================================
-- 5. تفعيل نظام الحماية الصارم (Row Level Security - RLS)
-- ==============================================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;


-- 🛡️ سياسات جدول المدراء: لا أحد يستطيع رؤيته سوى المدراء أنفسهم
CREATE POLICY "Admins can view admins list" ON public.admins FOR SELECT USING (public.is_admin());

-- 🛡️ سياسات جدول المشاريع:
-- الزوار يمكنهم القراءة فقط
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
-- المدراء فقط (الموجودون في جدول admins) يمكنهم الإضافة والتعديل والحذف
CREATE POLICY "Only admins can insert projects" ON public.projects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update projects" ON public.projects FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete projects" ON public.projects FOR DELETE USING (public.is_admin());

-- 🛡️ سياسات جدول المقالات:
-- الزوار يمكنهم قراءة المقالات (المنشورة فقط)
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (is_published = true);
-- المدراء يمكنهم قراءة كل المقالات (حتى المسودات غير المنشورة)
CREATE POLICY "Admins can view all articles" ON public.articles FOR SELECT USING (public.is_admin());
-- المدراء فقط يمكنهم التعديل والإضافة
CREATE POLICY "Only admins can insert articles" ON public.articles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update articles" ON public.articles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete articles" ON public.articles FOR DELETE USING (public.is_admin());

