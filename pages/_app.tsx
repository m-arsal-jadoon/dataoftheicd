import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout breadcrumbs={{ 
      code: pageProps.codeData, 
      category: pageProps.category, 
      chapter: pageProps.chapter,
      section: pageProps.sectionId ? { id: pageProps.sectionId, chapter_title: pageProps.chapterTitle } : undefined
    }}>
      <Component {...pageProps} />
    </Layout>
  )
}

