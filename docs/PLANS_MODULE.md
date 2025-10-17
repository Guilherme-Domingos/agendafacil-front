# Módulo de Gerenciamento de Planos

Este módulo permite criar, listar, editar e excluir planos no sistema AgendaFácil.

## 📁 Estrutura de Arquivos

```
src/
├── hooks/
│   └── usePlans.ts                    # Hook customizado com TanStack Query
├── components/
│   └── ui/
│       └── textarea.tsx               # Componente Textarea
└── app/
    └── (authenticated)/
        └── dashboard/
            └── plans/
                ├── page.tsx           # Lista todos os planos
                ├── create/
                │   └── page.tsx       # Formulário de criação
                └── [id]/
                    └── edit/
                        └── page.tsx   # Formulário de edição
```

## 🚀 Rotas Disponíveis

- `/dashboard/plans` - Listagem de todos os planos
- `/dashboard/plans/create` - Criação de novo plano
- `/dashboard/plans/[id]/edit` - Edição de plano existente

## 🔧 Hook usePlans

O hook `usePlans` fornece todas as operações necessárias para gerenciar planos:

### Funções Disponíveis

- **`usePlans()`** - Busca todos os planos
- **`usePlan(id)`** - Busca um plano específico por ID
- **`useCreatePlan()`** - Cria um novo plano
- **`useUpdatePlan()`** - Atualiza um plano existente
- **`useDeletePlan()`** - Deleta um plano

### Exemplo de Uso

```typescript
import { usePlans, useCreatePlan } from '@/hooks/usePlans';

function MyComponent() {
  const { data: plans, isLoading } = usePlans();
  const createPlan = useCreatePlan();

  const handleCreate = async () => {
    await createPlan.mutateAsync({
      name: 'Plano Premium',
      description: 'Plano completo',
      price: 99.90,
      features: {
        maxUsers: 100,
        maxAppointments: 1000,
        support: true
      }
    });
  };

  // ...
}
```

## 📝 Estrutura de Dados

### Plan Interface

```typescript
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

### CreatePlanData

```typescript
interface CreatePlanData {
  name: string;
  description: string;
  price: number;
  features: Record<string, any>;
}
```

## 🎨 Funcionalidades

### Listagem de Planos (`/dashboard/plans`)
- Exibe todos os planos em cards organizados
- Mostra nome, descrição, preço e funcionalidades
- Botões de ação para editar e excluir
- Botão para criar novo plano

### Criação de Plano (`/dashboard/plans/create`)
- Formulário com validações
- Campos: Nome, Descrição, Preço
- Sistema dinâmico de funcionalidades (key-value pairs)
- Conversão automática de tipos (string, number, boolean)

### Edição de Plano (`/dashboard/plans/[id]/edit`)
- Carrega dados do plano existente
- Mesmo formulário da criação
- Pré-preenche todos os campos
- Atualização em tempo real

## 🔌 Integração com API

O módulo se integra com o backend através dos seguintes endpoints:

- `GET /plan` - Lista todos os planos
- `GET /plan/:id` - Busca um plano específico
- `POST /plan` - Cria um novo plano
- `PATCH /plan/:id` - Atualiza um plano
- `DELETE /plan/:id` - Remove um plano

## 💡 Dicas de Uso

### Adicionando Funcionalidades

As funcionalidades (features) são pares chave-valor flexíveis. Exemplos:

```
maxUsers = 100
maxAppointments = 1000
support = true
customDomain = false
priority = high
```

O sistema converte automaticamente:
- `"true"` → `true` (boolean)
- `"false"` → `false` (boolean)
- `"123"` → `123` (number)
- Outros → string

### Validações

- Todos os campos principais são obrigatórios
- Preço deve ser um número positivo
- Features podem ser vazias, mas se preenchidas devem ter chave e valor

## 🔄 Cache e Invalidação

O TanStack Query gerencia automaticamente o cache:

- Lista de planos é cacheada com a chave `['plans']`
- Planos individuais com `['plan', id]`
- Mutations invalidam os caches relacionados automaticamente

## 📱 Responsividade

As páginas são totalmente responsivas:
- Layout em grid adaptativo (1, 2 ou 3 colunas)
- Formulários otimizados para mobile
- Botões e cards ajustáveis

## 🎯 Próximos Passos

Sugestões de melhorias futuras:
- [ ] Adicionar paginação na listagem
- [ ] Implementar busca/filtros
- [ ] Toast notifications ao invés de alerts
- [ ] Validação de formulário com Zod
- [ ] Modal de confirmação customizado
- [ ] Visualização detalhada do plano
- [ ] Histórico de alterações
