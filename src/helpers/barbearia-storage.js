/**
 * ============================================================================
 * SERVIÇO DE DADOS - BARBERFLOW PRO / ADMIN BARBEARIA
 * Armazenamento Local Reativo com Mock Completo
 * ============================================================================
 */

const STORAGE_KEYS = {
  BARBEIROS: 'barber_barbeiros',
  SERVICOS: 'barber_servicos',
  PRODUTOS: 'barber_produtos',
  CLIENTES: 'barber_clientes',
  AGENDAMENTOS: 'barber_agendamentos',
  COMANDAS: 'barber_comandas',
  FINANCEIRO: 'barber_financeiro',
  CONFIG: 'barber_config'
};

const BARBEIROS_INICIAIS = [
  {
    id: 'barb-1',
    nome: 'Carlos "Navalha" Mendes',
    apelido: 'Carlinhos Navalha',
    cargo: 'Master Barber & Sócio',
    especialidade: 'Degradê Navalhado, Visagismo e Barboterapia',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    telefone: '(11) 98765-4321',
    comissaoServico: 55, // 55%
    comissaoProduto: 15, // 15%
    status: 'atendendo', // 'disponivel', 'atendendo', 'intervalo'
    cadeira: 'Cadeira 01 (Vip)',
    faturamentoMes: 8450.00,
    comissaoMes: 4647.50,
    totalCortesHoje: 6,
    avaliacao: 4.9,
    ativo: true
  },
  {
    id: 'barb-2',
    nome: 'Lucas "Fade" Ferreira',
    apelido: 'Lucas Fade',
    cargo: 'Barbeiro Especialista',
    especialidade: 'Skin Fade, Taper Fade e Freestyle / Riscos',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    telefone: '(11) 97654-3210',
    comissaoServico: 50,
    comissaoProduto: 15,
    status: 'disponivel',
    cadeira: 'Cadeira 02',
    faturamentoMes: 6890.00,
    comissaoMes: 3445.00,
    totalCortesHoje: 4,
    avaliacao: 4.8,
    ativo: true
  },
  {
    id: 'barb-3',
    nome: 'Rafael "Barba Negra" Costa',
    apelido: 'Rafa Costa',
    cargo: 'Barbeiro Visagista',
    especialidade: 'Alinhamento de Barba, Toalha Quente e Selagem',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    telefone: '(11) 96543-2109',
    comissaoServico: 50,
    comissaoProduto: 15,
    status: 'atendendo',
    cadeira: 'Cadeira 03',
    faturamentoMes: 7200.00,
    comissaoMes: 3600.00,
    totalCortesHoje: 5,
    avaliacao: 4.95,
    ativo: true
  },
  {
    id: 'barb-4',
    nome: 'Gabriel Santos',
    apelido: 'Biel Barber',
    cargo: 'Barbeiro Junior',
    especialidade: 'Corte Tradicional, Barba Simples e Sobrancelha',
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    telefone: '(11) 95432-1098',
    comissaoServico: 45,
    comissaoProduto: 10,
    status: 'intervalo',
    cadeira: 'Cadeira 04',
    faturamentoMes: 4950.00,
    comissaoMes: 2227.50,
    totalCortesHoje: 3,
    avaliacao: 4.7,
    ativo: true
  }
];

