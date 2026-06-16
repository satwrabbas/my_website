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
    // أزلنا overflow-hidden من هنا لنسمح للتوهج بالخروج
    <div className="w-full py-4 md:py-6" dir="ltr">
      <Marquee 
        direction={adjustedDirection} 
        speed={40} 
        pauseOnHover={true} 
        autoFill={true} 
        gradient={false}
        // 👈 السر هنا: نجبر المكتبة على جعل حوافها "شفافة/مفتوحة" لكي لا تقص التوهج
        className="!overflow-visible" 
        style={{ overflow: 'visible' }} 
      >
        {React.Children.map(children, (child) => (
          // أعدنا المسافة الطبيعية بين البطاقات بدون أي Padding إضافي
          <div dir="rtl" className="mx-2 md:mx-4">
            {child}
          </div>
        ))}
      </Marquee>
    </div>
  )
}