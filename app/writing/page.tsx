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
      <header className="max-w-4xl mx-auto px-6 py-12 flex justify-between items-center border-b border-zinc-900">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors">
          <ArrowRight size={20} />
          <span>العودة للرئيسية</span>
        </Link>
        <div className="font-bold text-xl tracking-tighter">
          Abbas<span className="text-emerald-500">.</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">الكتابات والأفكار</h1>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            مساحتي الخاصة لتوثيق رحلتي كمطور، أشارك فيها تحديات برمجية واجهتني، دراسات حالة معمقة لتطبيقات بنيتها، وأفكار حول تجربة المستخدم.
          </p>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
            <BookOpen size={48} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-xl text-zinc-400 font-medium">قريباً...</h3>
            <p className="text-zinc-600 mt-2">أقوم حالياً بكتابة المقال الأول، عد لاحقاً!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link href={`/writing/${article.slug}`} key={article.slug} className="group flex flex-col">
                <article className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden hover:bg-zinc-900 hover:border-emerald-500/30 transition-all duration-300 h-full flex flex-col">
                  {article.cover_image && (
                    <div className="h-48 overflow-hidden bg-zinc-950">
                      <img 
                        src={article.cover_image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    <time className="text-emerald-500 text-sm font-medium mb-3 flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(article.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-zinc-400 leading-relaxed mb-6 flex-1">
                      {article.excerpt}
                    </p>
                    <span className="text-sm font-medium text-zinc-500 group-hover:text-white transition-colors mt-auto flex items-center gap-2">
                      اقرأ المقال <ArrowRight size={16} className="rotate-180" />
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