const SERVICOS_INICIAIS = [
  {
    id: 'serv-1',
    nome: 'Degradê / Fade Navalhado',
    categoria: 'Cabelo',
    preco: 60.00,
    duracaoMin: 45,
    descricao: 'Corte moderno com técnica de transição perfeita, finalização com navalha e pomada premium.',
    icone: 'ri-scissors-2-line'
  },
  {
    id: 'serv-2',
    nome: 'Corte Clássico / Social',
    categoria: 'Cabelo',
    preco: 50.00,
    duracaoMin: 35,
    descricao: 'Corte tesoura e máquina tradicional com acabamento no pezinho e penteado.',
    icone: 'ri-scissors-cut-line'
  },
  {
    id: 'serv-3',
    nome: 'Barboterapia com Toalha Quente',
    categoria: 'Barba',
    preco: 45.00,
    duracaoMin: 35,
    descricao: 'Higienização, toalha quente com vapor aromatizado, navalhamento preciso e balm hidratante.',
    icone: 'ri-fire-line'
  },
  {
    id: 'serv-4',
    nome: 'Combo Cabelo + Barba Premium',
    categoria: 'Combo',
    preco: 95.00,
    duracaoMin: 65,
    descricao: 'O pacote completo da casa: Corte Fade + Barba completa + Lavagem especial + 1 Cerveja cortesia.',
    icone: 'ri-vip-crown-line'
  },
  {
    id: 'serv-5',
    nome: 'Pigmentação de Cabelo / Barba',
    categoria: 'Química',
    preco: 40.00,
    duracaoMin: 25,
    descricao: 'Disfarce de falhas e fios brancos com efeito natural e duradouro.',
    icone: 'ri-brush-line'
  },
  {
    id: 'serv-6',
    nome: 'Alisamento / Selagem Orgânica',
    categoria: 'Química',
    preco: 110.00,
    duracaoMin: 60,
    descricao: 'Tratamento anti-frizz e redução de volume com brilho natural.',
    icone: 'ri-sparkling-fill'
  },
  {
    id: 'serv-7',
    nome: 'Design de Sobrancelha na Navalha',
    categoria: 'Estética',
    preco: 25.00,
    duracaoMin: 15,
    descricao: 'Alinhamento masculino e limpeza dos pelos em excesso.',
    icone: 'ri-eye-line'
  },
  {
    id: 'serv-8',
    nome: 'Hidratação Profunda & Lavatório',
    categoria: 'Estética',
    preco: 35.00,
    duracaoMin: 20,
    descricao: 'Massagem capilar refrescante com máscara reconstrutora e mentolada.',
    icone: 'ri-drop-line'
  }
];

const PRODUTOS_INICIAIS = [
  {
    id: 'prod-1',
    nome: 'Pomada Efeito Matte 120g',
    marca: 'BarberFlow Lab',
    categoria: 'Cabelo',
    precoVenda: 45.00,
    precoCusto: 18.00,
    estoque: 28,
    estoqueMinimo: 10,
    codigoBarras: '7891234567891'
  },
  {
    id: 'prod-2',
    nome: 'Óleo para Barba Amadeirado 30ml',
    marca: 'BarberFlow Lab',
    categoria: 'Barba',
    precoVenda: 38.00,
    precoCusto: 15.00,
    estoque: 19,
    estoqueMinimo: 8,
    codigoBarras: '7891234567892'
  },
  {
    id: 'prod-3',
    nome: 'Balm Pós-Barba Refrescante 140ml',
    marca: 'BarberFlow Lab',
    categoria: 'Barba',
    precoVenda: 42.00,
    precoCusto: 16.50,
    estoque: 14,
    estoqueMinimo: 8,
    codigoBarras: '7891234567893'
  },
  {
    id: 'prod-4',
    nome: 'Shampoo Anticaspa Mentolado 250ml',
    marca: 'BarberFlow Lab',
    categoria: 'Cabelo',
    precoVenda: 48.00,
    precoCusto: 21.00,
    estoque: 5, // Alerta baixo!
    estoqueMinimo: 8,
    codigoBarras: '7891234567894'
  },
  {
    id: 'prod-5',
    nome: 'Loção Fortalecedora Minoxidil 5%',
    marca: 'Kirkland Import',
    categoria: 'Tratamento',
    precoVenda: 95.00,
    precoCusto: 48.00,
    estoque: 4, // Alerta baixo!
    estoqueMinimo: 6,
    codigoBarras: '7891234567895'
  },
  {
    id: 'prod-6',
    nome: 'Cerveja Artesanal IPA 500ml (Lounge)',
    marca: 'Cervejaria Barber',
    categoria: 'Bebidas',
    precoVenda: 18.00,
    precoCusto: 9.00,
    estoque: 42,
    estoqueMinimo: 15,
    codigoBarras: '7891234567896'
  },
  {
    id: 'prod-7',
    nome: 'Cerveja Heineken Long Neck 330ml',
    marca: 'Heineken',
    categoria: 'Bebidas',
    precoVenda: 12.00,
    precoCusto: 5.80,
    estoque: 56,
    estoqueMinimo: 20,
    codigoBarras: '7891234567897'
  },
  {
    id: 'prod-8',
    nome: 'Energético Red Bull Tradicional 250ml',
    marca: 'Red Bull',
    categoria: 'Bebidas',
    precoVenda: 14.00,
    precoCusto: 7.20,
    estoque: 24,
    estoqueMinimo: 10,
    codigoBarras: '7891234567898'
  }
];

