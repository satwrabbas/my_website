// app/writing/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css' // ستايل تلوين الأكواد

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const { data: article } = await supabase.from('articles').select('title, excerpt').eq('slug', slug).single()
  
  if (!article) return { title: 'مقال غير موجود' }
  
  return {
    title: `${article.title} | Abbas Satwr`,
    description: article.excerpt,
  }
}

export default async function SingleArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  // جلب المقال
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  // إذا لم يجد المقال أو كان غير منشور، يعطي صفحة 404
  if (error || !article || !article.is_published) {
    notFound()
  }

  // زيادة عدد المشاهدات (تعمل في الخلفية بصمت)
  supabase.rpc('increment_article_views', { article_id: article.id })

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-32">
      <header className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/writing" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors mb-12">
          <ArrowRight size={20} />
          <span>العودة للمقالات</span>
        </Link>

        {article.cover_image && (
          <div className="w-full h-[400px] rounded-3xl overflow-hidden mb-12 bg-zinc-900 border border-zinc-800">
            <img 
              src={article.cover_image} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <time className="text-emerald-500 font-medium mb-4 flex items-center gap-2">
          <Calendar size={18} />
          {new Date(article.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
          {article.title}
        </h1>
        
        <div className="h-px w-full bg-zinc-900 mb-12"></div>

        <article className="prose prose-invert prose-emerald max-w-none prose-lg prose-headings:font-bold prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-img:rounded-2xl prose-pre:bg-[#282c34] prose-pre:border prose-pre:border-zinc-800 prose-pre:p-6">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeHighlight]}
          >
            {article.content}
          </ReactMarkdown>
        </article>
      </header>
    </div>
  )
}