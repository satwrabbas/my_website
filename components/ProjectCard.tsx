// components/ProjectCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Smartphone, Monitor, ArrowUpLeft } from 'lucide-react'

export default function ProjectCard({ project }: { project: any }) {
  const [isHovered, setIsHovered] = useState(false)

  // 1. تحليل المنصات لتحديد شكل البطاقة في البينتو جريد
  const isMobile = project.platforms?.includes('Android') || project.platforms?.includes('iOS')
  const isDesktop = project.platforms?.includes('Windows') || project.platforms?.includes('Web')
  const isMobileOnly = isMobile && !isDesktop

  // 2. إعداد كلاسات البينتو جريد بناءً على نوع المشروع
  let spanClasses = 'md:col-span-1 lg:col-span-1' // الحجم الافتراضي
  
  if (isDesktop) {
    // تطبيقات الويب والديسكتوب تأخذ مساحة أفقية (عمودين)
    spanClasses = 'md:col-span-2 lg:col-span-2'
  }

  // تحديد ارتفاع منطقة الصورة/الفيديو (تطبيقات الجوال تحتاج مساحة طولية أكبر)
  const mediaHeight = isMobileOnly ? 'h-80 sm:h-96' : 'h-64 sm:h-72'

  const isVideoDemo = project.demo_url?.match(/\.(mp4|webm)$/i)

  return (
    <div 
      className={`group relative bg-zinc-900/50 border border-zinc-800 rounded-[2rem] overflow-hidden hover:bg-zinc-900 hover:border-emerald-500/30 transition-all duration-500 flex flex-col ${spanClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- منطقة الوسائط (الصورة / الفيديو الذكي) --- */}
      <div className={`relative w-full ${mediaHeight} overflow-hidden border-b border-zinc-800/50 bg-zinc-950`}>
        
        {/* الصورة الثابتة الأساسية */}
        {project.thumbnail_url && (
          <img 
            src={project.thumbnail_url} 
            alt={project.title} 
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
              isHovered && project.demo_url ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}

        {/* الفيديو (لا يُرسم في المتصفح إلا عند التمرير لتوفير الباندويث!) */}
        {project.demo_url && isHovered && (
          <div className="absolute inset-0 w-full h-full animate-in fade-in duration-700">
            {isVideoDemo ? (
              <video 
                src={project.demo_url} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <img 
                src={project.demo_url} 
                alt="Demo" 
                className="w-full h-full object-cover object-top"
              />
            )}
          </div>
        )}
      </div>

      {/* --- محتوى البطاقة --- */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex gap-2 text-zinc-600 mb-4 group-hover:text-emerald-500 transition-colors">
          {isMobile && <Smartphone size={24} />}
          {isDesktop && <Monitor size={24} />}
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{project.title}</h3>
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
            استكشف دراسة الحالة
            <ArrowUpLeft size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}