'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TugasPendahuluanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const userRole = session.user?.role || null;
    setRole(userRole);

    if (userRole === 'asisten') {
      router.push('/tugas-pendahuluan/tugas-pendahuluan_asprak');
    } else if (userRole === 'praktikan') {
      router.push('/tugas-pendahuluan/tugas-pendahuluan_praktikan');
    } else {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  // Background class based on role
  const bgClass =
    role === 'asisten'
      ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800'
      : role === 'praktikan'
      ? 'bg-gradient-to-br from-[#0267FE] to-blue-700'
      : 'bg-white';

  // Loading or redirecting state
  return (
    <div className={`flex items-center justify-center min-h-screen transition-all duration-500 ${bgClass}`}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
