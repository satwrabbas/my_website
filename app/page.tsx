// app/page.tsx
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowUpLeft, Code2, Smartphone, Monitor, Download, Mail } from 'lucide-react'

// أيقونات مخصصة للعلامات التجارية (تم إزالتها من lucide-react)
const GithubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.8 0-1.4-.5-2.8-1.5-3.8.1-.3.7-1.8-.1-3.8 0 0-1.2-.4-3.9 1.4a12.3 12.3 0 0 0-7 0C6.1 1.6 4.9 2 4.9 2c-.8 2-.2 3.5-.1 3.8-1 1-1.5 2.4-1.5 3.8 0 5.3 3 6.5 6 6.8-.4.3-.7.9-.8 2-.2.1-.5.2-1 .2-1.5 0-2.5-1.1-3-2 0 0-.5-.9-1.5-1.1 0 0-1-.1-.1.3.8.4 1.2 1.5 1.2 1.5.7 1.9 2.8 1.9 4 1.5v2" />
  </svg>
)

const LinkedinIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
      
      <header className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tighter">
          Abbas<span className="text-emerald-500">.</span>
        </div>
        <nav className="flex gap-6 text-sm font-medium text-zinc-400">
          <Link href="#projects" className="hover:text-white transition-colors">الأعمال</Link>
          <Link href="/writing" className="hover:text-white transition-colors">المدونة</Link> 
          <Link href="#about" className="hover:text-white transition-colors">عني</Link>
          <Link href="#contact" className="hover:text-emerald-400 transition-colors">تواصل معي</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        
        <section className="py-24 md:py-32 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            متاح للمشاريع الجديدة
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            أهلاً، أنا عباس صاطور. <br />
            <span className="text-zinc-500">مطور برمجيات يصنع الفارق.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl">
            أصمم وأبرمج تطبيقات جوال وحاسوب متكاملة من الصفر. أركز على كتابة كود نظيف وتصميم واجهات عصرية تجعل استخدام التطبيق تجربة ممتعة وفعّالة.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              href="#projects"
              className="bg-white text-zinc-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors"
            >
              استكشف أعمالي
              <ArrowUpLeft size={20} />
            </Link>
            <Link 
              href="https://github.com/abbas-satwr" 
              target="_blank"
              className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors"
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>
        </section>

        <section id="projects" className="py-20 border-t border-zinc-900">
          <div className="flex items-center gap-4 mb-12">
            <Code2 className="text-emerald-500" size={32} />
            <h2 className="text-3xl font-bold">تطبيقات ومشاريع بارزة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects?.map((project) => (
              <div 
                key={project.id} 
                className="group relative bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden hover:bg-zinc-900 hover:border-emerald-500/30 transition-all duration-300 flex flex-col"
              >
                {project.thumbnail_url && (
                  <Link href={`/projects/${project.slug}`} className="block w-full h-64 overflow-hidden border-b border-zinc-800/50 bg-zinc-950 cursor-pointer">
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex gap-2 text-zinc-600 mb-4 group-hover:text-emerald-500 transition-colors">
                    {project.platforms?.includes('Android') || project.platforms?.includes('iOS') ? <Smartphone size={24} /> : null}
                    {project.platforms?.includes('Windows') || project.platforms?.includes('Web') ? <Monitor size={24} /> : null}
                  </div>

                <Link href={`/projects/${project.slug}`} className="hover:text-emerald-400 transition-colors w-fit">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                </Link>
                  <p className="text-zinc-400 mb-8 leading-relaxed flex-1">
                    {project.tagline}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech_stack?.map((tech: string, i: number) => (
                      <span key={i} className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-zinc-800/50 mt-auto">
                    <Link 
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                    >
                      استكشف تفاصيل المشروع
                      <ArrowUpLeft size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="py-24 border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">هل لديك فكرة مشروع؟</h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl leading-relaxed">
              أنا دائماً منفتح لمناقشة المشاريع الجديدة، وفرص العمل، أو حتى مجرد إلقاء التحية. دعنا نحول أفكارك إلى واقع برمجي ملموس.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link 
                href="mailto:satwrabbas@gmail.com" 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <Mail size={22} />
                أرسل لي بريداً
              </Link>
              
              <div className="flex items-center justify-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
                <Link 
                  href="https://linkedin.com/in/abbas-satwr" 
                  target="_blank"
                  className="bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-emerald-500/50 p-4 rounded-xl transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={22} />
                </Link>
                <Link 
                  href="https://github.com/satwrabbas" 
                  target="_blank"
                  className="bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-emerald-500/50 p-4 rounded-xl transition-all"
                  aria-label="GitHub"
                >
                  <GithubIcon size={22} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 border-t border-zinc-900 mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} عباس صاطور. جميع الحقوق محفوظة.</p>
          <p>صُنع بشغف وكوب من القهوة ☕</p>
        </footer>

      </main>
    </div>
  )
}