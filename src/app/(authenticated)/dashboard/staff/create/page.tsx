'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateStaff } from '@/hooks/useStaff';
import { useTenants } from '@/hooks/useTenants';
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
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import Link from 'next/link';

export default function CreateStaffPage() {
  const router = useRouter();
  const createStaff = useCreateStaff();
  const { data: tenants, isLoading: tenantsLoading } = useTenants();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
    tenantId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do funcionário é obrigatório';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Função/cargo é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.tenantId) {
      newErrors.tenantId = 'Selecione um tenant';
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
      const dataToSend = {
        ...formData,
        password: formData.password || undefined,
      };
      await createStaff.mutateAsync(dataToSend);
      router.push('/dashboard/staff');
    } catch (error: any) {
      console.error('Erro ao criar funcionário:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Erro ao criar funcionário. Por favor, tente novamente.';

      // Se for erro de conflito (409), destacar no formulário
      if (error.response?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          email: 'Este email já está em uso',
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
        <Link href='/dashboard/staff'>
          <Button variant='outline' size='icon'>
            <ArrowLeft className='w-4 h-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold'>Novo Funcionário</h1>
          <p className='text-muted-foreground mt-1'>
            Adicione um novo funcionário ao sistema
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
              <Users className='w-6 h-6 text-primary' />
            </div>
            <div>
              <CardTitle>Informações do Funcionário</CardTitle>
              <CardDescription>
                Preencha os dados do funcionário
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Nome */}
            <div className='space-y-2'>
              <Label htmlFor='name'>
                Nome Completo <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                name='name'
                type='text'
                placeholder='Ex: Maria Santos'
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className='text-sm text-red-500'>{errors.name}</p>
              )}
            </div>

            {/* Função/Cargo */}
            <div className='space-y-2'>
              <Label htmlFor='role'>
                Função/Cargo <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='role'
                name='role'
                type='text'
                placeholder='Ex: Cabeleireira, Manicure, Barbeiro'
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? 'border-red-500' : ''}
              />
              {errors.role && (
                <p className='text-sm text-red-500'>{errors.role}</p>
              )}
            </div>

            {/* Email */}
            <div className='space-y-2'>
              <Label htmlFor='email'>
                Email <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='funcionario@empresa.com'
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email}</p>
              )}
            </div>

            {/* Senha (Opcional) */}
            <div className='space-y-2'>
              <Label htmlFor='password'>Senha (Opcional)</Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='Deixe em branco para gerar automaticamente'
                value={formData.password}
                onChange={handleChange}
              />
              <p className='text-sm text-muted-foreground'>
                Se não informar, uma senha será gerada automaticamente e
                enviada por email.
              </p>
            </div>

            {/* Tenant */}
            <div className='space-y-2'>
              <Label htmlFor='tenantId'>
                Organização <span className='text-red-500'>*</span>
              </Label>
              {tenantsLoading ? (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Carregando organizações...
                </div>
              ) : (
                <select
                  id='tenantId'
                  name='tenantId'
                  value={formData.tenantId}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border ${
                    errors.tenantId ? 'border-red-500' : 'border-input'
                  } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <option value=''>Selecione uma organização</option>
                  {tenants?.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.tenantId && (
                <p className='text-sm text-red-500'>{errors.tenantId}</p>
              )}
            </div>

            {/* Actions */}
            <div className='flex gap-4 pt-4 border-t'>
              <Link href='/dashboard/staff' className='flex-1'>
                <Button type='button' variant='outline' className='w-full'>
                  Cancelar
                </Button>
              </Link>
              <Button
                type='submit'
                className='flex-1'
                disabled={createStaff.isPending}
              >
                {createStaff.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Criando...
                  </>
                ) : (
                  'Criar Funcionário'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
