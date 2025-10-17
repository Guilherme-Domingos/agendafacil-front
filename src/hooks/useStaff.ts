import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    name: string;
  };
  availableSlots?: any[];
  appointments?: any[];
}

export interface CreateStaffData {
  name: string;
  role: string;
  email: string;
  password?: string;
  tenantId: string;
}

export interface UpdateStaffData {
  name?: string;
  role?: string;
  email?: string;
  password?: string;
  tenantId?: string;
}

// Fetch all staff
export const useStaff = (tenantId?: string) => {
  return useQuery<Staff[]>({
    queryKey: ['staff', tenantId],
    queryFn: async () => {
      const url = tenantId ? `/staff?tenantId=${tenantId}` : '/staff';
      const { data } = await api.get(url);
      return data;
    },
  });
};

// Fetch single staff member
export const useStaffMember = (id: string) => {
  return useQuery<Staff>({
    queryKey: ['staff', id],
    queryFn: async () => {
      const { data } = await api.get(`/staff/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create staff
export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (staffData: CreateStaffData) => {
      const { data } = await api.post('/staff', staffData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

// Update staff
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateStaffData }) => {
      const response = await api.patch(`/staff/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff', variables.id] });
    },
  });
};

// Delete staff
export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/staff/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};
