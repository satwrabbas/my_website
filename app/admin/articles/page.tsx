// app/admin/articles/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2, Edit, FileText, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setArticles(data)
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return
    await supabase.from('articles').delete().eq('id', id)
    fetchArticles()
  }

  const togglePublish = async (id: string, currentStatus: boolean) => {
    await supabase
      .from('articles')
      .update({ is_published: !currentStatus })
      .eq('id', id)
    fetchArticles()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">المقالات والمدونة</h1>
        <Link 
          href="/admin/articles/new"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>كتابة مقال جديد</span>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-zinc-500">جاري تحميل المقالات...</p>
      ) : articles.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <FileText size={48} className="text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">لا يوجد أي مقالات حتى الآن</h3>
          <p className="text-zinc-400 mb-6">ابدأ بكتابة أول تدوينة لمشاركتها مع زوار موقعك.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{article.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${article.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {article.is_published ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {article.is_published ? 'منشور' : 'مسودة'}
                </span>
              </div>
              
              <p className="text-zinc-400 text-sm mb-6 line-clamp-3">{article.excerpt}</p>

              <div className="flex justify-end items-center gap-3 mt-auto pt-4 border-t border-zinc-800">
                <button 
                  onClick={() => togglePublish(article.id, article.is_published)}
                  className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium ml-auto"
                >
                  {article.is_published ? 'إلغاء النشر' : 'نشر الآن'}
                </button>
                
                {/* 👈 زر التعديل الجديد */}
                <Link 
                  href={`/admin/articles/${article.id}/edit`}
                  className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-400/10 transition-colors"
                  title="تعديل المقال"
                >
                  <Edit size={18} />
                </Link>

                <button 
                  onClick={() => handleDelete(article.id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                  title="حذف المقال"
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