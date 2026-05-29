// app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">نظرة عامة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* بطاقة إحصائيات مبدئية */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-zinc-400 text-sm font-medium">إجمالي المشاريع</h3>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-zinc-400 text-sm font-medium">المقالات المنشورة</h3>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h3 className="text-zinc-400 text-sm font-medium">الرسائل الجديدة</h3>
          <p className="text-3xl font-bold text-emerald-500 mt-2">0</p>
        </div>
      </div>
    </div>
  )
}