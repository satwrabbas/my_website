//components/ProjectMediaViewer.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ZoomIn, PlayCircle } from 'lucide-react'
import { ProjectFeature } from '@/types'
import MediaLightbox, { LightboxMedia } from './MediaLightbox'

export default function ProjectMediaViewer({ feature, layout }: { feature: ProjectFeature, layout: string }) {
  const [lightbox, setLightbox] = useState<LightboxMedia>(null)
  const isHero = layout === 'hero'

  return (
    <>
      {feature.video_url ? (
        // --- قسم عرض الفيديو ---
        <div 
          className={`relative w-full overflow-hidden bg-zinc-900 group cursor-pointer ${isHero ? 'absolute inset-0 h-full z-0' : 'rounded-3xl border border-zinc-800 shadow-2xl h-auto'}`}
          onClick={() => setLightbox({ type: 'video', url: feature.video_url! })}
        >
          {/* نستخدم preload="metadata" لعدم استهلاك باقة الإنترنت حتى يتم النقر */}
          <video src={feature.video_url} autoPlay loop muted playsInline preload="metadata" className={`w-full transition-transform duration-700 group-hover:scale-[1.02] ${isHero ? 'h-full object-cover absolute inset-0' : 'h-auto'}`} />
          {isHero && <div className="absolute inset-0 bg-zinc-950/40 mix-blend-multiply" />}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-10">
            <div className="bg-white/10 p-3 rounded-full text-white backdrop-blur-md border border-white/20 shadow-2xl"><PlayCircle size={36} /></div>
          </div>
        </div>
      ) : feature.image_urls && feature.image_urls.length > 0 ? (
        // --- قسم عرض الصور ---
        isHero ? (
          <div className="absolute inset-0 z-0 w-full h-full overflow-hidden cursor-pointer group" onClick={() => setLightbox({ type: 'image', url: feature.image_urls![0] })}>
             <Image src={feature.image_urls[0]} alt={feature.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
               <div className="bg-white/10 p-3 rounded-full text-white backdrop-blur-md border border-white/20"><ZoomIn size={32} /></div>
             </div>
          </div>
        ) : (
          <div className={`grid gap-6 w-full ${feature.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {feature.image_urls.map((imgUrl, idx) => (
              <div 
                key={idx} 
                className="relative rounded-3xl overflow-hidden border border-zinc-800/50 bg-zinc-900/30 shadow-xl group cursor-pointer"
                onClick={() => setLightbox({ type: 'image', url: imgUrl })}
              >
                <Image src={imgUrl} alt={feature.title} width={1200} height={800} className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="bg-white/10 p-3 rounded-full text-white backdrop-blur-md border border-white/20"><ZoomIn size={32} /></div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : null}

      <MediaLightbox media={lightbox} onClose={() => setLightbox(null)} />
    </>
  )
}