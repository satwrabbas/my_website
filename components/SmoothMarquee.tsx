// components/SmoothMarquee.tsx
'use client'

import { useRef, useEffect } from 'react'

export default function SmoothMarquee({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const speedRef = useRef(1) // 1 = يتحرك، 0 = يتوقف
  const currentSpeedRef = useRef(1) // السرعة الحالية (للتدرج)
  const positionRef = useRef(0)
  const maxScrollRef = useRef(0) // 👈 إضافة مرجع لتخزين أقصى مسافة تمرير

  useEffect(() => {
    // 👈 دالة لحساب أقصى مسافة بناءً على حجم الشاشة الحالي
    const calculateMaxScroll = () => {
      if (trackRef.current) {
        maxScrollRef.current = trackRef.current.scrollWidth / 2
      }
    }

    // الحساب الأولي عند التحميل
    calculateMaxScroll()

    // 👈 الاستماع لحدث تغير حجم الشاشة (Resize Event)
    window.addEventListener('resize', calculateMaxScroll)

    let animationId: number
    const animate = () => {
      // معادلة (Lerp) للتوقف والانطلاق الناعم
      currentSpeedRef.current += (speedRef.current - currentSpeedRef.current) * 0.05
      
      // سرعة الحركة
      positionRef.current += 1.5 * currentSpeedRef.current

      if (trackRef.current && maxScrollRef.current > 0) {
        // العودة للصفر لعمل حلقة لا نهائية باستخدام المرجع المحدث
        if (positionRef.current >= maxScrollRef.current) {
          positionRef.current = 0
        }
        trackRef.current.style.transform = `translateX(${positionRef.current}px)`
      }
      animationId = requestAnimationFrame(animate)
    }
    
    animationId = requestAnimationFrame(animate)
    
    // 👈 تنظيف الذاكرة (Cleanup) عند إغلاق أو تدمير المكون
    return () => {
      window.removeEventListener('resize', calculateMaxScroll)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div 
      className="w-full overflow-hidden relative"
      onMouseEnter={() => speedRef.current = 0}
      onMouseLeave={() => speedRef.current = 1}
      onTouchStart={() => speedRef.current = 0}
      onTouchEnd={() => speedRef.current = 1}
    >
      <div ref={trackRef} className="w-max flex gap-6 px-4">
        <div className="grid grid-rows-2 grid-flow-col gap-6 h-[500px] md:h-[650px] py-4">
          {children}
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-6 h-[500px] md:h-[650px] py-4">
          {children}
        </div>
      </div>
    </div>
  )
}