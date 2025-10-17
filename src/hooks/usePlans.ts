import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanData {
  name: string;
  description: string;
  price: number;
  features: Record<string, any>;
}

export interface UpdatePlanData {
  name?: string;
  description?: string;
  price?: number;
  features?: Record<string, any>;
}

// Fetch all plans
export const usePlans = () => {
  return useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data } = await api.get('/plan');
      return data;
    },
  });
};

// Fetch single plan
export const usePlan = (id: string) => {
  return useQuery<Plan>({
    queryKey: ['plan', id],
    queryFn: async () => {
      const { data } = await api.get(`/plan/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create plan
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: CreatePlanData) => {
      const { data } = await api.post('/plan', planData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

// Update plan
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePlanData }) => {
      const response = await api.patch(`/plan/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['plan', variables.id] });
    },
  });
};

// Delete plan
export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/plan/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};
