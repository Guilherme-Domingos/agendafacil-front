'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useService, useUpdateService } from '@/hooks/useServices';
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
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, AlertCircle, Building2, Scissors } from 'lucide-react';
import Link from 'next/link';

export default function EditManagerServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: service, isLoading: serviceLoading } = useService(params.id);
  const { data: ownerInfo, isLoading: ownerLoading } = useOwnerInfo();
  const updateService = useUpdateService();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when service data is loaded
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        duration: service.duration.toString(),
        price: service.price.toString(),
      });
    }
  }, [service]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do serviço é obrigatório';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duração é obrigatória';
    } else if (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Duração deve ser um número positivo';
    }

    if (!formData.price) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Preço deve ser um número válido';
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
        name: formData.name,
        description: formData.description || undefined,
        duration: Number(formData.duration),
        price: Number(formData.price),
        tenantId: ownerInfo.tenantId,
      };

      await updateService.mutateAsync({
        id: params.id,
        data: dataToSend,
      });
      router.push('/manager-dashboard/services');
    } catch (error: any) {
      console.error('Erro ao atualizar serviço:', error);

      const errorMessage =
        error.response?.data?.message ||
        'Erro ao atualizar serviço. Por favor, tente novamente.';

      alert(errorMessage);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (serviceLoading || ownerLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!service) {
    return (
      <div className='max-w-2xl mx-auto space-y-6'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-red-500 text-center'>Serviço não encontrado</p>
            <div className='flex justify-center mt-4'>
              <Link href='/manager-dashboard/services'>
                <Button>Voltar para Serviços</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se o serviço pertence ao tenant do manager
  if (ownerInfo && service.tenantId !== ownerInfo.tenantId) {
    return (
      <div className='max-w-2xl mx-auto space-y-6'>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center text-center gap-4'>
              <AlertCircle className='w-12 h-12 text-red-500' />
              <div>
                <p className='text-red-500 font-semibold'>Acesso negado</p>
                <p className='text-muted-foreground text-sm mt-1'>
                  Este serviço não pertence à sua organização.
                </p>
              </div>
              <Link href='/manager-dashboard/services'>
                <Button>Voltar para Serviços</Button>
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
        <Link href='/manager-dashboard/services'>
          <Button variant='outline' size='icon'>
            <ArrowLeft className='w-4 h-4' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold'>Editar Serviço</h1>
          <p className='text-muted-foreground mt-1'>Atualize as informações do serviço</p>
        </div>
      </div>

      {/* Tenant Info */}
      {ownerInfo && (
        <Card className='bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-full bg-orange-100 dark:bg-orange-900'>
                <Building2 className='w-5 h-5 text-orange-600 dark:text-orange-400' />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Organização</p>
                <p className='font-semibold'>{ownerInfo.tenant.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center'>
              <Scissors className='w-6 h-6 text-orange-600 dark:text-orange-400' />
            </div>
            <div>
              <CardTitle>Informações do Serviço</CardTitle>
              <CardDescription>Atualize os dados do serviço</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Nome */}
            <div className='space-y-2'>
              <Label htmlFor='name'>
                Nome do Serviço <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                name='name'
                type='text'
                placeholder='Ex: Corte de cabelo, Manicure, Massagem'
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
            </div>

            {/* Descrição */}
            <div className='space-y-2'>
              <Label htmlFor='description'>Descrição (Opcional)</Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Descreva os detalhes do serviço...'
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
              <p className='text-sm text-muted-foreground'>
                Adicione informações sobre o que está incluso no serviço.
              </p>
            </div>

            {/* Duração e Preço em Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Duração */}
              <div className='space-y-2'>
                <Label htmlFor='duration'>
                  Duração (minutos) <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='duration'
                  name='duration'
                  type='number'
                  min='1'
                  placeholder='Ex: 30, 60, 90'
                  value={formData.duration}
                  onChange={handleChange}
                  className={errors.duration ? 'border-red-500' : ''}
                />
                {errors.duration && <p className='text-sm text-red-500'>{errors.duration}</p>}
              </div>

              {/* Preço */}
              <div className='space-y-2'>
                <Label htmlFor='price'>
                  Preço (R$) <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='price'
                  name='price'
                  type='number'
                  min='0'
                  step='0.01'
                  placeholder='Ex: 50.00'
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className='text-sm text-red-500'>{errors.price}</p>}
              </div>
            </div>

            {/* Metadata */}
            <div className='space-y-2 pt-4 border-t'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>ID:</span>
                <span className='font-mono text-xs'>{service.id}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Criado em:</span>
                <span>{new Date(service.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={() => router.back()}
                disabled={updateService.isPending}
              >
                Cancelar
              </Button>
              <Button type='submit' className='flex-1' disabled={updateService.isPending}>
                {updateService.isPending ? (
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
