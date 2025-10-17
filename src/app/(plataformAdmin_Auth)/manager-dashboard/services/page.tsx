'use client';

import { useState } from 'react';
import { useServices, useDeleteService } from '@/hooks/useServices';
import { useOwnerInfo } from '@/hooks/useOwner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Building2,
  Clock,
  DollarSign,
  Scissors,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManagerServicesPage() {
  const router = useRouter();
  const { data: ownerInfo, isLoading: ownerLoading, error: ownerError } = useOwnerInfo();
  const { data: services, isLoading: servicesLoading, error: servicesError } = useServices(
    ownerInfo?.tenantId
  );
  const deleteService = useDeleteService();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o serviço "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteService.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      alert('Erro ao excluir serviço. Por favor, tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  if (ownerLoading || servicesLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  if (ownerError) {
    return (
      <div className='max-w-6xl mx-auto space-y-6'>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center text-center gap-4'>
              <AlertCircle className='w-12 h-12 text-red-500' />
              <div>
                <p className='text-red-500 font-semibold'>
                  Erro ao carregar informações do gerente
                </p>
                <p className='text-muted-foreground text-sm mt-1'>
                  Não foi possível identificar sua organização. Por favor, entre em contato com o
                  suporte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className='max-w-6xl mx-auto space-y-6'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-red-500 text-center'>
              Erro ao carregar serviços. Por favor, tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>Serviços</h1>
          <p className='text-muted-foreground mt-1'>
            Gerencie os serviços de {ownerInfo?.tenant?.name || 'sua organização'}
          </p>
        </div>
        <Link href='/manager-dashboard/services/create'>
          <Button>
            <Plus className='w-4 h-4 mr-2' />
            Novo Serviço
          </Button>
        </Link>
      </div>

      {/* Tenant Info Card */}
      {ownerInfo && (
        <Card className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-full bg-orange-100 dark:bg-orange-900'>
                <Scissors className='w-5 h-5 text-orange-600 dark:text-orange-400' />
              </div>
              <div>
                <p className='font-semibold'>{ownerInfo.tenant.name}</p>
                <p className='text-sm text-muted-foreground'>
                  Plano: {ownerInfo.tenant.plan.name} • {services?.length || 0} serviço(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services List */}
      {!services || services.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Scissors className='w-12 h-12 text-muted-foreground mb-4' />
            <p className='text-muted-foreground text-center mb-4'>
              Nenhum serviço cadastrado ainda
            </p>
            <p className='text-sm text-center text-muted-foreground mb-6 max-w-md'>
              Adicione serviços ao seu catálogo para que clientes possam fazer agendamentos.
            </p>
            <Link href='/manager-dashboard/services/create'>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Adicionar Primeiro Serviço
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {services.map((service) => (
            <Card key={service.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center'>
                      <Scissors className='w-6 h-6 text-orange-600 dark:text-orange-400' />
                    </div>
                    <div>
                      <CardTitle className='text-lg'>{service.name}</CardTitle>
                      <CardDescription className='text-xs'>
                        {service.description || 'Sem descrição'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Clock className='w-4 h-4' />
                      <span className='text-sm'>Duração</span>
                    </div>
                    <span className='font-semibold'>{formatDuration(service.duration)}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <DollarSign className='w-4 h-4' />
                      <span className='text-sm'>Preço</span>
                    </div>
                    <span className='font-semibold text-green-600 dark:text-green-400'>
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  {service.appointments && service.appointments.length > 0 && (
                    <div className='text-xs text-muted-foreground pt-2 border-t'>
                      <span>Agendamentos: </span>
                      <span className='font-medium'>{service.appointments.length}</span>
                    </div>
                  )}
                </div>

                <div className='flex gap-2 pt-2 border-t'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() =>
                      router.push(`/manager-dashboard/services/${service.id}/edit`)
                    }
                  >
                    <Pencil className='w-3 h-3 mr-1' />
                    Editar
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    onClick={() => handleDelete(service.id, service.name)}
                    disabled={deletingId === service.id}
                  >
                    {deletingId === service.id ? (
                      <Loader2 className='w-3 h-3 animate-spin' />
                    ) : (
                      <Trash2 className='w-3 h-3' />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
