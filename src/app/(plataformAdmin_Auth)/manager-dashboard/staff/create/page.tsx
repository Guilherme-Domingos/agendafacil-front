'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateStaff } from '@/hooks/useStaff';
import { useOwnerInfo } from '@/hooks/useOwner';
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
import { ArrowLeft, Loader2, Users, AlertCircle, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateManagerStaffPage() {
  const router = useRouter();
  const createStaff = useCreateStaff();
  const { data: ownerInfo, isLoading: ownerLoading, error: ownerError } = useOwnerInfo();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!ownerInfo?.tenantId) {
      alert('Erro: Não foi possível identificar sua organização.');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        password: formData.password || undefined,
        tenantId: ownerInfo.tenantId,
      };
      await createStaff.mutateAsync(dataToSend);
      router.push('/manager-dashboard/staff');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (ownerLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  if (ownerError || !ownerInfo) {
    return (
      <div className='max-w-2xl mx-auto space-y-6'>
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
              <Link href='/manager-dashboard'>
                <Button>Voltar ao Dashboard</Button>
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
        <Link href='/manager-dashboard/staff'>
          <Button variant='outline' size='icon'>
            <ArrowLeft className='w-4 h-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold'>Novo Funcionário</h1>
          <p className='text-muted-foreground mt-1'>
            Adicione um novo funcionário à sua equipe
          </p>
        </div>
      </div>

      {/* Tenant Info */}
      <Card className='bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800'>
        <CardContent className='pt-6'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-full bg-purple-100 dark:bg-purple-900'>
              <Building2 className='w-5 h-5 text-purple-600 dark:text-purple-400' />
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Organização</p>
              <p className='font-semibold'>{ownerInfo.tenant.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                Preencha os dados do novo funcionário
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
                enviada por email ao funcionário.
              </p>
            </div>

            {/* Actions */}
            <div className='flex gap-4 pt-4 border-t'>
              <Link href='/manager-dashboard/staff' className='flex-1'>
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
