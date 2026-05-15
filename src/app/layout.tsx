import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Renovi - Mesurez. Visualisez. Impressionnez.',
    template: '%s | Renovi',
  },
  description:
    'La plateforme tout-en-un pour les entrepreneurs en rénovation extérieure au Québec. Générez des mesures précises, visualisez en 3D et impressionnez vos clients.',
  keywords: [
    'rénovation',
    'revêtement extérieur',
    'mesures',
    'visualisation 3D',
    'Québec',
    'entrepreneur',
    'toiture',
    'vinyle',
    'Canexel',
  ],
  authors: [{ name: 'Renovi' }],
  creator: 'Renovi',
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    url: 'https://renovi.ca',
    title: 'Renovi - Mesurez. Visualisez. Impressionnez.',
    description:
      'La plateforme tout-en-un pour les entrepreneurs en rénovation extérieure au Québec.',
    siteName: 'Renovi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Renovi',
    description: 'La plateforme pour les entrepreneurs en rénovation au Québec.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid #334155',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#22C55E',
                secondary: '#F8FAFC',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#F8FAFC',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
