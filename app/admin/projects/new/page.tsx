// app/admin/projects/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowRight, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null) // حالة لحفظ ملف الصورة
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // حالة لعرض الصورة قبل الرفع
  
  const { register, handleSubmit } = useForm()

  // دالة لاختيار الصورة وعرض معاينة لها
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    let thumbnailUrl = null

    // 1. رفع الصورة إذا تم اختيارها
    if (imageFile) {
      // إنشاء اسم فريد للصورة لتجنب التكرار
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `thumbnails/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('project-assets')
        .upload(filePath, imageFile)

      if (uploadError) {
        alert('خطأ في رفع الصورة: ' + uploadError.message)
        setIsSubmitting(false)
        return
      }

      // جلب الرابط العام للصورة بعد رفعها بنجاح
      const { data: publicUrlData } = supabase.storage
        .from('project-assets')
        .getPublicUrl(filePath)
      
      thumbnailUrl = publicUrlData.publicUrl
    }
    
    // 2. تحويل النصوص إلى مصفوفات
    const techStackArray = data.tech_stack ? data.tech_stack.split(',').map((s: string) => s.trim()) : []
    const platformsArray = data.platforms ? data.platforms.split(',').map((s: string) => s.trim()) : []

    // 3. حفظ البيانات في قاعدة البيانات مع رابط الصورة
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
        thumbnail_url: thumbnailUrl // 👈 هنا نمرر رابط الصورة
      }
    ])

    setIsSubmitting(false)

    if (error) {
      alert('حدث خطأ أثناء حفظ المشروع: ' + error.message)
    } else {
      router.push('/admin/projects')
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-3xl font-bold">إضافة مشروع جديد</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
        
        {/* قسم رفع الصورة الرئيسية */}
        <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 transition-colors relative overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-lg mb-4" />
          ) : (
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-500">
              <ImageIcon size={32} />
            </div>
          )}
          
          <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            {previewUrl ? 'تغيير الصورة' : 'اختر صورة المشروع (Mockup)'}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </label>
        </div>

        {/* باقي الحقول (كما هي) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">اسم المشروع / التطبيق</label>
            <input {...register('title', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">رابط الصفحة (Slug بالإنجليزية)</label>
            <input {...register('slug', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-2">وصف مختصر (يظهر في البطاقة)</label>
          <input {...register('tagline', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-2">وصف تفصيلي (يدعم Markdown)</label>
          <textarea {...register('description')} rows={5} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">التقنيات (افصل بينها بفاصلة)</label>
            <input {...register('tech_stack')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">المنصات المدعومة</label>
            <input {...register('platforms')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">رابط GitHub</label>
            <input {...register('github_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">رابط تحميل التطبيق المباشر</label>
            <input {...register('download_url')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg px-4 py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            <Save size={20} />
            <span>{isSubmitting ? 'جاري رفع الصور والحفظ...' : 'حفظ ونشر المشروع'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}