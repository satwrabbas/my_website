// components/ProjectCard3D.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image' 
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion' 
import { Smartphone, Monitor, Globe, Apple, ArrowUpLeft } from 'lucide-react'

export default function ProjectCard3D({ project, index }: { project: any, index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return 
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  // --- 1. تحديد الحجم بناءً على نوع المنصة (أحجام مصغرة وأنيقة) ---
  const platforms = project.platforms || []
  const isMobile = platforms.includes('Android') || platforms.includes('iOS') || platforms.includes('iPhone')
  const isDesktop = platforms.includes('Windows') || platforms.includes('Web')

  let cardWidth = 'w-[260px] md:w-[320px]' 
  let mediaHeight = 'h-[300px] md:h-[350px]'

  if (isDesktop && isMobile) {
    // العملاق (أصبح بحجم متوسط وأنيق)
    cardWidth = 'w-[320px] md:w-[450px]' 
    mediaHeight = 'h-[350px] md:h-[400px]'
  } 
  else if (isMobile && !isDesktop) {
    // الجوال (نحيف وطويل قليلاً)
    cardWidth = 'w-[240px] md:w-[280px]' 
    mediaHeight = 'h-[380px] md:h-[450px]'
  } 
  else if (isDesktop && !isMobile) {
    // الويب (عريض وقصير)
    cardWidth = 'w-[300px] md:w-[400px]' 
    mediaHeight = 'h-[250px] md:h-[300px]'
  }

  // --- 2. خوارزمية التناثر العشوائي (Scattered Layout) ---
  // نستخدم (index % 5) لإنشاء 5 مستويات مختلفة من الارتفاعات لتبدو عشوائية
  let alignment = 'self-center'
  const scatterPattern = index % 5;

  if (scatterPattern === 0) {
    alignment = 'self-start mt-8 md:mt-12' // يطفو في الأعلى
  } else if (scatterPattern === 1) {
    alignment = 'self-end mb-12 md:mb-20' // يغوص في الأسفل
  } else if (scatterPattern === 2) {
    alignment = 'self-start mt-32 md:mt-48' // معلق في النصف العلوي
  } else if (scatterPattern === 3) {
    alignment = 'self-end mb-32 md:mb-48' // معلق في النصف السفلي
  } else {
    alignment = 'self-center' // يتوسط الشاشة
  }

  const isVideoDemo = project.demo_url?.match(/\.(mp4|webm)$/i)

  return (
    <div className={`${cardWidth} shrink-0 snap-center ${alignment} relative group`} style={{ perspective: "1500px" }}>
      
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX, 
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        // تم تصغير حواف البطاقة قليلاً لتناسب الحجم الجديد rounded-[2rem]
        className={`relative ${mediaHeight} w-full rounded-[2rem] border border-zinc-800/50 hover:border-emerald-500/50 bg-zinc-950 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors duration-500 cursor-pointer`}
      >
        
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

        {/* تم تصغير الـ Padding ليناسب البطاقة المصغرة p-5 */}
        <div 
          style={{ transform: shouldReduceMotion ? "none" : "translateZ(40px)" }} 
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
              
              {/* تصغير حجم الخط ليتناسب مع البطاقة المصغرة */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 leading-tight drop-shadow-xl">
                {project.title}
              </h3>
              <p className="text-zinc-300 text-xs md:text-sm line-clamp-1 drop-shadow-md">
                {project.tagline}
              </p>
            </div>

            <Link 
              href={`/projects/${project.slug}`}
              style={{ transform: shouldReduceMotion ? "none" : "translateZ(20px)" }}
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