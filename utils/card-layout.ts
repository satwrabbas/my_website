// utils/card-layout.ts

type LayoutResult = {
  gridClass: string;     // الخلية الوهمية للبينتو (صف أو صفين)
  cellWidth: string;     // عرض الخلية
  cardHeight: string;    // الارتفاع الفعلي للبطاقة بداخل الخلية
  scatterClass: string;  // تأثير التناثر والطفو
};

export function getCardLayout(platforms: string[] = [], index: number): LayoutResult {
  const isMobile = platforms.includes('Android') || platforms.includes('iOS') || platforms.includes('iPhone');
  const isDesktop = platforms.includes('Windows') || platforms.includes('Web');

  let gridClass = 'row-span-1';
  let cellWidth = 'w-[300px]';
  let cardHeight = 'h-[260px]';

  if (isDesktop && isMobile) {
    // 👑 العملاق: يأخذ مساحة صفين، لكن البطاقة أقصر قليلاً لتترك فراغاً جمالياً
    gridClass = 'row-span-2';
    cellWidth = 'w-[320px] md:w-[500px]';
    cardHeight = 'h-[480px] md:h-[550px]';
  } else if (isMobile && !isDesktop) {
    // 📱 الجوال: يأخذ مساحة صفين، أطول من الويب لكن أنحف
    gridClass = 'row-span-2';
    cellWidth = 'w-[260px] md:w-[320px]';
    cardHeight = 'h-[400px] md:h-[480px]';
  } else if (isDesktop && !isMobile) {
    // 💻 الويب: يأخذ مساحة صف واحد، ليسمح لبطاقتين بالاصطفاف فوق بعضهما بذكاء
    gridClass = 'row-span-1';
    cellWidth = 'w-[300px] md:w-[420px]';
    cardHeight = 'h-[220px] md:h-[260px]';
  }

  // --- سحر التناثر (Scattered Illusion) ---
  // البطاقة ستتحرك للأعلى والأسفل داخل خليتها الخاصة لكسر الجمود الهندسي
  let scatterClass = '';
  const scatter = index % 4;
  
  if (scatter === 0) scatterClass = '-translate-y-4 md:-translate-y-8';
  else if (scatter === 1) scatterClass = 'translate-y-4 md:translate-y-8';
  else if (scatter === 2) scatterClass = '-translate-y-2 md:-translate-y-4';
  else scatterClass = 'translate-y-2 md:translate-y-4';

  return { gridClass, cellWidth, cardHeight, scatterClass };
}