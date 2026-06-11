// components/ProjectCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Smartphone, Monitor, Globe, Apple, ArrowUpLeft, Construction } from 'lucide-react'

export default function ProjectCard({ project, type }: { project: any, type: 'mobile' | 'desktop' }) {
  const [isHovered, setIsHovered] = useState(false)

  // 1. قراءة المنصات
  const platforms = project.platforms || []
  const hasAndroid = platforms.includes('Android')
  const hasIOS = platforms.includes('iOS') || platforms.includes('iPhone')
  const hasWindows = platforms.includes('Windows')
  const hasWeb = platforms.includes('Web')

  // 2. معالجة الوسائط الذكية (الصور والفيديوهات المخصصة)
  const isMobileType = type === 'mobile'
  // إذا كان الشريط للجوال، ابحث عن صورة الجوال أولاً، وإلا استخدم العادية. والعكس صحيح.
  const activeThumbnail = isMobileType ? (project.mobile_thumbnail_url || project.thumbnail_url) : project.thumbnail_url
  const activeDemo = isMobileType ? (project.mobile_demo_url || project.demo_url) : project.demo_url
  
  const isVideoDemo = activeDemo?.match(/\.(mp4|webm)$/i)

  // 3. تحديد أبعاد البطاقة
  const cardSizeClasses = isMobileType 
    ? 'w-[260px] h-[400px] md:w-[300px] md:h-[500px]' 
    : 'w-[320px] h-[220px] md:w-[480px] md:h-[320px]'

  // 4. الألوان والهالات (Brand Color & Featured Glow)
  const brandColor = project.brand_color || '#10b981' // اللون الزمردي هو الافتراضي
  const isFeatured = project.is_featured === true
  
  // إذا كان مميزاً، اجعله ينبض باستمرار، وإلا اجعل التوهج يظهر فقط عند التمرير
  const glowStyle = isFeatured && !isHovered
    ? `0 0 20px -5px ${brandColor}40` // 40 تعني شفافية 25% بالـ HEX
    : isHovered 
      ? `0 0 40px -10px ${brandColor}60` 
      : 'none'

  // 5. فحص حالة المشروع
  const status = project.status || 'Live'
  const isNotLive = status.toLowerCase() !== 'live'

  return (
    <div 
      className={`group relative rounded-3xl overflow-hidden border border-zinc-800 transition-all duration-500 flex-shrink-0 ${cardSizeClasses} 
      group-hover/row:opacity-40 group-hover/row:scale-[0.98] 
      hover:!opacity-100 hover:!scale-[1.02] hover:z-20
      ${isFeatured ? 'animate-pulse-slow' : ''}`}
      style={{ 
        boxShadow: glowStyle,
        borderColor: isHovered || isFeatured ? brandColor : 'transparent' 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* 🚧 شارة "قيد التطوير" الذكية 🚧 */}
      {isNotLive && (
        <div className="absolute top-4 right-4 z-30 bg-zinc-900/80 backdrop-blur-md border border-amber-500/30 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <Construction size={14} className="animate-pulse" />
          <span>{status}</span>
        </div>
      )}

      {/* 🌟 شارة "مميز" (اختيارية، إذا أردت إظهار كلمة مميز) 🌟 */}
      {isFeatured && !isNotLive && (
        <div className="absolute top-4 right-4 z-30 bg-zinc-900/80 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border" style={{ borderColor: `${brandColor}50`, color: brandColor }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: brandColor }}></span>
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: brandColor }}></span>
          </span>
          مميز
        </div>
      )}

      <div className="absolute inset-0 w-full h-full bg-zinc-950">
        {activeThumbnail && (
          <Image 
            src={activeThumbnail} 
            alt={project.title} 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover object-top transition-all duration-700 ${
              isHovered && activeDemo ? 'opacity-0 scale-100' : 'opacity-100 scale-105'
            }`}
          />
        )}

        {activeDemo && isHovered && (
          <div className="absolute inset-0 w-full h-full animate-in fade-in duration-700">
            {isVideoDemo ? (
              <video src={activeDemo} autoPlay loop muted playsInline className="w-full h-full object-cover object-top" />
            ) : (
              <Image src={activeDemo} alt="Demo" fill className="object-cover object-top" />
            )}
          </div>
        )}
      </div>

      {/* التدرج اللوني السفلي يعتمد قليلاً على لون البراند للحصول على دمج مثالي */}
      <div 
        className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-80 pointer-events-none"
        style={{ background: `linear-gradient(to top, #09090b 10%, transparent 80%)` }}
      ></div>

      <div className="relative h-full flex flex-col justify-end p-5 md:p-6 z-10">
        <div className="flex justify-between items-end gap-3">
          <div className="flex-1">
            <div className="flex gap-1.5 mb-2 drop-shadow-md" style={{ color: brandColor }}>
              {hasAndroid && <Smartphone size={18} />}
              {hasIOS && <Apple size={18} />}
              {hasWindows && <Monitor size={18} />}
              {hasWeb && <Globe size={18} />}
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 leading-tight drop-shadow-lg">
              {project.title}
            </h3>
            <p className="text-zinc-300 text-sm line-clamp-1 drop-shadow-md">
              {project.tagline}
            </p>
          </div>

          <Link 
            href={`/projects/${project.slug}`}
            className="shrink-0 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 text-white p-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
            style={{ borderColor: isHovered ? `${brandColor}50` : 'rgba(255,255,255,0.1)' }}
          >
            <ArrowUpLeft size={20} style={{ color: isHovered ? brandColor : 'white', transition: 'color 0.3s' }} />
          </Link>
        </div>
      </div>
    </div>
  )
}