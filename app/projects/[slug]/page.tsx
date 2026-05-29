// app/projects/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Download, Monitor, Smartphone, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// أيقونة GitHub المخصصة
const GithubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.8 0-1.4-.5-2.8-1.5-3.8.1-.3.7-1.8-.1-3.8 0 0-1.2-.4-3.9 1.4a12.3 12.3 0 0 0-7 0C6.1 1.6 4.9 2 4.9 2c-.8 2-.2 3.5-.1 3.8-1 1-1.5 2.4-1.5 3.8 0 5.3 3 6.5 6 6.8-.4.3-.7.9-.8 2-.2.1-.5.2-1 .2-1.5 0-2.5-1.1-3-2 0 0-.5-.9-1.5-1.1 0 0-1-.1-.1.3.8.4 1.2 1.5 1.2 1.5.7 1.9 2.8 1.9 4 1.5v2" />
  </svg>
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// في Next.js الحديثة (15+) params تعتبر Promise ويجب عمل await لها
export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  // جلب بيانات المشروع بناءً على الـ slug
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  // إذا لم يتم العثور على المشروع، نوجهه لصفحة 404
  if (!project) {
    notFound()
  }

  // تنسيق التاريخ
  const formattedDate = new Intl.DateTimeFormat('ar-EG', { month: 'long', year: 'numeric' }).format(new Date(project.created_at))

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 pb-20">
      
      {/* شريط التنقل العلوي */}
      <header className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-emerald-400 transition-colors font-medium">
          <ArrowRight size={20} />
          العودة للرئيسية
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        
        {/* رأس الصفحة (العنوان والتفاصيل الأساسية) */}
        <div className="mb-12">
          <div className="flex gap-2 text-emerald-500 mb-6">
            {project.platforms?.includes('Android') || project.platforms?.includes('iOS') ? <Smartphone size={28} /> : null}
            {project.platforms?.includes('Windows') || project.platforms?.includes('Web') ? <Monitor size={28} /> : null}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">{project.title}</h1>
          <p className="text-xl text-zinc-400 leading-relaxed mb-8">{project.tagline}</p>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 border-y border-zinc-900 py-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {project.tech_stack?.map((tech: string, i: number) => (
                <span key={i} className="bg-zinc-900 text-zinc-300 px-3 py-1 rounded-full border border-zinc-800">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* صورة المشروع */}
        {project.thumbnail_url && (
          <div className="w-full rounded-3xl overflow-hidden border border-zinc-800 mb-16 bg-zinc-900 shadow-2xl">
            <img 
              src={project.thumbnail_url} 
              alt={project.title} 
              className="w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        )}

        {/* المحتوى والتفاصيل (يدعم Markdown) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="md:col-span-2">
            {/* هنا نستخدم tailwind typography (prose) لتنسيق الـ Markdown تلقائياً */}
            <article className="prose prose-invert prose-emerald max-w-none">
              {project.description ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.description}
                </ReactMarkdown>
              ) : (
                <p className="text-zinc-500 italic">لا يوجد وصف تفصيلي لهذا المشروع حتى الآن.</p>
              )}
            </article>
          </div>

          {/* القائمة الجانبية (روابط التحميل) */}
          <div className="space-y-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-6">روابط المشروع</h3>
              
              <div className="space-y-3">
                {project.download_url && (
                  <Link 
                    href={project.download_url}
                    target="_blank"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download size={20} />
                    تحميل التطبيق
                  </Link>
                )}
                
                {project.github_url && (
                  <Link 
                    href={project.github_url}
                    target="_blank"
                    className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <GithubIcon size={20} />
                    عرض الكود المصدري
                  </Link>
                )}

                {!project.download_url && !project.github_url && (
                  <p className="text-zinc-500 text-sm text-center">الروابط غير متاحة حالياً</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}