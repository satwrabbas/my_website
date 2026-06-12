// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Smartphone, Monitor, Download, ExternalLink, Globe, Apple, Store, Clock, User, LayoutGrid, Quote, Construction } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: project } = await supabase.from('projects').select('title, tagline').eq('slug', slug).single()
  if (!project) return { title: 'المشروع غير موجود' }
  return { title: `${project.title} | Abbas Satwr`, description: project.tagline }
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !project) {
    notFound()
  }

  const features = project.features || []
  const brandColor = project.brand_color || '#10b981'
  const isNotLive = project.status && project.status.toLowerCase() !== 'live'

  return (
    // 🔹 تقليل pb-32 إلى pb-16 للجوال
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16 md:pb-32 selection:bg-white/20" style={{ '--brand-color': brandColor } as React.CSSProperties}>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-20 blur-[150px] pointer-events-none" style={{ backgroundColor: brandColor }}></div>

      {/* 🔹 تقليل Padding الهيدر */}
      <header className="max-w-5xl mx-auto px-5 md:px-6 py-6 md:py-8 relative z-10">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm md:text-base">
          <ArrowRight size={18} className="md:w-5 md:h-5" />
          <span>العودة للأعمال</span>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-5 md:px-6 relative z-10">
        
        {/* 🔹 تقليل مسافة mb-20 إلى mb-12 للجوال */}
        <div className="mb-12 md:mb-20 text-center md:text-right">
          <div className="flex justify-center md:justify-start gap-2 md:gap-3 mb-4 md:mb-6" style={{ color: brandColor }}>
            {project.platforms?.includes('Android') && <span title="Android"><Smartphone size={24} className="md:w-7 md:h-7" /></span>}
            {(project.platforms?.includes('iOS') || project.platforms?.includes('iPhone')) && <span title="iOS"><Apple size={24} className="md:w-7 md:h-7" /></span>}
            {project.platforms?.includes('Windows') && <span title="Windows"><Monitor size={24} className="md:w-7 md:h-7" /></span>}
            {project.platforms?.includes('Web') && <span title="Web"><Globe size={24} className="md:w-7 md:h-7" /></span>}
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4 md:gap-6 mb-4 md:mb-6">
            {/* 🔹 تصغير العنوان الرئيسي text-4xl للجوال */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
              {project.title}
            </h1>
            {isNotLive && (
              <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full font-bold shadow-lg text-sm md:text-base">
                <Construction size={16} className="animate-pulse md:w-5 md:h-5" />
                {project.status}
              </div>
            )}
          </div>

          {/* 🔹 تصغير الخط text-base للجوال */}
          <p className="text-base md:text-xl lg:text-2xl text-zinc-400 mb-8 md:mb-12 leading-relaxed max-w-3xl">
            {project.tagline}
          </p>

          {/* 🔹 تقليل ارتفاع الصورة 250px والاستدارة rounded-2xl للجوال */}
          {(project.thumbnail_url || project.mobile_thumbnail_url) && (
            <div className="w-full h-[250px] sm:h-[300px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl relative">
              <Image 
                src={project.thumbnail_url || project.mobile_thumbnail_url} 
                alt={project.title} 
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover object-top"
              />
            </div>
          )}
        </div>

        {/* 🔹 تقليل المسافة بين العمودين gap-8 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          <aside className="lg:col-span-4 space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* 🔹 تقليل p-8 إلى p-5 */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl md:rounded-3xl p-5 md:p-8 sticky top-8 backdrop-blur-sm shadow-xl">
              
              <div className="mb-6 md:mb-8 space-y-3 md:space-y-4 border-b border-zinc-800 pb-5 md:pb-6 text-sm md:text-base">
                {project.category && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <LayoutGrid size={18} style={{ color: brandColor }} />
                    <span className="font-medium text-white">{project.category}</span>
                  </div>
                )}
                {project.role && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <User size={18} style={{ color: brandColor }} />
                    <span>الدور: <span className="font-medium text-white">{project.role}</span></span>
                  </div>
                )}
                {project.duration && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Clock size={18} style={{ color: brandColor }} />
                    <span>المدة: <span className="font-medium text-white">{project.duration}</span></span>
                  </div>
                )}
              </div>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="mb-6 md:mb-8">
                  <h3 className="text-white font-bold mb-3 md:mb-4 text-base md:text-lg">التقنيات المستخدمة</h3>
                  {/* 🔹 تقليل المسافة والأحجام للأزرار */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech: string, i: number) => (
                      <span key={i} className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔹 تصغير الـ padding للأزرار `py-3.5` وتقليل الاستدارة `rounded-xl` */}
              <div className="flex flex-col gap-3 pt-2 md:pt-4 text-sm md:text-base">
                {project.live_url && (
                  <Link href={project.live_url} target="_blank" className="font-bold rounded-xl md:rounded-2xl px-4 py-3.5 md:py-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] text-white shadow-lg" style={{ backgroundColor: brandColor, boxShadow: `0 10px 30px -10px ${brandColor}` }}>
                    <Globe size={18} className="md:w-5 md:h-5" /><span>زيارة الموقع المباشر</span>
                  </Link>
                )}
                {project.app_store_url && (
                  <Link href={project.app_store_url} target="_blank" className="bg-black border border-zinc-800 hover:bg-zinc-900 text-white font-bold rounded-xl md:rounded-2xl px-4 py-3.5 md:py-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                    <Apple size={20} className="md:w-[22px] md:h-[22px]" /><span>App Store</span>
                  </Link>
                )}
                {project.play_store_url && (
                  <Link href={project.play_store_url} target="_blank" className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[#00ff7f] font-bold rounded-xl md:rounded-2xl px-4 py-3.5 md:py-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                    <Store size={18} className="md:w-5 md:h-5" /><span>Google Play</span>
                  </Link>
                )}
                {project.download_url && (
                  <Link href={project.download_url} target="_blank" className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl md:rounded-2xl px-4 py-3.5 md:py-4 flex items-center justify-center gap-2 transition-colors">
                    <Download size={18} className="md:w-5 md:h-5" /><span>تحميل التطبيق</span>
                  </Link>
                )}
                {project.github_url && (
                  <Link href={project.github_url} target="_blank" className="bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-white font-bold rounded-xl md:rounded-2xl px-4 py-3.5 md:py-4 flex items-center justify-center gap-2 transition-colors mt-2">
                    <ExternalLink size={18} className="md:w-5 md:h-5" /><span>استعراض الكود المصدري</span>
                  </Link>
                )}
              </div>
            </div>
          </aside>

          <article className="lg:col-span-8 order-1 lg:order-2">
            
            {project.client_name && project.testimonial && (
              // 🔹 تقليل p-10 إلى p-6 للجوال 
              <div className="mb-10 md:mb-16 bg-zinc-900/40 border border-zinc-800 rounded-2xl md:rounded-3xl p-6 md:p-10 relative">
                <Quote size={32} className="absolute top-4 right-4 md:top-6 md:right-6 opacity-20 md:w-10 md:h-10" style={{ color: brandColor }} />
                <p className="text-lg md:text-2xl font-medium text-white leading-relaxed mb-6 italic relative z-10">
                  "{project.testimonial}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white text-base md:text-lg" style={{ backgroundColor: brandColor }}>
                    {project.client_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm md:text-base">{project.client_name}</h4>
                    <p className="text-zinc-500 text-xs md:text-sm">العميل</p>
                  </div>
                </div>
              </div>
            )}

            {project.description && (
              // 🔹 تصغير نص الوصف لـ prose-base للجوال و mb-12
              <div className="prose prose-base md:prose-lg prose-invert max-w-none prose-p:leading-relaxed mb-12 md:mb-20 text-zinc-300 prose-a:text-[var(--brand-color)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.description}
                </ReactMarkdown>
              </div>
            )}

            {features.length > 0 && (
              // 🔹 تقليل المسافة بين الميزات للجوال space-y-16
              <div className="space-y-16 md:space-y-32">
                {features.map((feature: any, index: number) => (
                  <section key={index} className="relative">
                    
                    {/* 🔹 تصغير الرقم الخلفي للجوال */}
                    <div className="absolute -top-6 -right-2 md:-top-16 md:-right-8 text-[6rem] md:text-[10rem] font-black opacity-10 select-none pointer-events-none z-0" style={{ color: brandColor }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 leading-tight">
                        {feature.title}
                      </h3>
                      
                      <div className="prose prose-base md:prose-lg prose-invert max-w-none text-zinc-400 mb-6 md:mb-10 leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {feature.content}
                        </ReactMarkdown>
                      </div>

                      {feature.video_url && (
                        <div className="rounded-xl md:rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl mb-6 md:mb-8">
                          <video src={feature.video_url} autoPlay loop muted playsInline controls className="w-full h-auto max-h-[600px] object-cover" />
                        </div>
                      )}

                      {feature.image_urls && feature.image_urls.length > 0 && (
                        // 🔹 جعل الصور فوق بعضها في الجوال `grid-cols-1` وبجانب بعضها في الأكبر `sm:grid-cols-2`
                        <div className={`grid gap-3 md:gap-4 ${feature.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                          {feature.image_urls.map((imgUrl: string, imgIndex: number) => (
                            <div key={imgIndex} className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 group">
                              <Image src={imgUrl} alt={`${feature.title} - لقطة ${imgIndex + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
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