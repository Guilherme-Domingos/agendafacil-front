'use client';

import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Users, Building2, Settings } from 'lucide-react';
import Link from 'next/link';

export function ManagerHeader() {
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
            <Link href='/manager-dashboard' className='flex items-center gap-3'>
              <Logo />
              <h1 className='text-xl md:text-2xl font-bold text-foreground'>
                AgendaFácil <span className='text-sm text-muted-foreground'>Manager</span>
              </h1>
            </Link>

            <nav className='hidden md:flex items-center gap-4'>
              <Link href='/manager-dashboard'>
                <Button variant='ghost' className='flex items-center gap-2'>
                  <LayoutDashboard className='w-4 h-4' />
                  Dashboard
                </Button>
              </Link>
              <Link href='/tenants'>
                <Button variant='ghost' className='flex items-center gap-2'>
                  <Building2 className='w-4 h-4' />
                  Tenants
                </Button>
              </Link>
              <Link href='/usuarios'>
                <Button variant='ghost' className='flex items-center gap-2'>
                  <Users className='w-4 h-4' />
                  Usuários
                </Button>
              </Link>
              <Link href='/configuracoes'>
                <Button variant='ghost' className='flex items-center gap-2'>
                  <Settings className='w-4 h-4' />
                  Configurações
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
