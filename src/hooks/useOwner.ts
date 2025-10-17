import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useSession } from '@/lib/auth-client';

export interface OwnerTenant {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    ownerEmail: string;
    planId: string;
    plan: {
      id: string;
      name: string;
      description: string;
      price: number;
    };
  };
}

// Hook para pegar informações do owner/manager logado
export const useOwnerInfo = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  return useQuery<OwnerTenant>({
    queryKey: ['owner-info', userEmail],
    queryFn: async () => {
      const { data } = await api.get(`/owner/by-email/${userEmail}`);
      return data;
    },
    enabled: !!userEmail,
  });
};
