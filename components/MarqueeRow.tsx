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
    <div className="w-full overflow-hidden flex relative py-6">
      {/* 🌟 أضفنا `group/row` هنا لتفعيل تأثير التركيز (Spotlight) لاحقاً 🌟 */}
      <div className={`flex items-center gap-6 md:gap-8 px-3 ${animationClass} group/row`}>
        {/* المجموعتين لخلق تأثير التمرير اللانهائي */}
        <div className="flex gap-6 md:gap-8 shrink-0 items-center">
          {children}
        </div>
        <div className="flex gap-6 md:gap-8 shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  )
}