import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  tenantId: string;
  createdAt: string;
  tenant?: {
    id: string;
    name: string;
  };
  appointments?: any[];
}

export interface CreateServiceData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  tenantId: string;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  tenantId?: string;
}

// Fetch all services
export const useServices = (tenantId?: string) => {
  return useQuery<Service[]>({
    queryKey: ['services', tenantId],
    queryFn: async () => {
      const url = tenantId ? `/service?tenantId=${tenantId}` : '/service';
      const { data } = await api.get(url);
      return data;
    },
  });
};

// Fetch single service
export const useService = (id: string) => {
  return useQuery<Service>({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data } = await api.get(`/service/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create service
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: CreateServiceData) => {
      const { data } = await api.post('/service', serviceData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

// Update service
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateServiceData }) => {
      const response = await api.patch(`/service/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service', variables.id] });
    },
  });
};

// Delete service
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/service/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
