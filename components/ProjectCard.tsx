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

  // 2. معالجة الوسائط الذكية
  const isMobileType = type === 'mobile'
  const activeThumbnail = isMobileType ? (project.mobile_thumbnail_url || project.thumbnail_url) : project.thumbnail_url
  const activeDemo = isMobileType ? (project.mobile_demo_url || project.demo_url) : project.demo_url
  
  const isVideoDemo = activeDemo?.match(/\.(mp4|webm)$/i)

  // 3. تحديد أبعاد البطاقة
  const cardSizeClasses = isMobileType 
    ? 'w-[220px] h-[360px] sm:w-[240px] sm:h-[380px] md:w-[300px] md:h-[500px]' 
    : 'w-[280px] h-[190px] sm:w-[300px] sm:h-[200px] md:w-[480px] md:h-[320px]'

  // 4. الألوان والهالات
  const brandColor = project.brand_color || '#10b981'
  const isFeatured = project.is_featured === true
  
  const glowStyle = isFeatured && !isHovered
    ? `0 0 30px -5px ${brandColor}80` 
    : isHovered 
      ? `0 15px 50px -10px ${brandColor}90`
      : 'none'

  // 5. فحص حالة المشروع
  const status = project.status || 'Live'
  const isNotLive = status.toLowerCase() !== 'live'

  return (
    <div 
      className={`group relative rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800 transition-all duration-500 flex-shrink-0 ${cardSizeClasses} 
      /* 🔹 تأثيرات الكمبيوتر فقط md: */
      md:group-hover/row:opacity-40 md:group-hover/row:scale-[0.98] 
      md:hover:!opacity-100 md:hover:!scale-[1.02] md:hover:z-20
      /* 🔹 تأثيرات الجوال: انضغاط عند اللمس واستقرار في المنتصف */
      active:scale-[0.98] snap-center
      ${isFeatured ? 'animate-pulse-slow' : ''}`}
      style={{ 
        boxShadow: glowStyle,
        borderColor: isHovered || isFeatured ? brandColor : 'transparent' 
      }}
      // أحداث الكمبيوتر
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // 🔹 أحداث الجوال (اللمس يفعّل تأثير الهوفر لمدة ثانيتين)
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
    >
      
      {/* 🚧 شارة "قيد التطوير" الذكية 🚧 */}
      {isNotLive && (
        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-30 bg-zinc-900/80 backdrop-blur-md border border-amber-500/30 text-amber-500 text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 shadow-lg">
          <Construction className="w-3 h-3 md:w-[14px] md:h-[14px] animate-pulse" />
          <span>{status}</span>
        </div>
      )}

      {/* 🌟 شارة "مميز" 🌟 */}
      {isFeatured && !isNotLive && (
        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-30 bg-zinc-900/80 backdrop-blur-md text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border" style={{ borderColor: `${brandColor}50`, color: brandColor }}>
          <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: brandColor }}></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2" style={{ backgroundColor: brandColor }}></span>
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

        {/* 🔹 إزالة hidden md:block ليظهر الفيديو في الجوال عند اللمس */}
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

      <div 
        className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-80 pointer-events-none z-10"
        style={{ background: `linear-gradient(to top, #09090b 10%, transparent 80%)` }}
      ></div>

      <div className="relative h-full flex flex-col justify-end p-4 md:p-6 z-20 pointer-events-none">
        <div className="flex justify-between items-end gap-2 md:gap-3">
          <div className="flex-1">
            <div className="flex gap-1.5 mb-1.5 md:mb-2 drop-shadow-md transition-colors duration-300" style={{ color: brandColor }}>
              {hasAndroid && <Smartphone className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
              {hasIOS && <Apple className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
              {hasWindows && <Monitor className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
              {hasWeb && <Globe className="w-4 h-4 md:w-[18px] md:h-[18px]" />}
            </div>
            
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-1.5 leading-tight drop-shadow-lg">
              {project.title}
            </h3>
            <p className="text-zinc-300 text-xs md:text-sm line-clamp-1 drop-shadow-md">
              {project.tagline}
            </p>
          </div>

          <Link 
            href={`/projects/${project.slug}`}
            /* 🔹 إضافة pointer-events-auto للزر لكي يمكن النقر عليه */
            className="shrink-0 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 text-white p-2.5 md:p-3 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 pointer-events-auto"
            style={{ 
              borderColor: isHovered || isFeatured ? `${brandColor}50` : 'rgba(255,255,255,0.1)'
            }}
          >
            <ArrowUpLeft className="w-4 h-4 md:w-5 md:h-5" style={{ color: isHovered || isFeatured ? brandColor : 'white', transition: 'color 0.3s' }} />
          </Link>
        </div>
      </div>
    </div>
  )
}