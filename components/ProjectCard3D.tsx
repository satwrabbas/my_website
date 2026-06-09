// components/ProjectCard3D.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image' 
import { motion } from 'framer-motion' 
import { Smartphone, Monitor, Globe, Apple, ArrowUpLeft } from 'lucide-react'

// 👈 استيراد أدوات المنطق والحركة المنفصلة
import { getCardLayout } from '@/utils/card-layout'
import { use3DPhysics } from '@/hooks/use-3d-physics'

export default function ProjectCard3D({ project, index }: { project: any, index: number }) {
  // حالة الـ Hover لعرض الفيديو
  const [isHovered, setIsHovered] = useState(false)
  
  // 1. تشغيل فيزياء الـ 3D
  const physics = use3DPhysics()

  // 2. جلب المقاسات والستايلات المناسبة
  const platforms = project.platforms || []
  const layout = getCardLayout(platforms, index)

  const isVideoDemo = project.demo_url?.match(/\.(mp4|webm)$/i)

  // دالة مجمعة للتعامل مع خروج الماوس (إيقاف الفيديو + تصفير الحركة)
  const onMouseLeave = () => {
    physics.handleMouseLeave()
    setIsHovered(false)
  }

  return (
    <div className={`${layout.cardWidth} ${layout.mediaHeight} ${layout.translateYClass} shrink-0 relative group`} style={{ perspective: "1500px" }}>
      
      <motion.div
        onMouseMove={physics.handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX: physics.rotateX, 
          rotateY: physics.rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full rounded-[2rem] border border-zinc-800/50 hover:border-emerald-500/50 bg-zinc-950 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors duration-500 cursor-pointer"
      >
        
        {/* --- طبقة الفيديو والصورة الخلفية --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none rounded-[2rem] overflow-hidden bg-zinc-900">
          {project.thumbnail_url && (
            <Image 
              src={project.thumbnail_url} 
              alt={project.title}
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover object-top transition-all duration-700 ${
                isHovered && project.demo_url ? 'opacity-0 scale-100' : 'opacity-100 scale-105'
              }`}
            />
          )}

          {project.demo_url && isHovered && (
            <div className="absolute inset-0 w-full h-full animate-in fade-in duration-700">
              {isVideoDemo ? (
                <video src={project.demo_url} autoPlay loop muted playsInline className="w-full h-full object-cover object-top" />
              ) : (
                <Image 
                  src={project.demo_url} 
                  alt="Demo" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top" 
                />
              )}
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-75 pointer-events-none rounded-[2rem]"></div>

        {/* --- طبقة النصوص والأيقونات البارزة --- */}
        <div 
          style={{ transform: physics.shouldReduceMotion ? "none" : "translateZ(40px)" }} 
          className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-10 pointer-events-none"
        >
          <div className="flex justify-between items-end gap-3 pointer-events-auto">
            <div className="flex-1">
              <div className="flex gap-1.5 text-emerald-400 mb-2 drop-shadow-md">
                {platforms.includes('Android') && <Smartphone size={16} />}
                {(platforms.includes('iOS') || platforms.includes('iPhone')) && <Apple size={16} />}
                {platforms.includes('Windows') && <Monitor size={16} />}
                {platforms.includes('Web') && <Globe size={16} />}
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 leading-tight drop-shadow-xl">
                {project.title}
              </h3>
              <p className="text-zinc-300 text-xs md:text-sm line-clamp-1 drop-shadow-md">
                {project.tagline}
              </p>
            </div>

            <Link 
              href={`/projects/${project.slug}`}
              style={{ transform: physics.shouldReduceMotion ? "none" : "translateZ(20px)" }}
              className="shrink-0 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 text-white p-2.5 md:px-4 md:py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-105 hover:border-emerald-500/50 shadow-2xl"
            >
              <span className="hidden md:inline font-medium text-xs">استكشف</span>
              <ArrowUpLeft size={16} className="text-emerald-400" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}