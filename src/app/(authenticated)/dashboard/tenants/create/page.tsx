'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateTenant } from '@/hooks/useTenants';
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

export default function CreateTenantPage() {
  const router = useRouter();
  const createTenant = useCreateTenant();
  const { data: plans, isLoading: plansLoading } = usePlans();

  const [formData, setFormData] = useState({
    name: '',
    ownerEmail: '',
    planId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do tenant é obrigatório';
    }

    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Email do proprietário é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Email inválido';
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
      await createTenant.mutateAsync(formData);
      router.push('/dashboard/tenants');
    } catch (error: any) {
      console.error('Erro ao criar tenant:', error);
      
      const errorMessage = error.response?.data?.message || 
        error.message || 
        'Erro ao criar tenant. Por favor, tente novamente.';
      
      // Se for erro de conflito (409), destacar no formulário
      if (error.response?.status === 409) {
        setErrors(prev => ({
          ...prev,
          ownerEmail: 'Este email já está em uso por outro tenant'
        }));
      }
      
      alert(errorMessage);
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
          <h1 className='text-3xl font-bold'>Novo Tenant</h1>
          <p className='text-muted-foreground mt-1'>
            Crie uma nova organização no sistema
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
                Preencha os dados da organização
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

            {/* Email do Proprietário */}
            <div className='space-y-2'>
              <Label htmlFor='ownerEmail'>
                Email do Proprietário <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='ownerEmail'
                name='ownerEmail'
                type='email'
                placeholder='proprietario@empresa.com'
                value={formData.ownerEmail}
                onChange={handleChange}
                className={errors.ownerEmail ? 'border-red-500' : ''}
              />
              {errors.ownerEmail && (
                <p className='text-sm text-red-500'>{errors.ownerEmail}</p>
              )}
              <p className='text-sm text-muted-foreground'>
                Se o proprietário não existir, será criado automaticamente com
                uma senha padrão enviada por email.
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

            {/* Actions */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={() => router.back()}
                disabled={createTenant.isPending}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='flex-1'
                disabled={createTenant.isPending}
              >
                {createTenant.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Criando...
                  </>
                ) : (
                  'Criar Tenant'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
