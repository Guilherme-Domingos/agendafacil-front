'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant, useUpdateTenant } from '@/hooks/useTenants';
import { usePlans } from '@/hooks/usePlans';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function EditTenantPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: tenant, isLoading: tenantLoading } = useTenant(params.id);
  const { data: plans, isLoading: plansLoading } = usePlans();
  const updateTenant = useUpdateTenant();

  const [formData, setFormData] = useState({
    name: '',
    planId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when tenant data is loaded
  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        planId: tenant.planId,
      });
    }
  }, [tenant]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do tenant é obrigatório';
    }

    if (!formData.planId) {
      newErrors.planId = 'Selecione um plano';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateTenant.mutateAsync({
        id: params.id,
        data: formData,
      });
      router.push('/dashboard/tenants');
    } catch (error: any) {
      console.error('Erro ao atualizar tenant:', error);
      alert(
        error.response?.data?.message ||
          'Erro ao atualizar tenant. Por favor, tente novamente.'
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (tenantLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className='max-w-2xl mx-auto space-y-6'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-red-500 text-center'>Tenant não encontrado</p>
            <div className='flex justify-center mt-4'>
              <Link href='/dashboard/tenants'>
                <Button>Voltar para Tenants</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link href='/dashboard/tenants'>
          <Button variant='outline' size='icon'>
            <ArrowLeft className='w-4 h-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold'>Editar Tenant</h1>
          <p className='text-muted-foreground mt-1'>
            Atualize as informações da organização
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
              <Building2 className='w-6 h-6 text-primary' />
            </div>
            <div>
              <CardTitle>Informações do Tenant</CardTitle>
              <CardDescription>
                Atualize os dados da organização
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Nome do Tenant */}
            <div className='space-y-2'>
              <Label htmlFor='name'>
                Nome do Tenant <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                name='name'
                type='text'
                placeholder='Ex: Empresa XYZ'
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name}</p>
              )}
            </div>

            {/* Owner Email (read-only) */}
            <div className='space-y-2'>
              <Label htmlFor='ownerEmail'>Email do Proprietário</Label>
              <Input
                id='ownerEmail'
                type='email'
                value={tenant.owners?.[0]?.email || 'N/A'}
                disabled
                className='bg-muted'
              />
              <p className='text-sm text-muted-foreground'>
                O email do proprietário não pode ser alterado.
              </p>
            </div>

            {/* Plano */}
            <div className='space-y-2'>
              <Label htmlFor='planId'>
                Plano <span className='text-red-500'>*</span>
              </Label>
              {plansLoading ? (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Carregando planos...
                </div>
              ) : (
                <select
                  id='planId'
                  name='planId'
                  value={formData.planId}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border ${
                    errors.planId ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <option value=''>Selecione um plano</option>
                  {plans?.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - R$ {plan.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              )}
              {errors.planId && (
                <p className='text-sm text-red-500'>{errors.planId}</p>
              )}
            </div>

            {/* Metadata */}
            <div className='space-y-2 pt-4 border-t'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>ID:</span>
                <span className='font-mono text-xs'>{tenant.id}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Criado em:</span>
                <span>
                  {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Atualizado em:</span>
                <span>
                  {new Date(tenant.updatedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={() => router.back()}
                disabled={updateTenant.isPending}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='flex-1'
                disabled={updateTenant.isPending}
              >
                {updateTenant.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
