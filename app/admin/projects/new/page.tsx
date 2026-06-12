// app/admin/projects/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowRight, Save, Image as ImageIcon, Video, Images, X, Plus, Trash2, ListChecks, Monitor, Smartphone, Link as LinkIcon, User, Star, Globe, Apple } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface ProjectFeature {
  title: string;
  content: string;
  videoFile: File | null;
  videoPreview: string | null;
  imageFiles: { file: File; url: string }[];
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

  const [features, setFeatures] = useState<ProjectFeature[]>([])
  
  // 🌟 استخراج setValue للتحكم باللون برمجياً وإعطاء قيمة افتراضية للون بتمرير نوع <any> لتخطي اعتراض الـ TypeScript 🌟
  const { register, handleSubmit, watch, setValue } = useForm<any>({
    defaultValues: {
      platforms: [] as string[],
      brand_color: '#10b981' // اللون الزمردي كقيمة افتراضية
    }
  })

  // 🌟 المراقبة الحية للون والمنصات المختارة 🌟
  const brandColorValue = watch('brand_color') || '#10b981'
  const selectedPlatforms = watch('platforms') || []
  const hasDesktop = selectedPlatforms.includes('Web') || selectedPlatforms.includes('Windows')
  const hasMobile = selectedPlatforms.includes('Android') || selectedPlatforms.includes('iOS')

  // --- دوال التعامل مع الملفات ---
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setThumbnailFile(file); setThumbnailPreview(URL.createObjectURL(file)) } }
  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setDemoFile(file); setDemoPreview(URL.createObjectURL(file)) } }
  const handleMobileThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setMobileThumbnailFile(file); setMobileThumbnailPreview(URL.createObjectURL(file)) } }
  const handleMobileDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setMobileDemoFile(file); setMobileDemoPreview(URL.createObjectURL(file)) } }

  // --- دوال الميزات ---
  const addFeature = () => setFeatures([...features, { title: '', content: '', videoFile: null, videoPreview: null, imageFiles: [] }])
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index))
  const updateFeatureText = (index: number, field: 'title' | 'content', value: string) => { const updated = [...features]; updated[index][field] = value; setFeatures(updated) }
  const handleFeatureVideo = (index: number, e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; const updated = [...features]; updated[index].videoFile = file; updated[index].videoPreview = URL.createObjectURL(file); setFeatures(updated) } }
  const handleFeatureImages = (index: number, e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) { const filesArray = Array.from(e.target.files).map(file => ({ file, url: URL.createObjectURL(file) })); const updated = [...features]; updated[index].imageFiles = [...updated[index].imageFiles, ...filesArray]; setFeatures(updated) } }
  const removeFeatureImage = (featureIndex: number, imageIndex: number) => { const updated = [...features]; updated[featureIndex].imageFiles = updated[featureIndex].imageFiles.filter((_, i) => i !== imageIndex); setFeatures(updated) }

  // --- دالة الرفع ---
  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('project-assets').upload(fileName, file)
    if (error) throw error
    const { data } = supabase.storage.from('project-assets').getPublicUrl(fileName)
    return data.publicUrl
  }

  // --- الحفظ في قاعدة البيانات ---
  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const thumbnailUrl = thumbnailFile ? await uploadFile(thumbnailFile, 'thumbnails') : null
      const demoUrl = demoFile ? await uploadFile(demoFile, 'demos') : null
      const mobileThumbnailUrl = mobileThumbnailFile ? await uploadFile(mobileThumbnailFile, 'thumbnails/mobile') : null
      const mobileDemoUrl = mobileDemoFile ? await uploadFile(mobileDemoFile, 'demos/mobile') : null
      
      const processedFeatures = await Promise.all(
        features.map(async (feature) => {
          const video_url = feature.videoFile ? await uploadFile(feature.videoFile, 'features/videos') : null;
          const image_urls = await Promise.all(feature.imageFiles.map(img => uploadFile(img.file, 'features/images')));
          return { title: feature.title, content: feature.content, video_url, image_urls }
        })
      )

      const techStackArray = data.tech_stack ? data.tech_stack.split(',').map((s: string) => s.trim()) : []

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
          brand_color: data.brand_color || '#10b981', // حفظ اللون الصحيح

          thumbnail_url: thumbnailUrl,
          demo_url: demoUrl,
          mobile_thumbnail_url: mobileThumbnailUrl,
          mobile_demo_url: mobileDemoUrl,
          
          features: processedFeatures, 
        }
      ])

      if (error) throw error
      router.push('/admin/projects')
    } catch (error: any) {
      alert('حدث خطأ أثناء الرفع: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
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
                      غلاف الجوال<input type="file" accept="image/*" onChange={handlePrimaryMobileChange => handleMobileThumbnailChange(handlePrimaryMobileChange)} className="hidden" />
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

            {/* 🌟 إصلاح لون الهوية (توهج البطاقة) 🌟 */}
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

        {/* --- 6. قسم النقاط الديناميكية --- */}
        <div className="bg-zinc-900 border border-emerald-500/30 rounded-3xl p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2 text-white"><ListChecks className="text-emerald-500" /> بناء دراسة الحالة</h2>
              <p className="text-zinc-400 text-sm mt-1">أضف نقاط الشرح تباعاً، مع إرفاق فيديو أو صور لكل نقطة.</p>
            </div>
            <button 
              type="button" 
              onClick={addFeature}
              disabled={isSubmitting}
              className={`bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-zinc-700 font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Plus size={18} /> إضافة نقطة
            </button>
          </div>

          {features.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">لم تقم بإضافة أي نقاط شرح بعد.</div>
          ) : (
            <div className="space-y-12">
              {features.map((feature, index) => (
                <div key={index} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative group">
                  <div className="absolute -top-3 -right-3 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => removeFeature(index)}
                    disabled={isSubmitting}
                    className={`absolute -top-3 -left-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg ${isSubmitting ? 'hidden' : ''}`}
                    title="حذف هذه النقطة"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="space-y-4 mb-6">
                    <input 
                      value={feature.title}
                      onChange={(e) => updateFeatureText(index, 'title', e.target.value)}
                      placeholder="عنوان الميزة (مثال: الأداء الفائق بدون إنترنت)"
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none font-bold text-lg"
                      required
                    />
                    <textarea 
                      value={feature.content}
                      onChange={(e) => updateFeatureText(index, 'content', e.target.value)}
                      placeholder="اشرح الميزة أو التحدي البرمجي هنا (يدعم Markdown)..."
                      rows={4}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none resize-y"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-zinc-800">
                    <div className="lg:col-span-1 border-2 border-dashed border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center text-center relative h-32 hover:border-emerald-500/50 transition-colors">
                      {feature.videoPreview ? (
                        <video src={feature.videoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <Video size={24} className="text-zinc-600 mb-2" />
                          <span className="text-zinc-500 text-xs font-medium">فيديو الميزة (اختياري)</span>
                        </>
                      )}
                      <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white font-medium text-sm rounded-xl">
                        اختر فيديو
                        <input type="file" accept="video/mp4,video/webm" onChange={(e) => handleFeatureVideo(index, e)} className="hidden" />
                      </label>
                    </div>

                    <div className="lg:col-span-2 border-2 border-dashed border-zinc-800 rounded-xl p-4 flex flex-col justify-center relative min-h-[8rem]">
                      <div className="flex items-center justify-between mb-3 w-full absolute top-0 left-0 p-3">
                        <span className="text-zinc-500 text-xs font-medium">صور الميزة (اختياري)</span>
                        <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded-lg text-xs transition-colors flex items-center gap-1">
                          <Images size={14} /> أضف صور
                          <input type="file" accept="image/*" multiple onChange={(e) => handleFeatureImages(index, e)} className="hidden" />
                        </label>
                      </div>
                      
                      {feature.imageFiles.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-6 w-full">
                          {feature.imageFiles.map((img, imgIndex) => (
                            <div key={imgIndex} className="relative group/img rounded-md overflow-hidden h-16 border border-zinc-700">
                              <img src={img.url} alt="Feature snapshot" className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => removeFeatureImage(index, imgIndex)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl px-4 py-5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Save size={24} className={isSubmitting ? "animate-spin" : ""} />
          <span>{isSubmitting ? 'جاري بناء ورفع المشروع...' : 'نشر المشروع'}</span>
        </button>
      </form>
    </div>
  )
}