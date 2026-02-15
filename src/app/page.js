'use client';
import dynamic from "next/dynamic";
import Link from "next/link";


export default function Home() {
  return (
    <main>
      <div>
        Finite Scroll animation
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
        <Link
          href="/scroll"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            background: "#333",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          Infinite Scroll
        </Link>
        <Link
          href="/carousel"
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            background: "#333",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          WebGL Carousel
        </Link>
      </div>
    </main>
  );
}
