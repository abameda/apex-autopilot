'use client';

import dynamic from 'next/dynamic';

const Autopilot = dynamic(() => import('./autopilot'), { ssr: false });

export default function Home() {
  return <Autopilot />;
}
