/**
 * ============================================================================
 * SERVIÇO DE DADOS ESCOLAR - CEI SANTA FILOMENA (CONTAGEM - MG)
 * ============================================================================
 */

const STORAGE_KEYS = {
  ALUNOS: 'cei_alunos',
  TURMAS: 'cei_turmas',
  ROTINA: 'cei_rotina_diaria',
  CONTRIBUICOES: 'cei_contribuicoes',
  PORTARIA: 'cei_saidas_portaria',
  ATIVIDADES_TURMA: 'cei_atividades_turma'
};

const TURMAS_INICIAIS = [
  { id: 'mat1', nome: 'Maternal I', faixaEtaria: '2 anos', sala: 'Sala 01', professora: 'Tia Fernanda' },
  { id: 'mat2', nome: 'Maternal II', faixaEtaria: '3 anos', sala: 'Sala 02', professora: 'Tia Juliana' },
  { id: 'per1', nome: '1º Período', faixaEtaria: '4 anos', sala: 'Sala 03', professora: 'Tia Cláudia' },
  { id: 'per2', nome: '2º Período', faixaEtaria: '5 anos', sala: 'Sala 04', professora: 'Tia Roberta' },
];

const ALUNOS_INICIAIS = [
  {
    id: 'aluno-1',
    nome: 'Alice Silva Santos',
    dataNascimento: '2023-04-12',
    turmaId: 'mat1',
    turno: 'Integral (07h às 17h)',
    tipoVaga: 'Conveniada (Prefeitura Contagem)',
    foto: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    alergias: 'Intolerância a Lactose',
    medicamentos: 'Nenhum',
    responsaveis: [
      { nome: 'Mariana Silva (Mãe)', telefone: '31998765432', parentesco: 'Mãe' },
      { nome: 'Carlos Santos (Pai)', telefone: '31987654321', parentesco: 'Pai' }
    ],
    autorizadosRetirada: [
      { nome: 'Carlos Santos', parentesco: 'Pai', documento: 'MG-18.452.123' },
      { nome: 'Mariana Silva', parentesco: 'Mãe', documento: 'MG-19.123.456' },
      { nome: 'Sônia Silva (Avó)', parentesco: 'Avó Materna', documento: 'MG-12.876.543' }
    ],
    anamnese: {
      objetoApego: 'Naninha de ursinho azul (precisa para adormecer)',
      socializacao: 'Brinca bem com outras crianças, mas tem dificuldade inicial em compartilhar brinquedos novos.',
      desfralde: 'Em processo de desfralde diurno. Pede para fazer xixi, mas necessita de lembretes regulares.',
      comportamentoSono: 'Dorme tranquila após ouvir música suave; necessita da naninha por perto.',
      preferenciasAlimentares: 'Gosta de frutas e legumes, mas recusa alimentos muito pastosos.',
      reacaoFrustracao: 'Chora quando é contrariada; acalma-se bem com acolhimento e conversa calma.',
      historicoAdaptacao: 'Primeira vez em escola/creche de horário integral. Muito apegada à mãe na entrada.',
      medosGatilhos: 'Medo de trovões e barulho de liquidificador/aspirador.'
    }
  },
  {
    id: 'aluno-2',
    nome: 'Bernardo Souza Lima',
    dataNascimento: '2023-01-20',
    turmaId: 'mat1',
    turno: 'Integral (07h às 17h)',
    tipoVaga: 'Conveniada (Prefeitura Contagem)',
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    alergias: 'Nenhuma',
    medicamentos: 'Pomada para assadura após cada troca',
    responsaveis: [
      { nome: 'Patrícia Souza (Mãe)', telefone: '31991234567', parentesco: 'Mãe' }
    ],
    autorizadosRetirada: [
      { nome: 'Patrícia Souza', parentesco: 'Mãe', documento: 'MG-20.334.887' },
      { nome: 'Tio Roberto (Transporte Escolar)', parentesco: 'Van Escolar', documento: 'MG-15.678.901' }
    ],
    anamnese: {
      objetoApego: 'Cadeirinha de balanço favorita ou carrinho vermelho.',
      socializacao: 'Muito ativo, gosta de correr ao ar livre e dividir a bola no parquinho.',
      desfralde: 'Usa fralda descartável integralmente.',
      comportamentoSono: 'Soneca rápida (40-50 min). Acorda disposto.',
      preferenciasAlimentares: 'Come de tudo, muito bom apetite nas 4 refeições.',
      reacaoFrustracao: 'Tende a morder brinquedos quando ansioso; orientar verbalmente com firmeza carinhosa.',
      historicoAdaptacao: 'Já frequentava berçário anterior, adaptado à rotina escolar.',
      medosGatilhos: 'Nenhum medo expressivo relatado pelos pais.'
    }
  },
  {
    id: 'aluno-3',
    nome: 'Helena Costa Ribeiro',
    dataNascimento: '2022-08-15',
    turmaId: 'mat2',
    turno: 'Integral (07h às 17h)',
    tipoVaga: 'Conveniada (Prefeitura Contagem)',
    foto: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80',
    alergias: 'Alergia a picada de inseto',
    medicamentos: 'Nenhum',
    necessidadesEspeciais: 'TEA (Transtorno do Espectro Autista - Nível 1)',
    possuiLaudo: true,
    precisaMonitor: true,
    orientacoesInclusao: 'Sensibilidade a ruídos fortes e transições de rotina. Comunica-se bem com apoio visual. Estimular no parquinho em pequenos grupos.',
    terapeuta: 'Dra. Beatriz Santos (Terapeuta Ocupacional) - 31 98877-6655',
    responsaveis: [
      { nome: 'Renata Costa (Mãe)', telefone: '31993456789', parentesco: 'Mãe' },
      { nome: 'Marcelo Ribeiro (Pai)', telefone: '31991223344', parentesco: 'Pai' }
    ],
    autorizadosRetirada: [
      { nome: 'Renata Costa', parentesco: 'Mãe', documento: 'MG-16.789.012' }
    ],
    anamnese: {
      objetoApego: 'Livro sensorial com texturas (brinquedo de segurança/transição).',
      socializacao: 'Prefere brincadeiras paralelas ou em duplas; precisa de mediação da monitora para interação em grandes rodas.',
      desfralde: 'Desfraldada de dia, mas precisa de apoio de rotina visual para ir ao banheiro.',
      comportamentoSono: 'Exige ambiente silencioso e luz baixa para conseguir desacelerar.',
      preferenciasAlimentares: 'Seletividade alimentar sensorial: prefere alimentos secos/crocantes, recusa molhos escuros.',
      reacaoFrustracao: 'Em sobrecarga sensorial, busca canto calmo ou tampa os ouvidos. Oferecer abafador ou espaço de acolhimento.',
      historicoAdaptacao: 'Necessita de previsibilidade: avisar 5 minutos antes da troca de atividade.',
      medosGatilhos: 'Apitos de recreio, balões estourando e aglomerações repentinas.'
    }
  },
  {
    id: 'aluno-4',
    nome: 'Davi Lucas Moreira',
    dataNascimento: '2021-05-10',
    turmaId: 'per1',
    turno: 'Integral (07h às 17h)',
    tipoVaga: 'Conveniada (Prefeitura Contagem)',
    foto: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    alergias: 'Nenhuma',
    medicamentos: 'Nenhum',
    responsaveis: [
      { nome: 'Luciana Moreira (Mãe)', telefone: '31988997766', parentesco: 'Mãe' }
    ],
    autorizadosRetirada: [
      { nome: 'Luciana Moreira', parentesco: 'Mãe', documento: 'MG-14.556.789' }
    ],
    anamnese: {
      objetoApego: 'Nenhum objeto específico, sente-se seguro com histórias e livros infantis.',
      socializacao: 'Muito comunicativo e líder de brincadeiras. Adora desenhar e quebra-cabeças.',
      desfralde: 'Totalmente independente no banheiro.',
      comportamentoSono: 'Descansa ouvindo historinha, mas costuma acordar cedo na soneca.',
      preferenciasAlimentares: 'Alimenta-se com autonomia e gosta de experimentar alimentos novos.',
      reacaoFrustracao: 'Expressa sentimentos verbalmente, aceita combinados e regras coletivas.',
      historicoAdaptacao: 'Excelente adaptação, frequenta a instituição há 2 anos.',
      medosGatilhos: 'Escuro total.'
    }
  }
];

