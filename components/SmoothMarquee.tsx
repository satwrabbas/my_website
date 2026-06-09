// components/SmoothMarquee.tsx
'use client'

import { useRef, useEffect } from 'react'

export default function SmoothMarquee({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const speedRef = useRef(1) 
  const currentSpeedRef = useRef(1) 
  const positionRef = useRef(0)
  const maxScrollRef = useRef(0)

  useEffect(() => {
    const calculateMaxScroll = () => {
      if (trackRef.current) {
        maxScrollRef.current = trackRef.current.scrollWidth / 2
      }
    }

    calculateMaxScroll()
    window.addEventListener('resize', calculateMaxScroll)

    let animationId: number
    const animate = () => {
      currentSpeedRef.current += (speedRef.current - currentSpeedRef.current) * 0.05
      positionRef.current += 1.5 * currentSpeedRef.current

      if (trackRef.current && maxScrollRef.current > 0) {
        if (positionRef.current >= maxScrollRef.current) {
          positionRef.current = 0
        }
        trackRef.current.style.transform = `translateX(${positionRef.current}px)`
      }
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    return () => {
      window.removeEventListener('resize', calculateMaxScroll)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div 
      className="w-full overflow-hidden relative py-16"
      onMouseEnter={() => speedRef.current = 0}
      onMouseLeave={() => speedRef.current = 1}
      onTouchStart={() => speedRef.current = 0}
      onTouchEnd={() => speedRef.current = 1}
    >
      {/* الحاوية الرئيسية بارتفاع 900px */}
      <div ref={trackRef} className="w-max flex gap-8 md:gap-16 px-4 h-[750px] md:h-[900px]">
        
        {/* السحر هنا: flex-col flex-wrap يجبر المشاريع على التكدس فوق بعضها بنفس العمود بدقة متناهية! */}
        <div className="flex flex-col flex-wrap items-center justify-center gap-6 md:gap-10 h-full">
          {children}
        </div>
        
        <div className="flex flex-col flex-wrap items-center justify-center gap-6 md:gap-10 h-full">
          {children}
        </div>

      </div>
    </div>
  )
}