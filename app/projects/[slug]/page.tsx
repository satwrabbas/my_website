// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Smartphone, Monitor, Download, ExternalLink, Globe, Apple, Store, Clock, User, LayoutGrid, Quote, Construction } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Project, ProjectChapter, ProjectFeature } from '@/types'

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

// مُكوّن داخلي لعرض الوسائط بشكل نظيف
const FeatureMedia = ({ feature }: { feature: ProjectFeature }) => {
  if (feature.video_url) {
    return (
      <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl relative w-full h-full min-h-[300px]">
        <video src={feature.video_url} autoPlay loop muted playsInline className="w-full h-full object-cover absolute inset-0" />
      </div>
    )
  }
  if (feature.image_urls && feature.image_urls.length > 0) {
    return (
      <div className={`grid gap-4 w-full h-full ${feature.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {feature.image_urls.map((imgUrl, idx) => (
          <div key={idx} className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl min-h-[300px]">
            <Image src={imgUrl} alt={feature.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single()

  if (error || !data) notFound()

  const project: Project = data 
  
  // 🌟 معالجة التوافقية: إذا لم يكن هناك فصول، نحول النقاط القديمة إلى فصل وهمي
  const chapters: ProjectChapter[] = (project.chapters && project.chapters.length > 0) 
    ? project.chapters 
    : (project.features && project.features.length > 0)
      ? [{ id: 'legacy', title: 'نظرة عامة', features: project.features }]
      : []

  const brandColor = project.brand_color || '#10b981'
  const isNotLive = project.status && project.status.toLowerCase() !== 'live'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 md:pb-32 selection:bg-white/20" style={{ '--brand-color': brandColor } as React.CSSProperties}>
      
      {/* 🔹 تأثير الخلفية العلوي */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-20 blur-[150px] pointer-events-none" style={{ backgroundColor: brandColor }}></div>

      {/* 🔹 الهيدر */}
      <header className="max-w-6xl mx-auto px-5 md:px-6 py-6 md:py-8 relative z-10">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm md:text-base font-medium">
          <ArrowRight size={18} /> العودة للأعمال
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-6 relative z-10">
        
        {/* 🔹 قسم العنوان الرئيسي */}
        <div className="mb-16 md:mb-24 text-center md:text-right max-w-4xl">
          <div className="flex justify-center md:justify-start gap-3 mb-6" style={{ color: brandColor }}>
            {project.platforms?.includes('Android') && <Smartphone size={28} />}
            {(project.platforms?.includes('iOS') || project.platforms?.includes('iPhone')) && <Apple size={28} />}
            {project.platforms?.includes('Windows') && <Monitor size={28} />}
            {project.platforms?.includes('Web') && <Globe size={28} />}
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6 mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">{project.title}</h1>
            {isNotLive && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full font-bold shadow-lg">
                <Construction size={18} className="animate-pulse" /> {project.status}
              </div>
            )}
          </div>

          <p className="text-lg md:text-2xl text-zinc-400 mb-12 leading-relaxed">{project.tagline}</p>

          {(project.thumbnail_url || project.mobile_thumbnail_url) && (
            <div className="w-full h-[300px] md:h-[600px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl relative">
              <Image src={project.thumbnail_url || project.mobile_thumbnail_url || ''} alt={project.title} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover object-top" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 🔹 الشريط الجانبي (التفاصيل والروابط) */}
          <aside className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 sticky top-8 backdrop-blur-sm shadow-xl">
              
              <div className="mb-8 space-y-4 border-b border-zinc-800 pb-6">
                {project.category && <div className="flex items-center gap-3 text-zinc-400"><LayoutGrid size={18} style={{ color: brandColor }} /><span className="font-medium text-white">{project.category}</span></div>}
                {project.role && <div className="flex items-center gap-3 text-zinc-400"><User size={18} style={{ color: brandColor }} /><span>الدور: <span className="font-medium text-white">{project.role}</span></span></div>}
                {project.duration && <div className="flex items-center gap-3 text-zinc-400"><Clock size={18} style={{ color: brandColor }} /><span>المدة: <span className="font-medium text-white">{project.duration}</span></span></div>}
              </div>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-white font-bold mb-4 text-lg">التقنيات المستخدمة</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech, i) => <span key={i} className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-xl">{tech}</span>)}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-4">
                {project.live_url && <Link href={project.live_url} target="_blank" className="font-bold rounded-2xl px-4 py-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] text-white shadow-lg" style={{ backgroundColor: brandColor, boxShadow: `0 10px 30px -10px ${brandColor}` }}><Globe size={20} /><span>زيارة الموقع المباشر</span></Link>}
                {project.app_store_url && <Link href={project.app_store_url} target="_blank" className="bg-black border border-zinc-800 hover:bg-zinc-900 text-white font-bold rounded-2xl px-4 py-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"><Apple size={22} /><span>App Store</span></Link>}
                {project.play_store_url && <Link href={project.play_store_url} target="_blank" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[#00ff7f] font-bold rounded-2xl px-4 py-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"><Store size={20} /><span>Google Play</span></Link>}
                {project.download_url && <Link href={project.download_url} target="_blank" className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl px-4 py-4 flex items-center justify-center gap-2 transition-colors"><Download size={20} /><span>تحميل التطبيق</span></Link>}
                {project.github_url && <Link href={project.github_url} target="_blank" className="bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-white font-bold rounded-2xl px-4 py-4 flex items-center justify-center gap-2 transition-colors mt-2"><ExternalLink size={20} /><span>استعراض الكود</span></Link>}
              </div>
            </div>
          </aside>

          {/* 🔹 المحتوى الرئيسي (دراسة الحالة والفصول) */}
          <article className="lg:col-span-8 order-1 lg:order-2">
            
            {project.client_name && project.testimonial && (
              <div className="mb-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <Quote size={48} className="absolute -top-4 -right-4 opacity-10" style={{ color: brandColor }} />
                <p className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-6 italic relative z-10">"{project.testimonial}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg" style={{ backgroundColor: brandColor }}>{project.client_name.charAt(0)}</div>
                  <div><h4 className="text-white font-bold text-lg">{project.client_name}</h4><p className="text-zinc-500 text-sm">العميل</p></div>
                </div>
              </div>
            )}

            {project.description && (
              <div className="prose prose-lg prose-invert max-w-none prose-p:leading-relaxed mb-20 text-zinc-300 prose-a:text-[var(--brand-color)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
              </div>
            )}

            {/* 🌟 بناء الفصول ودراسة الحالة 🌟 */}
            {chapters.length > 0 && (
              <div className="space-y-24">
                {chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.id} className="relative">
                    
                    {/* رأس الفصل */}
                    <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 py-6 mb-12 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] text-white" style={{ backgroundColor: brandColor }}>
                        {chapterIndex + 1}
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{chapter.title}</h2>
                        {chapter.description && <p className="text-zinc-400 text-sm mt-1">{chapter.description}</p>}
                      </div>
                    </div>

                    {/* نقاط الفصل (الميزات) */}
                    <div className="space-y-20">
                      {chapter.features.map((feature, featureIndex) => {
                        const layout = feature.layout_type || 'default'

                        // 1. التخطيط الافتراضي (نص وفوقه/تحته وسائط)
                        if (layout === 'default') {
                          return (
                            <section key={feature.id}>
                              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{feature.title}</h3>
                              <div className="prose prose-lg prose-invert max-w-none text-zinc-400 mb-8"><ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.content}</ReactMarkdown></div>
                              <div className="h-[400px]"><FeatureMedia feature={feature} /></div>
                            </section>
                          )
                        }

                        // 2. تخطيط الشاشة الكاملة (Hero)
                        if (layout === 'hero') {
                          return (
                            <section key={feature.id} className="relative h-[600px] rounded-3xl overflow-hidden border border-zinc-800 group">
                              <FeatureMedia feature={feature} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12 z-10">
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{feature.title}</h3>
                                <div className="prose prose-lg prose-invert max-w-2xl text-zinc-300 drop-shadow-md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.content}</ReactMarkdown></div>
                              </div>
                            </section>
                          )
                        }

                        // 3. تخطيط جانبي (يمين أو يسار)
                        const isImageLeft = layout === 'image_left'
                        return (
                          <section key={feature.id} className="flex flex-col md:flex-row gap-8 items-center">
                            <div className={`w-full md:w-1/2 h-[350px] ${isImageLeft ? 'md:order-1' : 'md:order-2'}`}>
                              <FeatureMedia feature={feature} />
                            </div>
                            <div className={`w-full md:w-1/2 ${isImageLeft ? 'md:order-2' : 'md:order-1'}`}>
                              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{feature.title}</h3>
                              <div className="prose prose-lg prose-invert text-zinc-400"><ReactMarkdown remarkPlugins={[remarkGfm]}>{feature.content}</ReactMarkdown></div>
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
        </div>
      </main>
    </div>
  )
}