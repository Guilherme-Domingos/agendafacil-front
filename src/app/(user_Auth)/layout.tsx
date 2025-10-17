'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { UserHeader } from '@/components/layouts/user-header';
import { useEffect } from 'react';

export default function UserAuthLayout({
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

      // Se o usuário for admin, redireciona para o dashboard de admin
      if (session?.user && session.user.role === 'admin') {
        router.push('/dashboard');
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

  // Don't render if user is admin (will redirect to admin dashboard)
  if (session.user.role === 'admin') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <UserHeader />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  );
}
