'use client';

import { useState } from 'react';
import { useStaff, useDeleteStaff } from '@/hooks/useStaff';
import { useTenants } from '@/hooks/useTenants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Users, Loader2, Mail, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StaffPage() {
  const router = useRouter();
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const { data: staff, isLoading, error } = useStaff(selectedTenantId || undefined);
  const { data: tenants, isLoading: tenantsLoading } = useTenants();
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

  if (isLoading || tenantsLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  if (error) {
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
            Gerencie os funcionários das organizações
          </p>
        </div>
        <Link href='/dashboard/staff/create'>
          <Button>
            <Plus className='w-4 h-4 mr-2' />
            Novo Funcionário
          </Button>
        </Link>
      </div>

      {/* Filter by Tenant */}
      {tenants && tenants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-4'>
              <label className='text-sm font-medium'>Filtrar por Tenant:</label>
              <div className='flex gap-2'>
                <Select
                  value={selectedTenantId || undefined}
                  onValueChange={setSelectedTenantId}
                >
                  <SelectTrigger className='w-[280px]'>
                    <SelectValue placeholder='Todos os tenants' />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTenantId && (
                  <Button
                    variant='outline'
                    onClick={() => setSelectedTenantId('')}
                  >
                    Limpar
                  </Button>
                )}
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
              {selectedTenantId
                ? 'Nenhum funcionário encontrado para este tenant'
                : 'Nenhum funcionário cadastrado ainda'}
            </p>
            <Link href='/dashboard/staff/create'>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Criar Primeiro Funcionário
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
                  {member.tenant && (
                    <div>
                      <span className='text-muted-foreground text-xs'>
                        Organização:
                      </span>
                      <p className='font-medium'>{member.tenant.name}</p>
                    </div>
                  )}
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
                      router.push(`/dashboard/staff/${member.id}/edit`)
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
