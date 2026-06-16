// components/ProjectHeroMedia.tsx
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ZoomIn, Play } from 'lucide-react'
import MediaLightbox, { LightboxMedia } from './MediaLightbox'

interface ProjectHeroMediaProps {
  title: string
  thumbnailUrl?: string
  demoUrl?: string
}

export default function ProjectHeroMedia({ title, thumbnailUrl, demoUrl }: ProjectHeroMediaProps) {
  const [showVideo, setShowVideo] = useState(false)
  const [lightbox, setLightbox] = useState<LightboxMedia>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)

  // منطق التمرير (Hover)
  const handleMouseEnter = () => {
    if (!demoUrl) return
    hoverTimer.current = setTimeout(() => {
      setShowVideo(true)
    }, 500) // نصف ثانية
  }

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setShowVideo(false)
  }

  const handleClick = () => {
    if (demoUrl) setLightbox({ type: 'video', url: demoUrl })
    else if (thumbnailUrl) setLightbox({ type: 'image', url: thumbnailUrl })
  }

  if (!thumbnailUrl && !demoUrl) return null

  return (
    <>
      <div 
        className="w-full aspect-video md:h-[600px] rounded-[2rem] overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl relative group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* الصورة الأساسية (مع تأثير تحميل لبطء الإنترنت) */}
        {thumbnailUrl && (
          <Image 
            src={thumbnailUrl} 
            // 👈 التعديل 1: تأمين النص البديل
            alt={title || "صورة الغلاف الرئيسية للمشروع"} 
            fill 
            priority 
            // 👈 التعديل 2: توجيه المتصفح لتحميل حجم لا يتعدى 1200px بدلاً من 100vw المفتوحة
            sizes="(max-width: 1200px) 100vw, 1200px" 
            className={`object-cover object-top transition-all duration-700 ${imageLoaded ? 'blur-0 scale-100' : 'blur-xl scale-105'}`}
            onLoad={() => setImageLoaded(true)}
          />
        )}

        {/* الفيديو يظهر فوق الصورة عند التمرير */}
        {demoUrl && showVideo && (
          <video 
            src={demoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline
            // 👈 التعديل 3: إضافة preload لتحسين استهلاك الذاكرة والإنترنت
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500 z-10"
          />
        )}

        {/* أيقونة تفاعلية تظهر عند التمرير تدل على إمكانية الفتح */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="bg-white/10 p-4 rounded-full text-white backdrop-blur-md border border-white/20 shadow-2xl flex items-center gap-2 font-bold">
            {demoUrl ? <><Play size={24} /> تشغيل الفيديو</> : <><ZoomIn size={24} /> تكبير الغلاف</>}
          </div>
        </div>
      </div>

      {/* نافذة العرض المكبرة */}
      <MediaLightbox media={lightbox} onClose={() => setLightbox(null)} />
    </>
  )
}