const CLIENTES_INICIAIS = [
  {
    id: 'cli-1',
    nome: 'Rodrigo Alcantara',
    telefone: '(11) 99123-4567',
    email: 'rodrigo.alcantara@email.com',
    foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    totalVisitas: 14,
    selosFidelidade: 8, // 8 de 10
    totalGasto: 1280.00,
    barbeiroPreferidoId: 'barb-1',
    planoVip: true,
    planoNome: 'Clube Barber Black (Ilimitado)',
    ultimaVisita: '2026-10-12',
    frequenciaMediaDias: 15,
    observacoes: 'Gosta de café expresso duplo ao chegar. Máquina 1 disfarçada nas laterais e tesoura em cima.'
  },
  {
    id: 'cli-2',
    nome: 'Matheus Henrique Silveira',
    telefone: '(11) 98234-5678',
    email: 'matheus.silveira@email.com',
    foto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    totalVisitas: 9,
    selosFidelidade: 9, // Próximo é grátis!
    totalGasto: 740.00,
    barbeiroPreferidoId: 'barb-2',
    planoVip: false,
    planoNome: null,
    ultimaVisita: '2026-10-04',
    frequenciaMediaDias: 18,
    observacoes: 'Pele muito sensível no pescoço. Aplicar toalha morna e pós-barba calmante.'
  },
  {
    id: 'cli-3',
    nome: 'Thiago Bernardes',
    telefone: '(11) 97345-6789',
    email: 'thiago.b@email.com',
    foto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    totalVisitas: 18,
    selosFidelidade: 3,
    totalGasto: 1650.00,
    barbeiroPreferidoId: 'barb-3',
    planoVip: true,
    planoNome: 'Clube Barba & Chopp',
    ultimaVisita: '2026-10-14',
    frequenciaMediaDias: 12,
    observacoes: 'Barba longa alinhada no formato lenhador. Sempre consome cerveja IPA no lounge.'
  },
  {
    id: 'cli-4',
    nome: 'Felipe Augusto Rocha',
    telefone: '(11) 96456-7890',
    email: 'felipe.rocha@email.com',
    foto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    totalVisitas: 5,
    selosFidelidade: 5,
    totalGasto: 350.00,
    barbeiroPreferidoId: 'barb-1',
    planoVip: false,
    planoNome: null,
    ultimaVisita: '2026-09-02', // Mais de 40 dias sem vir (Cliente para Resgate!)
    frequenciaMediaDias: 20,
    observacoes: 'Gosta de risquinho na sobrancelha direita e degradê navalhado.'
  },
  {
    id: 'cli-5',
    nome: 'Eduardo Martins',
    telefone: '(11) 95567-8901',
    email: 'edu.martins@email.com',
    foto: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
    totalVisitas: 2,
    selosFidelidade: 2,
    totalGasto: 190.00,
    barbeiroPreferidoId: 'barb-4',
    planoVip: false,
    planoNome: null,
    ultimaVisita: '2026-10-15',
    frequenciaMediaDias: 30,
    observacoes: 'Novo cliente, indicado pelo Rodrigo Alcantara.'
  }
];

const hojeStr = new Date().toISOString().split('T')[0];

