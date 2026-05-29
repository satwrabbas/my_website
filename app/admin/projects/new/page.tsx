// app/admin/projects/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { ArrowRight, Save } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // تهيئة نموذج الإدخال
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    // تحويل النصوص المفصولة بفاصلة إلى مصفوفات (Arrays) لكي تقبلها قاعدة البيانات
    const techStackArray = data.tech_stack ? data.tech_stack.split(',').map((s: string) => s.trim()) : []
    const platformsArray = data.platforms ? data.platforms.split(',').map((s: string) => s.trim()) : []

    // إرسال البيانات إلى Supabase
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
      }
    ])

    setIsSubmitting(false)

    if (error) {
      alert('حدث خطأ أثناء حفظ المشروع: ' + error.message)
    } else {
      router.push('/admin/projects') // العودة لصفحة المشاريع بعد النجاح
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/projects" className="text-zinc-500 hover:text-white transition-colors">
          <ArrowRight size={24} />
        </Link>
        <h1 className="text-3xl font-bold">إضافة مشروع جديد</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* اسم المشروع */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2">اسم المشروع / التطبيق</label>
            <input 
              {...register('title', { required: true })}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
              placeholder="مثال: Task Manager"
            />
          </div>

          {/* الرابط النظيف (Slug) */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2">رابط الصفحة (Slug بالإنجليزية)</label>
            <input 
              {...register('slug', { required: true })}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
              placeholder="مثال: task-manager-app"
            />
          </div>
        </div>

        {/* وصف مختصر */}
        <div>
          <label className="block text-zinc-400 text-sm mb-2">وصف مختصر (يظهر في البطاقة)</label>
          <input 
            {...register('tagline', { required: true })}
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
            placeholder="مثال: تطبيق لإدارة المهام اليومية مدعوم بالذكاء الاصطناعي"
          />
        </div>

        {/* وصف تفصيلي */}
        <div>
          <label className="block text-zinc-400 text-sm mb-2">وصف تفصيلي (يدعم Markdown)</label>
          <textarea 
            {...register('description')}
            rows={5}
            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-colors resize-none"
            placeholder="اكتب تفاصيل هندسة التطبيق والتحديات التي واجهتك..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* التقنيات */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2">التقنيات (افصل بينها بفاصلة)</label>
            <input 
              {...register('tech_stack')}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
              placeholder="Flutter, Next.js, Supabase"
            />
          </div>

          {/* المنصات */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2">المنصات المدعومة (افصل بينها بفاصلة)</label>
            <input 
              {...register('platforms')}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
              placeholder="Android, Windows, Web"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* رابط جيت هاب */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2">رابط GitHub (اختياري)</label>
            <input 
              {...register('github_url')}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
              placeholder="https://github.com/..."
            />
          </div>

          {/* رابط التحميل */}
          <div>
            <label className="block text-zinc-400 text-sm mb-2">رابط تحميل التطبيق المباشر (اختياري)</label>
            <input 
              {...register('download_url')}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg px-4 py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ ونشر المشروع'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}