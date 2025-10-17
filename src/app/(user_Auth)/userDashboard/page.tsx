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
import { User, Calendar, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function UserDashboardPage() {
  const { data: session } = useSession();

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Welcome Card */}
      <Card>
        <CardHeader>
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
              <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
                <User className='w-8 h-8 text-primary' />
              </div>
            )}
            <div>
              <CardTitle className='text-2xl'>
                Olá, {session?.user?.name}!
              </CardTitle>
              <CardDescription>{session?.user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            Bem-vindo ao seu painel de agendamentos. Aqui você pode visualizar e gerenciar seus compromissos.
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card className='hover:shadow-md transition-shadow cursor-pointer'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-full bg-primary/10'>
                <Calendar className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-lg'>Novo Agendamento</CardTitle>
                <CardDescription>Agende um novo serviço</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href='/agendamentos/novo'>
              <Button className='w-full'>Agendar Agora</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='hover:shadow-md transition-shadow cursor-pointer'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='p-3 rounded-full bg-blue-500/10'>
                <Clock className='w-6 h-6 text-blue-500' />
              </div>
              <div>
                <CardTitle className='text-lg'>Meus Agendamentos</CardTitle>
                <CardDescription>Veja seus compromissos</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href='/meus-agendamentos'>
              <Button variant='outline' className='w-full'>
                Ver Agendamentos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='w-5 h-5' />
            Próximos Agendamentos
          </CardTitle>
          <CardDescription>
            Seus compromissos agendados para os próximos dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {/* Placeholder para quando não houver agendamentos */}
            <div className='text-center py-8 text-muted-foreground'>
              <Calendar className='w-12 h-12 mx-auto mb-3 opacity-50' />
              <p>Você não possui agendamentos próximos.</p>
              <p className='text-sm mt-1'>
                Clique em "Novo Agendamento" para agendar um serviço.
              </p>
            </div>

            {/* Exemplo de como os agendamentos seriam exibidos */}
            {/* <div className='flex items-start gap-4 p-4 border rounded-lg'>
              <div className='p-2 rounded-full bg-green-500/10'>
                <CheckCircle className='w-5 h-5 text-green-500' />
              </div>
              <div className='flex-1'>
                <h4 className='font-semibold'>Corte de Cabelo</h4>
                <p className='text-sm text-muted-foreground'>
                  Salão Beleza & Estilo
                </p>
                <div className='flex items-center gap-4 mt-2 text-sm'>
                  <span className='flex items-center gap-1'>
                    <Calendar className='w-4 h-4' />
                    18/10/2025
                  </span>
                  <span className='flex items-center gap-1'>
                    <Clock className='w-4 h-4' />
                    14:00
                  </span>
                </div>
              </div>
              <Button variant='outline' size='sm'>
                Detalhes
              </Button>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Informações Úteis */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <CheckCircle className='w-5 h-5 text-green-500' />
              Total de Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-primary'>0</p>
            <p className='text-sm text-muted-foreground mt-1'>
              Nenhum agendamento realizado ainda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Clock className='w-5 h-5 text-blue-500' />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-blue-500'>0</p>
            <p className='text-sm text-muted-foreground mt-1'>
              Agendamentos aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <CheckCircle className='w-5 h-5 text-green-500' />
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold text-green-500'>0</p>
            <p className='text-sm text-muted-foreground mt-1'>
              Serviços concluídos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
