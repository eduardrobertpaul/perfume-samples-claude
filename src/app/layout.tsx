import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif'
})

export const metadata: Metadata = {
  title: {
    default: 'Perfume Samples - Premium Fragrance Discovery in Bucharest',
    template: '%s | Perfume Samples'
  },
  description: 'Discover luxury fragrances through affordable samples. Premium designer and niche perfumes delivered fresh to your door in Bucharest.',
  keywords: ['perfume samples', 'fragrance', 'Bucharest', 'designer perfume', 'niche fragrance', 'decants'],
  authors: [{ name: 'Perfume Samples Platform' }],
  creator: 'Perfume Samples Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Perfume Samples - Premium Fragrance Discovery',
    description: 'Discover luxury fragrances through affordable samples in Bucharest',
    siteName: 'Perfume Samples',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perfume Samples - Premium Fragrance Discovery',
    description: 'Discover luxury fragrances through affordable samples in Bucharest',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(inter.variable, playfair.variable)}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        "perfume-gradient"
      )}>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 flex">
                <a className="mr-6 flex items-center space-x-2" href="/">
                  <span className="font-serif text-xl font-bold">Parfum</span>
                </a>
              </div>
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <a href="/products" className="transition-colors hover:text-foreground/80">
                    Products
                  </a>
                  <a href="/discovery-sets" className="transition-colors hover:text-foreground/80">
                    Discovery Sets
                  </a>
                  <a href="/about" className="transition-colors hover:text-foreground/80">
                    About
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built for fragrance enthusiasts in Bucharest. Discover your signature scent.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}