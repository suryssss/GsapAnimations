"use client";

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function UnrollScroll() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const rollRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Configuration
  const CONFIG = {
    imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80",
    imageWidth: 400,
    imageHeight: 550,
    rolls: 3,           // Number of rolls/spirals
    rollRadius: 40,     // Size of the rolled portion
  };

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = CONFIG.imageUrl;
  }, []);

  useLayoutEffect(() => {
    if (!imageLoaded) return;

    const ctx = gsap.context(() => {
      // Initial state: image is clipped (rolled up)
      gsap.set(imageRef.current, {
        clipPath: "inset(100% 0% 0% 0%)", // Completely hidden from bottom
      });

      gsap.set(rollRef.current, {
        y: 0,
        rotateX: 0,
        scaleY: 1,
      });

      // Create the unroll animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: ".unroll-pin-container",
          anticipatePin: 1,
        },
      });

      // Main unroll animation - reveal the image from top to bottom
      tl.to(imageRef.current, {
        clipPath: "inset(0% 0% 0% 0%)", // Fully revealed
        ease: "none",
        duration: 1,
      }, 0);

      // Animate the roll cylinder moving down
      tl.to(rollRef.current, {
        y: CONFIG.imageHeight + 20,
        rotateX: 360 * CONFIG.rolls, // Multiple rotations as it unrolls
        ease: "none",
        duration: 1,
      }, 0);

      // Fade out the roll at the end
      tl.to(rollRef.current, {
        opacity: 0,
        duration: 0.1,
      }, 0.9);

    }, containerRef);

    return () => ctx.revert();
  }, [imageLoaded]);

  return (
    <div ref={containerRef} className="unroll-container">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="title">Image Unroll Effect</h1>
        <p className="subtitle">Scroll to reveal the magic</p>
        <div className="scroll-hint">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5L12 19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* Pinned Animation Container */}
      <div className="unroll-pin-container">
        <div className="unroll-wrapper">
          {/* The Roll/Cylinder at the top */}
          <div
            ref={rollRef}
            className="roll-cylinder"
            style={{ width: CONFIG.imageWidth + 20 }}
          >
            <div className="roll-inner"></div>
            <div className="roll-shadow"></div>
          </div>

          {/* The main image being revealed */}
          <div
            className="image-container"
            style={{
              width: CONFIG.imageWidth,
              height: CONFIG.imageHeight
            }}
          >
            <div
              ref={imageRef}
              className="image-reveal"
              style={{
                backgroundImage: `url(${CONFIG.imageUrl})`,
                width: CONFIG.imageWidth,
                height: CONFIG.imageHeight,
              }}
            />
          </div>
        </div>
      </div>

      {/* End Section */}
      <section className="end-section">
        <div className="card">
          <h2>Fully Revealed!</h2>
          <p>The image has unrolled like a scroll. This effect creates a unique paper-like reveal animation.</p>
        </div>
      </section>

      <style jsx>{`
        .unroll-container {
          min-height: 400vh;
          background: linear-gradient(180deg, 
            #0a0a1a 0%, 
            #1a1a3a 50%,
            #0a0a1a 100%
          );
        }

        /* Hero Section */
        .hero {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          position: relative;
        }

        .title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(2rem, 8vw, 5rem);
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #fff 0%, #a78bfa 50%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.03em;
        }

        .subtitle {
          font-size: 1.25rem;
          color: rgba(255,255,255,0.5);
          margin-top: 1rem;
        }

        .scroll-hint {
          position: absolute;
          bottom: 2rem;
          animation: bounce 2s ease-in-out infinite;
          color: rgba(255,255,255,0.5);
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        /* Animation Container */
        .unroll-pin-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }

        .unroll-wrapper {
          position: relative;
          transform-style: preserve-3d;
        }

        /* The Roll Cylinder */
        .roll-cylinder {
          position: absolute;
          top: -25px;
          left: -10px;
          height: 30px;
          border-radius: 15px;
          background: linear-gradient(180deg, 
            #d4d4d4 0%,
            #ffffff 20%,
            #e5e5e5 40%,
            #ffffff 60%,
            #d4d4d4 80%,
            #b0b0b0 100%
          );
          transform-style: preserve-3d;
          z-index: 10;
          box-shadow: 
            0 5px 15px rgba(0,0,0,0.3),
            inset 0 2px 4px rgba(255,255,255,0.8),
            inset 0 -2px 4px rgba(0,0,0,0.2);
        }

        .roll-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: calc(100% - 20px);
          height: 20px;
          border-radius: 10px;
          background: linear-gradient(180deg,
            #c0c0c0 0%,
            #e8e8e8 30%,
            #d0d0d0 70%,
            #a0a0a0 100%
          );
        }

        .roll-shadow {
          position: absolute;
          bottom: -10px;
          left: 10%;
          width: 80%;
          height: 10px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%);
          filter: blur(3px);
        }

        /* Image Container */
        .image-container {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 
            0 25px 60px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.1);
        }

        .image-reveal {
          position: absolute;
          top: 0;
          left: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          will-change: clip-path;
        }

        /* Add paper texture overlay */
        .image-reveal::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.02) 2px,
              rgba(0,0,0,0.02) 4px
            );
          pointer-events: none;
        }

        /* End Section */
        .end-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .card {
          max-width: 500px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
        }

        .card h2 {
          font-family: 'Inter', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 1rem;
          background: linear-gradient(135deg, #fff, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card p {
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          margin: 0;
        }
      `}</style>
    </div>
  );
}