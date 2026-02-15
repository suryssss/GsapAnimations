'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const WebGLCarousel = dynamic(
  () => import('../components/WebGLCarousel/WebGLCarousel'),
  { ssr: false }
);

export default function CarouselPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: 'white',
      }}
    >
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'linear-gradient(180deg, rgba(10,10,10,0.9) 0%, transparent 100%)',
        }}
      >
        <Link
          href="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            opacity: 0.9,
          }}
        >
          ← Back
        </Link>
        <span style={{ opacity: 0.6 }}>|</span>
        <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>
          WebGL Carousel
        </h1>
      </header>

      <div style={{ height: '35vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '3rem' }}>
        <p style={{ opacity: 0.7, margin: 0 }}>
          Scroll or drag to move the carousel. Click a card to open its link.
        </p>
      </div>

      <WebGLCarousel />
    </main>
  );
}
