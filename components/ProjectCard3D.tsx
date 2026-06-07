// components/ProjectCard3D.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Smartphone, Monitor, Globe, Apple, ArrowUpLeft } from 'lucide-react'

export default function ProjectCard3D({ project, index }: { project: any, index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  // --------------------------------------------------------
  // 1. فيزياء الأبعاد الثلاثية (3D Physics Setup)
  // --------------------------------------------------------
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // جعل الحركة ناعمة وارتدادية (Spring) لتجنب التقطيع
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

  // تحويل حركة الماوس إلى زوايا دوران (من -10 درجات إلى 10 درجات)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    // حساب موقع الفأرة بالنسبة لمركز البطاقة
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
    // تصفير القيم لتعود البطاقة مسطحة عند خروج الفأرة
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  // --------------------------------------------------------
  // 2. تحليل المنصات (الأحجام والمحاذاة للموجة غير المتماثلة)
  // --------------------------------------------------------
  const platforms = project.platforms || []
  const isMobile = platforms.includes('Android') || platforms.includes('iOS') || platforms.includes('iPhone')
  const isDesktop = platforms.includes('Windows') || platforms.includes('Web')

  // القيم الافتراضية
  let cardWidth = 'w-[300px] md:w-[350px]' 
  let alignment = 'self-center' 
  let mediaHeight = 'min-h-[450px]'

  if (isDesktop && isMobile) {
    // 👑 الحجم العملاق (تطبيق مشترك جوال + ديسكتوب)
    // يأخذ عرضاً كبيراً جداً 700px وارتفاعاً يملأ الشريط 550px
    cardWidth = 'w-[85vw] md:w-[700px]' 
    alignment = 'self-center' // يتوسط الشاشة بفخامة
    mediaHeight = 'min-h-[550px]'
  } 
  else if (isDesktop && !isMobile) {
    // 💻 الحجم البانورامي (ديسكتوب / ويب فقط)
    cardWidth = 'w-[85vw] md:w-[550px]' 
    alignment = 'self-start' // يطفو في الأعلى ⬆️
    mediaHeight = 'min-h-[350px]'
  } 
  else if (isMobile && !isDesktop) {
    // 📱 الحجم العمودي (جوال فقط)
    cardWidth = 'w-[300px] md:w-[380px]' 
    alignment = 'self-end' // يستقر في الأسفل ⬇️
    mediaHeight = 'min-h-[480px]'
  }

  const isVideoDemo = project.demo_url?.match(/\.(mp4|webm)$/i)

  return (
    // الحاوية الأم تعطى خاصية (perspective) لكي تعمل الأبعاد الثلاثية
    <div className={`${cardWidth} shrink-0 snap-center ${alignment} relative group`} style={{ perspective: "1500px" }}>
      
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d", // إخبار المتصفح بأن العناصر الداخلية ستبرز للأمام
        }}
        className={`relative ${mediaHeight} w-full rounded-[2.5rem] border border-zinc-800/50 hover:border-emerald-500/50 bg-zinc-950 overflow-hidden shadow-2xl transition-colors duration-500 cursor-pointer`}
      >
        
        {/* --- طبقة الفيديو والصورة الخلفية (Z = 0) --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none rounded-[2.5rem] overflow-hidden">
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

        {/* --- تدرج لوني للقراءة --- */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-75 pointer-events-none rounded-[2.5rem]"></div>

        {/* --- طبقة النصوص والأيقونات البارزة (Parallax: translateZ) --- */}
        <div 
          style={{ transform: "translateZ(60px)" }} // السر السحري لبروز النص!
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
              style={{ transform: "translateZ(30px)" }} // بروز إضافي للزر!
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