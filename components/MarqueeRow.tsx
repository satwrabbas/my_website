// components/MarqueeRow.tsx
'use client'

export default function MarqueeRow({ 
  children, 
  direction = 'right' 
}: { 
  children: React.ReactNode, 
  direction?: 'right' | 'left' 
}) {
  const animationClass = direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left'

  return (
    // 🔹 تقليل المسافة العمودية `py-4` للموبايل لتوفير مساحة الشاشة
    <div className="w-full overflow-hidden flex relative py-4 md:py-6">
      
      {/* 🌟 أضفنا `group/row` هنا لتفعيل تأثير التركيز (Spotlight) لاحقاً 🌟 */}
      {/* 🔹 تقليل المسافة بين البطاقات لـ `gap-4` في الجوال لتظهر بشكل متقارب */}
      <div className={`flex items-center gap-4 md:gap-8 px-2 md:px-4 ${animationClass} group/row`}>
        
        {/* المجموعتين لخلق تأثير التمرير اللانهائي */}
        <div className="flex gap-4 md:gap-8 shrink-0 items-center">
          {children}
        </div>
        <div className="flex gap-4 md:gap-8 shrink-0 items-center">
          {children}
        </div>

      </div>
    </div>
  )
}