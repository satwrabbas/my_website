// app/admin/layout.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, FileText, Briefcase, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* القائمة الجانبية */}
      <aside className="w-64 bg-zinc-900 border-l border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-emerald-500">لوحة القيادة</h2>
          <p className="text-xs text-zinc-400 mt-1">مرحباً يا عباس</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
            <LayoutDashboard size={20} />
            <span>نظرة عامة</span>
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
            <Briefcase size={20} />
            <span>المشاريع والتطبيقات</span>
          </Link>
          <Link href="/admin/articles" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
            <FileText size={20} />
            <span>المقالات</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* منطقة المحتوى */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}