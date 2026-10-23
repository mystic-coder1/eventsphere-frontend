'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MySchedulePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/delegate/agenda');
  }, [router]);

  return null;
}
