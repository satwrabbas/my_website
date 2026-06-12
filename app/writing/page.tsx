// app/writing/page.tsx
import Link from 'next/link'
import { ArrowRight, Calendar, BookOpen } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

export const metadata = {
  title: 'المقالات والكتابات | Abbas Satwr',
  description: 'أفكار، تجارب، ومقالات تقنية حول تطوير البرمجيات وتصميم الواجهات.',
}

// إعادة جلب البيانات كل 60 ثانية (لضمان السرعة والتحديث)
export const revalidate = 60;

export default async function WritingPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // جلب المقالات "المنشورة فقط"
  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, excerpt, cover_image, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
      
      {/* 🔹 تقليل py-12 إلى py-6 في الجوال، و px-6 إلى px-5 */}
      <header className="max-w-4xl mx-auto px-5 md:px-6 py-6 md:py-12 flex justify-between items-center border-b border-zinc-900">
        {/* 🔹 تصغير حجم زر العودة للرئيسية في الجوال */}
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors text-sm md:text-base">
          <ArrowRight size={18} className="md:w-5 md:h-5" />
          <span>العودة للرئيسية</span>
        </Link>
        <div className="font-bold text-lg md:text-xl tracking-tighter">
          Abbas<span className="text-emerald-500">.</span>
        </div>
      </header>

      {/* 🔹 تقليل py-20 إلى py-12 في الجوال */}
      <main className="max-w-4xl mx-auto px-5 md:px-6 py-12 md:py-20">
        
        {/* 🔹 توسيط النص في الجوال ليكون متناسقاً */}
        <div className="mb-10 md:mb-16 text-center md:text-right flex flex-col items-center md:items-start">
          {/* 🔹 تصغير العنوان لـ text-3xl في الجوال */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">الكتابات والأفكار</h1>
          {/* 🔹 تصغير النص لـ text-base */}
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            مساحتي الخاصة لتوثيق رحلتي كمطور، أشارك فيها تحديات برمجية واجهتني، وأفكار حول تجربة المستخدم, او حتى اي افكار او تقنيات عمل اعجبتني .
          </p>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-zinc-900/30 rounded-2xl md:rounded-3xl border border-zinc-800 border-dashed mx-2 md:mx-0">
            <BookOpen size={40} className="mx-auto text-zinc-700 mb-4 md:w-12 md:h-12" />
            <h3 className="text-lg md:text-xl text-zinc-400 font-medium">قريباً...</h3>
            <p className="text-sm md:text-base text-zinc-600 mt-2">أقوم حالياً بكتابة المقال الأول، عد لاحقاً!</p>
          </div>
        ) : (
          // 🔹 تقليل المسافة بين المقالات في الجوال gap-5 بدلاً من gap-8
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {articles.map((article) => (
              <Link href={`/writing/${article.slug}`} key={article.slug} className="group flex flex-col">
                {/* 🔹 تقليل الاستدارة rounded-2xl للجوال */}
                <article className="bg-zinc-900/50 border border-zinc-800 rounded-2xl md:rounded-3xl overflow-hidden hover:bg-zinc-900 hover:border-emerald-500/30 transition-all duration-300 h-full flex flex-col shadow-sm">
                  {article.cover_image && (
                    // 🔹 تصغير ارتفاع الصورة في الجوال h-40
                    <div className="h-40 md:h-48 overflow-hidden bg-zinc-950">
                      <img 
                        src={article.cover_image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {/* 🔹 تقليل الـ padding الداخلي p-5 بدلاً من p-8 */}
                  <div className="p-5 md:p-8 flex-1 flex flex-col">
                    <time className="text-emerald-500 text-xs md:text-sm font-medium mb-3 flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(article.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    {/* 🔹 تصغير عنوان المقال text-xl للجوال */}
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-emerald-400 transition-colors">
                      {article.title}
                    </h2>
                    {/* 🔹 تصغير الخط text-sm */}
                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed mb-5 md:mb-6 flex-1">
                      {article.excerpt}
                    </p>
                    <span className="text-xs md:text-sm font-medium text-zinc-500 group-hover:text-white transition-colors mt-auto flex items-center gap-2">
                      اقرأ المقال <ArrowRight size={14} className="rotate-180 md:w-4 md:h-4" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}