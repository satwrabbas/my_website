// app/admin/projects/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Smartphone, Monitor } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    // جلب المشاريع وترتيبها من الأحدث للأقدم
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setProjects(data)
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع نهائياً؟')) return

    await supabase.from('projects').delete().eq('id', id)
    fetchProjects() // تحديث القائمة بعد الحذف
  }

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">المشاريع والتطبيقات</h1>
        <Link 
          href="/admin/projects/new"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-lg shadow-emerald-900/20"
        >
          <Plus size={20} />
          <span>إضافة مشروع جديد</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 p-8 text-center animate-pulse">جاري تحميل المشاريع...</div>
      ) : projects.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
          <Smartphone size={48} className="text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">لا يوجد أي مشاريع حتى الآن</h3>
          <p className="text-zinc-400 mb-6">ابدأ بإضافة أول تطبيق أو مشروع برمجي لمعرض أعمالك.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col hover:border-zinc-700 transition-colors">
              <h3 className="text-xl font-bold text-emerald-400">{project.title}</h3>
              <p className="text-zinc-400 text-sm mt-2 line-clamp-2 leading-relaxed">{project.tagline}</p>
              
              <div className="flex gap-2 mt-4 flex-wrap">
                {/* استخدام ?. لتجنب الأخطاء إذا لم تكن هناك تقنيات مدخلة */}
                {project.tech_stack?.map((tech: string, i: number) => (
                  <span key={i} className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 px-3 py-1 rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>

              {/* أزرار التحكم (تعديل وحذف) */}
              <div className="flex justify-end items-center gap-2 mt-auto pt-6 border-t border-zinc-800/50">
                <Link 
                  href={`/admin/projects/${project.id}/edit`}
                  className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-colors"
                  title="تعديل المشروع"
                >
                  <Edit size={18} />
                </Link>

                <button 
                  onClick={() => handleDelete(project.id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                  title="حذف المشروع"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}