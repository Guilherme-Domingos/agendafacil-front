'use client';

import { useState } from 'react';
import { useStaff, useDeleteStaff } from '@/hooks/useStaff';
import { useOwnerInfo } from '@/hooks/useOwner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Users, Loader2, Mail, Briefcase, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ManagerStaffPage() {
  const router = useRouter();
  const { data: ownerInfo, isLoading: ownerLoading, error: ownerError } = useOwnerInfo();
  const { data: staff, isLoading: staffLoading, error: staffError } = useStaff(ownerInfo?.tenantId);
  const deleteStaff = useDeleteStaff();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o funcionário "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteStaff.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      alert('Erro ao excluir funcionário. Por favor, tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  if (ownerLoading || staffLoading) {
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
                  Não foi possível identificar sua organização. Por favor, entre em contato com o suporte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (staffError) {
    return (
      <div className='max-w-6xl mx-auto space-y-6'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-red-500 text-center'>
              Erro ao carregar funcionários. Por favor, tente novamente.
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
          <h1 className='text-3xl font-bold'>Funcionários</h1>
          <p className='text-muted-foreground mt-1'>
            Gerencie os funcionários de {ownerInfo?.tenant?.name || 'sua organização'}
          </p>
        </div>
        <Link href='/manager-dashboard/staff/create'>
          <Button>
            <Plus className='w-4 h-4 mr-2' />
            Novo Funcionário
          </Button>
        </Link>
      </div>

      {/* Tenant Info Card */}
      {ownerInfo && (
        <Card className='bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-full bg-purple-100 dark:bg-purple-900'>
                <Users className='w-5 h-5 text-purple-600 dark:text-purple-400' />
              </div>
              <div>
                <p className='font-semibold'>{ownerInfo.tenant.name}</p>
                <p className='text-sm text-muted-foreground'>
                  Plano: {ownerInfo.tenant.plan.name} • {staff?.length || 0} funcionário(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff List */}
      {!staff || staff.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Users className='w-12 h-12 text-muted-foreground mb-4' />
            <p className='text-muted-foreground text-center mb-4'>
              Nenhum funcionário cadastrado ainda
            </p>
            <p className='text-sm text-center text-muted-foreground mb-6 max-w-md'>
              Adicione funcionários à sua equipe para que eles possam gerenciar
              agendamentos e horários disponíveis.
            </p>
            <Link href='/manager-dashboard/staff/create'>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Adicionar Primeiro Funcionário
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {staff.map((member) => (
            <Card
              key={member.id}
              className='hover:shadow-lg transition-shadow'
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
                      <Users className='w-6 h-6 text-primary' />
                    </div>
                    <div>
                      <CardTitle className='text-lg'>{member.name}</CardTitle>
                      <CardDescription className='text-xs flex items-center gap-1'>
                        <Briefcase className='w-3 h-3' />
                        {member.role}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Mail className='w-4 h-4' />
                    <span className='text-xs'>{member.email}</span>
                  </div>
                  {member.appointments && member.appointments.length > 0 && (
                    <div className='text-xs text-muted-foreground'>
                      <span>Agendamentos: </span>
                      <span className='font-medium'>
                        {member.appointments.length}
                      </span>
                    </div>
                  )}
                </div>

                <div className='flex gap-2 pt-2 border-t'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() =>
                      router.push(`/manager-dashboard/staff/${member.id}/edit`)
                    }
                  >
                    <Pencil className='w-3 h-3 mr-1' />
                    Editar
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    onClick={() => handleDelete(member.id, member.name)}
                    disabled={deletingId === member.id}
                  >
                    {deletingId === member.id ? (
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
