// app/admin/projects/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowRight, Save, Image as ImageIcon, Video, Loader2, Monitor, Smartphone, Link as LinkIcon, User, Star, Globe, Apple } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

// 👈 1. استدعاء مُكون بناء الفصول هنا أيضاً
import CaseStudyBuilder, { ProjectFormChapter } from '@/components/admin/CaseStudyBuilder'

interface ProjectFormValues {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  tech_stack: string;
  platforms: string[];
  github_url: string;
  download_url: string;
  live_url: string;
  play_store_url: string;
  app_store_url: string;
  role: string;
  category: string;
  duration: string;
  client_name: string;
  testimonial: string;
  status: string;
  is_featured: boolean;
  brand_color: string;
}

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [demoFile, setDemoFile] = useState<File | null>(null)
  const [demoPreview, setDemoPreview] = useState<string | null>(null)

  const [mobileThumbnailFile, setMobileThumbnailFile] = useState<File | null>(null)
  const [mobileThumbnailPreview, setMobileThumbnailPreview] = useState<string | null>(null)
  const [mobileDemoFile, setMobileDemoFile] = useState<File | null>(null)
  const [mobileDemoPreview, setMobileDemoPreview] = useState<string | null>(null)

  // 👈 2. استبدال مصفوفة features القديمة بمصفوفة chapters
  const [chapters, setChapters] = useState<ProjectFormChapter[]>([])
  
  const { register, handleSubmit, watch, setValue } = useForm<ProjectFormValues>({
    defaultValues: {
      platforms: [],
      brand_color: '#10b981' 
    }
  })

  const brandColorValue = watch('brand_color') || '#10b981'
  const selectedPlatforms = watch('platforms') || []
  const hasDesktop = selectedPlatforms.includes('Web') || selectedPlatforms.includes('Windows')
  const hasMobile = selectedPlatforms.includes('Android') || selectedPlatforms.includes('iOS')

  // --- دوال التعامل مع الملفات الأساسية ---
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setThumbnailFile(file); setThumbnailPreview(URL.createObjectURL(file)) } }
  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setDemoFile(file); setDemoPreview(URL.createObjectURL(file)) } }
  const handleMobileThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setMobileThumbnailFile(file); setMobileThumbnailPreview(URL.createObjectURL(file)) } }
  const handleMobileDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setMobileDemoFile(file); setMobileDemoPreview(URL.createObjectURL(file)) } }

  // --- دالة الرفع للتخزين السحابي ---
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('project-assets').upload(fileName, file)
    if (error) throw error
    const { data } = supabase.storage.from('project-assets').getPublicUrl(fileName)
    return data.publicUrl
  }

  // --- الحفظ في قاعدة البيانات ---
  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true)
    try {
      const thumbnailUrl = thumbnailFile ? await uploadFile(thumbnailFile, 'thumbnails') : null
      const demoUrl = demoFile ? await uploadFile(demoFile, 'demos') : null
      const mobileThumbnailUrl = mobileThumbnailFile ? await uploadFile(mobileThumbnailFile, 'thumbnails/mobile') : null
      const mobileDemoUrl = mobileDemoFile ? await uploadFile(mobileDemoFile, 'demos/mobile') : null
      
      // 👈 3. معالجة الفصول (Chapters) ورفع ملفاتها كما في صفحة التعديل
      const processedChapters = await Promise.all(
        chapters.map(async (chapter) => {
          const processedFeatures = await Promise.all(
            chapter.features.map(async (feature) => {
              const video_url = feature.videoFile ? await uploadFile(feature.videoFile, 'features/videos') : null;
              const image_urls = await Promise.all(feature.imageFiles.map(img => uploadFile(img.file as File, 'features/images')));
              return { 
                id: feature.id, 
                title: feature.title, 
                content: feature.content, 
                layout_type: feature.layout_type,
                video_url, 
                image_urls 
              };
            })
          );

          return {
            id: chapter.id,
            title: chapter.title,
            description: chapter.description,
            features: processedFeatures
          }
        })
      );

      const techStackArray = data.tech_stack ? data.tech_stack.split(',').map((s) => s.trim()) : []

      const { error } = await supabase.from('projects').insert([
        {
          title: data.title,
          slug: data.slug,
          tagline: data.tagline,
          description: data.description,
          tech_stack: techStackArray,
          platforms: data.platforms || [], 
          
          github_url: data.github_url,
          download_url: data.download_url,
          live_url: data.live_url,
          play_store_url: data.play_store_url,
          app_store_url: data.app_store_url,
          
          role: data.role,
          category: data.category,
          duration: data.duration,
          client_name: data.client_name,
          testimonial: data.testimonial,
          
          status: data.status || 'Live',
          is_featured: data.is_featured || false,
          brand_color: data.brand_color || '#10b981',

          thumbnail_url: thumbnailUrl,
          demo_url: demoUrl,
          mobile_thumbnail_url: mobileThumbnailUrl,
          mobile_demo_url: mobileDemoUrl,
          
          chapters: processedChapters, // 👈 4. التخزين في عمود الفصول الجديد
        }
      ])

      if (error) throw error
      router.push('/admin/projects')
    } catch (error: unknown) {
      alert('حدث خطأ أثناء الرفع: ' + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      
      {/* شاشة التحميل الشفافة */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <Loader2 size={64} className="animate-spin text-emerald-500 mb-6" />
          <h2 className="text-2xl font-bold mb-2">جاري الرفع...</h2>
          <p className="text-zinc-400">يرجى الانتظار وعدم إغلاق الصفحة.</p>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-3xl font-bold">إضافة مشروع جديد</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* --- 1. تفاصيل المشروع الأساسية والمنصات --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-4 mb-6">المعلومات الأساسية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-zinc-400 text-sm mb-2">اسم المشروع</label><input {...register('title', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">رابط الصفحة (Slug)</label><input {...register('slug', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
          </div>

          <div><label className="block text-zinc-400 text-sm mb-2">وصف مختصر (يظهر في البطاقة)</label><input {...register('tagline', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
          <div><label className="block text-zinc-400 text-sm mb-2">مقدمة المشروع (يدعم Markdown)</label><textarea {...register('description')} rows={4} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none resize-y" /></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-emerald-400 text-sm mb-3 font-medium">المنصات المدعومة (اختر لفتح الوسائط):</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                  <input type="checkbox" value="Web" {...register('platforms')} className="w-4 h-4 accent-emerald-500" /> <Globe size={16} className="text-zinc-400"/> ويب
                </label>
                <label className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                  <input type="checkbox" value="Windows" {...register('platforms')} className="w-4 h-4 accent-emerald-500" /> <Monitor size={16} className="text-zinc-400"/> ويندوز
                </label>
                <label className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                  <input type="checkbox" value="Android" {...register('platforms')} className="w-4 h-4 accent-emerald-500" /> <Smartphone size={16} className="text-zinc-400"/> أندرويد
                </label>
                <label className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors">
                  <input type="checkbox" value="iOS" {...register('platforms')} className="w-4 h-4 accent-emerald-500" /> <Apple size={16} className="text-zinc-400"/> iOS
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div><label className="block text-zinc-400 text-sm mb-2">التقنيات (مفصولة بفاصلة)</label><input {...register('tech_stack')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
              <div><label className="block text-zinc-400 text-sm mb-2">تصنيف المشروع (Category)</label><input {...register('category')} placeholder="مثل: متجر إلكتروني" className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
            <div><label className="block text-zinc-400 text-sm mb-2">دورك في المشروع (Role)</label><input {...register('role')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">مدة الإنجاز (Duration)</label><input {...register('duration')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
          </div>
        </div>

        {/* --- 2. قسم الوسائط المزدوجة --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-zinc-800 pb-4">الوسائط والمظهر</h2>
          
          {!hasDesktop && !hasMobile && (
            <div className="text-center py-8 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-950">
              يرجى تحديد منصة واحدة على الأقل من القسم السابق لإظهار خيارات رفع الوسائط.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 💻 وسائط الويب/ديسكتوب */}
            {hasDesktop && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-emerald-500 font-medium flex items-center gap-2"><Monitor size={18} /> وسائط الويب/سطح المكتب (عرضية)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-40 group bg-zinc-950">
                    {thumbnailPreview ? <img src={thumbnailPreview} className="w-full h-full object-cover rounded-xl" /> : <ImageIcon size={28} className="text-zinc-500 mb-2" />}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-sm font-medium rounded-2xl">
                      صورة الغلاف<input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                    </label>
                  </div>
                  <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-40 group bg-zinc-950">
                    {demoPreview ? <video src={demoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-xl" /> : <Video size={28} className="text-zinc-500 mb-2" />}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-sm font-medium rounded-2xl">
                      فيديو Hover<input type="file" accept="video/mp4,video/webm" onChange={handleDemoChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 📱 وسائط الجوال */}
            {hasMobile && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-blue-500 font-medium flex items-center gap-2"><Smartphone size={18} /> وسائط الجوال (طولية)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-40 group bg-zinc-950">
                    {mobileThumbnailPreview ? <img src={mobileThumbnailPreview} className="w-full h-full object-cover rounded-xl" /> : <ImageIcon size={28} className="text-zinc-500 mb-2" />}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-sm font-medium rounded-2xl">
                      غلاف الجوال<input type="file" accept="image/*" onChange={handleMobileThumbnailChange} className="hidden" />
                    </label>
                  </div>
                  <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-40 group bg-zinc-950">
                    {mobileDemoPreview ? <video src={mobileDemoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-xl" /> : <Video size={28} className="text-zinc-500 mb-2" />}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-sm font-medium rounded-2xl">
                      فيديو الجوال<input type="file" accept="video/mp4,video/webm" onChange={handleMobileDemoChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 3. الحالة والتميز ولون الهوية --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white border-b border-zinc-800 pb-4"><Star className="text-yellow-500" /> التميز والهوية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div>
              <label className="block text-zinc-400 text-sm mb-2">حالة المشروع</label>
              <select {...register('status')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none">
                <option value="Live">Live (مكتمل)</option>
                <option value="In Progress">In Progress (قيد التطوير)</option>
                <option value="Beta">Beta (نسخة تجريبية)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-2">لون الهوية (توهج البطاقة)</label>
              <div className="flex gap-3">
                <input 
                  type="color" 
                  value={brandColorValue} 
                  onChange={(e) => setValue('brand_color', e.target.value, { shouldDirty: true })} 
                  className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer" 
                />
                <input 
                  type="text" 
                  {...register('brand_color')} 
                  className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none uppercase" 
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 p-4 rounded-xl h-12 mt-6 cursor-pointer hover:border-emerald-500 transition-colors">
              <input type="checkbox" id="is_featured" {...register('is_featured')} className="w-5 h-5 accent-emerald-500" />
              <label htmlFor="is_featured" className="text-white font-medium cursor-pointer">تثبيت كمشروع مميز (هالة دائمة)</label>
            </div>

          </div>
        </div>

        {/* --- 4. الروابط المباشرة والمتاجر --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white border-b border-zinc-800 pb-4"><LinkIcon className="text-zinc-400" /> الروابط والمتاجر</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasDesktop && (
              <div><label className="block text-zinc-400 text-sm mb-2">رابط الموقع المباشر (Live URL)</label><input {...register('live_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            )}
            <div><label className="block text-zinc-400 text-sm mb-2">الكود المصدري (GitHub)</label><input {...register('github_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            
            {hasMobile && (
              <>
                <div><label className="block text-zinc-400 text-sm mb-2">رابط Google Play</label><input {...register('play_store_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
                <div><label className="block text-zinc-400 text-sm mb-2">رابط App Store</label><input {...register('app_store_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
              </>
            )}
            <div className="md:col-span-2"><label className="block text-zinc-400 text-sm mb-2">رابط تحميل مباشر (آخر)</label><input {...register('download_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
          </div>
        </div>

        {/* --- 5. العميل والتقييم --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white border-b border-zinc-800 pb-4"><User className="text-zinc-400" /> معلومات العميل (اختياري)</h2>
          <div className="grid grid-cols-1 gap-6">
            <div><label className="block text-zinc-400 text-sm mb-2">اسم العميل أو الشركة</label><input {...register('client_name')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">رأي العميل (Testimonial)</label><textarea {...register('testimonial')} rows={3} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none resize-y" /></div>
          </div>
        </div>

        {/* 👈 5. استدعاء مُكوّن السحب والإفلات وبناء الفصول هنا! */}
        <CaseStudyBuilder 
          chapters={chapters} 
          setChapters={setChapters} 
          isSubmitting={isSubmitting} 
        />

        <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl px-4 py-5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Save size={24} className={isSubmitting ? "animate-spin" : ""} />
          <span>{isSubmitting ? 'جاري بناء ورفع المشروع...' : 'نشر المشروع'}</span>
        </button>
      </form>
    </div>
  )
}