import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ArtworkProvider } from './context/ArtworkContext.tsx'
import Navbar from './components/Navbar.tsx'
import ListPage from './pages/ListPage.tsx'
import GalleryPage from './pages/GalleryPage.tsx'
import DetailPage from './pages/DetailPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import styles from './App.module.css'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ArtworkProvider>
        <div className={styles.app}>
          <a className={styles.skip} href="#content">
            Skip to content
          </a>
          <Navbar />
          <main id="content" className={styles.main}>
            <Routes>
              <Route path="/" element={<ListPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/artwork/:id" element={<DetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <footer className={styles.footer}>
            <p>
              Artwork data and images from the{' '}
              <a href="https://www.artic.edu/" target="_blank" rel="noreferrer">
                Art Institute of Chicago
              </a>
              .
            </p>
          </footer>
        </div>
      </ArtworkProvider>
    </BrowserRouter>
  )
}
