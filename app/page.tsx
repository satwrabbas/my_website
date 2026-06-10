// app/page.tsx
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowUpLeft, Code2, Mail, User } from 'lucide-react'

import ProjectCard from '@/components/ProjectCard' // البطاقة الموحدة
import MarqueeRow from '@/components/MarqueeRow'   // شريط التمرير الجديد

// ... (نفس أيقونات GithubIcon, TelegramIcon, WhatsAppIcon) ...

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

  // 👈 فصل المشاريع بناءً على المنصات
  const desktopProjects = projects?.filter(p => p.platforms?.includes('Web') || p.platforms?.includes('Windows')) || []
  const mobileProjects = projects?.filter(p => p.platforms?.includes('Android') || p.platforms?.includes('iOS') || p.platforms?.includes('iPhone')) || []

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* ... (الهيدر وقسم الـ Hero كما هو بدون تغيير) ... */}

      {/* --- 🌊 قسم المشاريع (الخطين المتعاكسين) 🌊 --- */}
      <section id="projects" className="py-24 border-t border-zinc-900 w-full overflow-hidden relative bg-zinc-950">
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[300px] md:h-[500px] bg-emerald-500/10 blur-[120px] rounded-full opacity-60"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mb-16 flex items-center gap-4 relative z-20">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
            <Code2 className="text-emerald-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">معرض الأعمال</h2>
            <p className="text-zinc-500 text-sm mt-1">تطبيقات جوال، مواقع ويب، وأنظمة متكاملة</p>
          </div>
        </div>

        <div className="w-full relative z-10 flex flex-col gap-4 md:gap-8">
          
          {/* التدرجات اللونية الجانبية للنعومة */}
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-48 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-48 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none"></div>

          {/* 💻 الشريط الأول: الويب وسطح المكتب (يتحرك لليسار) */}
          {desktopProjects.length > 0 && (
            <MarqueeRow direction="left">
              {desktopProjects.map((project) => (
                <ProjectCard key={`desktop-${project.id}`} project={project} type="desktop" />
              ))}
            </MarqueeRow>
          )}

          {/* 📱 الشريط الثاني: تطبيقات الجوال (يتحرك لليمين) */}
          {mobileProjects.length > 0 && (
            <MarqueeRow direction="right">
              {mobileProjects.map((project) => (
                <ProjectCard key={`mobile-${project.id}`} project={project} type="mobile" />
              ))}
            </MarqueeRow>
          )}

        </div>
      </section>

      {/* ... (باقي الأقسام About, Contact, Footer كما هي) ... */}
    </div>
  )
}