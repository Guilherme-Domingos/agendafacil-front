'use client';

import { useSession, authClient } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layouts/header';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingOrganization, setCheckingOrganization] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isPending && !session) {
        router.push('/login');
        return;
      }

    };

    checkAuthentication();
  }, []);

  // Show loading state while checking authentication or organization
  

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  );
}