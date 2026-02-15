'use client';

import { FiniteScroll } from '../components/finite-scroll';

const images = [
    '/img1.avif',
    '/img2.avif',
    '/img3.avif',
    '/img4.avif',
    '/img5.avif',
    '/img6.avif',
    '/img7.avif',
];
const getPaddingDirection = (index) => (index % 2 === 0 ? 'left' : 'right');

function ScrollCompleteComponent() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                padding: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            <h2 style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>
                End of the scroll
            </h2>
        </div>
    );
}

export default function PixelatedScrollPage() {
    return (
        <main
            style={{
                position: 'fixed',
                top: 10,
                left: 0,
                right: 0,
                bottom: 0,
                color: 'white',
            }}
        >
            <FiniteScroll
                style={{ height: '100%' }}
                endContent={<ScrollCompleteComponent />}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '30vh',
                        paddingBottom: '30vh',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {Array.from({ length: 7 }).map((_, i) => {
                        const paddingDirection = getPaddingDirection(i);
                        const paddingStyle =
                            paddingDirection === 'left'
                                ? { paddingLeft: '50vw' }
                                : paddingDirection === 'right'
                                    ? { paddingRight: '50vw' }
                                    : {};
                        return (
                            <div key={i} style={paddingStyle}>
                                <img
                                    src={images[i]}
                                    alt={`Image ${i + 1}`}
                                    width={400}
                                    height={500}
                                    style={{ display: 'block', objectFit: 'cover' }}
                                />
                            </div>
                        );
                    })}
                </div>
            </FiniteScroll>
        </main>
    );
}
