// components/MarqueeRow.tsx
'use client'

import React from 'react'
import Marquee from 'react-fast-marquee'

export default function MarqueeRow({ 
  children, 
  direction = 'right' 
}: { 
  children: React.ReactNode, 
  direction?: 'right' | 'left' 
}) {
  const adjustedDirection = direction === 'right' ? 'left' : 'right'

  return (
    // أزلنا py-4 من هنا لكي لا نزيد الفجوات الخارجية
    <div className="w-full overflow-hidden" dir="ltr">
      <Marquee 
        direction={adjustedDirection} 
        speed={40} 
        pauseOnHover={true} 
        autoFill={true} 
        gradient={false}
      >
        {React.Children.map(children, (child) => (
          // 👈 السر هنا: أضفنا (py-8 md:py-10) لكي نوسع الحاوية من الداخل ليتسع التوهج والتكبير دون أن يُقص
          <div dir="rtl" className="mx-2 md:mx-4 py-8 md:py-10">
            {child}
          </div>
        ))}
      </Marquee>
    </div>
  )
}