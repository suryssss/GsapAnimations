'use client';
import dynamic from "next/dynamic";

// 🚫 Disable SSR for this animation-heavy component
const UnrollScroll = dynamic(() => import("./components/ScrollEffect"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <UnrollScroll />
    </main>
  );
}
