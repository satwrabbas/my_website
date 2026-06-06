// app/admin/projects/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowRight, Save, Image as ImageIcon, Video, Images, X, Plus, Trash2, ListChecks, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

interface ProjectFeature {
  title: string;
  content: string;
  videoFile: File | null;
  videoPreview: string | null;
  imageFiles: { file: File | null; url: string }[];
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [demoFile, setDemoFile] = useState<File | null>(null)
  const [demoPreview, setDemoPreview] = useState<string | null>(null)

  const [features, setFeatures] = useState<ProjectFeature[]>([])
  
  const { register, handleSubmit, reset } = useForm()

  // --- جلب بيانات المشروع القديمة ---
  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (data) {
        // تعبئة البيانات النصية الأساسية
        reset({
          title: data.title,
          slug: data.slug,
          tagline: data.tagline,
          description: data.description,
          tech_stack: data.tech_stack?.join(', ') || '',
          platforms: data.platforms?.join(', ') || '',
          github_url: data.github_url || '',
          download_url: data.download_url || '',
        })

        // تعبئة الوسائط الأساسية
        setThumbnailPreview(data.thumbnail_url)
        setDemoPreview(data.demo_url)

        // تعبئة النقاط التفاعلية (Features)
        if (data.features && data.features.length > 0) {
          const loadedFeatures: ProjectFeature[] = data.features.map((feat: any) => ({
            title: feat.title,
            content: feat.content,
            videoFile: null,
            videoPreview: feat.video_url || null,
            imageFiles: feat.image_urls ? feat.image_urls.map((url: string) => ({ file: null, url })) : [],
          }))
          setFeatures(loadedFeatures)
        }
      }
      setIsLoading(false)
    }
    fetchProject()
  }, [projectId, reset, supabase])

  // --- دوال الملفات الأساسية ---
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0])
      setThumbnailPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDemoFile(e.target.files[0])
      setDemoPreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  // --- دوال الميزات (Features) ---
  const addFeature = () => setFeatures([...features, { title: '', content: '', videoFile: null, videoPreview: null, imageFiles: [] }])
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index))
  const updateFeatureText = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...features]; updated[index][field] = value; setFeatures(updated)
  }
  const handleFeatureVideo = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const updated = [...features]; updated[index].videoFile = e.target.files[0]; updated[index].videoPreview = URL.createObjectURL(e.target.files[0]); setFeatures(updated)
    }
  }
  const handleFeatureImages = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => ({ file, url: URL.createObjectURL(file) }))
      const updated = [...features]; updated[index].imageFiles = [...updated[index].imageFiles, ...filesArray]; setFeatures(updated)
    }
  }
  const removeFeatureImage = (featureIndex: number, imageIndex: number) => {
    const updated = [...features]; updated[featureIndex].imageFiles = updated[featureIndex].imageFiles.filter((_, i) => i !== imageIndex); setFeatures(updated)
  }

  // --- دالة الرفع ---
  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('project-assets').upload(fileName, file)
    if (error) throw error
    const { data } = supabase.storage.from('project-assets').getPublicUrl(fileName)
    return data.publicUrl
  }

  // --- دالة الحفظ (Submit) ---
  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // 1. رفع الوسائط الجديدة أو الاحتفاظ بالقديمة
      const finalThumbnailUrl = thumbnailFile ? await uploadFile(thumbnailFile, 'thumbnails') : thumbnailPreview
      const finalDemoUrl = demoFile ? await uploadFile(demoFile, 'demos') : demoPreview
      
      // 2. معالجة النقاط (Features)
      const processedFeatures = await Promise.all(
        features.map(async (feature) => {
          const video_url = feature.videoFile ? await uploadFile(feature.videoFile, 'features/videos') : feature.videoPreview;
          
          const image_urls = await Promise.all(
            feature.imageFiles.map(async (img) => {
              if (img.file) return await uploadFile(img.file, 'features/images')
              return img.url // الصورة موجودة مسبقاً
            })
          );

          return { title: feature.title, content: feature.content, video_url, image_urls }
        })
      )

      const techStackArray = data.tech_stack ? data.tech_stack.split(',').map((s: string) => s.trim()) : []
      const platformsArray = data.platforms ? data.platforms.split(',').map((s: string) => s.trim()) : []

      // 3. التحديث في قاعدة البيانات
      const { error } = await supabase.from('projects').update({
        title: data.title,
        slug: data.slug,
        tagline: data.tagline,
        description: data.description,
        tech_stack: techStackArray,
        platforms: platformsArray,
        github_url: data.github_url,
        download_url: data.download_url,
        thumbnail_url: finalThumbnailUrl,
        demo_url: finalDemoUrl,
        features: processedFeatures,
      }).eq('id', projectId)

      if (error) throw error

      router.push('/admin/projects')
    } catch (error: any) {
      alert('حدث خطأ أثناء التعديل: ' + error.message)
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="text-zinc-400 p-8 text-center animate-pulse">جاري جلب بيانات المشروع...</div>

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">
      
      {/* 🔴 شاشة التحميل الشفافة التي تمنع أي نقر (Loading Overlay) 🔴 */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <Loader2 size={64} className="animate-spin text-emerald-500 mb-6" />
          <h2 className="text-2xl font-bold mb-2">جاري معالجة ورفع الملفات...</h2>
          <p className="text-zinc-400">يرجى الانتظار وعدم إغلاق الصفحة.</p>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-3xl font-bold">تعديل المشروع التفاعلي</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* --- الوسائط الأساسية --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ImageIcon className="text-emerald-500" /> الواجهة الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-48 group">
              {thumbnailPreview ? <img src={thumbnailPreview} className="w-full h-full object-cover rounded-xl" /> : <ImageIcon size={32} className="text-zinc-500 mb-2" />}
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium rounded-2xl">
                تغيير الصورة الأساسية
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
              </label>
            </div>
            <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-48 group">
              {demoPreview ? (
                demoPreview.match(/\.(mp4|webm)$/i) ? <video src={demoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-xl" /> : <img src={demoPreview} className="w-full h-full object-cover rounded-xl" />
              ) : <Video size={32} className="text-zinc-500 mb-2" />}
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium rounded-2xl">
                تغيير فيديو العرض
                <input type="file" accept="video/mp4,video/webm,image/*" onChange={handleDemoChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* --- البيانات النصية --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-zinc-400 text-sm mb-2">اسم المشروع</label><input {...register('title', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">رابط الصفحة (Slug)</label><input {...register('slug', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" /></div>
          </div>
          <div><label className="block text-zinc-400 text-sm mb-2">وصف مختصر</label><input {...register('tagline', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" /></div>
          <div><label className="block text-zinc-400 text-sm mb-2">مقدمة المشروع</label><textarea {...register('description')} rows={4} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none resize-y" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-zinc-400 text-sm mb-2">التقنيات (مفصولة بفاصلة)</label><input {...register('tech_stack')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">المنصات</label><input {...register('platforms')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-zinc-400 text-sm mb-2">رابط GitHub</label><input {...register('github_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" /></div>
            <div><label className="block text-zinc-400 text-sm mb-2">رابط التحميل</label><input {...register('download_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" /></div>
          </div>
        </div>

        {/* --- النقاط الديناميكية --- */}
        <div className="bg-zinc-900 border border-emerald-500/30 rounded-3xl p-8 space-y-8">
          <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white"><ListChecks className="text-emerald-500" /> تعديل دراسة الحالة</h2>
            <button type="button" onClick={addFeature} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 border border-zinc-700 font-medium">
              <Plus size={18} /> إضافة نقطة
            </button>
          </div>

          <div className="space-y-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative group">
                <div className="absolute -top-3 -right-3 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                <button type="button" onClick={() => removeFeature(index)} className="absolute -top-3 -left-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 shadow-lg"><Trash2 size={16} /></button>

                <div className="space-y-4 mb-6">
                  <input value={feature.title} onChange={(e) => updateFeatureText(index, 'title', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none font-bold text-lg" required />
                  <textarea value={feature.content} onChange={(e) => updateFeatureText(index, 'content', e.target.value)} rows={4} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 outline-none resize-y" required />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-zinc-800">
                  <div className="lg:col-span-1 border-2 border-dashed border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center relative h-32 group/vid">
                    {feature.videoPreview ? (
                      feature.videoPreview.match(/\.(mp4|webm)$/i) ? <video src={feature.videoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-lg" /> : <img src={feature.videoPreview} className="w-full h-full object-cover rounded-lg" />
                    ) : <Video size={24} className="text-zinc-600 mb-2" />}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/vid:opacity-100 cursor-pointer text-white font-medium text-sm rounded-xl">تغيير<input type="file" accept="video/mp4,video/webm,image/*" onChange={(e) => handleFeatureVideo(index, e)} className="hidden" /></label>
                  </div>

                  <div className="lg:col-span-2 border-2 border-dashed border-zinc-800 rounded-xl p-4 relative min-h-[8rem]">
                    <div className="flex justify-between w-full absolute top-0 left-0 p-3">
                      <span className="text-zinc-500 text-xs font-medium">صور النقطة</span>
                      <label className="cursor-pointer bg-zinc-800 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1"><Images size={14} /> إضافة<input type="file" accept="image/*" multiple onChange={(e) => handleFeatureImages(index, e)} className="hidden" /></label>
                    </div>
                    {feature.imageFiles.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-8 w-full">
                        {feature.imageFiles.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative group/img rounded-md h-16 border border-zinc-700">
                            <img src={img.url} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeFeatureImage(index, imgIndex)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100"><X size={10} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl px-4 py-5 flex items-center justify-center gap-2 text-lg shadow-lg">
          <Save size={24} /><span>تحديث المشروع</span>
        </button>
      </form>
    </div>
  )
}