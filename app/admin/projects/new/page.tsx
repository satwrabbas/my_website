// app/admin/projects/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowRight, Save, Image as ImageIcon, Video, Images, X } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 1. حالة الصورة الرئيسية
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  // 2. حالة الفيديو التوضيحي
  const [demoFile, setDemoFile] = useState<File | null>(null)
  const [demoPreview, setDemoPreview] = useState<string | null>(null)

  // 3. حالة معرض الصور (عدة صور)
  const [galleryFiles, setGalleryFiles] = useState<{file: File, url: string}[]>([])
  
  const { register, handleSubmit } = useForm()

  // دوال التعامل مع الملفات
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

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file => ({
        file,
        url: URL.createObjectURL(file)
      }))
      setGalleryFiles(prev => [...prev, ...filesArray])
    }
  }

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryFiles(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  // دالة مساعدة لرفع ملف واحد وجلب رابطه
  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    
    const { error } = await supabase.storage.from('project-assets').upload(fileName, file)
    if (error) throw error
    
    const { data } = supabase.storage.from('project-assets').getPublicUrl(fileName)
    return data.publicUrl
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // رفع الصورة الرئيسية
      const thumbnailUrl = thumbnailFile ? await uploadFile(thumbnailFile, 'thumbnails') : null
      
      // رفع فيديو العرض
      const demoUrl = demoFile ? await uploadFile(demoFile, 'demos') : null
      
      // رفع معرض الصور (بالتوازي لتسريع العملية باستخدام Promise.all)
      const imageUrls = await Promise.all(
        galleryFiles.map(item => uploadFile(item.file, 'gallery'))
      )

      // معالجة النصوص للمصفوفات
      const techStackArray = data.tech_stack ? data.tech_stack.split(',').map((s: string) => s.trim()) : []
      const platformsArray = data.platforms ? data.platforms.split(',').map((s: string) => s.trim()) : []

      // حفظ في قاعدة البيانات
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
          image_urls: imageUrls, // 👈 حفظ مصفوفة روابط المعرض هنا
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
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-3xl font-bold">إضافة مشروع متكامل</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* --- قسم رفع الوسائط (Media) --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ImageIcon className="text-emerald-500" /> وسائط المشروع</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* الصورة الرئيسية */}
            <div className="border-2 border-dashed border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden h-48">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <ImageIcon size={32} className="text-zinc-500 mb-2" />
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white font-medium">
                الصورة الأساسية (Thumbnail)
                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
              </label>
            </div>

            {/* فيديو التمرير (Hover) */}
            <div className="border-2 border-dashed border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden h-48">
              {demoPreview ? (
                <video src={demoPreview} autoPlay loop muted className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Video size={32} className="text-zinc-500 mb-2" />
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white font-medium">
                فيديو قصير (MP4)
                <input type="file" accept="video/mp4,video/webm" onChange={handleDemoChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* معرض الصور المتعددة */}
          <div className="border-2 border-dashed border-zinc-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 font-medium">معرض لقطات الشاشة (Screenshots)</span>
              <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
                <Images size={16} /> إضافة صور
                <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
              </label>
            </div>
            
            {galleryFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {galleryFiles.map((item, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden h-24 border border-zinc-700">
                    <img src={item.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- قسم البيانات النصية --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">تفاصيل المشروع</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">اسم المشروع</label>
              <input {...register('title', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">رابط الصفحة (Slug)</label>
              <input {...register('slug', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">وصف مختصر (البطاقة)</label>
            <input {...register('tagline', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">الشرح المعمق (Markdown)</label>
            <textarea {...register('description')} rows={8} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none resize-y" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">التقنيات (مفصولة بفاصلة)</label>
              <input {...register('tech_stack')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">المنصات (مفصولة بفاصلة)</label>
              <input {...register('platforms')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">رابط GitHub</label>
              <input {...register('github_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">رابط التحميل</label>
              <input {...register('download_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          <Save size={20} className={isSubmitting ? "animate-spin" : ""} />
          <span>{isSubmitting ? 'جاري معالجة ورفع الملفات الحجمية...' : 'نشر المشروع بالكامل'}</span>
        </button>
      </form>
    </div>
  )
}