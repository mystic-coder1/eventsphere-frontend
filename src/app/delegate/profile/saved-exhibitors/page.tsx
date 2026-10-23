'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SavedExhibitorsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/delegate/companies');
  }, [router]);

  return null;
}
