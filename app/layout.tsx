// app\layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// استدعاء مكون تسجيل الدخول السري
import SecretLoginModal from "@/components/auth/SecretLoginModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// هنا نضع هويتك الشخصية لمحركات البحث
export const metadata: Metadata = {
  title: "Abbas Satwr | مطور برمجيات",
  description: "موقع شخصي ومعرض أعمال عباس صاطور - مطور تطبيقات جوال وحاسوب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* أضفنا ألوان الخلفية الداكنة bg-zinc-950 والخط الفاتح text-zinc-100 */}
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
        {children}
        
        {/* المكون السري الخاص بك (لن يظهر إلا بالاختصار) */}
        <SecretLoginModal />
      </body>
    </html>
  );
}