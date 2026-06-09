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

  const platforms = project.platforms || []
  const isMobile = platforms.includes('Android') || platforms.includes('iOS') || platforms.includes('iPhone')
  const isDesktop = platforms.includes('Windows') || platforms.includes('Web')

  // 👈 هنا أعدنا التفاوت الجمالي (الأطوال والمحاذاة الحرة)
  let cardWidth = 'w-[300px] md:w-[350px]' 
  let alignment = 'self-center' 
  let mediaHeight = 'h-[400px] md:h-[450px]'

  if (isDesktop && isMobile) {
    // 👑 العملاق: يتوسط الشاشة دائماً ويكون الأطول
    cardWidth = 'w-[85vw] md:w-[650px]' 
    alignment = 'self-center' 
    mediaHeight = 'h-[450px] md:h-[550px]'
  } 
  else if (isMobile && !isDesktop) {
    // 📱 الجوال (طولي): طوله كبير لكن عرضه نحيف.
    // نستخدم index لجعله يطفو مرة للأعلى ومرة للأسفل بتفاوت
    cardWidth = 'w-[280px] md:w-[320px]' 
    alignment = index % 2 === 0 ? 'self-end mb-8' : 'self-start mt-8'
    mediaHeight = 'h-[450px] md:h-[500px]'
  } 
  else if (isDesktop && !isMobile) {
    // 💻 الويب (عرضي): قصير وعريض.
    // عكسنا الـ index هنا لكي لا يتوازى مع الجوال ويصنع حركة "متموجة"
    cardWidth = 'w-[400px] md:w-[480px]' 
    alignment = index % 2 === 0 ? 'self-start mt-8' : 'self-end mb-8'
    mediaHeight = 'h-[300px] md:h-[350px]'
  }

  const isVideoDemo = project.demo_url?.match(/\.(mp4|webm)$/i)

  return (
    // 👈 دمج العرض، والتموضع (alignment) لتطفو البطاقة في مكانها
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
        // 👈 أعدنا الارتفاع الصريح mediaHeight بدلاً من h-full
        className={`relative ${mediaHeight} w-full rounded-[2.5rem] border border-zinc-800/50 hover:border-emerald-500/50 bg-zinc-950 overflow-hidden shadow-2xl transition-colors duration-500 cursor-pointer`}
      >
        
        <div className="absolute inset-0 w-full h-full pointer-events-none rounded-[2.5rem] overflow-hidden bg-zinc-900">
          {project.thumbnail_url && (
            <Image 
              src={project.thumbnail_url} 
              alt={project.title}
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-top" 
                />
              )}
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-75 pointer-events-none rounded-[2.5rem]"></div>

        <div 
          style={{ transform: shouldReduceMotion ? "none" : "translateZ(60px)" }} 
          className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10 pointer-events-none"
        >
          <div className="flex justify-between items-end gap-4 pointer-events-auto">
            <div className="flex-1">
              <div className="flex gap-1.5 text-emerald-400 mb-2 drop-shadow-md">
                {platforms.includes('Android') && <Smartphone size={18} />}
                {(platforms.includes('iOS') || platforms.includes('iPhone')) && <Apple size={18} />}
                {platforms.includes('Windows') && <Monitor size={18} />}
                {platforms.includes('Web') && <Globe size={18} />}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1.5 leading-tight drop-shadow-xl">
                {project.title}
              </h3>
              <p className="text-zinc-300 text-sm md:text-base line-clamp-1 drop-shadow-md">
                {project.tagline}
              </p>
            </div>

            <Link 
              href={`/projects/${project.slug}`}
              style={{ transform: shouldReduceMotion ? "none" : "translateZ(30px)" }}
              className="shrink-0 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 text-white p-3 md:px-5 md:py-3 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:border-emerald-500/50 shadow-2xl"
            >
              <span className="hidden md:inline font-medium text-sm">استكشف</span>
              <ArrowUpLeft size={18} className="text-emerald-400" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}