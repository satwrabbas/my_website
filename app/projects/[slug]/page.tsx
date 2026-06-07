// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Smartphone, Monitor, Download, ExternalLink, Images, PlayCircle, Globe, Apple } from 'lucide-react'
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

  // استخراج مصفوفة الميزات (النقاط) مع توفير مصفوفة فارغة كاحتياطي
  const features = project.features || []

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-32">
      
      <header className="max-w-5xl mx-auto px-6 py-8">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors">
          <ArrowRight size={20} />
          <span>العودة للأعمال</span>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        
        {/* --- الترويسة الرئيسية للمشروع --- */}
        <div className="mb-20 text-center md:text-right">
          <div className="flex justify-center md:justify-start gap-3 text-emerald-500 mb-6">
            {project.platforms?.includes('Android') && <Smartphone size={28} title="Android" />}
            {(project.platforms?.includes('iOS') || project.platforms?.includes('iPhone')) && <Apple size={28} title="iOS" />}
            {project.platforms?.includes('Windows') && <Monitor size={28} title="Windows" />}
            {project.platforms?.includes('Web') && <Globe size={28} title="Web" />}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 leading-relaxed max-w-3xl">
            {project.tagline}
          </p>

          {project.thumbnail_url && (
            <div className="w-full rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl relative">
              <img 
                src={project.thumbnail_url} 
                alt={project.title} 
                className="w-full h-auto max-h-[700px] object-cover object-top"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- العمود الجانبي (المعلومات والروابط) --- */}
          <aside className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 sticky top-8 backdrop-blur-sm">
              <div className="mb-8">
                <h3 className="text-white font-bold mb-4 border-b border-zinc-800 pb-4 text-lg">التقنيات المستخدمة</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.map((tech: string, i: number) => (
                    <span key={i} className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-xl">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-white font-bold mb-4 border-b border-zinc-800 pb-4 text-lg">المنصات</h3>
                <div className="flex flex-wrap gap-2">
                  {project.platforms?.map((platform: string, i: number) => (
                    <span key={i} className="text-zinc-300 font-medium px-3 py-1 border-r-2 border-emerald-500 pr-3">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {project.download_url && (
                  <Link 
                    href={project.download_url}
                    target="_blank"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl px-4 py-4 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
                  >
                    <Download size={20} />
                    <span>تحميل التطبيق</span>
                  </Link>
                )}
                {project.github_url && (
                  <Link 
                    href={project.github_url}
                    target="_blank"
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl px-4 py-4 flex items-center justify-center gap-2 transition-colors"
                  >
                    <ExternalLink size={20} />
                    <span>استعراض الكود المصدري</span>
                  </Link>
                )}
              </div>
            </div>
          </aside>

          {/* --- محتوى دراسة الحالة (النقاط التفاعلية) --- */}
          <article className="lg:col-span-8 order-1 lg:order-2">
            
            {/* المقدمة العامة للمشروع إن وجدت */}
            {project.description && (
              <div className="prose prose-invert prose-emerald max-w-none prose-lg prose-headings:font-bold prose-p:leading-relaxed mb-20 text-zinc-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.description}
                </ReactMarkdown>
              </div>
            )}

            {/* --- حلقة المرور على النقاط (Features Loop) --- */}
            {features.length > 0 && (
              <div className="space-y-32">
                {features.map((feature: any, index: number) => (
                  <section key={index} className="relative">
                    
                    {/* رقم هندسي فخم في الخلفية */}
                    <div className="absolute -top-16 -right-8 text-[10rem] font-black text-zinc-800/30 select-none pointer-events-none z-0">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                        {feature.title}
                      </h3>
                      
                      <div className="prose prose-invert prose-emerald max-w-none prose-lg text-zinc-400 mb-10 leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {feature.content}
                        </ReactMarkdown>
                      </div>

                      {/* عرض فيديو النقطة (إن وجد) */}
                      {feature.video_url && (
                        <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl mb-8">
                          <video 
                            src={feature.video_url} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            controls
                            className="w-full h-auto max-h-[600px] object-cover"
                          />
                        </div>
                      )}

                      {/* عرض صور النقطة كشبكة (إن وجدت) */}
                      {feature.image_urls && feature.image_urls.length > 0 && (
                        <div className={`grid gap-4 ${feature.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-2'}`}>
                          {feature.image_urls.map((imgUrl: string, imgIndex: number) => (
                            <div key={imgIndex} className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
                              <img 
                                src={imgUrl} 
                                alt={`${feature.title} - لقطة ${imgIndex + 1}`} 
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            )}
            
          </article>
        </div>
      </main>
    </div>
  )
}