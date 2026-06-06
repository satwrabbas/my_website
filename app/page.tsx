// app/page.tsx
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowUpLeft, Code2, Smartphone, Monitor, Download, Mail, User } from 'lucide-react'

// --- الأيقونات المخصصة ---
const GithubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.8 0-1.4-.5-2.8-1.5-3.8.1-.3.7-1.8-.1-3.8 0 0-1.2-.4-3.9 1.4a12.3 12.3 0 0 0-7 0C6.1 1.6 4.9 2 4.9 2c-.8 2-.2 3.5-.1 3.8-1 1-1.5 2.4-1.5 3.8 0 5.3 3 6.5 6 6.8-.4.3-.7.9-.8 2-.2.1-.5.2-1 .2-1.5 0-2.5-1.1-3-2 0 0-.5-.9-1.5-1.1 0 0-1-.1-.1.3.8.4 1.2 1.5 1.2 1.5.7 1.9 2.8 1.9 4 1.5v2" /></svg>
)

const TelegramIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
)

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
)

// إعداد Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// دالة لتنظيف الروابط وتحديث البيانات
export const revalidate = 60; 

export default async function Home() {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* --- الترويسة العليا --- */}
      <header className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tighter">
          Abbas<span className="text-emerald-500">.</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
          <Link href="#projects" className="hover:text-white transition-colors">الأعمال</Link>
          <Link href="/writing" className="hover:text-white transition-colors">المدونة</Link>
          <Link href="#about" className="hover:text-white transition-colors">عني</Link>
          <Link href="#contact" className="hover:text-emerald-400 transition-colors">تواصل معي</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        
        {/* --- القسم الرئيسي (Hero) --- */}
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
              href="https://github.com/satwrabbas" 
              target="_blank"
              className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors"
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>
        </section>

        {/* --- قسم المشاريع --- */}
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
                  <div className="w-full h-64 overflow-hidden border-b border-zinc-800/50 bg-zinc-950">
                    <img 
                      src={project.thumbnail_url} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex gap-2 text-zinc-600 mb-4 group-hover:text-emerald-500 transition-colors">
                    {project.platforms?.includes('Android') || project.platforms?.includes('iOS') ? <Smartphone size={24} /> : null}
                    {project.platforms?.includes('Windows') || project.platforms?.includes('Web') ? <Monitor size={24} /> : null}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
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

        {/* --- قسم عنّي (About Me) --- */}
        <section id="about" className="py-20 border-t border-zinc-900">
          <div className="flex items-center gap-4 mb-12">
            <User className="text-emerald-500" size={32} />
            <h2 className="text-3xl font-bold">فلسفتي في العمل</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6 text-zinc-400 leading-relaxed text-lg">
              <p>
                بدأت رحلتي في عالم البرمجة بشغف لفهم كيف تعمل الأشياء من الداخل. لم أكتفِ بتعلم كتابة الأكواد، بل ركزت على <strong className="text-white">هندسة البرمجيات</strong> وكيفية بناء أنظمة قابلة للتوسع وتتحمل ضغط العمل.
              </p>
              <p>
                أؤمن أن <strong className="text-white">"الكود الجيد يجب أن يقرأ كأنه قصة"</strong>. لذلك أقضي وقتاً طويلاً في التخطيط وبناء هيكلية نظيفة (Clean Code) قبل البدء في التنفيذ.
              </p>
              <p>
                سواء كنت أطور تطبيقاً للجوال أو برنامجاً للحاسوب، هدفي الدائم هو سد الفجوة بين الأداء التقني العالي والتصميم المريح للعين (UI/UX)، ليحصل المستخدم النهائي على تجربة لا تُنسى.
              </p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center">
              <h3 className="text-white font-bold mb-4">أدواتي المفضلة</h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'Flutter', 'React', 'Supabase', 'Tailwind', 'TypeScript', 'Node.js'].map((skill) => (
                  <span key={skill} className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- قسم التواصل المباشر (Smart Contact) --- */}
        <section id="contact" className="py-24 border-t border-zinc-900 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">لنعمل معاً على مشروعك القادم</h2>
          <p className="text-zinc-400 mb-12 max-w-xl mx-auto text-lg">
            سواء كان لديك فكرة تطبيق تود تحويلها لواقع، أو مشروع يحتاج لتطوير، يسعدني تواصلك معي مباشرة عبر منصتك المفضلة. أرد عادةً خلال ساعات قليلة.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="https://wa.me/963938457732" 
              target="_blank"
              className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors"
            >
              <WhatsAppIcon size={24} />
              واتساب
            </Link>

            <Link 
              href="https://t.me/+963938457732" 
              target="_blank"
              className="bg-[#229ED9]/10 text-[#229ED9] border border-[#229ED9]/20 hover:bg-[#229ED9]/20 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors"
            >
              <TelegramIcon size={24} />
              تليجرام
            </Link>

            {/* زر الإيميل يفتح Gmail مباشرة في المتصفح */}
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=satwrabbas@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors"
            >
              <Mail size={24} />
              البريد الإلكتروني
            </a>
          </div>
        </section>

        {/* --- تذييل الموقع (Footer) --- */}
        <footer className="py-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} عباس صاطور. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <Link href="https://github.com/satwrabbas" target="_blank" className="hover:text-white transition-colors">
              <GithubIcon size={20} />
            </Link>
          </div>
        </footer>

      </main>
    </div>
  )
}