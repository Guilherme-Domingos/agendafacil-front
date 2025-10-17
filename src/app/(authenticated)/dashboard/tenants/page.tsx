'use client';

import { useState } from 'react';
import { useTenants, useDeleteTenant } from '@/hooks/useTenants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Building2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TenantsPage() {
  const router = useRouter();
  const { data: tenants, isLoading, error } = useTenants();
  const deleteTenant = useDeleteTenant();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o tenant "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteTenant.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir tenant:', error);
      alert('Erro ao excluir tenant. Por favor, tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
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
              Erro ao carregar tenants. Por favor, tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Tenants</h1>
          <p className='text-muted-foreground mt-1'>
            Gerencie as organizações do sistema
          </p>
        </div>
        <Link href='/dashboard/tenants/create'>
          <Button>
            <Plus className='w-4 h-4 mr-2' />
            Novo Tenant
          </Button>
        </Link>
      </div>

      {/* Tenants List */}
      {!tenants || tenants.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Building2 className='w-12 h-12 text-muted-foreground mb-4' />
            <p className='text-muted-foreground text-center mb-4'>
              Nenhum tenant cadastrado ainda
            </p>
            <Link href='/dashboard/tenants/create'>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Criar Primeiro Tenant
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {tenants.map((tenant) => (
            <Card
              key={tenant.id}
              className='hover:shadow-lg transition-shadow'
            >
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
                      <Building2 className='w-6 h-6 text-primary' />
                    </div>
                    <div>
                      <CardTitle className='text-lg'>{tenant.name}</CardTitle>
                      <CardDescription className='text-xs'>
                        {tenant.plan?.name || 'Sem plano'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2 text-sm'>
                  {tenant.owners && tenant.owners.length > 0 && (
                    <div>
                      <span className='text-muted-foreground'>
                        Proprietário:
                      </span>
                      <p className='font-medium'>{tenant.owners[0].email}</p>
                    </div>
                  )}
                  {tenant.plan && (
                    <div>
                      <span className='text-muted-foreground'>Plano:</span>
                      <p className='font-medium'>
                        {tenant.plan.name} - R${' '}
                        {tenant.plan.price.toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div className='flex gap-4 text-xs text-muted-foreground'>
                    <div>
                      <span>Serviços: </span>
                      <span className='font-medium'>
                        {tenant.services?.length || 0}
                      </span>
                    </div>
                    <div>
                      <span>Staff: </span>
                      <span className='font-medium'>
                        {tenant.staff?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex gap-2 pt-2 border-t'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() =>
                      router.push(`/dashboard/tenants/${tenant.id}/edit`)
                    }
                  >
                    <Pencil className='w-3 h-3 mr-1' />
                    Editar
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                    onClick={() => handleDelete(tenant.id, tenant.name)}
                    disabled={deletingId === tenant.id}
                  >
                    {deletingId === tenant.id ? (
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
