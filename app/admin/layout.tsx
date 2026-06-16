// app/admin/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Briefcase, LogOut, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true) // 👈 حالة لإدارة عملية التحقق

  useEffect(() => {
    const checkUser = async () => {
      // جلب بيانات المستخدم الحالي بشكل آمن من خادم Supabase
      const { data: { user }, error } = await supabase.auth.getUser()

      // 1. التحقق من وجود مستخدم مسجل
      // 2. التحقق من أن البريد الإلكتروني هو بريدك الشخصي فقط لمنع المتطفلين
      if (error || !user || user.email !== "satwrabbas@gmail.com") {
        if (user) {
          // إذا كان مسجلاً ببريد آخر، قم بتسجيل خروجه فوراً
          await supabase.auth.signOut()
        }
        // إعادة توجيه المستخدم إلى الصفحة الرئيسية
        router.replace('/')
      } else {
        // إذا كان المستخدم هو أنت، يتم إلغاء حالة التحميل وعرض لوحة التحكم
        setCheckingAuth(false)
      }
    }

    checkUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  // 👈 عرض شاشة تحميل مؤقتة لمنع ظهور أجزاء من لوحة التحكم قبل إتمام التحقق (وميض المحتوى)
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen bg-zinc-950 text-white items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 animate-pulse text-lg font-medium">جاري التحقق من الهوية...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white relative">
      
      {/* 📱 الشريط العلوي للشاشات الصغيرة */}
      <div className="lg:hidden fixed top-0 right-0 left-0 h-16 bg-zinc-900 border-b border-zinc-800 z-40 px-6 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold text-emerald-500">لوحة القيادة</h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* 🌑 خلفية معتمة */}
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
      <main className="flex-1 p-6 md:p-8 pt-24 lg:pt-8 w-full min-w-0 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}