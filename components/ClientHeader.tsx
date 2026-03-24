"use client";

import dynamic from "next/dynamic";

// ssr: false must live inside a Client Component, not a Server Component like layout.tsx
const Header = dynamic(() => import("./Header"), { ssr: false });

export default function ClientHeader() {
  return <Header />;
}
