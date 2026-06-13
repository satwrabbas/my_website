// app/admin/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Briefcase, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() // لمعرفة مسار الصفحة الحالية
  const supabase = createClient()
  
  // حالة فتح وإغلاق القائمة الجانبية في الشاشات الصغيرة
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // إغلاق القائمة الجانبية تلقائياً عند تغيير الصفحة في الشاشات الصغيرة
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white relative">
      
      {/* 📱 الشريط العلوي للشاشات الصغيرة (يظهر فقط عند تصغير الشاشة) */}
      <div className="lg:hidden fixed top-0 right-0 left-0 h-16 bg-zinc-900 border-b border-zinc-800 z-40 px-6 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold text-emerald-500">لوحة القيادة</h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 🌑 خلفية معتمة تظهر خلف القائمة في وضع الشاشات الصغيرة */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🖥️ القائمة الجانبية */}
      <aside className={`
        fixed lg:sticky top-0 bottom-0 right-0 z-50 h-screen w-64 bg-zinc-900 border-l border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-emerald-500">لوحة القيادة</h2>
            <p className="text-xs text-zinc-400 mt-1">مرحباً يا عباس</p>
          </div>
          {/* زر إغلاق مخفي في الديسكتوب، يظهر داخل القائمة للجوال */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              pathname === '/admin' 
                ? 'bg-emerald-500/10 text-emerald-500 font-medium' 
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>نظرة عامة</span>
          </Link>
          <Link 
            href="/admin/projects" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              pathname.includes('/admin/projects') 
                ? 'bg-emerald-500/10 text-emerald-500 font-medium' 
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Briefcase size={20} />
            <span>المشاريع والتطبيقات</span>
          </Link>
          <Link 
            href="/admin/articles" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              pathname.includes('/admin/articles') 
                ? 'bg-emerald-500/10 text-emerald-500 font-medium' 
                : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <FileText size={20} />
            <span>المقالات</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* 📄 منطقة المحتوى */}
      {/* تم إضافة pt-24 ليأخذ مسافة أسفل الشريط العلوي في الشاشات الصغيرة */}
      <main className="flex-1 p-6 md:p-8 pt-24 lg:pt-8 w-full min-w-0 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}