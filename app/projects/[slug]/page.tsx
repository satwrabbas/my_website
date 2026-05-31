// src/app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Smartphone, Monitor, Download, ExternalLink } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// إعداد Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// دالة لتوليد البيانات الوصفية (SEO) تلقائياً لكل مشروع
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const { data: project } = await supabase.from('projects').select('title, tagline').eq('slug', slug).single()
  
  if (!project) return { title: 'المشروع غير موجود' }
  
  return {
    title: `${project.title} | Abbas Satwr`,
    description: project.tagline,
  }
}

export default async function ProjectDetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = await params

  // جلب بيانات المشروع باستخدام الـ slug
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !project) {
    notFound() // توجيه المستخدم لصفحة 404 إذا لم يجد المشروع
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      
      {/* الترويسة العليا */}
      <header className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors">
          <ArrowRight size={20} />
          <span>العودة للرئيسية</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        
        {/* عنوان المشروع والصورة */}
        <div className="mb-16">
          <div className="flex gap-3 text-emerald-500 mb-6">
            {project.platforms?.includes('Android') || project.platforms?.includes('iOS') ? <Smartphone size={28} /> : null}
            {project.platforms?.includes('Windows') || project.platforms?.includes('Web') ? <Monitor size={28} /> : null}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {project.title}
          </h1>
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
            {project.tagline}
          </p>

          {project.thumbnail_url && (
            <div className="w-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img 
                src={project.thumbnail_url} 
                alt={project.title} 
                className="w-full h-auto max-h-[600px] object-cover"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* العمود الجانبي (المعلومات التقنية والروابط) */}
          <aside className="lg:col-span-1 space-y-8 order-2 lg:order-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 border-b border-zinc-800 pb-4">التقنيات المستخدمة</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.map((tech: string, i: number) => (
                  <span key={i} className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm px-3 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 border-b border-zinc-800 pb-4">المنصات</h3>
              <div className="flex flex-wrap gap-2">
                {project.platforms?.map((platform: string, i: number) => (
                  <span key={i} className="text-zinc-300 text-sm px-3 py-1">
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* أزرار التحميل وجيت هاب */}
            <div className="flex flex-col gap-3">
              {project.download_url && (
                <Link 
                  href={project.download_url}
                  target="_blank"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={20} />
                  <span>تحميل التطبيق</span>
                </Link>
              )}
              {project.github_url && (
                <Link 
                  href={project.github_url}
                  target="_blank"
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink size={20} />
                  <span>استعراض الكود</span>
                </Link>
              )}
            </div>
          </aside>

          {/* محتوى دراسة الحالة (Markdown) */}
          <article className="lg:col-span-2 order-1 lg:order-2">
            <div className="prose prose-invert prose-emerald max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-a:text-emerald-400 hover:prose-a:text-emerald-300">
              {project.description ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.description}
                </ReactMarkdown>
              ) : (
                <p className="text-zinc-500 italic">لا توجد تفاصيل إضافية لهذا المشروع.</p>
              )}
            </div>
          </article>

        </div>
      </main>
    </div>
  )
}