const AGENDAMENTOS_INICIAIS = [
  {
    id: 'ag-101',
    clienteId: 'cli-1',
    clienteNome: 'Rodrigo Alcantara',
    clienteTelefone: '(11) 99123-4567',
    barbeiroId: 'barb-1',
    servicos: [
      { id: 'serv-4', nome: 'Combo Cabelo + Barba Premium', preco: 95.00, duracaoMin: 65 }
    ],
    produtos: [
      { id: 'prod-6', nome: 'Cerveja Artesanal IPA 500ml', preco: 18.00, qtd: 1 }
    ],
    data: hojeStr,
    horario: '16:00',
    duracaoTotalMin: 65,
    valorTotal: 113.00,
    status: 'em_atendimento', // 'aguardando', 'em_atendimento', 'concluido', 'cancelado'
    observacoes: 'Corte agendado pelo WhatsApp, cerveja de cortesia já entregue.',
    comandaId: 'cmd-501'
  },
  {
    id: 'ag-102',
    clienteId: 'cli-3',
    clienteNome: 'Thiago Bernardes',
    clienteTelefone: '(11) 97345-6789',
    barbeiroId: 'barb-3',
    servicos: [
      { id: 'serv-3', nome: 'Barboterapia com Toalha Quente', preco: 45.00, duracaoMin: 35 },
      { id: 'serv-5', nome: 'Pigmentação de Cabelo / Barba', preco: 40.00, duracaoMin: 25 }
    ],
    produtos: [],
    data: hojeStr,
    horario: '16:15',
    duracaoTotalMin: 60,
    valorTotal: 85.00,
    status: 'em_atendimento',
    observacoes: 'Alinhamento especial para evento amanhã.',
    comandaId: 'cmd-502'
  },
  {
    id: 'ag-103',
    clienteId: 'cli-2',
    clienteNome: 'Matheus Henrique Silveira',
    clienteTelefone: '(11) 98234-5678',
    barbeiroId: 'barb-2',
    servicos: [
      { id: 'serv-1', nome: 'Degradê / Fade Navalhado', preco: 60.00, duracaoMin: 45 }
    ],
    produtos: [],
    data: hojeStr,
    horario: '17:00',
    duracaoTotalMin: 45,
    valorTotal: 60.00,
    status: 'aguardando', // Lounge / esperando
    observacoes: 'Chegou adiantado no lounge jogando sinuca.',
    comandaId: null
  },
  {
    id: 'ag-104',
    clienteId: 'cli-5',
    clienteNome: 'Eduardo Martins',
    clienteTelefone: '(11) 95567-8901',
    barbeiroId: 'barb-4',
    servicos: [
      { id: 'serv-2', nome: 'Corte Clássico / Social', preco: 50.00, duracaoMin: 35 },
      { id: 'serv-7', nome: 'Design de Sobrancelha', preco: 25.00, duracaoMin: 15 }
    ],
    produtos: [],
    data: hojeStr,
    horario: '17:30',
    duracaoTotalMin: 50,
    valorTotal: 75.00,
    status: 'confirmado',
    observacoes: 'Confirmou presença por WhatsApp.',
    comandaId: null
  },
  {
    id: 'ag-105',
    clienteId: null,
    clienteNome: 'Bruno Mendonça (Avulso)',
    clienteTelefone: '(11) 94321-8765',
    barbeiroId: 'barb-1',
    servicos: [
      { id: 'serv-1', nome: 'Degradê / Fade Navalhado', preco: 60.00, duracaoMin: 45 }
    ],
    produtos: [],
    data: hojeStr,
    horario: '18:15',
    duracaoTotalMin: 45,
    valorTotal: 60.00,
    status: 'confirmado',
    observacoes: 'Primeira vez na barbearia.',
    comandaId: null
  },
  {
    id: 'ag-106',
    clienteId: 'cli-4',
    clienteNome: 'Felipe Augusto Rocha',
    clienteTelefone: '(11) 96456-7890',
    barbeiroId: 'barb-2',
    servicos: [
      { id: 'serv-4', nome: 'Combo Cabelo + Barba Premium', preco: 95.00, duracaoMin: 65 }
    ],
    produtos: [],
    data: hojeStr,
    horario: '14:00',
    duracaoTotalMin: 65,
    valorTotal: 95.00,
    status: 'concluido',
    observacoes: 'Atendimento finalizado com sucesso.',
    comandaId: 'cmd-499'
  }
];

