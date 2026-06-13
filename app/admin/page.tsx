// app/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Briefcase, FileText, FileEdit } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    publishedArticles: 0,
    draftArticles: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      // 1. جلب إجمالي المشاريع
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      // 2. جلب المقالات المنشورة
      const { count: publishedCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)

      // 3. جلب مسودات المقالات (التي لم تنشر بعد بدلاً من الرسائل)
      const { count: draftsCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', false)

      setStats({
        projects: projectsCount || 0,
        publishedArticles: publishedCount || 0,
        draftArticles: draftsCount || 0,
      })
      setIsLoading(false)
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">نظرة عامة</h1>
      
      {isLoading ? (
        <div className="text-zinc-500 animate-pulse">جاري تحميل الإحصائيات...</div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* بطاقة المشاريع */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">إجمالي المشاريع</h3>
              <p className="text-3xl font-bold text-white">{stats.projects}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
              <Briefcase size={24} />
            </div>
          </div>
          
          {/* بطاقة المقالات المنشورة */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">المقالات المنشورة</h3>
              <p className="text-3xl font-bold text-white">{stats.publishedArticles}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
              <FileText size={24} />
            </div>
          </div>
          
          {/* بطاقة مسودات المقالات */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-zinc-400 text-sm font-medium mb-2">مسودات المقالات</h3>
              <p className="text-3xl font-bold text-zinc-300">{stats.draftArticles}</p>
            </div>
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
              <FileEdit size={24} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}