// app/admin/messages/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Trash2, Mail, CheckCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setMessages(data)
    setIsLoading(false)
  }

  const markAsRead = async (id: string, currentStatus: boolean) => {
    // عكس الحالة الحالية
    await supabase.from('messages').update({ is_read: !currentStatus }).eq('id', id)
    fetchMessages()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return
    await supabase.from('messages').delete().eq('id', id)
    fetchMessages()
  }

  // تنسيق التاريخ ليظهر بشكل جميل
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">صندوق الوارد</h1>
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-zinc-400 text-sm">
          إجمالي الرسائل: {messages.length}
        </div>
      </div>

      {isLoading ? (
        <p className="text-zinc-500">جاري تحميل الرسائل...</p>
      ) : messages.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Mail size={48} className="text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">صندوق الوارد فارغ</h3>
          <p className="text-zinc-400">لا يوجد رسائل جديدة في الوقت الحالي.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`border rounded-2xl p-6 transition-all ${
                msg.is_read ? 'bg-zinc-900/50 border-zinc-800/50 opacity-70' : 'bg-zinc-900 border-zinc-700 shadow-lg'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {msg.name}
                    {!msg.is_read && <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full">جديدة</span>}
                  </h3>
                  <a href={`mailto:${msg.email}`} className="text-emerald-400 text-sm hover:underline">{msg.email}</a>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-zinc-500 text-xs flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(msg.created_at)}
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => markAsRead(msg.id, msg.is_read)}
                      title={msg.is_read ? 'تحديد كغير مقروءة' : 'تحديد كمقروءة'}
                      className={`p-2 rounded-lg transition-colors ${msg.is_read ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-emerald-500 hover:bg-emerald-500/10'}`}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50 text-zinc-300 whitespace-pre-wrap leading-relaxed text-sm">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}