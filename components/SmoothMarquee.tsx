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
      {/* 👈 الارتفاع هنا ضخم (900px) ليتسع لبطاقتين فوق بعضهما براحة تامة */}
      <div ref={trackRef} className="w-max flex gap-8 md:gap-12 px-4 h-[700px] md:h-[900px]">
        
        {/* 👈 السحر هنا: grid-flow-col-dense سيقوم بحشر البطاقات الصغيرة فوق بعضها في الفراغات! */}
        <div className="grid grid-rows-2 grid-flow-col-dense gap-8 md:gap-12 h-full">
          {children}
        </div>
        
        <div className="grid grid-rows-2 grid-flow-col-dense gap-8 md:gap-12 h-full">
          {children}
        </div>

      </div>
    </div>
  )
}