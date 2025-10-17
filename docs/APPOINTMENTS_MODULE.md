# Sistema de Agendamentos Multi-Tenant

## 📋 Resumo das Alterações

Este documento descreve as alterações feitas para permitir que usuários façam agendamentos em múltiplos tenants sem precisar criar várias contas.

---

## 🗄️ Backend - Alterações no Banco de Dados

### Schema Prisma Modificado

#### 1. Removida relação direta User ↔ Tenant

**Antes:**
```prisma
model User {
  tenantId  String?
  tenant    Tenant?  @relation(fields: [tenantId], references: [id])
}

model Tenant {
  users  User[]
}
```

**Depois:**
```prisma
model User {
  userTenants  UserTenant[]  // Relação muitos-para-muitos
}

model Tenant {
  userTenants  UserTenant[]  // Relação muitos-para-muitos
}
```

#### 2. Criado modelo UserTenant (tabela intermediária)

```prisma
model UserTenant {
  id        String   @id @default(uuid())
  userId    String
  tenantId  String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, tenantId])
  @@map("user_tenant")
}
```

### Migration Executada

A migration `20251017185810_add_user_tenant_relation` foi criada e aplicada com sucesso:

1. ✅ Criou a tabela `user_tenant`
2. ✅ Migrou dados existentes de `user.tenantId` para `user_tenant`
3. ✅ Removeu a coluna `tenantId` da tabela `user`
4. ✅ Adicionou coluna `updatedAt` na tabela `Tenant`

---

## 🎨 Frontend - Novas Funcionalidades

### 1. Hook Customizado: `useAppointments.ts`

Localização: `src/hooks/useAppointments.ts`

**Funcionalidades:**
- ✅ `useAppointments(userId)` - Buscar todos os agendamentos do usuário
- ✅ `useAppointmentsByTenant(tenantId)` - Buscar agendamentos por tenant
- ✅ `useAppointment(id)` - Buscar agendamento específico
- ✅ `useCreateAppointment()` - Criar novo agendamento
- ✅ `useUpdateAppointment()` - Atualizar agendamento
- ✅ `useCancelAppointment()` - Cancelar agendamento
- ✅ `useDeleteAppointment()` - Deletar agendamento

### 2. Página: Novo Agendamento

Localização: `src/app/(user_Auth)/agendamentos/novo/page.tsx`

**Recursos:**
- 🏢 Seleção de estabelecimento (tenant)
- 💼 Seleção de serviço com informações (preço, duração, descrição)
- 👤 Seleção de profissional (staff)
- 📅 Seleção de data (não permite datas passadas)
- ⏰ Seleção de horário
- ✅ Validação de campos obrigatórios
- 🔄 Loading states durante busca de dados
- 🎯 Navegação automática após sucesso

**Fluxo:**
1. Usuário seleciona o estabelecimento
2. Carrega serviços daquele tenant
3. Usuário seleciona o serviço (mostra detalhes)
4. Carrega profissionais daquele tenant
5. Usuário seleciona profissional, data e hora
6. Confirmação cria o agendamento

### 3. Página: Meus Agendamentos

Localização: `src/app/(user_Auth)/meus-agendamentos/page.tsx`

**Recursos:**
- 📊 Listagem de todos os agendamentos do usuário
- 🔄 Separação: Próximos vs Histórico
- 🎨 Status visuais:
  - 🟡 Pendente (pending)
  - 🟢 Confirmado (confirmed)
  - 🔴 Cancelado (cancelled)
  - 🔵 Concluído (completed)
- 📋 Informações completas:
  - Estabelecimento
  - Serviço
  - Profissional
  - Data e hora
  - Valor
- ❌ Cancelamento de agendamentos (com confirmação)
- 📱 Layout responsivo

### 4. Dashboard do Usuário Atualizado

Localização: `src/app/(user_Auth)/user-dashboard/page.tsx`

**Melhorias:**
- 📊 Estatísticas reais:
  - Total de agendamentos
  - Pendentes
  - Concluídos
- 📅 Próximos 3 agendamentos
- 🔄 Loading states
- 🔗 Links para criar e ver agendamentos

### 5. Componente: Alert Dialog

Localização: `src/components/ui/alert-dialog.tsx`

Componente Radix UI para confirmações (usado no cancelamento de agendamentos).

---

## 📦 Dependências Adicionadas

```bash
npm install @radix-ui/react-alert-dialog date-fns
```

- **@radix-ui/react-alert-dialog**: Componente de diálogo de confirmação
- **date-fns**: Biblioteca para formatação de datas em português

---

## 🚀 Como Usar

### Para o Usuário Final

1. **Acessar o Dashboard**
   - Faça login na aplicação
   - Será redirecionado para `/user-dashboard`

2. **Criar um Novo Agendamento**
   - Clique em "Novo Agendamento" ou acesse `/agendamentos/novo`
   - Selecione o estabelecimento desejado
   - Escolha o serviço
   - Escolha o profissional
   - Selecione data e horário
   - Confirme o agendamento

3. **Visualizar Agendamentos**
   - Clique em "Meus Agendamentos" ou acesse `/meus-agendamentos`
   - Veja todos os seus agendamentos organizados
   - Cancele agendamentos se necessário

### Multi-Tenant

O usuário agora pode:
- ✅ Fazer agendamentos em **múltiplos estabelecimentos**
- ✅ Usar a **mesma conta** para todos os agendamentos
- ✅ Ver todos os agendamentos em um único lugar
- ✅ Trocar entre estabelecimentos facilmente

---

## 🔧 Próximos Passos (Sugestões)

1. **Slots de Horário Disponíveis**
   - Integrar com `AvailableSlot` para mostrar apenas horários disponíveis
   - Implementar validação de conflitos de horário

2. **Notificações**
   - Email de confirmação ao criar agendamento
   - Lembrete antes do agendamento
   - Notificação de cancelamento

3. **Avaliações**
   - Sistema de avaliação de serviços
   - Feedback após agendamentos concluídos

4. **Filtros e Busca**
   - Filtrar agendamentos por período
   - Buscar por estabelecimento ou serviço
   - Exportar histórico

5. **Reagendamento**
   - Permitir alterar data/hora de agendamentos

6. **Favoritos**
   - Marcar estabelecimentos favoritos
   - Acesso rápido a serviços frequentes

---

## 📝 Notas Técnicas

### Backend
- A migration preservou os dados existentes migrando automaticamente
- Relacionamento com `onDelete: Cascade` garante limpeza automática
- Índice único `@@unique([userId, tenantId])` previne duplicações

### Frontend
- Uso de React Query para cache e sincronização
- Loading states em todas as operações assíncronas
- Toast notifications para feedback ao usuário
- Formatação de datas em português brasileiro

---

## ✅ Status da Implementação

- [x] Schema do banco atualizado
- [x] Migration criada e aplicada
- [x] Hook de appointments criado
- [x] Página de novo agendamento
- [x] Página de listagem de agendamentos
- [x] Dashboard atualizado com dados reais
- [x] Componentes UI necessários
- [x] Validações e tratamento de erros
- [x] Loading states
- [x] Responsividade

---

## 🎯 Conclusão

A funcionalidade de agendamentos multi-tenant foi implementada com sucesso! Os usuários agora podem:
- Criar agendamentos em diferentes estabelecimentos
- Gerenciar todos os agendamentos em um único local
- Visualizar informações detalhadas de cada agendamento
- Cancelar agendamentos quando necessário

Tudo isso usando uma única conta! 🎉
