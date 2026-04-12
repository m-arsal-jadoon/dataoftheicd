import { ReactNode } from 'react'
import Script from 'next/script'
import { ThemeProvider } from '../components/ThemeProvider'
import '../styles/globals.css'
export const metadata = {
  title: 'Dataicd10 - Medical Coding Intelligence',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-8FMW07WMCS`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-8FMW07WMCS');
  `}
        </Script>
        {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
