'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Globe, Monitor, Smartphone, Apple, Star, Loader2, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  platforms: string[];
  status: string;
  is_featured: boolean;
  thumbnail_url?: string;
  mobile_thumbnail_url?: string;
}

export default function ProjectsPage() {
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, slug, category, platforms, status, is_featured, thumbnail_url, mobile_thumbnail_url')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      alert('حدث خطأ أثناء جلب قائمة المشاريع.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف المشروع "${title}"؟`)) return

    try {
      setIsDeleting(id)
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProjects(projects.filter((p) => p.id !== id))
    } catch (error: unknown) {
      alert('حدث خطأ أثناء حذف المشروع: ' + (error as Error).message)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">المشاريع والتطبيقات</h1>
          <p className="text-zinc-400 text-sm mt-1">إدارة وتحرير كافة المشاريع المسجلة في معرض أعمالك.</p>
        </div>
        <Link 
          href="/admin/projects/new" 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)] self-start sm:self-auto"
        >
          <Plus size={20} />
          <span>إضافة مشروع جديد</span>
        </Link>
      </div>

      {/* المحتوى الرئيسي */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400">
          <Loader2 size={36} className="animate-spin text-emerald-500 ml-3" />
          <span>جاري تحميل قائمة المشاريع...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/50">
          <p className="text-zinc-500 text-lg mb-4">لم تقم بإضافة أي مشاريع حتى الآن.</p>
          <Link 
            href="/admin/projects/new" 
            className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 font-medium"
          >
            <span>أضف مشروعك الأول من هنا</span>
            <Plus size={18} />
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-sm">
                  <th className="p-5 font-medium">المشروع</th>
                  <th className="p-5 font-medium">التصنيف</th>
                  <th className="p-5 font-medium">المنصات</th>
                  <th className="p-5 font-medium">الحالة</th>
                  <th className="p-5 font-medium">مميز</th>
                  <th className="p-5 font-medium text-left">خيارات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-900/30 transition-colors">
                    {/* عمود تفاصيل المشروع والاسم */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-zinc-950 overflow-hidden border border-zinc-800 flex items-center justify-center shrink-0">
                          {(project.thumbnail_url || project.mobile_thumbnail_url) ? (
                            <img 
                              src={project.thumbnail_url || project.mobile_thumbnail_url} 
                              alt={project.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Monitor size={20} className="text-zinc-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{project.title}</div>
                          <div className="text-xs text-zinc-500">/{project.slug}</div>
                        </div>
                      </div>
                    </td>

                    {/* عمود التصنيف */}
                    <td className="p-5 text-sm">{project.category || '—'}</td>

                    {/* عمود المنصات */}
                    <td className="p-5">
                      <div className="flex gap-1.5 text-zinc-400">
                        {project.platforms?.includes('Web') && <Globe size={16} title="ويب" />}
                        {project.platforms?.includes('Windows') && <Monitor size={16} title="ويندوز" />}
                        {project.platforms?.includes('Android') && <Smartphone size={16} title="أندرويد" />}
                        {project.platforms?.includes('iOS') && <Apple size={16} title="iOS" />}
                        {(!project.platforms || project.platforms.length === 0) && <span className="text-xs text-zinc-600">—</span>}
                      </div>
                    </td>

                    {/* عمود الحالة */}
                    <td className="p-5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        project.status === 'Live' ? 'bg-emerald-500/10 text-emerald-500' :
                        project.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {project.status === 'Live' ? 'Live (مكتمل)' :
                         project.status === 'In Progress' ? 'In Progress' : 'Beta'}
                      </span>
                    </td>

                    {/* عمود التميز */}
                    <td className="p-5">
                      {project.is_featured ? (
                        <Star size={18} className="text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Star size={18} className="text-zinc-700" />
                      )}
                    </td>

                    {/* عمود خيارات التحكم */}
                    <td className="p-5 text-left">
                      <div className="flex items-center justify-end gap-3">
                        <a 
                          href={`/projects/${project.slug}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-zinc-500 hover:text-white p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="عرض المعاينة"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <Link 
                          href={`/admin/projects/${project.id}/edit`} 
                          className="text-zinc-400 hover:text-emerald-500 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(project.id, project.title)}
                          disabled={isDeleting === project.id}
                          className="text-zinc-500 hover:text-red-500 p-2 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
                          title="حذف"
                        >
                          {isDeleting === project.id ? (
                            <Loader2 size={18} className="animate-spin text-red-500" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}