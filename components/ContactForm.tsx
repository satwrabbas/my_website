// components/ContactForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

type ContactFormData = {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const supabase = createClient()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setErrorMsg('')

    const { error } = await supabase.from('messages').insert([
      {
        name: data.name,
        email: data.email,
        message: data.message,
      }
    ])

    setIsSubmitting(false)

    if (error) {
      setErrorMsg('حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً.')
    } else {
      setIsSuccess(true)
      reset() // تفريغ الحقول بعد النجاح
      
      // إخفاء رسالة النجاح بعد 5 ثوانٍ
      setTimeout(() => setIsSuccess(false), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 size={20} />
          <p>تم إرسال رسالتك بنجاح! سأرد عليك في أقرب وقت.</p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input 
            {...register('name', { required: 'الاسم مطلوب' })} 
            type="text" 
            placeholder="اسمك الكريم" 
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
          />
          {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message}</span>}
        </div>
        <div>
          <input 
            {...register('email', { 
              required: 'البريد الإلكتروني مطلوب',
              pattern: { value: /^\S+@\S+$/i, message: 'صيغة البريد غير صحيحة' }
            })} 
            type="email" 
            placeholder="بريدك الإلكتروني" 
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
          />
          {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
        </div>
      </div>

      <div>
        <textarea 
          {...register('message', { required: 'الرسالة مطلوبة' })} 
          rows={5} 
          placeholder="كيف يمكنني مساعدتك؟" 
          className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:border-emerald-500 outline-none resize-none transition-colors"
        />
        {errors.message && <span className="text-red-400 text-xs mt-1 block">{errors.message.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        <Send size={20} />
        <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}</span>
      </button>
    </form>
  )
}