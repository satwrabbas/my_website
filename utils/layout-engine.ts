// utils/layout-engine.ts

export type LayoutMode = 'bento' | 'stack' | 'scattered';

export function getContainerStyles(mode: LayoutMode) {
  switch (mode) {
    case 'bento':
      return "grid grid-rows-2 grid-flow-col-dense items-center gap-6 md:gap-10 h-[550px] md:h-[650px]";
    case 'stack':
      return "flex flex-col flex-wrap justify-center gap-6 md:gap-10 h-[700px] md:h-[850px]";
    case 'scattered':
      return "flex gap-12 md:gap-20 items-center h-[600px] md:h-[750px]";
    default:
      return "flex gap-6 h-[500px]";
  }
}

export function getCardStyles(mode: LayoutMode, platforms: string[] = [], index: number) {
  const isMobile = platforms.includes('Android') || platforms.includes('iOS') || platforms.includes('iPhone');
  const isDesktop = platforms.includes('Windows') || platforms.includes('Web');

  let gridClass = '';
  let cardWidth = '';
  let cardHeight = '';
  let transformClass = '';

  // 👈 السر هنا: استخدام الـ index لصنع "عشوائية منتظمة"
  // wVar يختار العرض، و hVar يختار الطول بشكل متعاكس لضمان عدم التكرار
  const wVar = index % 3;
  const hVar = (index + 1) % 3; 
  const scatterPattern = index % 4;

  if (mode === 'bento') {
    if (isDesktop && isMobile) {
      gridClass = 'row-span-2';
      // 3 احتمالات لعرض وطول العملاق
      cardWidth = ['w-[320px] md:w-[480px]', 'w-[300px] md:w-[440px]', 'w-[340px] md:w-[500px]'][wVar];
      cardHeight = ['h-[380px] md:h-[450px]', 'h-[360px] md:h-[420px]', 'h-[400px] md:h-[480px]'][hVar];
    } else if (isMobile && !isDesktop) {
      gridClass = 'row-span-2';
      // 3 احتمالات لعرض وطول الجوال
      cardWidth = ['w-[260px] md:w-[320px]', 'w-[240px] md:w-[280px]', 'w-[280px] md:w-[340px]'][wVar];
      cardHeight = ['h-[320px] md:h-[380px]', 'h-[300px] md:h-[350px]', 'h-[340px] md:h-[420px]'][hVar];
    } else {
      gridClass = 'row-span-1';
      // 3 احتمالات لعرض وطول الويب
      cardWidth = ['w-[300px] md:w-[420px]', 'w-[280px] md:w-[380px]', 'w-[320px] md:w-[460px]'][wVar];
      cardHeight = ['h-[180px] md:h-[220px]', 'h-[160px] md:h-[200px]', 'h-[200px] md:h-[250px]'][hVar];
    }
    transformClass = scatterPattern % 2 === 0 ? '-translate-y-4' : 'translate-y-4';

  } else if (mode === 'stack') {
    if (isDesktop && isMobile) {
      cardWidth = ['w-[320px] md:w-[450px]', 'w-[300px] md:w-[420px]', 'w-[340px] md:w-[480px]'][wVar];
      cardHeight = ['h-[400px] md:h-[480px]', 'h-[380px] md:h-[440px]', 'h-[420px] md:h-[500px]'][hVar];
    } else if (isMobile && !isDesktop) {
      cardWidth = ['w-[280px] md:w-[320px]', 'w-[260px] md:w-[280px]', 'w-[300px] md:w-[340px]'][wVar];
      cardHeight = ['h-[320px] md:h-[400px]', 'h-[300px] md:h-[360px]', 'h-[340px] md:h-[420px]'][hVar];
    } else {
      cardWidth = ['w-[300px] md:w-[420px]', 'w-[280px] md:w-[380px]', 'w-[320px] md:w-[440px]'][wVar];
      cardHeight = ['h-[200px] md:h-[240px]', 'h-[180px] md:h-[220px]', 'h-[220px] md:h-[260px]'][hVar];
    }
    
    if (scatterPattern === 0) transformClass = '-translate-y-8';
    else if (scatterPattern === 1) transformClass = 'translate-y-8';
    else transformClass = 'translate-y-0';

  } else if (mode === 'scattered') {
    if (isDesktop && isMobile) {
      cardWidth = ['w-[280px] md:w-[360px]', 'w-[260px] md:w-[340px]', 'w-[300px] md:w-[380px]'][wVar];
      cardHeight = ['h-[280px] md:h-[320px]', 'h-[260px] md:h-[300px]', 'h-[300px] md:h-[340px]'][hVar];
    } else if (isMobile && !isDesktop) {
      cardWidth = ['w-[220px] md:w-[260px]', 'w-[200px] md:w-[240px]', 'w-[240px] md:w-[280px]'][wVar];
      cardHeight = ['h-[240px] md:h-[280px]', 'h-[220px] md:h-[260px]', 'h-[260px] md:h-[300px]'][hVar];
    } else {
      cardWidth = ['w-[260px] md:w-[320px]', 'w-[240px] md:w-[300px]', 'w-[280px] md:w-[340px]'][wVar];
      cardHeight = ['h-[160px] md:h-[200px]', 'h-[140px] md:h-[180px]', 'h-[180px] md:h-[220px]'][hVar];
    }
    
    if (scatterPattern === 0) transformClass = 'self-start mt-12';
    else if (scatterPattern === 1) transformClass = 'self-end mb-12';
    else if (scatterPattern === 2) transformClass = 'self-start mt-32';
    else transformClass = 'self-end mb-32';
  }

  return { gridClass, cardWidth, cardHeight, transformClass };
}