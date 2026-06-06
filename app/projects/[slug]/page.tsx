// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Smartphone, Monitor, Download, ExternalLink, Images, PlayCircle } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !project) {
    notFound()
  }

  // التحقق مما إذا كان رابط الفيديو هو mp4/webm لتشغيله كفيديو أو كصورة متحركة GIF
  const isVideoDemo = project.demo_url?.match(/\.(mp4|webm)$/i);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      
      <header className="max-w-5xl mx-auto px-6 py-8">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors">
          <ArrowRight size={20} />
          <span>العودة للأعمال</span>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        
        {/* --- عنوان المشروع والصورة الرئيسية --- */}
        <div className="mb-16 text-center md:text-right">
          <div className="flex justify-center md:justify-start gap-3 text-emerald-500 mb-6">
            {project.platforms?.includes('Android') || project.platforms?.includes('iOS') ? <Smartphone size={28} /> : null}
            {project.platforms?.includes('Windows') || project.platforms?.includes('Web') ? <Monitor size={28} /> : null}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {project.title}
          </h1>
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-3xl">
            {project.tagline}
          </p>

          {project.thumbnail_url && (
            <div className="w-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl relative group">
              <img 
                src={project.thumbnail_url} 
                alt={project.title} 
                className="w-full h-auto max-h-[600px] object-cover object-top"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* --- العمود الجانبي (المعلومات التقنية والروابط) --- */}
          <aside className="lg:col-span-1 space-y-8 order-2 lg:order-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 sticky top-8">
              <div className="mb-8">
                <h3 className="text-white font-bold mb-4 border-b border-zinc-800 pb-4">التقنيات</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.map((tech: string, i: number) => (
                    <span key={i} className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-white font-bold mb-4 border-b border-zinc-800 pb-4">المنصات</h3>
                <div className="flex flex-wrap gap-2">
                  {project.platforms?.map((platform: string, i: number) => (
                    <span key={i} className="text-zinc-300 text-sm px-3 py-1 border-l-2 border-emerald-500/50 pl-2">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

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
            </div>
          </aside>

          {/* --- المحتوى الرئيسي (الشرح + معرض الوسائط) --- */}
          <article className="lg:col-span-2 order-1 lg:order-2">
            
            {/* الشرح المعمق (Markdown) */}
            <div className="prose prose-invert prose-emerald max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-a:text-emerald-400 hover:prose-a:text-emerald-300 prose-img:rounded-2xl prose-pre:bg-[#282c34] prose-pre:border prose-pre:border-zinc-800">
              {project.description ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.description}
                </ReactMarkdown>
              ) : (
                <p className="text-zinc-500 italic">لا توجد تفاصيل إضافية لهذا المشروع حتى الآن.</p>
              )}
            </div>

            {/* --- فيديو العرض (Demo Video) --- */}
            {project.demo_url && (
              <div className="mt-16 pt-12 border-t border-zinc-900">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <PlayCircle className="text-emerald-500" /> عرض توضيحي
                </h3>
                <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl">
                  {isVideoDemo ? (
                    <video 
                      src={project.demo_url} 
                      controls 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-auto"
                    />
                  ) : (
                    <img 
                      src={project.demo_url} 
                      alt="Demo Animation" 
                      className="w-full h-auto"
                    />
                  )}
                </div>
              </div>
            )}

            {/* --- معرض الصور المتعددة (Gallery Grid) --- */}
            {project.image_urls && project.image_urls.length > 0 && (
              <div className="mt-16 pt-12 border-t border-zinc-900">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Images className="text-emerald-500" /> لقطات الشاشة
                </h3>
                
                {/* شبكة الصور */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.image_urls.map((url: string, index: number) => (
                    <div key={index} className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 relative group">
                      <img 
                        src={url} 
                        alt={`${project.title} - Screenshot ${index + 1}`} 
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* تظليل خفيف عند التمرير */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </article>
        </div>
      </main>
    </div>
  )
}