export const EscolaStorage = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.TURMAS)) {
      localStorage.setItem(STORAGE_KEYS.TURMAS, JSON.stringify(TURMAS_INICIAIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALUNOS)) {
      localStorage.setItem(STORAGE_KEYS.ALUNOS, JSON.stringify(ALUNOS_INICIAIS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROTINA)) {
      localStorage.setItem(STORAGE_KEYS.ROTINA, JSON.stringify({}));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTRIBUICOES)) {
      const mesAtual = new Date().toISOString().slice(0, 7);
      const contPadrao = ALUNOS_INICIAIS.map((a, idx) => ({
        id: `contrib-${a.id}-${mesAtual}`,
        alunoId: a.id,
        mesReferencia: mesAtual,
        valor: 120.00,
        status: idx === 0 ? 'pago' : 'pendente',
        dataPagamento: idx === 0 ? new Date().toISOString().slice(0, 10) : null,
        metodo: idx === 0 ? 'PIX' : null,
        observacao: ''
      }));
      localStorage.setItem(STORAGE_KEYS.CONTRIBUICOES, JSON.stringify(contPadrao));
    }
  },

  getTurmas() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TURMAS) || '[]');
  },

  getAlunos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ALUNOS) || '[]');
  },

  salvarAluno(aluno) {
    const alunos = this.getAlunos();
    const index = alunos.findIndex(a => a.id === aluno.id);
    if (index >= 0) {
      alunos[index] = aluno;
    } else {
      aluno.id = 'aluno-' + Date.now();
      alunos.push(aluno);
    }
    localStorage.setItem(STORAGE_KEYS.ALUNOS, JSON.stringify(alunos));
    return aluno;
  },

  excluirAluno(alunoId) {
    const alunos = this.getAlunos().filter(a => a.id !== alunoId);
    localStorage.setItem(STORAGE_KEYS.ALUNOS, JSON.stringify(alunos));
    return true;
  },

  getRotinaPorDataETurma(dataStr, turmaId) {
    const todasRotinas = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROTINA) || '{}');
    if (!todasRotinas[dataStr]) {
      todasRotinas[dataStr] = {};
    }
    const alunosDaTurma = this.getAlunos().filter(a => a.turmaId === turmaId);
    alunosDaTurma.forEach(aluno => {
      if (!todasRotinas[dataStr][aluno.id]) {
        todasRotinas[dataStr][aluno.id] = {
          alunoId: aluno.id,
          data: dataStr,
          presente: true,
          humor: 'radiante', // radiante, tranquilo, choroso, cansado, agitado
          temperatura: '36.5',
          medicamento: '',
          trocasFralda: 2,
          cafe: 'completo',
          almoco: 'completo',
          lanche: 'completo',
          jantar: 'completo',
          banho: true,
          sono: true,
          sonoTempo: '1h30',
          intestino: 'normal',
          participacaoBncc: 'participativo',
          reposicaoItens: [],
          recado: ''
        };
      }
    });
    return {
      alunos: alunosDaTurma,
      rotinas: todasRotinas[dataStr]
    };
  },

  salvarItemRotina(dataStr, alunoId, dadosRotina) {
    const todasRotinas = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROTINA) || '{}');
    if (!todasRotinas[dataStr]) {
      todasRotinas[dataStr] = {};
    }
    todasRotinas[dataStr][alunoId] = {
      ...todasRotinas[dataStr][alunoId],
      ...dadosRotina
    };
    localStorage.setItem(STORAGE_KEYS.ROTINA, JSON.stringify(todasRotinas));
  },

  getAtividadeTurma(dataStr, turmaId) {
    const todas = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATIVIDADES_TURMA) || '{}');
    const chave = `${dataStr}_${turmaId}`;
    if (!todas[chave]) {
      return {
        data: dataStr,
        turmaId,
        campoBncc: 'Corpo, gestos e movimentos',
        titulo: 'Circuito Psicomotor & Pintura Sensorial',
        descricao: 'Atividade no pátio com túnel e obstáculos de espuma, seguida de exploração de texturas e cores na folha craft coletiva.',
        observacoes: 'Excelente envolvimento da turma, com estímulo à coordenação motora ampla e cooperação.'
      };
    }
    return todas[chave];
  },

  salvarAtividadeTurma(dataStr, turmaId, dados) {
    const todas = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATIVIDADES_TURMA) || '{}');
    const chave = `${dataStr}_${turmaId}`;
    todas[chave] = {
      data: dataStr,
      turmaId,
      ...dados
    };
    localStorage.setItem(STORAGE_KEYS.ATIVIDADES_TURMA, JSON.stringify(todas));
    return todas[chave];
  },

  getContribuicoes(mes) {
    const todas = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRIBUICOES) || '[]');
    if (mes) {
      return todas.filter(c => c.mesReferencia === mes);
    }
    return todas;
  },

  registrarPagamento(contribuicaoId, metodo = 'PIX') {
    const todas = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRIBUICOES) || '[]');
    const item = todas.find(c => c.id === contribuicaoId);
    if (item) {
      item.status = 'pago';
      item.metodo = metodo;
      item.dataPagamento = new Date().toISOString().slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.CONTRIBUICOES, JSON.stringify(todas));
    }
    return item;
  },

  getSaidasPortaria(dataStr) {
    const todas = JSON.parse(localStorage.getItem(STORAGE_KEYS.PORTARIA) || '{}');
    return todas[dataStr] || {};
  },

  registrarSaidaPortaria(dataStr, alunoId, dadosSaida) {
    const todas = JSON.parse(localStorage.getItem(STORAGE_KEYS.PORTARIA) || '{}');
    if (!todas[dataStr]) todas[dataStr] = {};
    todas[dataStr][alunoId] = {
      alunoId,
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      ...dadosSaida
    };
    localStorage.setItem(STORAGE_KEYS.PORTARIA, JSON.stringify(todas));
    return todas[dataStr][alunoId];
  },

  cancelarSaidaPortaria(dataStr, alunoId) {
    const todas = JSON.parse(localStorage.getItem(STORAGE_KEYS.PORTARIA) || '{}');
    if (todas[dataStr] && todas[dataStr][alunoId]) {
      delete todas[dataStr][alunoId];
      localStorage.setItem(STORAGE_KEYS.PORTARIA, JSON.stringify(todas));
    }
  }
};
