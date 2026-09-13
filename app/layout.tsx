import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Lora, Uncial_Antiqua } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SiteBackground } from '@/components/site-background'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const uncialAntiqua = Uncial_Antiqua({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-uncial',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Garden In The Jungle — Experience Nature, Experience Vitality',
  description:
    'A place where plants and people come together. Explore exotic natural remedies — shilajit, medicinal mushrooms, ceremonial cacao and more — and learn the health benefits behind each one.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#14251a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${fraunces.variable} ${uncialAntiqua.variable} bg-background`}
    >
      <body className="antialiased font-sans flex min-h-dvh flex-col bg-transparent">
        <SiteBackground />
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
