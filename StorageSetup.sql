-- 1. إنشاء مجلد التخزين (Bucket) باسم 'project-assets' وجعله عاماً للزوار
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. سياسة (Policy): السماح لجميع زوار الموقع برؤية الصور
CREATE POLICY "Public view access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'project-assets');

-- 3. سياسة (Policy): السماح للمدير فقط (أنت) برفع الصور الجديدة
CREATE POLICY "Admin can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'project-assets' AND auth.role() = 'authenticated');

-- 4. سياسة (Policy): السماح للمدير فقط بتحديث أو حذف الصور
CREATE POLICY "Admin can update images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'project-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can delete images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'project-assets' AND auth.role() = 'authenticated');