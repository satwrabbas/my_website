// components/SmoothMarquee.tsx
'use client'

import { useRef, useEffect } from 'react'

export default function SmoothMarquee({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const speedRef = useRef(1) // 1 = يتحرك، 0 = يتوقف
  const currentSpeedRef = useRef(1) // السرعة الحالية (للتدرج)
  const positionRef = useRef(0)

  useEffect(() => {
    let animationId: number
    const animate = () => {
      // معادلة (Lerp) السحرية للتوقف والانطلاق الناعم جداً
      currentSpeedRef.current += (speedRef.current - currentSpeedRef.current) * 0.05
      
      // سرعة الحركة (0.6 بيكسل في الإطار = بطيئة وأنيقة)
      positionRef.current += 1.5 * currentSpeedRef.current

      if (trackRef.current) {
        // عندما نمرر نصف المسافة، نعود للصفر لعمل حلقة لا نهائية (Seamless Loop)
        const maxScroll = trackRef.current.scrollWidth / 2
        if (positionRef.current >= maxScroll) {
          positionRef.current = 0
        }
        // استخدام translateX بالموجب يحرك الشريط لليسار في المواقع العربية (RTL)
        trackRef.current.style.transform = `translateX(${positionRef.current}px)`
      }
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    // الحاوية الأم
    <div 
      className="w-full overflow-hidden relative"
      onMouseEnter={() => speedRef.current = 0}
      onMouseLeave={() => speedRef.current = 1}
      onTouchStart={() => speedRef.current = 0} // دعم اللمس في الجوال
      onTouchEnd={() => speedRef.current = 1}
    >
      {/* المسار المتحرك */}
      <div ref={trackRef} className="w-max flex gap-6 px-4">
        
        {/* الشبكة الأولى (Bento Grid) */}
        <div className="grid grid-rows-2 grid-flow-col gap-6 h-[500px] md:h-[650px] py-4">
          {children}
        </div>
        
        {/* الشبكة الثانية المتطابقة (للاستمرار اللانهائي) */}
        <div className="grid grid-rows-2 grid-flow-col gap-6 h-[500px] md:h-[650px] py-4">
          {children}
        </div>

      </div>
    </div>
  )
}