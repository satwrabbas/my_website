// app/admin/projects/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Smartphone, Monitor } from 'lucide-react'
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
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) return

    await supabase.from('projects').delete().eq('id', id)
    fetchProjects() // تحديث القائمة بعد الحذف
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">المشاريع والتطبيقات</h1>
        <Link 
          href="/admin/projects/new"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>إضافة مشروع جديد</span>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-zinc-500">جاري تحميل المشاريع...</p>
      ) : projects.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Smartphone size={48} className="text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">لا يوجد أي مشاريع حتى الآن</h3>
          <p className="text-zinc-400 mb-6">ابدأ بإضافة أول تطبيق أو مشروع برمجي لمعرض أعمالك.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col">
              <h3 className="text-xl font-bold text-emerald-400">{project.title}</h3>
              <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{project.tagline}</p>
              
              <div className="flex gap-2 mt-4 flex-wrap">
                {project.tech_stack.map((tech: string, i: number) => (
                  <span key={i} className="bg-zinc-800 text-xs text-zinc-300 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-auto pt-6">
                <button 
                  onClick={() => handleDelete(project.id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
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