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
    // الحاوية الخارجية: تمنع ظهور أي أشرطة تمرير أفقية مزعجة للموقع
    <div className="w-full relative py-4 md:py-6 overflow-hidden">
      
      {/* 
         السر كله هنا:
         - في الجوال: w-full (عرض الشاشة) + overflow-x-auto (سحب يدوي) + snap-x (التقاط).
         - في الكمبيوتر: md:w-max (لإعطاء مساحة للحركة) + md:overflow-visible (إلغاء السحب ليعمل الأنيميشن).
      */}
      <div className={`flex items-center gap-4 md:gap-8 px-5 md:px-0 w-full md:w-max overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar group/row ${animationClass}`}>
        
        {/* 
          البطاقات الأساسية: 
          مباشرة داخل مسار السحب لكي يعمل الـ (Snap) بشكل مثالي في الجوال.
        */}
        {children}

        {/* 
          نسخة مكررة من البطاقات:
          - في الجوال: مخفية تماماً (hidden) لأن المستخدم سيسحب البطاقات بنفسه.
          - في الكمبيوتر: تظهر كأبناء مباشرين (md:contents) لتكمل تأثير الحركة اللانهائية.
        */}
        <div className="hidden md:contents">
          {children}
        </div>

      </div>
    </div>
  )
}