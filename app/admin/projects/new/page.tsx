// app/admin/projects/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowRight, Save, Image as ImageIcon, Video, Images, X, Plus, Trash2, ListChecks } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

// تعريف هيكلية نقطة الشرح (Feature)
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
  
  // حالة الصورة الأساسية وفيديو التمرير
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [demoFile, setDemoFile] = useState<File | null>(null)
  const [demoPreview, setDemoPreview] = useState<string | null>(null)

  // حالة النقاط الديناميكية (Features)
  const [features, setFeatures] = useState<ProjectFeature[]>([])
  
  const { register, handleSubmit } = useForm()

  // ----------------------------------------
  // دوال التعامل مع الملفات الأساسية
  // ----------------------------------------
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setDemoFile(file)
      setDemoPreview(URL.createObjectURL(file))
    }
  }

  // ----------------------------------------
  // دوال التحكم بالنقاط الديناميكية (Features)
  // ----------------------------------------
  const addFeature = () => {
    setFeatures([...features, { title: '', content: '', videoFile: null, videoPreview: null, imageFiles: [] }])
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const updateFeatureText = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...features]
    updated[index][field] = value
    setFeatures(updated)
  }

  const handleFeatureVideo = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const updated = [...features]
      updated[index].videoFile = file
      updated[index].videoPreview = URL.createObjectURL(file)
      setFeatures(updated)
    }
  }

  const handleFeatureImages = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => ({
        file,
        url: URL.createObjectURL(file)
      }))
      const updated = [...features]
      updated[index].imageFiles = [...updated[index].imageFiles, ...filesArray]
      setFeatures(updated)
    }
  }

  const removeFeatureImage = (featureIndex: number, imageIndex: number) => {
    const updated = [...features]
    updated[featureIndex].imageFiles = updated[featureIndex].imageFiles.filter((_, i) => i !== imageIndex)
    setFeatures(updated)
  }

  // ----------------------------------------
  // دالة الرفع إلى Supabase
  // ----------------------------------------
  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    
    const { error } = await supabase.storage.from('project-assets').upload(fileName, file)
    if (error) throw error
    
    const { data } = supabase.storage.from('project-assets').getPublicUrl(fileName)
    return data.publicUrl
  }

  // ----------------------------------------
  // الإرسال النهائي (Submit)
  // ----------------------------------------
  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // 1. رفع الوسائط الأساسية
      const thumbnailUrl = thumbnailFile ? await uploadFile(thumbnailFile, 'thumbnails') : null
      const demoUrl = demoFile ? await uploadFile(demoFile, 'demos') : null
      
      // 2. معالجة ورفع وسائط النقاط الديناميكية (Features)
      const processedFeatures = await Promise.all(
        features.map(async (feature) => {
          const video_url = feature.videoFile ? await uploadFile(feature.videoFile, 'features/videos') : null;
          const image_urls = await Promise.all(
            feature.imageFiles.map(img => uploadFile(img.file, 'features/images'))
          );

          return {
            title: feature.title,
            content: feature.content,
            video_url,
            image_urls
          }
        })
      )

      // 3. معالجة النصوص (المصفوفات)
      const techStackArray = data.tech_stack ? data.tech_stack.split(',').map((s: string) => s.trim()) : []
      const platformsArray = data.platforms ? data.platforms.split(',').map((s: string) => s.trim()) : []

      // 4. الحفظ في قاعدة البيانات
      const { error } = await supabase.from('projects').insert([
        {
          title: data.title,
          slug: data.slug,
          tagline: data.tagline,
          description: data.description,
          tech_stack: techStackArray,
          platforms: platformsArray,
          github_url: data.github_url,
          download_url: data.download_url,
          thumbnail_url: thumbnailUrl,
          demo_url: demoUrl,
          features: processedFeatures, // 👈 حفظ مصفوفة الميزات الديناميكية هنا بصيغة JSONB
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
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-3xl font-bold">إضافة مشروع تفاعلي</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* --- 1. الوسائط الأساسية --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ImageIcon className="text-emerald-500" /> الواجهة الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-48 group">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <ImageIcon size={32} className="text-zinc-500 mb-2" />
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium rounded-2xl">
                الصورة الأساسية (Thumbnail)
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
              </label>
            </div>

            <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative h-48 group">
              {demoPreview ? (
                <video src={demoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Video size={32} className="text-zinc-500 mb-2" />
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium rounded-2xl">
                فيديو العرض المصغر (Hover MP4)
                <input type="file" accept="video/mp4,video/webm" onChange={handleDemoChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* --- 2. البيانات النصية --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">تفاصيل المشروع الأساسية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">اسم المشروع</label>
              <input {...register('title', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">رابط الصفحة (Slug)</label>
              <input {...register('slug', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">وصف مختصر (يظهر في البطاقة)</label>
            <input {...register('tagline', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">مقدمة المشروع (Markdown - اختياري)</label>
            <textarea {...register('description')} rows={4} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none resize-y" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">التقنيات (مفصولة بفاصلة)</label>
              <input {...register('tech_stack')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">المنصات (مفصولة بفاصلة)</label>
              <input {...register('platforms')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">رابط GitHub</label>
              <input {...register('github_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">رابط التحميل المباشر</label>
              <input {...register('download_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        {/* --- 3. قسم النقاط الديناميكية (Features / Case Study) --- */}
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
              disabled={isSubmitting} // 👈 إضافة هذا
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
                    disabled={isSubmitting} // 👈 إضافة هذا
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
                    {/* فيديو الميزة */}
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

                    {/* صور الميزة */}
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
          <span>{isSubmitting ? 'جاري بناء ورفع دراسة الحالة الكاملة...' : 'نشر المشروع التفاعلي'}</span>
        </button>
      </form>
    </div>
  )
}