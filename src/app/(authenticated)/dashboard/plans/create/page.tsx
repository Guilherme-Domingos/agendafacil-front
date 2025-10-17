'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePlan } from '@/hooks/usePlans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';

export default function CreatePlanPage() {
  const router = useRouter();
  const createPlan = useCreatePlan();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [features, setFeatures] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index: number, field: 'key' | 'value', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, { key: '', value: '' }]);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.name || !formData.description || !formData.price) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Converte as features para objeto
    const featuresObject = features.reduce((acc, feature) => {
      if (feature.key && feature.value) {
        // Tenta converter o valor para número ou boolean se aplicável
        let parsedValue: any = feature.value;
        if (feature.value === 'true') parsedValue = true;
        else if (feature.value === 'false') parsedValue = false;
        else if (!isNaN(Number(feature.value))) parsedValue = Number(feature.value);
        
        acc[feature.key] = parsedValue;
      }
      return acc;
    }, {} as Record<string, any>);

    try {
      await createPlan.mutateAsync({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        features: featuresObject,
      });

      alert('Plano criado com sucesso!');
      router.push('/dashboard/plans');
    } catch (error: any) {
      console.error('Erro ao criar plano:', error);
      alert(error.response?.data?.message || 'Erro ao criar plano');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Criar Novo Plano</h1>
        <p className="text-muted-foreground mt-2">
          Preencha as informações abaixo para criar um novo plano
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Plano</CardTitle>
          <CardDescription>
            Defina os detalhes e funcionalidades do plano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Plano */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome do Plano <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: Plano Premium"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva as principais características do plano"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="min-h-[100px]"
              />
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Preço Mensal (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="99.90"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Funcionalidades */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Funcionalidades</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input
                        placeholder="Nome da funcionalidade (ex: maxUsers)"
                        value={feature.key}
                        onChange={(e) => handleFeatureChange(index, 'key', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Valor (ex: 100, true, Suporte Premium)"
                        value={feature.value}
                        onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      disabled={features.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                Exemplos: maxUsers=100, maxAppointments=1000, support=true
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={createPlan.isPending}
                className="flex-1"
              >
                {createPlan.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Plano'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={createPlan.isPending}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
