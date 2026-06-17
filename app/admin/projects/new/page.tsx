// app/admin/projects/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowRight, Save, Image as ImageIcon, Video, Monitor, Smartphone, Link as LinkIcon, User, Star, Globe, Apple, ZoomIn, Upload } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

import CaseStudyBuilder, { ProjectFormChapter } from '@/components/admin/CaseStudyBuilder'
import MediaLightbox, { LightboxMedia } from '@/components/MediaLightbox'
// 👈 1. استيراد شاشة الرفع الجديدة
import UploadProgressOverlay, { UploadState } from '@/components/admin/UploadProgressOverlay'

interface ProjectFormValues {
  title: string; slug: string; tagline: string; description: string; tech_stack: string; platforms: string[];
  github_url: string; download_url: string; live_url: string; play_store_url: string; app_store_url: string;
  role: string; category: string; duration: string; client_name: string; testimonial: string;
  status: string; is_featured: boolean; brand_color: string;
}

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  
  // 👈 2. حالة الرفع المتقدمة
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false, isProcessingData: false, fileName: '', fileIndex: 0, filesCount: 0,
    progress: 0, loadedMB: 0, totalMB: 0, speedMBps: 0, etaSeconds: 0
  })
  const [lightboxMedia, setLightboxMedia] = useState<LightboxMedia>(null)
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [demoFile, setDemoFile] = useState<File | null>(null)
  const [demoPreview, setDemoPreview] = useState<string | null>(null)

  const [mobileThumbnailFile, setMobileThumbnailFile] = useState<File | null>(null)
  const [mobileThumbnailPreview, setMobileThumbnailPreview] = useState<string | null>(null)
  const [mobileDemoFile, setMobileDemoFile] = useState<File | null>(null)
  const [mobileDemoPreview, setMobileDemoPreview] = useState<string | null>(null)

  const [chapters, setChapters] = useState<ProjectFormChapter[]>([])
  
  const { register, handleSubmit, watch, setValue } = useForm<ProjectFormValues>({ defaultValues: { platforms: [], brand_color: '#10b981' } })

  const brandColorValue = watch('brand_color') || '#10b981'
  const selectedPlatforms = watch('platforms') || []
  const hasDesktop = selectedPlatforms.includes('Web') || selectedPlatforms.includes('Windows')
  const hasMobile = selectedPlatforms.includes('Android') || selectedPlatforms.includes('iOS')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: any, setPreview: any) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setFile(file); setPreview(URL.createObjectURL(file)) } }

  // 👈 3. نظام الرفع المخصص (XHR) لقياس السرعة والوقت
  const uploadFileWithProgress = async (file: File, folder: string, index: number, total: number): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      
      setUploadState(prev => ({ ...prev, isUploading: true, fileName: file.name, fileIndex: index, filesCount: total, progress: 0, speedMBps: 0, etaSeconds: 0, loadedMB: 0, totalMB: file.size / (1024 * 1024) }));

      const { data: { session } } = await supabase.auth.getSession()
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const token = session?.access_token || anonKey

      const fileExt = file.name.split('.').pop()
      const generatedName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const uploadUrl = `${supabaseUrl}/storage/v1/object/project-assets/${generatedName}`

      const xhr = new XMLHttpRequest()
      let lastLoaded = 0;
      let lastTime = Date.now();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const now = Date.now()
          const dt = (now - lastTime) / 1000 // بالثواني
          
          // تحديث الواجهة كل نصف ثانية لمنع الوميض المزعج
          if (dt > 0.5 || e.loaded === e.total) {
            const dl = e.loaded - lastLoaded // البايتات المرفوعة في هذا الجزء
            const speed = dl / dt // بايت في الثانية
            const speedMBps = speed / (1024 * 1024)
            const remainingBytes = e.total - e.loaded
            
            setUploadState(prev => ({
              ...prev,
              progress: Math.round((e.loaded / e.total) * 100),
              loadedMB: e.loaded / (1024 * 1024),
              speedMBps: speedMBps,
              etaSeconds: speed > 0 ? remainingBytes / speed : 0
            }))

            lastLoaded = e.loaded
            lastTime = now
          }
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const { data } = supabase.storage.from('project-assets').getPublicUrl(generatedName)
          resolve(data.publicUrl)
        } else reject(new Error(`فشل الرفع: ${xhr.status}`))
      }
      xhr.onerror = () => reject(new Error('خطأ في الشبكة أثناء الرفع'))

      xhr.open('POST', uploadUrl, true)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.setRequestHeader('apikey', anonKey)
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
      xhr.send(file)
    })
  }

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      // إحصاء عدد الملفات الكلي لتحديث العداد
      let allFilesToUpload: File[] = [];
      if (thumbnailFile) allFilesToUpload.push(thumbnailFile);
      if (demoFile) allFilesToUpload.push(demoFile);
      if (mobileThumbnailFile) allFilesToUpload.push(mobileThumbnailFile);
      if (mobileDemoFile) allFilesToUpload.push(mobileDemoFile);
      chapters.forEach(ch => ch.features.forEach(f => {
        if (f.videoFile) allFilesToUpload.push(f.videoFile);
        f.imageFiles.forEach(img => { if (img.file) allFilesToUpload.push(img.file as File) });
      }));

      const totalFilesCount = allFilesToUpload.length;
      let currentFileIndex = 0;

      // دالة مساعدة لرفع الملف وتحديث العداد
      const upload = async (file: File | null, folder: string) => {
        if (!file) return null;
        currentFileIndex++;
        return await uploadFileWithProgress(file, folder, currentFileIndex, totalFilesCount);
      }

      // 👈 4. الرفع بشكل تتابعي (وليس متوازي) لحماية المتصفح وضمان دقة شريط التقدم
      const thumbnailUrl = await upload(thumbnailFile, 'thumbnails')
      const demoUrl = await upload(demoFile, 'demos')
      const mobileThumbnailUrl = await upload(mobileThumbnailFile, 'thumbnails/mobile')
      const mobileDemoUrl = await upload(mobileDemoFile, 'demos/mobile')
      
      const processedChapters = [];
      for (const chapter of chapters) {
        const processedFeatures = [];
        for (const feature of chapter.features) {
          const video_url = await upload(feature.videoFile, 'features/videos')
          const image_urls = [];
          for (const img of feature.imageFiles) {
             if (img.file) image_urls.push(await upload(img.file as File, 'features/images'))
          }
          processedFeatures.push({ id: feature.id, title: feature.title, content: feature.content, layout_type: feature.layout_type, video_url, image_urls });
        }
        processedChapters.push({ id: chapter.id, title: chapter.title, description: chapter.description, features: processedFeatures });
      }

      // 👈 5. بعد انتهاء الرفع، نظهر شاشة "جاري حفظ البيانات"
      setUploadState(prev => ({ ...prev, isUploading: false, isProcessingData: true }))

      const techStackArray = data.tech_stack ? data.tech_stack.split(',').map((s) => s.trim()) : []
      const { error } = await supabase.from('projects').insert([{
        title: data.title, slug: data.slug, tagline: data.tagline, description: data.description, tech_stack: techStackArray, platforms: data.platforms || [], 
        github_url: data.github_url, download_url: data.download_url, live_url: data.live_url, play_store_url: data.play_store_url, app_store_url: data.app_store_url,
        role: data.role, category: data.category, duration: data.duration, client_name: data.client_name, testimonial: data.testimonial,
        status: data.status || 'Live', is_featured: data.is_featured || false, brand_color: data.brand_color || '#10b981',
        thumbnail_url: thumbnailUrl, demo_url: demoUrl, mobile_thumbnail_url: mobileThumbnailUrl, mobile_demo_url: mobileDemoUrl,
        chapters: processedChapters,
      }])

      if (error) throw error
      router.push('/admin/projects')
    } catch (error: unknown) {
      alert('حدث خطأ أثناء الرفع: ' + (error as Error).message)
      setUploadState(prev => ({ ...prev, isUploading: false, isProcessingData: false }))
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      
      {/* 🌟 استدعاء مكون التحميل الذكي الجديد 🌟 */}
      <UploadProgressOverlay state={uploadState} />

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-zinc-500 hover:text-white transition-colors"><ArrowRight size={24} /></Link>
        <h1 className="text-3xl font-bold">إضافة مشروع جديد</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* === نفس أكواد الحقول المتبقية بالضبط دون أي تغيير === */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-4 mb-6">المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-zinc-400 text-sm mb-2">اسم المشروع</label><input {...register('title', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">رابط الصفحة (Slug)</label><input {...register('slug', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
          </div>
          <div><label className="block text-zinc-400 text-sm mb-2">وصف مختصر</label><input {...register('tagline', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
          <div><label className="block text-zinc-400 text-sm mb-2">مقدمة المشروع</label><textarea {...register('description')} rows={4} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none resize-y" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-emerald-400 text-sm mb-3 font-medium">المنصات المدعومة:</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors"><input type="checkbox" value="Web" {...register('platforms')} className="w-4 h-4 accent-emerald-500" /> <Globe size={16} className="text-zinc-400"/> ويب</label>
                <label className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors"><input type="checkbox" value="Windows" {...register('platforms')} className="w-4 h-4 accent-emerald-500" /> <Monitor size={16} className="text-zinc-400"/> ويندوز</label>
                <label className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors"><input type="checkbox" value="Android" {...register('platforms')} className="w-4 h-4 accent-emerald-500" /> <Smartphone size={16} className="text-zinc-400"/> أندرويد</label>
                <label className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors"><input type="checkbox" value="iOS" {...register('platforms')} className="w-4 h-4 accent-emerald-500" /> <Apple size={16} className="text-zinc-400"/> iOS</label>
              </div>
            </div>
            <div className="space-y-4">
              <div><label className="block text-zinc-400 text-sm mb-2">التقنيات</label><input {...register('tech_stack')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
              <div><label className="block text-zinc-400 text-sm mb-2">تصنيف المشروع</label><input {...register('category')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
            <div><label className="block text-zinc-400 text-sm mb-2">الدور (Role)</label><input {...register('role')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">المدة (Duration)</label><input {...register('duration')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-zinc-800 pb-4">الوسائط والمظهر</h2>
          {!hasDesktop && !hasMobile && (<div className="text-center py-8 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-950">يرجى تحديد منصة واحدة.</div>)}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hasDesktop && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-emerald-500 font-medium flex items-center gap-2"><Monitor size={18} /> وسائط الويب/ديسكتوب</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-40 group bg-zinc-950 overflow-hidden">
                    {thumbnailPreview ? <img src={thumbnailPreview} className="w-full h-full object-cover rounded-xl" /> : <div className="text-zinc-500"><ImageIcon size={28} className="mb-2 mx-auto" /><span className="text-sm">صورة الغلاف</span></div>}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-2xl">
                      {thumbnailPreview && (<button type="button" onClick={() => setLightboxMedia({ type: 'image', url: thumbnailPreview })} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"><ZoomIn size={20} /></button>)}
                      <label className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors cursor-pointer"><Upload size={20} /><input type="file" accept="image/*" onChange={(e)=>handleFileChange(e,setThumbnailFile,setThumbnailPreview)} className="hidden" /></label>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-40 group bg-zinc-950 overflow-hidden">
                    {demoPreview ? (demoPreview.match(/\.(mp4|webm)$/i) || (demoFile && demoFile.type.startsWith('video/')) ? <video src={demoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-xl" /> : <img src={demoPreview} className="w-full h-full object-cover rounded-xl" />) : <div className="text-zinc-500"><Video size={28} className="mb-2 mx-auto" /><span className="text-sm">فيديو العرض</span></div>}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-2xl">
                      {demoPreview && (<button type="button" onClick={() => setLightboxMedia({ type: demoFile?.type.startsWith('video/') ? 'video' : 'image', url: demoPreview })} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"><ZoomIn size={20} /></button>)}
                      <label className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors cursor-pointer"><Upload size={20} /><input type="file" accept="video/mp4,video/webm,image/*" onChange={(e)=>handleFileChange(e,setDemoFile,setDemoPreview)} className="hidden" /></label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {hasMobile && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-blue-500 font-medium flex items-center gap-2"><Smartphone size={18} /> وسائط الجوال</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-40 group bg-zinc-950 overflow-hidden">
                    {mobileThumbnailPreview ? <img src={mobileThumbnailPreview} className="w-full h-full object-cover rounded-xl" /> : <div className="text-zinc-500"><ImageIcon size={28} className="mb-2 mx-auto" /><span className="text-sm">غلاف الجوال</span></div>}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-2xl">
                      {mobileThumbnailPreview && (<button type="button" onClick={() => setLightboxMedia({ type: 'image', url: mobileThumbnailPreview })} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"><ZoomIn size={20} /></button>)}
                      <label className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors cursor-pointer"><Upload size={20} /><input type="file" accept="image/*" onChange={(e)=>handleFileChange(e,setMobileThumbnailFile,setMobileThumbnailPreview)} className="hidden" /></label>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-40 group bg-zinc-950 overflow-hidden">
                    {mobileDemoPreview ? (mobileDemoPreview.match(/\.(mp4|webm)$/i) || (mobileDemoFile && mobileDemoFile.type.startsWith('video/')) ? <video src={mobileDemoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-xl" /> : <img src={mobileDemoPreview} className="w-full h-full object-cover rounded-xl" />) : <div className="text-zinc-500"><Video size={28} className="mb-2 mx-auto" /><span className="text-sm">فيديو الجوال</span></div>}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-2xl">
                      {mobileDemoPreview && (<button type="button" onClick={() => setLightboxMedia({ type: mobileDemoFile?.type.startsWith('video/') ? 'video' : 'image', url: mobileDemoPreview })} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"><ZoomIn size={20} /></button>)}
                      <label className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors cursor-pointer"><Upload size={20} /><input type="file" accept="video/mp4,video/webm,image/*" onChange={(e)=>handleFileChange(e,setMobileDemoFile,setMobileDemoPreview)} className="hidden" /></label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white border-b border-zinc-800 pb-4"><Star className="text-yellow-500" /> التميز والهوية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div><label className="block text-zinc-400 text-sm mb-2">حالة المشروع</label><select {...register('status')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none"><option value="Live">Live (مكتمل)</option><option value="In Progress">In Progress (قيد التطوير)</option><option value="Beta">Beta (نسخة تجريبية)</option></select></div>
            <div><label className="block text-zinc-400 text-sm mb-2">لون الهوية</label><div className="flex gap-3"><input type="color" value={brandColorValue} onChange={(e) => setValue('brand_color', e.target.value)} className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer" /><input type="text" {...register('brand_color')} className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none uppercase" /></div></div>
            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 p-4 rounded-xl h-12 mt-6 cursor-pointer hover:border-emerald-500 transition-colors"><input type="checkbox" id="is_featured" {...register('is_featured')} className="w-5 h-5 accent-emerald-500" /><label htmlFor="is_featured" className="text-white font-medium cursor-pointer">تثبيت كمشروع مميز</label></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white border-b border-zinc-800 pb-4"><LinkIcon className="text-zinc-400" /> الروابط والمتاجر</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasDesktop && (<div><label className="block text-zinc-400 text-sm mb-2">رابط الموقع</label><input {...register('live_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>)}
            <div><label className="block text-zinc-400 text-sm mb-2">الكود المصدري</label><input {...register('github_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            {hasMobile && (<><div><label className="block text-zinc-400 text-sm mb-2">Google Play</label><input {...register('play_store_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div><div><label className="block text-zinc-400 text-sm mb-2">App Store</label><input {...register('app_store_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div></>)}
            <div className="md:col-span-2"><label className="block text-zinc-400 text-sm mb-2">تحميل مباشر</label><input {...register('download_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white border-b border-zinc-800 pb-4"><User className="text-zinc-400" /> العميل</h2>
          <div className="grid grid-cols-1 gap-6">
            <div><label className="block text-zinc-400 text-sm mb-2">اسم العميل</label><input {...register('client_name')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none" /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">الرأي</label><textarea {...register('testimonial')} rows={3} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none resize-y" /></div>
          </div>
        </div>

        <CaseStudyBuilder chapters={chapters} setChapters={setChapters} isSubmitting={uploadState.isUploading || uploadState.isProcessingData} />

        <button type="submit" disabled={uploadState.isUploading || uploadState.isProcessingData} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl px-4 py-5 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Save size={24} className={(uploadState.isUploading || uploadState.isProcessingData) ? "animate-spin" : ""} />
          <span>{(uploadState.isUploading || uploadState.isProcessingData) ? 'جاري التنفيذ...' : 'نشر المشروع'}</span>
        </button>
      </form>

      <MediaLightbox media={lightboxMedia} onClose={() => setLightboxMedia(null)} />
    </div>
  )
}