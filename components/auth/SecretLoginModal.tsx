// components\auth\SecretLoginModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SecretLoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // تم تغيير الاسم هنا لتجنب التعارض
  const [errorMessage, setErrorMessage] = useState('') 
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // استخدمنا e.code بدلاً من e.key حتى يعمل الاختصار سواء كانت الكيبورد عربي أو إنجليزي
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyL') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    // محاولة تسجيل الدخول
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setErrorMessage('بيانات الدخول غير صحيحة')
      setIsLoading(false)
      return
    }

    // --- 🟢 الإصلاح هنا 🟢 ---
    setIsLoading(false) // 1. إعادة حالة الزر لطبيعتها لكي تتمكن من الدخول مجدداً لاحقاً
    setPassword('') // 2. تفريغ كلمة المرور كإجراء أمني
    setIsOpen(false) // 3. إغلاق النافذة
    
    router.refresh() // 4. إجبار Next.js على تحديث حالة السيرفر لقراءة الـ Cookies الجديدة
    router.push('/admin') // 5. التوجيه للوحة التحكم
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
            dir="rtl"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                <Lock size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">تسجيل دخول الإدارة</h2>
              <p className="text-sm text-zinc-400 mt-1">مرحباً عباس، هذه المنطقة مخصصة لك فقط.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              
              {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg px-4 py-3 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}