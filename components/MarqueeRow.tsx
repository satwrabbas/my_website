// components/MarqueeRow.tsx
'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'

export default function MarqueeRow({ 
  children, 
  direction = 'right' 
}: { 
  children: React.ReactNode, 
  direction?: 'right' | 'left' 
}) {
  const scrollSpeed = direction === 'right' ? 1.5 : -1.5

  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,
      dragFree: true,
      direction: 'rtl',
    },
    [
      AutoScroll({
        playOnInit: true,
        speed: scrollSpeed,
        stopOnInteraction: false, 
        stopOnMouseEnter: true, 
        // 👇 تم حذف سطر delay
      })
    ]
  )

  return (
    <div className="w-full py-12 -my-8" dir="rtl">
      <div 
        className="overflow-hidden cursor-grab active:cursor-grabbing px-4" 
        ref={emblaRef}
      >
        <div className="flex touch-pan-y">
          {React.Children.map(children, (child) => (
            <div className="flex-[0_0_auto] mx-2 md:mx-4">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}