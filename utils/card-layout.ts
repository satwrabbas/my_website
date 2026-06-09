// utils/card-layout.ts

type LayoutResult = {
  cardWidth: string;
  mediaHeight: string;
  translateYClass: string;
};

export function getCardLayout(platforms: string[] = [], index: number): LayoutResult {
  const isMobile = platforms.includes('Android') || platforms.includes('iOS') || platforms.includes('iPhone');
  const isDesktop = platforms.includes('Windows') || platforms.includes('Web');

  // --- الابعاد الدقيقة لضمان التكدس العمودي ---
  let cardWidth = 'w-[300px]';
  let mediaHeight = 'h-[300px]';

  if (isDesktop && isMobile) {
    // العملاق
    cardWidth = 'w-[320px] md:w-[480px]';
    mediaHeight = 'h-[500px] md:h-[650px]';
  } else if (isMobile && !isDesktop) {
    // الجوال
    cardWidth = 'w-[260px] md:w-[320px]';
    mediaHeight = 'h-[400px] md:h-[500px]';
  } else if (isDesktop && !isMobile) {
    // الويب
    cardWidth = 'w-[300px] md:w-[420px]';
    mediaHeight = 'h-[250px] md:h-[300px]';
  }

  // --- خوارزمية التناثر الوهمي (Scattered Illusion) ---
  let translateYClass = '';
  const scatterPattern = index % 4;
  
  if (scatterPattern === 0) translateYClass = '-translate-y-6 md:-translate-y-10';
  else if (scatterPattern === 1) translateYClass = 'translate-y-6 md:translate-y-10';
  else if (scatterPattern === 2) translateYClass = '-translate-y-2 md:-translate-y-4';
  else translateYClass = 'translate-y-2 md:translate-y-4';

  return { cardWidth, mediaHeight, translateYClass };
}