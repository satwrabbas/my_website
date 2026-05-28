// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

// نستخدم Browser Client للمكونات التفاعلية في جهة العميل (Client-side)
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}