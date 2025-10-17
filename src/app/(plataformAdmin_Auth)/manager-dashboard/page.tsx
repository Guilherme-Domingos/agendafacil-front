'use client';

import { useSession } from '@/lib/auth-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Building2, 
  Users, 
  TrendingUp,
  Calendar,
  Settings,
  BarChart3
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ManagerDashboardPage() {
  const { data: session } = useSession();

  return (
    <div className='max-w-7xl mx-auto space-y-6'>
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              {session?.user?.image ? (
                <div className='relative w-16 h-16 rounded-full overflow-hidden'>
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center'>
                  <User className='w-8 h-8 text-purple-500' />
                </div>
              )}
              <div>
                <CardTitle className='text-2xl'>
                  Bem-vindo, {session?.user?.name}!
                </CardTitle>
                <CardDescription>{session?.user?.email}</CardDescription>
                <p className='text-sm text-purple-600 dark:text-purple-400 font-semibold mt-1'>
                  Administrador do Tenant
                </p>
              </div>
            </div>
            <div className='flex gap-2'>
              <Link href='/relatorios'>
                <Button variant='outline'>
                  <BarChart3 className='w-4 h-4 mr-2' />
                  Relatórios
                </Button>
              </Link>
              <Link href='/configuracoes'>
                <Button>
                  <Settings className='w-4 h-4 mr-2' />
                  Configurações
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Painel de controle do seu negócio. Gerencie sua equipe, serviços e acompanhe seus agendamentos.
          </p>
        </CardContent>
      </Card>

      {/* Estatísticas Principais */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Funcionários</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
            <p className='text-xs text-muted-foreground'>
              Membros da equipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Agendamentos Hoje</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
            <p className='text-xs text-muted-foreground'>
              Agendamentos de hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Serviços Ativos</CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0</div>
            <p className='text-xs text-muted-foreground'>
              Serviços oferecidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-full bg-blue-500/10'>
                <Users className='w-6 h-6 text-blue-500' />
              </div>
              <div>
                <CardTitle className='text-lg'>Funcionários</CardTitle>
                <CardDescription>Gerenciar equipe</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href='/manager-dashboard/staff'>
              <Button className='w-full'>Acessar</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-full bg-green-500/10'>
                <Calendar className='w-6 h-6 text-green-500' />
              </div>
              <div>
                <CardTitle className='text-lg'>Agendamentos</CardTitle>
                <CardDescription>Visualizar e gerenciar</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href='/agendamentos'>
              <Button className='w-full'>Acessar</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-full bg-orange-500/10'>
                <Building2 className='w-6 h-6 text-orange-500' />
              </div>
              <div>
                <CardTitle className='text-lg'>Serviços</CardTitle>
                <CardDescription>Gerenciar serviços</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href='/manager-dashboard/services'>
              <Button className='w-full'>Acessar</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='hover:shadow-md transition-shadow'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-full bg-purple-500/10'>
                <BarChart3 className='w-6 h-6 text-purple-500' />
              </div>
              <div>
                <CardTitle className='text-lg'>Relatórios</CardTitle>
                <CardDescription>Métricas e análises</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href='/relatorios'>
              <Button className='w-full'>Acessar</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes e Métricas */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Agendamentos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='w-5 h-5' />
              Agendamentos Recentes
            </CardTitle>
            <CardDescription>
              Últimos agendamentos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='text-center py-8 text-muted-foreground'>
              <Calendar className='w-12 h-12 mx-auto mb-3 opacity-50' />
              <p>Nenhum agendamento realizado ainda.</p>
              <p className='text-sm mt-1'>
                Os agendamentos aparecerão aqui quando forem realizados.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas do Mês */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='w-5 h-5' />
              Estatísticas do Mês
            </CardTitle>
            <CardDescription>
              Métricas do seu negócio nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Agendamentos</span>
                <span className='text-2xl font-bold text-blue-500'>0</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Novos Clientes</span>
                <span className='text-2xl font-bold text-green-500'>0</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Taxa de Ocupação</span>
                <span className='text-2xl font-bold text-purple-500'>0%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
