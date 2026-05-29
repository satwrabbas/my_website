// app/admin/articles/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowRight, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function NewArticlePage() {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const { register, handleSubmit } = useForm()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    let coverUrl = null

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `covers/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('project-assets')
        .upload(fileName, imageFile)

      if (uploadError) {
        alert('خطأ في رفع الصورة: ' + uploadError.message)
        setIsSubmitting(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('project-assets')
        .getPublicUrl(fileName)
      
      coverUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase.from('articles').insert([
      {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        cover_image: coverUrl,
        is_published: data.is_published === 'true', // تحويل القيمة النصية إلى Boolean
      }
    ])

    setIsSubmitting(false)

    if (error) {
      alert('حدث خطأ أثناء حفظ المقال: ' + error.message)
    } else {
      router.push('/admin/articles')
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/articles" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-3xl font-bold">كتابة مقال جديد</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
        
        {/* رفع صورة الغلاف */}
        <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 transition-colors relative overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-lg mb-4" />
          ) : (
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-500">
              <ImageIcon size={32} />
            </div>
          )}
          
          <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            {previewUrl ? 'تغيير صورة الغلاف' : 'اختر صورة غلاف للمقال'}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-zinc-400 text-sm mb-2">عنوان المقال</label>
            <input {...register('title', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-zinc-400 text-sm mb-2">رابط المقال (Slug بالإنجليزية)</label>
            <input {...register('slug', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-2">نبذة مختصرة (تظهر في البطاقة)</label>
          <input {...register('excerpt', { required: true })} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none" />
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-2 flex justify-between">
            <span>محتوى المقال (يدعم Markdown)</span>
            <span className="text-zinc-600 text-xs">استخدم # للعناوين، و ``` للأكواد</span>
          </label>
          <textarea {...register('content', { required: true })} rows={15} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none resize-y font-mono text-sm leading-relaxed" dir="auto" />
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-2">حالة المقال</label>
          <select {...register('is_published')} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none">
            <option value="false">مسودة (لا يظهر للزوار)</option>
            <option value="true">نشر فوراً</option>
          </select>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg px-4 py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            <Save size={20} />
            <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ المقال'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}