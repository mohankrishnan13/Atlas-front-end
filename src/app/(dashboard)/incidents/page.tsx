'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

// This component now only serves to redirect to the new case management page.
export default function OldIncidentsPage() {
  useEffect(() => {
    redirect('/case-management');
  }, []);

  return null;
}
