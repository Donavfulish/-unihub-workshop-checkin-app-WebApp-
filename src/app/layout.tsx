'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import { MyWorkshopsProvider } from '@/components/my-workshops-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <MyWorkshopsProvider>
              {children}
              <Toaster richColors position="top-center" />
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </MyWorkshopsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
