'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SavedPeoplePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/delegate/people');
  }, [router]);

  return null;
}