const COMANDAS_INICIAIS = [
  {
    id: 'cmd-501',
    numero: '#0501',
    clienteNome: 'Rodrigo Alcantara',
    clienteTelefone: '(11) 99123-4567',
    barbeiroId: 'barb-1',
    barbeiroNome: 'Carlos "Navalha" Mendes',
    dataHora: `${hojeStr} 16:02`,
    servicos: [
      { id: 'serv-4', nome: 'Combo Cabelo + Barba Premium', preco: 95.00, qtd: 1 }
    ],
    produtos: [
      { id: 'prod-6', nome: 'Cerveja Artesanal IPA 500ml', preco: 18.00, qtd: 1 },
      { id: 'prod-1', nome: 'Pomada Efeito Matte 120g', preco: 45.00, qtd: 1 }
    ],
    subtotal: 158.00,
    desconto: 0.00,
    total: 158.00,
    status: 'aberta', // 'aberta', 'fechada'
    formaPagamento: null,
    comissaoBarbeiroServico: 52.25, // 55% de 95
    comissaoBarbeiroProduto: 9.45  // 15% de 63
  },
  {
    id: 'cmd-502',
    numero: '#0502',
    clienteNome: 'Thiago Bernardes',
    clienteTelefone: '(11) 97345-6789',
    barbeiroId: 'barb-3',
    barbeiroNome: 'Rafael "Barba Negra" Costa',
    dataHora: `${hojeStr} 16:16`,
    servicos: [
      { id: 'serv-3', nome: 'Barboterapia com Toalha Quente', preco: 45.00, qtd: 1 },
      { id: 'serv-5', nome: 'Pigmentação de Cabelo / Barba', preco: 40.00, qtd: 1 }
    ],
    produtos: [
      { id: 'prod-7', nome: 'Cerveja Heineken Long Neck', preco: 12.00, qtd: 1 }
    ],
    subtotal: 97.00,
    desconto: 0.00,
    total: 97.00,
    status: 'aberta',
    formaPagamento: null,
    comissaoBarbeiroServico: 42.50, // 50% de 85
    comissaoBarbeiroProduto: 1.80  // 15% de 12
  },
  {
    id: 'cmd-499',
    numero: '#0499',
    clienteNome: 'Felipe Augusto Rocha',
    clienteTelefone: '(11) 96456-7890',
    barbeiroId: 'barb-2',
    barbeiroNome: 'Lucas "Fade" Ferreira',
    dataHora: `${hojeStr} 14:05`,
    servicos: [
      { id: 'serv-4', nome: 'Combo Cabelo + Barba Premium', preco: 95.00, qtd: 1 }
    ],
    produtos: [],
    subtotal: 95.00,
    desconto: 5.00,
    total: 90.00,
    status: 'fechada',
    formaPagamento: 'PIX',
    comissaoBarbeiroServico: 47.50,
    comissaoBarbeiroProduto: 0.00
  }
];

const FINANCEIRO_INICIAL = [
  {
    id: 'fin-1',
    tipo: 'receita',
    categoria: 'Serviços & Atendimentos',
    descricao: 'Fechamento Comanda #0499 - Felipe Rocha',
    valor: 90.00,
    formaPagamento: 'PIX',
    data: `${hojeStr} 15:10`,
    status: 'concluido'
  },
  {
    id: 'fin-2',
    tipo: 'receita',
    categoria: 'Serviços & Atendimentos',
    descricao: 'Atendimento Balcão - Corte Degradê + Pomada',
    valor: 105.00,
    formaPagamento: 'Cartão de Crédito',
    data: `${hojeStr} 13:30`,
    status: 'concluido'
  },
  {
    id: 'fin-3',
    tipo: 'receita',
    categoria: 'Clube de Assinatura VIP',
    descricao: 'Mensalidade Clube Barber Black - Rodrigo Alcantara',
    valor: 199.90,
    formaPagamento: 'PIX Recorrente',
    data: `${hojeStr} 09:00`,
    status: 'concluido'
  },
  {
    id: 'fin-4',
    tipo: 'despesa',
    categoria: 'Insumos & Produtos Barbearia',
    descricao: 'Compra de Lâminas descartáveis, toalhas e golas higiênicas',
    valor: 240.00,
    formaPagamento: 'Boleto / Débito',
    data: `${hojeStr} 11:00`,
    status: 'concluido'
  },
  {
    id: 'fin-5',
    tipo: 'despesa',
    categoria: 'Frigobar & Bebidas',
    descricao: 'Reposição de 3 engradados Heineken e Red Bull',
    valor: 185.00,
    formaPagamento: 'PIX',
    data: `${hojeStr} 10:15`,
    status: 'concluido'
  }
];

