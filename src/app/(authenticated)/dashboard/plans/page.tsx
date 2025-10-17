'use client';

import { usePlans, useDeletePlan } from '@/hooks/usePlans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlansPage() {
  const router = useRouter();
  const { data: plans, isLoading, error } = usePlans();
  const deletePlan = useDeletePlan();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o plano "${name}"?`)) {
      try {
        await deletePlan.mutateAsync(id);
        alert('Plano excluído com sucesso!');
      } catch (error: any) {
        console.error('Erro ao excluir plano:', error);
        alert(error.response?.data?.message || 'Erro ao excluir plano');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Erro ao carregar planos</CardTitle>
            <CardDescription>
              Ocorreu um erro ao buscar os planos. Por favor, tente novamente.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Planos</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie todos os planos disponíveis
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/plans/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {plans && plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum plano cadastrado ainda
            </p>
            <Button onClick={() => router.push('/dashboard/plans/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Plano
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">
                      R$ {plan.price.toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /mês
                      </span>
                    </p>
                  </div>

                  {plan.features && Object.keys(plan.features).length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Funcionalidades:</p>
                      <ul className="space-y-1">
                        {Object.entries(plan.features).map(([key, value]) => (
                          <li key={key} className="text-sm text-muted-foreground">
                            <span className="font-medium">{key}:</span>{' '}
                            {typeof value === 'boolean' 
                              ? (value ? '✓ Sim' : '✗ Não')
                              : String(value)
                            }
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/plans/${plan.id}/edit`)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(plan.id, plan.name)}
                      disabled={deletePlan.isPending}
                    >
                      {deletePlan.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
