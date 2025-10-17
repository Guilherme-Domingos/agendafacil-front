import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Owner {
  id: string;
  email: string;
  name: string;
  tenantId: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
}

export interface Tenant {
  id: string;
  name: string;
  planId: string;
  createdAt: string;
  updatedAt: string;
  plan?: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
  owners?: Owner[];
  services?: Service[];
  staff?: Staff[];
}

export interface CreateTenantData {
  name: string;
  ownerEmail: string;
  planId: string;
}

export interface UpdateTenantData {
  name?: string;
  planId?: string;
}

// Fetch all tenants
export const useTenants = () => {
  return useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data } = await api.get('/tenant');
      return data;
    },
  });
};

// Fetch single tenant
export const useTenant = (id: string) => {
  return useQuery<Tenant>({
    queryKey: ['tenant', id],
    queryFn: async () => {
      const { data } = await api.get(`/tenant/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create tenant mutation
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenantData: CreateTenantData) => {
      const { data } = await api.post('/tenant', tenantData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};

// Update tenant mutation
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTenantData;
    }) => {
      const response = await api.patch(`/tenant/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', variables.id] });
    },
  });
};

// Delete tenant mutation
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/tenant/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
};