export const BarbeariaStorage = {
  // Inicialização no LocalStorage
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.BARBEIROS)) {
      localStorage.setItem(STORAGE_KEYS.BARBEIROS, JSON.stringify(BARBEIROS_INICIAIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICOS)) {
      localStorage.setItem(STORAGE_KEYS.SERVICOS, JSON.stringify(SERVICOS_INICIAIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUTOS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(PRODUTOS_INICIAIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLIENTES)) {
      localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(CLIENTES_INICIAIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AGENDAMENTOS)) {
      localStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(AGENDAMENTOS_INICIAIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMANDAS)) {
      localStorage.setItem(STORAGE_KEYS.COMANDAS, JSON.stringify(COMANDAS_INICIAIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FINANCEIRO)) {
      localStorage.setItem(STORAGE_KEYS.FINANCEIRO, JSON.stringify(FINANCEIRO_INICIAL));
    }
  },

  // Reset para dados de fábrica
  resetAll() {
    localStorage.setItem(STORAGE_KEYS.BARBEIROS, JSON.stringify(BARBEIROS_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.SERVICOS, JSON.stringify(SERVICOS_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(PRODUTOS_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(CLIENTES_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(AGENDAMENTOS_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.COMANDAS, JSON.stringify(COMANDAS_INICIAIS));
    localStorage.setItem(STORAGE_KEYS.FINANCEIRO, JSON.stringify(FINANCEIRO_INICIAL));
  },

  // BARBEIROS
  getBarbeiros() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BARBEIROS) || '[]');
  },
  saveBarbeiro(barbeiro) {
    const barbeiros = this.getBarbeiros();
    const index = barbeiros.findIndex(b => b.id === barbeiro.id);
    if (index >= 0) {
      barbeiros[index] = { ...barbeiros[index], ...barbeiro };
    } else {
      barbeiro.id = 'barb-' + Date.now();
      barbeiros.push(barbeiro);
    }
    localStorage.setItem(STORAGE_KEYS.BARBEIROS, JSON.stringify(barbeiros));
    return barbeiro;
  },
  updateBarbeiroStatus(id, status) {
    const barbeiros = this.getBarbeiros();
    const b = barbeiros.find(item => item.id === id);
    if (b) {
      b.status = status;
      localStorage.setItem(STORAGE_KEYS.BARBEIROS, JSON.stringify(barbeiros));
    }
  },

  // SERVIÇOS
  getServicos() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICOS) || '[]');
  },
  saveServico(servico) {
    const servicos = this.getServicos();
    const index = servicos.findIndex(s => s.id === servico.id);
    if (index >= 0) {
      servicos[index] = { ...servicos[index], ...servico };
    } else {
      servico.id = 'serv-' + Date.now();
      servicos.push(servico);
    }
    localStorage.setItem(STORAGE_KEYS.SERVICOS, JSON.stringify(servicos));
    return servico;
  },
  deleteServico(id) {
    const servicos = this.getServicos().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICOS, JSON.stringify(servicos));
  },

  // PRODUTOS
  getProdutos() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS) || '[]');
  },
  saveProduto(produto) {
    const produtos = this.getProdutos();
    const index = produtos.findIndex(p => p.id === produto.id);
    if (index >= 0) {
      produtos[index] = { ...produtos[index], ...produto };
    } else {
      produto.id = 'prod-' + Date.now();
      produtos.push(produto);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
    return produto;
  },
  updateEstoque(produtoId, qtdVariacao) {
    const produtos = this.getProdutos();
    const p = produtos.find(item => item.id === produtoId);
    if (p) {
      p.estoque = Math.max(0, p.estoque + qtdVariacao);
      localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
    }
  },

  // CLIENTES
  getClientes() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTES) || '[]');
  },
  saveCliente(cliente) {
    const clientes = this.getClientes();
    const index = clientes.findIndex(c => c.id === cliente.id);
    if (index >= 0) {
      clientes[index] = { ...clientes[index], ...cliente };
    } else {
      cliente.id = 'cli-' + Date.now();
      cliente.totalVisitas = cliente.totalVisitas || 1;
      cliente.selosFidelidade = cliente.selosFidelidade || 1;
      cliente.totalGasto = cliente.totalGasto || 0;
      clientes.push(cliente);
    }
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
    return cliente;
  },

  // AGENDAMENTOS
  getAgendamentos() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AGENDAMENTOS) || '[]');
  },
  saveAgendamento(agendamento) {
    const agendamentos = this.getAgendamentos();
    const index = agendamentos.findIndex(a => a.id === agendamento.id);
    if (index >= 0) {
      agendamentos[index] = { ...agendamentos[index], ...agendamento };
    } else {
      agendamento.id = 'ag-' + Date.now();
      agendamentos.push(agendamento);
    }
    localStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(agendamentos));
    return agendamento;
  },
  updateAgendamentoStatus(id, novoStatus) {
    const agendamentos = this.getAgendamentos();
    const ag = agendamentos.find(a => a.id === id);
    if (ag) {
      ag.status = novoStatus;
      localStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(agendamentos));
    }
  },
  deleteAgendamento(id) {
    const agendamentos = this.getAgendamentos().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(agendamentos));
  },

  // COMANDAS
  getComandas() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMANDAS) || '[]');
  },
  saveComanda(comanda) {
    const comandas = this.getComandas();
    const index = comandas.findIndex(c => c.id === comanda.id);
    if (index >= 0) {
      comandas[index] = { ...comandas[index], ...comanda };
    } else {
      comanda.id = 'cmd-' + Date.now();
      comanda.numero = '#' + String(Math.floor(1000 + Math.random() * 9000));
      comandas.push(comanda);
    }
    localStorage.setItem(STORAGE_KEYS.COMANDAS, JSON.stringify(comandas));
    return comanda;
  },
  fecharComanda(comandaId, formaPagamento, desconto = 0) {
    const comandas = this.getComandas();
    const cmd = comandas.find(c => c.id === comandaId);
    if (cmd) {
      cmd.status = 'fechada';
      cmd.formaPagamento = formaPagamento;
      cmd.desconto = desconto;
      cmd.total = Math.max(0, cmd.subtotal - desconto);
      localStorage.setItem(STORAGE_KEYS.COMANDAS, JSON.stringify(comandas));

      // Grava no financeiro
      this.addLancamentoFinanceiro({
        tipo: 'receita',
        categoria: 'Serviços & Atendimentos',
        descricao: `Fechamento Comanda ${cmd.numero} - ${cmd.clienteNome}`,
        valor: cmd.total,
        formaPagamento: formaPagamento,
        data: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'concluido'
      });

      // Atualiza fidelidade do cliente se existir
      const clientes = this.getClientes();
      const cli = clientes.find(c => c.nome.toLowerCase() === cmd.clienteNome.toLowerCase());
      if (cli) {
        cli.totalVisitas = (cli.totalVisitas || 0) + 1;
        cli.totalGasto = (cli.totalGasto || 0) + cmd.total;
        cli.selosFidelidade = ((cli.selosFidelidade || 0) + 1) % 10;
        cli.ultimaVisita = new Date().toISOString().split('T')[0];
        localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
      }
    }
    return cmd;
  },

  // FINANCEIRO
  getFinanceiro() {
    this.init();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FINANCEIRO) || '[]');
  },
  addLancamentoFinanceiro(lancamento) {
    const financeiro = this.getFinanceiro();
    lancamento.id = 'fin-' + Date.now();
    financeiro.unshift(lancamento);
    localStorage.setItem(STORAGE_KEYS.FINANCEIRO, JSON.stringify(financeiro));
    return lancamento;
  }
};
