'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ManagerHeader } from '@/components/layouts/manager-header';
import { useEffect } from 'react';

export default function PlatformAdminLayout({
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

      // Se o usuário não for manager, redireciona baseado na role
      if (session?.user && session.user.role !== 'manager') {
        if (session.user.role === 'admin') {
          router.push('/dashboard');
        } else {
          router.push('/user-dashboard');
        }
        return;
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

  // Don't render if user is not manager (will redirect based on role)
  if (session.user.role !== 'manager') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <ManagerHeader />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  );
}
