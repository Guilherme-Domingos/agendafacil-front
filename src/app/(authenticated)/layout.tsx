'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layouts/header';
import { useEffect } from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isPending && !session) {
        router.push('/login');
        return;
      }

      // Redireciona baseado na role do usuário
      if (session?.user) {
        if (session.user.role === 'manager') {
          router.push('/manager-dashboard');
          return;
        } else if (session.user.role !== 'admin') {
          router.push('/userDashboard');
          return;
        }
      }
    };

    checkAuthentication();
  }, [session, isPending, router]);

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  // Don't render if user is not admin (will redirect based on role)
  if (session.user.role !== 'admin') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  );
}