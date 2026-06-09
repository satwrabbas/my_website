// utils/layout-engine.ts

// يمكنك التبديل بين 'bento' أو 'stack' أو 'scattered' من هنا مستقبلاً
export type LayoutMode = 'bento' | 'stack' | 'scattered';

// --------------------------------------------------------
// 1. كود الحاوية الأم (كيف تتصرف الكروت مع بعضها؟)
// --------------------------------------------------------
export function getContainerStyles(mode: LayoutMode) {
  switch (mode) {
    case 'bento':
      // شبكة البينتو: ترص الكروت بجانب وفوق بعضها بذكاء لسد الفراغات
      return "grid grid-rows-2 grid-flow-col-dense items-center gap-6 md:gap-10 h-[550px] md:h-[650px]";
    
    case 'stack':
      // التكدس العمودي: تجبر الكروت على الاصطفاف فوق بعضها في نفس العمود
      return "flex flex-col flex-wrap justify-center gap-6 md:gap-10 h-[700px] md:h-[850px]";
    
    case 'scattered':
      // التناثر العشوائي: الكروت بجانب بعضها مع مسافات شاسعة لتطفو بحرية
      return "flex gap-12 md:gap-20 items-center h-[600px] md:h-[750px]";
      
    default:
      return "flex gap-6 h-[500px]";
  }
}

// --------------------------------------------------------
// 2. كود البطاقة الفردية (كيف يبدو شكل وحجم كل كرت؟)
// --------------------------------------------------------
export function getCardStyles(mode: LayoutMode, platforms: string[] = [], index: number) {
  const isMobile = platforms.includes('Android') || platforms.includes('iOS');
  const isDesktop = platforms.includes('Windows') || platforms.includes('Web');

  // القيم الافتراضية
  let gridClass = '';
  let cardWidth = 'w-[300px]';
  let cardHeight = 'h-[300px]';
  let transformClass = '';

  // خوارزمية التناثر لمعرفة اتجاه حركة الكرت
  const scatterPattern = index % 4;

  if (mode === 'bento') {
    // --- استراتيجية البينتو (تداخل وتفاوت) ---
    if (isDesktop && isMobile) {
      gridClass = 'row-span-2';
      cardWidth = 'w-[320px] md:w-[480px]';
      cardHeight = 'h-[480px] md:h-[550px]';
    } else if (isMobile && !isDesktop) {
      gridClass = 'row-span-2';
      cardWidth = 'w-[260px] md:w-[320px]';
      cardHeight = 'h-[400px] md:h-[480px]';
    } else {
      gridClass = 'row-span-1';
      cardWidth = 'w-[300px] md:w-[420px]';
      cardHeight = 'h-[220px] md:h-[260px]';
    }
    // تناثر خفيف داخل خلية البينتو
    transformClass = scatterPattern % 2 === 0 ? '-translate-y-4' : 'translate-y-4';

  } else if (mode === 'stack') {
    // --- استراتيجية التكدس العمودي (فوق بعض بدقة مسطرة) ---
    if (isDesktop && isMobile) {
      cardWidth = 'w-[320px] md:w-[450px]';
      cardHeight = 'h-[500px] md:h-[600px]';
    } else if (isMobile && !isDesktop) {
      cardWidth = 'w-[280px] md:w-[320px]';
      cardHeight = 'h-[400px] md:h-[480px]';
    } else {
      cardWidth = 'w-[300px] md:w-[420px]';
      cardHeight = 'h-[250px] md:h-[280px]';
    }
    // حركة طفو وهمية لا تكسر الترتيب العمودي
    if (scatterPattern === 0) transformClass = '-translate-y-8';
    else if (scatterPattern === 1) transformClass = 'translate-y-8';
    else transformClass = 'translate-y-0';

  } else if (mode === 'scattered') {
    // --- استراتيجية العشوائية المطلقة (أحجام صغيرة متناثرة جداً) ---
    if (isDesktop && isMobile) {
      cardWidth = 'w-[280px] md:w-[360px]';
      cardHeight = 'h-[350px] md:h-[400px]';
    } else if (isMobile && !isDesktop) {
      cardWidth = 'w-[220px] md:w-[260px]';
      cardHeight = 'h-[300px] md:h-[350px]';
    } else {
      cardWidth = 'w-[260px] md:w-[320px]';
      cardHeight = 'h-[200px] md:h-[240px]';
    }
    // تناثر عنيف جداً صعوداً ونزولاً
    if (scatterPattern === 0) transformClass = 'self-start mt-12';
    else if (scatterPattern === 1) transformClass = 'self-end mb-12';
    else if (scatterPattern === 2) transformClass = 'self-start mt-32';
    else transformClass = 'self-end mb-32';
  }

  return { gridClass, cardWidth, cardHeight, transformClass };
}