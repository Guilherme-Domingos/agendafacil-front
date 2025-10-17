import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  staffId: string;
  scheduledAt: string;
  status: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  service?: {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
  };
  staff?: {
    id: string;
    name: string;
    role: string;
  };
  tenant?: {
    id: string;
    name: string;
  };
}

export interface CreateAppointmentData {
  userId: string;
  serviceId: string;
  staffId: string;
  scheduledAt: string;
  tenantId: string;
}

export interface UpdateAppointmentData {
  serviceId?: string;
  staffId?: string;
  scheduledAt?: string;
  status?: string;
}

// Fetch all appointments for the current user
export const useAppointments = (userId?: string) => {
  return useQuery<Appointment[]>({
    queryKey: ['appointments', userId],
    queryFn: async () => {
      const url = userId ? `/appointment?userId=${userId}` : '/appointment';
      const { data } = await api.get(url);
      return data;
    },
  });
};

// Fetch appointments by tenant
export const useAppointmentsByTenant = (tenantId: string) => {
  return useQuery<Appointment[]>({
    queryKey: ['appointments', 'tenant', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/appointment?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

// Fetch single appointment
export const useAppointment = (id: string) => {
  return useQuery<Appointment>({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const { data } = await api.get(`/appointment/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: CreateAppointmentData) => {
      const { data } = await api.post('/appointment', appointmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Update appointment
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAppointmentData;
    }) => {
      const response = await api.patch(`/appointment/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
    },
  });
};

// Cancel appointment
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/appointment/${id}`, {
        status: 'cancelled',
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Delete appointment
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/appointment/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
