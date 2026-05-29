// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // إنشاء استجابة مبدئية
  let supabaseResponse = NextResponse.next({
    request,
  })

  // تهيئة Supabase Server Client داخل الـ Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // جلب بيانات المستخدم الحالي (إن وجدت)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 🔴 حماية مسار الإدارة: إذا كان المسار يبدأ بـ /admin ولا يوجد مستخدم، اطرده للرئيسية!
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

// تحديد المسارات التي سيعمل عليها الـ Middleware (نتجاهل ملفات النظام والصور لتسريع الموقع)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}