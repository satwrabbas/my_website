// components/ProjectCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Smartphone, Monitor, Globe, Apple, ArrowUpLeft } from 'lucide-react'

export default function ProjectCard({ project }: { project: any }) {
  const [isHovered, setIsHovered] = useState(false)

  // 1. قراءة المنصات بدقة لكل نوع
  const platforms = project.platforms || []
  const hasAndroid = platforms.includes('Android')
  const hasIOS = platforms.includes('iOS') || platforms.includes('iPhone')
  const hasWindows = platforms.includes('Windows')
  const hasWeb = platforms.includes('Web')

  const isMobile = hasAndroid || hasIOS
  const isDesktop = hasWindows || hasWeb

  // 2. توزيع المساحات بشكل دقيق (Bento Logic)
  let bentoClasses = 'col-span-1 row-span-1 min-h-[350px]'
  
  if (isDesktop && isMobile) {
    bentoClasses = 'md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[600px]'
  } else if (isDesktop && !isMobile) {
    bentoClasses = 'md:col-span-2 md:row-span-1 min-h-[350px] md:min-h-[400px]'
  } else if (isMobile && !isDesktop) {
    bentoClasses = 'md:col-span-1 md:row-span-2 min-h-[400px] md:min-h-[600px]'
  }

  const isVideoDemo = project.demo_url?.match(/\.(mp4|webm)$/i)

  return (
    <div 
      className={`group relative rounded-[2rem] overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all duration-500 flex flex-col ${bentoClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* خلفية البطاقة */}
      <div className="absolute inset-0 w-full h-full bg-zinc-950">
        {project.thumbnail_url && (
          <img 
            src={project.thumbnail_url} 
            alt={project.title} 
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ${
              isHovered && project.demo_url ? 'opacity-0 scale-100' : 'opacity-100 scale-105'
            }`}
          />
        )}

        {project.demo_url && isHovered && (
          <div className="absolute inset-0 w-full h-full animate-in fade-in duration-700">
            {isVideoDemo ? (
              <video src={project.demo_url} autoPlay loop muted playsInline className="w-full h-full object-cover object-top" />
            ) : (
              <img src={project.demo_url} alt="Demo" className="w-full h-full object-cover object-top" />
            )}
          </div>
        )}
      </div>

      {/* التدرج اللوني للقراءة */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-75 pointer-events-none"></div>

      {/* المحتوى النصي والأيقونات الخضراء */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8 z-10">
        <div className="flex justify-between items-end gap-4">
          
          <div className="flex-1">
            {/* 🟢 هنا الأيقونات الذكية الجديدة 🟢 */}
            <div className="flex gap-2 text-emerald-400 mb-2 drop-shadow-md">
              {hasAndroid && <Smartphone size={20} title="Android" />}
              {hasIOS && <Apple size={20} title="iOS" />}
              {hasWindows && <Monitor size={20} title="Windows" />}
              {hasWeb && <Globe size={20} title="Web" />}
            </div>
            
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
              {project.title}
            </h3>
            <p className="text-zinc-300 text-sm md:text-base line-clamp-1 drop-shadow-md">
              {project.tagline}
            </p>
          </div>

          <Link 
            href={`/projects/${project.slug}`}
            className="shrink-0 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 text-white p-3 md:px-6 md:py-3 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-500/50"
          >
            <span className="hidden md:inline font-medium text-sm">استكشف</span>
            <ArrowUpLeft size={20} className="group-hover:text-emerald-400 transition-colors" />
          </Link>

        </div>
      </div>
    </div>
  )
}