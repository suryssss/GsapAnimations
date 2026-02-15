'use client';
import dynamic from "next/dynamic";
import Link from "next/link";


export default function Home() {
  return (
    <main>
      <div>
        Finite Scroll animation
      </div>
      <Link
        href="/scroll"
        style={{
          display: "inline-block",
          marginTop: "1rem",
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
    </main>
  );
}
