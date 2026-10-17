/**
 * ============================================================================
 * INTERFACES TYPESCRIPT - BARBERFLOW PRO / BARBEARIA
 * ============================================================================
 */

export interface Barbeiro {
  id: string;
  nome: string;
  apelido: string;
  cargo?: string;
  especialidade?: string;
  foto: string;
  telefone?: string;
  comissaoServico?: number;
  comissaoProduto?: number;
  status: 'disponivel' | 'atendendo' | 'intervalo' | string;
  cadeira: string;
  faturamentoMes?: number;
  comissaoMes?: number;
  totalCortesHoje?: number;
  avaliacao?: number;
  ativo?: boolean;
}

export interface Cliente {
  id: string | number;
  nome: string;
  telefone: string;
  email?: string;
  totalVisitas?: number;
  selosFidelidade?: number;
  barbeiroPreferidoId?: string;
  ultimoCorte?: string;
  observacoes?: string;
}

export interface Servico {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  duracaoMin: number;
  descricao?: string;
  icone?: string;
}

export interface Agendamento {
  id?: string | number;
  clienteId: string | number | null;
  clienteNome: string;
  clienteTelefone: string;
  barbeiroId: string;
  servicos: Servico[];
  produtos?: any[];
  data: string;
  horario: string;
  duracaoTotalMin: number;
  valorTotal: number;
  status: 'confirmado' | 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | string;
  observacoes?: string;
  comandaId?: string | number | null;
}

export interface AgendamentoPayload {
  clienteId: string | number | null;
  clienteNome: string;
  clienteTelefone: string;
  barbeiroId: string;
  servicos: Servico[];
  produtos: any[];
  data: string;
  horario: string;
  duracaoTotalMin: number;
  valorTotal: number;
  status: string;
  observacoes: string;
  comandaId: string | number | null;
}

export interface SlotStatus {
  hora: string;
  disponivel: boolean;
  motivo?: string;
  ocupadoPor?: string;
}
