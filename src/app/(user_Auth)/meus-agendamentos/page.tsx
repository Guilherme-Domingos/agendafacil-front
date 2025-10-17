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
  useAppointments,
  useCancelAppointment,
} from '@/hooks/useAppointments';
import {
  Calendar,
  Clock,
  Building2,
  User,
  DollarSign,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarX,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const STATUS_MAP = {
  pending: {
    label: 'Pendente',
    icon: AlertCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  confirmed: {
    label: 'Confirmado',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  cancelled: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  completed: {
    label: 'Concluído',
    icon: CheckCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
};

export default function MyAppointmentsPage() {
  const { data: session } = useSession();
  const { data: appointments, isLoading } = useAppointments(
    session?.user?.id
  );
  const cancelAppointment = useCancelAppointment();

  const handleCancelAppointment = async (id: string) => {
    try {
      await cancelAppointment.mutateAsync(id);
      toast.success('Agendamento cancelado com sucesso');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Erro ao cancelar agendamento'
      );
    }
  };

  // Separar agendamentos por status
  const upcomingAppointments = appointments?.filter(
    (apt) =>
      (apt.status === 'pending' || apt.status === 'confirmed') &&
      new Date(apt.scheduledAt) >= new Date()
  );

  const pastAppointments = appointments?.filter(
    (apt) =>
      apt.status === 'completed' ||
      apt.status === 'cancelled' ||
      (apt.status !== 'cancelled' && new Date(apt.scheduledAt) < new Date())
  );

  const renderAppointmentCard = (appointment: any) => {
    const status =
      STATUS_MAP[appointment.status as keyof typeof STATUS_MAP] ||
      STATUS_MAP.pending;
    const StatusIcon = status.icon;
    const isPast = new Date(appointment.scheduledAt) < new Date();
    const canCancel =
      (appointment.status === 'pending' ||
        appointment.status === 'confirmed') &&
      !isPast;

    return (
      <Card key={appointment.id} className='hover:shadow-md transition-shadow'>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
            {/* Informações principais */}
            <div className='flex-1 space-y-3'>
              {/* Status */}
              <div className='flex items-center gap-2'>
                <div className={`p-2 rounded-full ${status.bgColor}`}>
                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                </div>
                <span className={`text-sm font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Estabelecimento */}
              <div className='flex items-start gap-3'>
                <Building2 className='w-5 h-5 text-muted-foreground mt-0.5' />
                <div>
                  <p className='font-semibold text-lg'>
                    {appointment.tenant?.name || 'Estabelecimento'}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {appointment.service?.name}
                  </p>
                </div>
              </div>

              {/* Data e Hora */}
              <div className='flex flex-wrap gap-4 text-sm'>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4 text-muted-foreground' />
                  <span>
                    {format(
                      new Date(appointment.scheduledAt),
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR }
                    )}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Clock className='w-4 h-4 text-muted-foreground' />
                  <span>
                    {format(new Date(appointment.scheduledAt), 'HH:mm', {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>

              {/* Profissional */}
              <div className='flex items-center gap-2 text-sm'>
                <User className='w-4 h-4 text-muted-foreground' />
                <span>
                  {appointment.staff?.name} - {appointment.staff?.role}
                </span>
              </div>

              {/* Preço */}
              {appointment.service?.price && (
                <div className='flex items-center gap-2 text-sm font-semibold'>
                  <DollarSign className='w-4 h-4 text-green-600' />
                  <span className='text-green-600'>
                    R$ {appointment.service.price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Ações */}
            {canCancel && (
              <div className='flex flex-col gap-2'>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-red-600 hover:text-red-700'
                    >
                      <CalendarX className='w-4 h-4 mr-2' />
                      Cancelar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja cancelar este agendamento? Esta
                        ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Não, manter</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className='bg-red-600 hover:bg-red-700'
                      >
                        Sim, cancelar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Meus Agendamentos</h1>
          <p className='text-muted-foreground mt-2'>
            Gerencie todos os seus agendamentos
          </p>
        </div>
        <Link href='/agendamentos/novo'>
          <Button>
            <Calendar className='w-4 h-4 mr-2' />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      {/* Próximos Agendamentos */}
      {upcomingAppointments && upcomingAppointments.length > 0 && (
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='w-5 h-5' />
                Próximos Agendamentos
              </CardTitle>
              <CardDescription>
                Seus compromissos futuros e pendentes
              </CardDescription>
            </CardHeader>
          </Card>

          <div className='space-y-4'>
            {upcomingAppointments.map(renderAppointmentCard)}
          </div>
        </div>
      )}

      {/* Agendamentos Passados */}
      {pastAppointments && pastAppointments.length > 0 && (
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='w-5 h-5' />
                Histórico
              </CardTitle>
              <CardDescription>
                Agendamentos anteriores e cancelados
              </CardDescription>
            </CardHeader>
          </Card>

          <div className='space-y-4'>
            {pastAppointments.map(renderAppointmentCard)}
          </div>
        </div>
      )}

      {/* Vazio */}
      {(!appointments || appointments.length === 0) && (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Calendar className='w-16 h-16 text-muted-foreground/50 mb-4' />
            <h3 className='text-xl font-semibold mb-2'>
              Nenhum agendamento encontrado
            </h3>
            <p className='text-muted-foreground text-center mb-6'>
              Você ainda não possui agendamentos. Crie seu primeiro agendamento
              agora!
            </p>
            <Link href='/agendamentos/novo'>
              <Button>
                <Calendar className='w-4 h-4 mr-2' />
                Criar Agendamento
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
