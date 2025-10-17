'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useTenants } from '@/hooks/useTenants';
import { useServices } from '@/hooks/useServices';
import { useStaff } from '@/hooks/useStaff';
import { useCreateAppointment } from '@/hooks/useAppointments';
import { Calendar, Clock, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NewAppointmentPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');

  // Queries
  const { data: tenants, isLoading: loadingTenants } = useTenants();
  const { data: services, isLoading: loadingServices } = useServices(
    selectedTenant || undefined
  );
  const { data: staff, isLoading: loadingStaff } = useStaff(
    selectedTenant || undefined
  );

  // Mutation
  const createAppointment = useCreateAppointment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTenant || !selectedService || !selectedStaff || !scheduledDate || !scheduledTime) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (!session?.user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      // Combinar data e hora
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();

      await createAppointment.mutateAsync({
        userId: session.user.id,
        serviceId: selectedService,
        staffId: selectedStaff,
        scheduledAt,
        tenantId: selectedTenant,
      });

      toast.success('Agendamento criado com sucesso!');
      router.push('/meus-agendamentos');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao criar agendamento');
    }
  };

  const selectedServiceData = services?.find((s) => s.id === selectedService);

  // Data mínima é hoje
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Novo Agendamento</h1>
        <p className='text-muted-foreground mt-2'>
          Selecione o estabelecimento, serviço e horário desejado
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Agendamento</CardTitle>
            <CardDescription>
              Preencha todos os campos para criar seu agendamento
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Seleção de Tenant */}
            <div className='space-y-2'>
              <Label htmlFor='tenant' className='flex items-center gap-2'>
                <Building2 className='w-4 h-4' />
                Estabelecimento
              </Label>
              {loadingTenants ? (
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Carregando estabelecimentos...
                </div>
              ) : (
                <Select
                  value={selectedTenant}
                  onValueChange={(value) => {
                    setSelectedTenant(value);
                    setSelectedService('');
                    setSelectedStaff('');
                  }}
                >
                  <SelectTrigger id='tenant'>
                    <SelectValue placeholder='Selecione o estabelecimento' />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants?.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Seleção de Serviço */}
            {selectedTenant && (
              <div className='space-y-2'>
                <Label htmlFor='service'>Serviço</Label>
                {loadingServices ? (
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Carregando serviços...
                  </div>
                ) : (
                  <Select
                    value={selectedService}
                    onValueChange={setSelectedService}
                  >
                    <SelectTrigger id='service'>
                      <SelectValue placeholder='Selecione o serviço' />
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className='flex flex-col'>
                            <span>{service.name}</span>
                            <span className='text-xs text-muted-foreground'>
                              {service.duration} min - R${' '}
                              {service.price.toFixed(2)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {selectedServiceData && (
                  <div className='p-3 bg-muted rounded-lg space-y-1'>
                    <p className='text-sm'>
                      <strong>Duração:</strong> {selectedServiceData.duration}{' '}
                      minutos
                    </p>
                    <p className='text-sm'>
                      <strong>Valor:</strong> R${' '}
                      {selectedServiceData.price.toFixed(2)}
                    </p>
                    {selectedServiceData.description && (
                      <p className='text-sm'>
                        <strong>Descrição:</strong>{' '}
                        {selectedServiceData.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Seleção de Profissional */}
            {selectedService && (
              <div className='space-y-2'>
                <Label htmlFor='staff'>Profissional</Label>
                {loadingStaff ? (
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Carregando profissionais...
                  </div>
                ) : (
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger id='staff'>
                      <SelectValue placeholder='Selecione o profissional' />
                    </SelectTrigger>
                    <SelectContent>
                      {staff?.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className='flex flex-col'>
                            <span>{member.name}</span>
                            <span className='text-xs text-muted-foreground'>
                              {member.role}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Data e Hora */}
            {selectedStaff && (
              <>
                <div className='space-y-2'>
                  <Label htmlFor='date' className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    Data
                  </Label>
                  <Input
                    id='date'
                    type='date'
                    min={minDate}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='time' className='flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    Horário
                  </Label>
                  <Input
                    id='time'
                    type='time'
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/* Botões */}
            <div className='flex gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                className='flex-1'
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='flex-1'
                disabled={
                  createAppointment.isPending ||
                  !selectedTenant ||
                  !selectedService ||
                  !selectedStaff ||
                  !scheduledDate ||
                  !scheduledTime
                }
              >
                {createAppointment.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Criando...
                  </>
                ) : (
                  'Confirmar Agendamento'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
