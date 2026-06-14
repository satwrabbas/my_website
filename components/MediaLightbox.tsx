//components/MediaLightbox.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Loader2 } from 'lucide-react'

export type LightboxMedia = { type: 'image' | 'video'; url: string } | null

export default function MediaLightbox({ media, onClose }: { media: LightboxMedia, onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (media) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
    setIsLoading(true) // إعادة تعيين حالة التحميل عند تغيير الوسائط
    return () => { document.body.style.overflow = 'auto' }
  }, [media])

  if (!media) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-colors z-[101]"
      >
        <X size={24} />
      </button>
      
      <div className="relative w-full max-w-7xl h-full flex items-center justify-center" onClick={onClose}>
        {/* مؤشر التحميل (يختفي عندما تجهز الصورة/الفيديو) */}
        {isLoading && <Loader2 size={48} className="absolute animate-spin text-zinc-500 z-0" />}

        {media.type === 'image' ? (
          <Image 
            src={media.url} 
            alt="تكبير" 
            fill 
            className={`object-contain transition-opacity duration-500 z-10 ${isLoading ? 'opacity-0' : 'opacity-100'}`} 
            sizes="100vw"
            onLoad={() => setIsLoading(false)}
            onClick={(e) => e.stopPropagation()} // لمنع إغلاق النافذة عند النقر على الصورة نفسها
          />
        ) : (
          <video 
            src={media.url} 
            controls 
            autoPlay 
            className={`max-w-full max-h-full rounded-2xl shadow-2xl z-10 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            onCanPlay={() => setIsLoading(false)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  )
}