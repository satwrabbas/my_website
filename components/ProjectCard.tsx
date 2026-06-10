// components/ProjectCard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Smartphone, Monitor, Globe, Apple, ArrowUpLeft } from 'lucide-react'

export default function ProjectCard({ project, type }: { project: any, type: 'mobile' | 'desktop' }) {
  const [isHovered, setIsHovered] = useState(false)

  const platforms = project.platforms || []
  const hasAndroid = platforms.includes('Android')
  const hasIOS = platforms.includes('iOS') || platforms.includes('iPhone')
  const hasWindows = platforms.includes('Windows')
  const hasWeb = platforms.includes('Web')

  const isVideoDemo = project.demo_url?.match(/\.(mp4|webm)$/i)

  // تحديد أبعاد البطاقة بناءً على نوعها
  const cardSizeClasses = type === 'mobile' 
    ? 'w-[260px] h-[400px] md:w-[300px] md:h-[500px]' // طولي للجوال
    : 'w-[320px] h-[220px] md:w-[480px] md:h-[320px]' // عرضي للويب وسطح المكتب

  return (
    <div 
      // 🌟 السحر هنا في الكلاسات المضافة في السطر التالي 🌟
      className={`group relative rounded-3xl overflow-hidden border border-zinc-800 transition-all duration-500 flex-shrink-0 ${cardSizeClasses} 
      group-hover/row:opacity-40 group-hover/row:scale-[0.98] 
      hover:!opacity-100 hover:!scale-[1.02] hover:z-20 hover:border-emerald-500/50 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 w-full h-full bg-zinc-950">
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
              <Image src={project.demo_url} alt="Demo" fill className="object-cover object-top" />
            )}
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80 pointer-events-none"></div>

      <div className="relative h-full flex flex-col justify-end p-5 md:p-6 z-10">
        <div className="flex justify-between items-end gap-3">
          <div className="flex-1">
            <div className="flex gap-1.5 text-emerald-400 mb-2 drop-shadow-md">
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
            className="shrink-0 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 text-white p-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:border-emerald-500/50"
          >
            <ArrowUpLeft size={20} className="group-hover:text-emerald-400 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
}