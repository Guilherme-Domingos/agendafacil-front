'use client';

import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useRouter } from 'next/navigation';
import { LogOut, Calendar, User } from 'lucide-react';
import Link from 'next/link';

export function UserHeader() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  return (
    <header className='border-b border-border bg-card'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-8'>
            <Link href='/user-dashboard' className='flex items-center gap-3'>
              <Logo />
              <h1 className='text-xl md:text-2xl font-bold text-foreground'>
                AgendaFácil
              </h1>
            </Link>

            <nav className='hidden md:flex items-center gap-4'>
              <Link href='/user-dashboard'>
                <Button variant='ghost' className='flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  Meu Painel
                </Button>
              </Link>
              <Link href='/meus-agendamentos'>
                <Button variant='ghost' className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  Meus Agendamentos
                </Button>
              </Link>
            </nav>
          </div>

          <Button
            variant='outline'
            onClick={handleSignOut}
            className='flex items-center gap-2'>
            <LogOut className='w-4 h-4' />
            <span className='hidden sm:inline'>Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
