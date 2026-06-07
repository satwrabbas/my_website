// app/page.tsx
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowUpLeft, Code2, Mail, User } from 'lucide-react'

// 👈 استدعاء مكون البطاقة ثلاثية الأبعاد الجديد!
import ProjectCard3D from '@/components/ProjectCard3D'

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.8 0-1.4-.5-2.8-1.5-3.8.1-.3.7-1.8-.1-3.8 0 0-1.2-.4-3.9 1.4a12.3 12.3 0 0 0-7 0C6.1 1.6 4.9 2 4.9 2c-.8 2-.2 3.5-.1 3.8-1 1-1.5 2.4-1.5 3.8 0 5.3 3 6.5 6 6.8-.4.3-.7.9-.8 2-.2.1-.5.2-1 .2-1.5 0-2.5-1.1-3-2 0 0-.5-.9-1.5-1.1 0 0-1-.1-.1.3.8.4 1.2 1.5 1.2 1.5.7 1.9 2.8 1.9 4 1.5v2" /></svg>
)

const TelegramIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
)

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 60; 

export default async function Home() {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  // ♾️ مضاعفة مصفوفة المشاريع لضمان استمرار الشريط دون توقف (Seamless Loop)
  // قمنا بمضاعفتها 4 مرات لضمان ملء الشاشات الكبيرة جداً
  const marqueeProjects = projects ? [...projects, ...projects, ...projects, ...projects] : []

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 overflow-x-hidden">
      
      <header className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
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

      <main className="w-full">
        
        {/* --- القسم الرئيسي (Hero) --- */}
        <section className="max-w-5xl mx-auto px-6 py-20 md:py-32 relative z-10">
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
            <Link href="#projects" className="bg-white text-zinc-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors">
              استكشف أعمالي <ArrowUpLeft size={20} />
            </Link>
            <Link href="https://github.com/satwrabbas" target="_blank" className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-zinc-800 transition-colors">
              <GithubIcon size={20} /> GitHub
            </Link>
          </div>
        </section>

        {/* --- 🌊 قسم المشاريع (الموجة اللانهائية 3D) 🌊 --- */}
        <section id="projects" className="py-24 border-t border-zinc-900 w-full overflow-hidden bg-zinc-950 relative">
          
          <div className="max-w-5xl mx-auto px-6 mb-16 flex items-center gap-4 relative z-20">
            <Code2 className="text-emerald-500" size={32} />
            <h2 className="text-3xl font-bold">معرض الأعمال التفاعلي</h2>
          </div>

          {/* حاوية الشريط المتموج (ارتفاع ثابت 650px) */}
          <div className="w-full relative h-[600px] md:h-[650px] flex items-center">
            
            {/* التدرجات اللونية (Fade Edges) لإخفاء الأطراف بجمالية */}
            <div className="absolute top-0 bottom-0 right-0 w-16 md:w-48 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 left-0 w-16 md:w-48 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none"></div>

            {/* المسار المتحرك (Marquee Track) */}
            <div className="flex gap-8 px-8 animate-marquee-rtl h-full items-stretch relative z-10 py-10">
              {marqueeProjects?.map((project, index) => (
                // تم تمرير project و index لمكون الـ 3D
                <ProjectCard3D key={`${project.id}-${index}`} project={project} index={index} />
              ))}
            </div>

          </div>
        </section>

        {/* --- قسم عنّي --- */}
        <section id="about" className="max-w-5xl mx-auto px-6 py-24 border-t border-zinc-900 relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <User className="text-emerald-500" size={32} />
            <h2 className="text-3xl font-bold">فلسفتي في العمل</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6 text-zinc-400 leading-relaxed text-lg">
              <p>بدأت رحلتي في عالم البرمجة بشغف لفهم كيف تعمل الأشياء من الداخل. لم أكتفِ بتعلم كتابة الأكواد، بل ركزت على <strong className="text-white">هندسة البرمجيات</strong> وكيفية بناء أنظمة قابلة للتوسع وتتحمل ضغط العمل.</p>
              <p>أؤمن أن <strong className="text-white">"الكود الجيد يجب أن يقرأ كأنه قصة"</strong>. لذلك أقضي وقتاً طويلاً في التخطيط وبناء هيكلية نظيفة قبل البدء في التنفيذ.</p>
              <p>سواء كنت أطور تطبيقاً للجوال أو برنامجاً للحاسوب، هدفي الدائم هو سد الفجوة بين الأداء التقني العالي والتصميم المريح للعين (UI/UX).</p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center">
              <h3 className="text-white font-bold mb-4">أدواتي المفضلة</h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'Flutter', 'React', 'Supabase', 'Tailwind', 'TypeScript', 'Node.js'].map((skill) => (
                  <span key={skill} className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-lg">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- قسم التواصل --- */}
        <section id="contact" className="max-w-5xl mx-auto px-6 py-24 border-t border-zinc-900 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">لنعمل معاً على مشروعك القادم</h2>
          <p className="text-zinc-400 mb-12 max-w-xl mx-auto text-lg">
            سواء كان لديك فكرة تطبيق تود تحويلها لواقع، أو مشروع يحتاج لتطوير، يسعدني تواصلك معي مباشرة.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/963938457732" target="_blank" rel="noopener noreferrer" className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors">
              <WhatsAppIcon size={24} /> واتساب
            </a>
            <a href="https://t.me/+963938457732" target="_blank" rel="noopener noreferrer" className="bg-[#229ED9]/10 text-[#229ED9] border border-[#229ED9]/20 hover:bg-[#229ED9]/20 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors">
              <TelegramIcon size={24} /> تليجرام
            </a>
            <a href="mailto:satwrabbas@gmail.com" className="bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors">
              <Mail size={24} /> البريد الإلكتروني
            </a>
          </div>
        </section>

        <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm relative z-10">
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