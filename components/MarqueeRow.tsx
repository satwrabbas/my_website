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
  // 1. عكس الاتجاه برمجياً ليتناسب مع الخدعة
  const adjustedDirection = direction === 'right' ? 'left' : 'right'

  return (
    // 2. إجبار الحاوية الخارجية على LTR لكي تنجح حسابات المكتبة في التكرار (autoFill)
    <div className="w-full py-4 md:py-6 overflow-hidden" dir="ltr">
      
      <Marquee 
        direction={adjustedDirection} 
        speed={40} 
        pauseOnHover={true} 
        autoFill={true} // ستعمل الآن بنجاح!
        gradient={false}
      >
        {React.Children.map(children, (child) => (
          // 3. إعادة المحتوى للـ RTL لكي لا تتشوه النصوص العربية داخل البطاقات
          // استخدام mx (يمين ويسار) يضمن مسافة متساوية ومثالية بين كل البطاقات المكررة
          <div dir="rtl" className="mx-2 md:mx-4">
            {child}
          </div>
        ))}
      </Marquee>

    </div>
  )
}