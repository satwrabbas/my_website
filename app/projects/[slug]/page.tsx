// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Smartphone, Monitor, Download, ExternalLink, Globe, Apple, Store, Clock, User, LayoutGrid, Quote, Construction } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Project, ProjectChapter } from '@/types'

// استدعاء المكونات التفاعلية الجديدة
import ProjectMediaViewer from '@/components/ProjectMediaViewer'
import ProjectHeroMedia from '@/components/ProjectHeroMedia'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const { data: project, error } = await supabase.from('projects').select('title, tagline').eq('slug', slug).single()
    if (error || !project) return { title: 'المشروع غير موجود | Abbas Satwr' }
    return { title: `${project.title} | Abbas Satwr`, description: project.tagline }
  } catch (err) {
    return { title: 'المشروع | Abbas Satwr' }
  }
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single()

  if (error || !data) notFound()

  const project: Project = data 
  
  const chapters: ProjectChapter[] = (project.chapters && project.chapters.length > 0) 
    ? project.chapters 
    : (project.features && project.features.length > 0)
      ? [{ id: 'legacy', title: 'نظرة عامة', features: project.features }]
      : []

  const brandColor = project.brand_color || '#10b981'
  const isNotLive = project.status && project.status.toLowerCase() !== 'live'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 md:pb-32 selection:bg-white/20" style={{ '--brand-color': brandColor } as React.CSSProperties}>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] opacity-15 blur-[150px] pointer-events-none" style={{ backgroundColor: brandColor }}></div>

      <header className="max-w-6xl mx-auto px-5 md:px-8 py-8 relative z-10">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium bg-zinc-900/50 border border-zinc-800 rounded-full px-5 py-2.5 backdrop-blur-md">
          <ArrowRight size={18} /> العودة للأعمال
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
        
        {/* 🌟 1. العنوان الرئيسي والغلاف الذكي 🌟 */}
        <div className="mb-12 text-center max-w-5xl mx-auto">
          <div className="flex justify-center gap-3 mb-6" style={{ color: brandColor }}>
            {project.platforms?.includes('Android') && <Smartphone size={28} />}
            {(project.platforms?.includes('iOS') || project.platforms?.includes('iPhone')) && <Apple size={28} />}
            {project.platforms?.includes('Windows') && <Monitor size={28} />}
            {project.platforms?.includes('Web') && <Globe size={28} />}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6">{project.title}</h1>
          
          {isNotLive && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full font-bold shadow-lg mb-8">
              <Construction size={18} className="animate-pulse" /> {project.status}
            </div>
          )}

          <p className="text-xl md:text-3xl text-zinc-400 mb-12 leading-relaxed max-w-3xl mx-auto">{project.tagline}</p>

          {/* استبدال الغلاف القديم بمكون الغلاف التفاعلي الجديد */}
          <ProjectHeroMedia 
            title={project.title}
            thumbnailUrl={project.thumbnail_url || project.mobile_thumbnail_url || undefined}
            demoUrl={project.demo_url || project.mobile_demo_url || undefined}
          />
        </div>

        {/* 🌟 2. شريط المعلومات الأفقي 🌟 */}
        <div className="max-w-5xl mx-auto mb-20 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-b border-zinc-800/50 pb-8">
            {project.category && (
              <div className="flex flex-col gap-2"><div className="flex items-center gap-2 text-zinc-500 text-sm"><LayoutGrid size={16}/> التصنيف</div><div className="text-white font-bold text-lg">{project.category}</div></div>
            )}
            {project.role && (
              <div className="flex flex-col gap-2"><div className="flex items-center gap-2 text-zinc-500 text-sm"><User size={16}/> الدور</div><div className="text-white font-bold text-lg">{project.role}</div></div>
            )}
            {project.duration && (
              <div className="flex flex-col gap-2"><div className="flex items-center gap-2 text-zinc-500 text-sm"><Clock size={16}/> المدة</div><div className="text-white font-bold text-lg">{project.duration}</div></div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="flex-1">
                <div className="text-zinc-500 text-sm mb-3">التقنيات المستخدمة</div>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, i) => <span key={i} className="bg-zinc-950/50 border border-zinc-800 text-zinc-300 text-sm px-4 py-1.5 rounded-full">{tech}</span>)}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {project.live_url && <Link href={project.live_url} target="_blank" className="font-bold rounded-2xl px-5 py-3 flex items-center gap-2 transition-all hover:scale-[1.02] text-white shadow-lg" style={{ backgroundColor: brandColor, boxShadow: `0 10px 30px -10px ${brandColor}` }}><Globe size={18} /><span>الموقع المباشر</span></Link>}
              {project.app_store_url && <Link href={project.app_store_url} target="_blank" className="bg-white text-black font-bold rounded-2xl px-5 py-3 flex items-center gap-2 transition-all hover:scale-[1.02]"><Apple size={20} /><span>App Store</span></Link>}
              {project.play_store_url && <Link href={project.play_store_url} target="_blank" className="bg-zinc-800 hover:bg-zinc-700 text-[#00ff7f] font-bold rounded-2xl px-5 py-3 flex items-center gap-2 transition-all hover:scale-[1.02]"><Store size={18} /><span>Google Play</span></Link>}
              {project.download_url && <Link href={project.download_url} target="_blank" className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl px-5 py-3 flex items-center gap-2 transition-colors"><Download size={18} /><span>تحميل</span></Link>}
              {project.github_url && <Link href={project.github_url} target="_blank" className="bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-white font-bold rounded-2xl px-5 py-3 flex items-center gap-2 transition-colors"><ExternalLink size={18} /><span>الكود</span></Link>}
            </div>
          </div>
        </div>

        {/* 🌟 3. دراسة الحالة بكامل العرض 🌟 */}
        <article className="max-w-5xl mx-auto">
          {/* ... (نفس كود التقييمات ووصف المشروع كما هو دون تغيير) ... */}
          {project.client_name && project.testimonial && (
            <div className="mb-20 bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <Quote size={80} className="absolute -top-6 -right-6 opacity-5" style={{ color: brandColor }} />
              <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-8 italic relative z-10 text-center">"{project.testimonial}"</p>
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg" style={{ backgroundColor: brandColor }}>{project.client_name.charAt(0)}</div>
                <div className="text-center"><h4 className="text-white font-bold text-xl">{project.client_name}</h4><p className="text-zinc-500">العميل</p></div>
              </div>
            </div>
          )}

          {project.description && (
            <div className="prose prose-xl md:prose-2xl prose-invert max-w-none prose-p:leading-relaxed mb-24 text-zinc-300 prose-a:text-[var(--brand-color)]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
            </div>
          )}

          {chapters.length > 0 && (
            <div className="space-y-32">
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="relative">
                  
                  <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] text-white" style={{ backgroundColor: brandColor }}>
                      {chapterIndex + 1}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white">{chapter.title}</h2>
                    {chapter.description && <p className="text-zinc-400 text-lg md:text-xl mt-4 max-w-2xl">{chapter.description}</p>}
                  </div>

                  <div className="space-y-24 md:space-y-32">
                    {chapter.features.map((feature) => {
                      const layout = feature.layout_type || 'default'

                      if (layout === 'default') {
                        return (
                          <section key={feature.id} className="space-y-8">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">{feature.title}</h3>
                            <div className="prose prose-lg md:prose-xl prose-invert max-w-4xl mx-auto text-zinc-400 mb-10 text-center"><ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.content}</ReactMarkdown></div>
                            <ProjectMediaViewer feature={feature} layout={layout} />
                          </section>
                        )
                      }

                      if (layout === 'hero') {
                        return (
                          <section key={feature.id} className="relative min-h-[600px] md:min-h-[700px] rounded-[2.5rem] overflow-hidden border border-zinc-800 group flex items-end shadow-2xl">
                            <ProjectMediaViewer feature={feature} layout={layout} />
                            <div className="relative z-10 w-full p-8 md:p-16 text-center pointer-events-none">
                              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-xl">{feature.title}</h3>
                              <div className="prose prose-xl prose-invert max-w-3xl mx-auto text-zinc-200 drop-shadow-md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.content}</ReactMarkdown></div>
                            </div>
                          </section>
                        )
                      }

                      const isImageLeft = layout === 'image_left'
                      return (
                        <section key={feature.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                          <div className={`w-full ${isImageLeft ? 'order-1' : 'order-1 lg:order-2'}`}>
                            <ProjectMediaViewer feature={feature} layout={layout} />
                          </div>
                          <div className={`w-full ${isImageLeft ? 'order-2' : 'order-2 lg:order-1'}`}>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">{feature.title}</h3>
                            <div className="prose prose-lg md:prose-xl prose-invert text-zinc-400"><ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.content}</ReactMarkdown></div>
                          </div>
                        </section>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  )
}