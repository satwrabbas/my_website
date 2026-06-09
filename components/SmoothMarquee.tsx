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
      className="w-full overflow-hidden relative py-12"
      onMouseEnter={() => speedRef.current = 0}
      onMouseLeave={() => speedRef.current = 1}
      onTouchStart={() => speedRef.current = 0}
      onTouchEnd={() => speedRef.current = 1}
    >
      {/* 👈 حاوية مرنة جداً بارتفاع 750px لتعطي مجالاً للتفاوت صعوداً ونزولاً */}
      <div ref={trackRef} className="w-max flex gap-8 px-4 h-[600px] md:h-[750px]">
        
        <div className="flex gap-8 h-full">
          {children}
        </div>
        
        <div className="flex gap-8 h-full">
          {children}
        </div>

      </div>
    </div>
  )
}