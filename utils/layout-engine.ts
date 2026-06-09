// utils/layout-engine.ts

export type LayoutMode = 'bento' | 'stack' | 'scattered';

export function getContainerStyles(mode: LayoutMode) {
  switch (mode) {
    case 'bento':
      // 3 صفوف (grid-rows-3) لعمل تداخل تيتريس متقدم
      return "grid grid-rows-3 grid-flow-col-dense items-center gap-6 md:gap-10 h-[500px] md:h-[650px]";
      
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

  const wVar = index % 3;
  const hVar = (index + 1) % 3; 
  const scatterPattern = index % 4;

  if (mode === 'bento') {
    // --- 🌟 استراتيجية البينتو ثلاثية الأبعاد (Multi-Row Bento) المعدلة 🌟 ---
    if (isDesktop && isMobile) {
      gridClass = 'row-span-3'; // يأخذ 3 صفوف (الارتفاع الكامل لـ 650px)
      cardWidth = ['w-[320px] md:w-[480px]', 'w-[340px] md:w-[520px]', 'w-[360px] md:w-[560px]'][wVar];
      // 👈 تم استبدال h-full بأطوال ثابتة متناسقة تمنع الانهيار البصري
      cardHeight = ['h-[380px] md:h-[480px]', 'h-[400px] md:h-[510px]', 'h-[420px] md:h-[540px]'][hVar];
    } else if (isMobile && !isDesktop) {
      gridClass = 'row-span-2'; // يأخذ صفين (من أصل 3 صفوف)
      cardWidth = ['w-[240px] md:w-[300px]', 'w-[260px] md:w-[320px]', 'w-[280px] md:w-[340px]'][wVar];
      // 👈 تم استبدال h-full بأطوال ثابتة متناسقة
      cardHeight = ['h-[280px] md:h-[320px]', 'h-[300px] md:h-[350px]', 'h-[320px] md:h-[380px]'][hVar];
    } else {
      gridClass = 'row-span-1'; // يأخذ صفاً واحداً
      cardWidth = ['w-[280px] md:w-[380px]', 'w-[300px] md:w-[420px]', 'w-[320px] md:w-[460px]'][wVar];
      // 👈 تم استبدال h-full بأطوال ثابتة متناسقة
      cardHeight = ['h-[130px] md:h-[160px]', 'h-[140px] md:h-[180px]', 'h-[150px] md:h-[200px]'][hVar];
    }
    transformClass = ''; // الحفاظ على انتظام البينتو

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