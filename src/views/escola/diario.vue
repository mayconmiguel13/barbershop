<template>
  <Layout>
    <!-- CABEÇALHO DA PÁGINA -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
      <div>
        <h4 class="mb-1 text-dark fw-bold">
          <i class="ri-booklet-line text-primary me-2"></i>Diário de Bordo & Rotina Integral
        </h4>
        <p class="text-muted fs-13 mb-0">
          Acompanhamento pedagógico, nutricional e fisiológico em tempo integral (07:00 às 17:00) • 
          <span class="text-primary fw-semibold">CEI Santa Filomena</span>
        </p>
      </div>

      <!-- BOTÕES DE TOPO: VISUALIZAÇÃO & DISPARO COLETIVO -->
      <div class="d-flex flex-wrap align-items-center gap-2">
        <!-- Alternador de Modo de Visualização -->
        <div class="btn-group p-1 bg-light rounded border shadow-sm" role="group">
          <button 
            type="button" 
            class="btn btn-sm" 
            :class="modoVisualizacao === 'cards' ? 'btn-primary shadow-sm fw-semibold' : 'btn-ghost-secondary text-muted'"
            @click="modoVisualizacao = 'cards'"
          >
            <i class="ri-layout-grid-line align-middle me-1"></i> Modo Cards
          </button>
          <button 
            type="button" 
            class="btn btn-sm" 
            :class="modoVisualizacao === 'express' ? 'btn-primary shadow-sm fw-semibold' : 'btn-ghost-secondary text-muted'"
            @click="modoVisualizacao = 'express'"
          >
            <i class="ri-table-line align-middle me-1"></i> Matriz Express ⚡
          </button>
        </div>

        <!-- Botão Disparo Coletivo WhatsApp -->
        <button type="button" class="btn btn-sm btn-success shadow-sm" @click="abrirModalDisparoColetivo">
          <i class="ri-whatsapp-line align-middle me-1"></i> Disparo em Lote WhatsApp
        </button>
      </div>
    </div>

    <!-- PAINEL SUPERIOR: CONTROLES DA SALA, HORÁRIO ATUAL & PREENCHIMENTO -->
    <BCard no-body class="border-0 shadow-sm mb-3">
      <BCardBody class="p-3">
        <BRow class="align-items-center g-3">
          <!-- Seleção da Turma -->
          <BCol xl="3" lg="4" md="6">
            <label class="form-label text-muted fs-11 fw-bold text-uppercase mb-1">
              <i class="ri-community-line text-primary me-1"></i> Turma da Educação Infantil:
            </label>
            <select v-model="turmaSelecionadaId" @change="carregarDados" class="form-select form-select-sm fw-semibold shadow-none border-primary-subtle">
              <option v-for="t in turmas" :key="t.id" :value="t.id">
                {{ t.nome }} ({{ t.faixaEtaria }}) • {{ t.professora }}
              </option>
            </select>
          </BCol>

          <!-- Data Letiva & Atalhos -->
          <BCol xl="3" lg="4" md="6">
            <label class="form-label text-muted fs-11 fw-bold text-uppercase mb-1">
              <i class="ri-calendar-event-line text-primary me-1"></i> Data da Rotina:
            </label>
            <div class="d-flex gap-1">
              <input type="date" v-model="dataSelecionada" @change="carregarDados" class="form-control form-control-sm fw-medium shadow-none" />
              <button type="button" @click="setDataHoje" class="btn btn-sm btn-outline-secondary px-2" title="Hoje">Hoje</button>
            </div>
          </BCol>

          <!-- Momento da Rotina Atual (Relógio Escolar) -->
          <BCol xl="3" lg="4" md="6">
            <div class="p-2 rounded bg-light border d-flex align-items-center gap-2">
              <div class="avatar-xs flex-shrink-0">
                <span class="avatar-title rounded-circle bg-primary-subtle text-primary fs-14">
                  <i :class="momentoAtual.icone"></i>
                </span>
              </div>
              <div class="overflow-hidden">
                <span class="fs-10 text-muted fw-bold text-uppercase d-block">Momento Atual (Turno Integral):</span>
                <span class="fs-12 fw-bold text-dark text-truncate d-block">{{ momentoAtual.titulo }}</span>
              </div>
            </div>
          </BCol>

          <!-- Progresso do Preenchimento & Ações Rápidas -->
          <BCol xl="3" lg="12" md="6">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fs-11 text-muted fw-bold text-uppercase">Preenchimento Hoje:</span>
              <span class="badge" :class="percentualPreenchido === 100 ? 'bg-success text-white' : 'bg-primary-subtle text-primary'">
                {{ percentualPreenchido }}% Concluído
              </span>
            </div>
            <div class="progress mb-2" style="height: 6px;">
              <div 
                class="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                :class="percentualPreenchido === 100 ? 'bg-success' : 'bg-primary'"
                :style="{ width: percentualPreenchido + '%' }"
              ></div>
            </div>
            <div class="d-flex justify-content-between gap-1">
              <!-- Dropdown de Refeições em Lote -->
              <div class="btn-group w-50">
                <button type="button" class="btn btn-xs btn-outline-primary dropdown-toggle py-1" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="ri-restaurant-2-line me-1"></i> Refeições
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow">
                  <li><h6 class="dropdown-header">Café da Manhã (07h30)</h6></li>
                  <li><a class="dropdown-item fs-12 cursor-pointer" @click="marcarRefeicaoTurmaToda('cafe', 'completo')">✓ Café: Todos Completo</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><h6 class="dropdown-header">Almoço Nutritivo (11h00)</h6></li>
                  <li><a class="dropdown-item fs-12 cursor-pointer" @click="marcarRefeicaoTurmaToda('almoco', 'completo')">✓ Almoço: Todos Completo</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><h6 class="dropdown-header">Lanche da Tarde (14h30)</h6></li>
                  <li><a class="dropdown-item fs-12 cursor-pointer" @click="marcarRefeicaoTurmaToda('lanche', 'completo')">✓ Lanche: Todos Completo</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><h6 class="dropdown-header">Jantar Leve (16h30)</h6></li>
                  <li><a class="dropdown-item fs-12 cursor-pointer" @click="marcarRefeicaoTurmaToda('jantar', 'completo')">✓ Jantar: Todos Completo</a></li>
                </ul>
              </div>

              <!-- Preencher Tudo Normal -->
              <button @click="preencherPadraoParaTodos" class="btn btn-xs btn-success py-1 w-50" title="Marcar 4 refeições, banho e sono para todos os presentes">
                <i class="ri-magic-line me-1"></i> Tudo 100%
              </button>
            </div>
          </BCol>
        </BRow>
      </BCardBody>
    </BCard>

    <!-- BANNER PEDAGÓGICO: VIVÊNCIA BNCC DO DIA DA TURMA -->
    <BCard no-body class="border-0 shadow-sm mb-3 banner-pedagogico">
      <BCardBody class="p-3">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-sm flex-shrink-0">
              <span class="avatar-title rounded-circle bg-warning-subtle text-warning fs-20 shadow-sm">
                <i class="ri-palette-line"></i>
              </span>
            </div>
            <div>
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <span class="badge bg-warning text-dark fw-bold fs-10 text-uppercase">
                  BNCC • {{ atividadeTurma.campoBncc || 'Campos de Experiências' }}
                </span>
                <span class="text-muted fs-11">Planejamento Coletivo da Turma</span>
              </div>
              <h5 class="fs-14 fw-bold text-dark mb-0 mt-1">
                {{ atividadeTurma.titulo || 'Vivência / Atividade Pedagógica de Hoje' }}
              </h5>
              <p class="text-muted fs-12 mb-0 mt-1">
                {{ atividadeTurma.descricao }}
              </p>
            </div>
          </div>

          <button type="button" @click="abrirModalAtividade" class="btn btn-sm btn-outline-warning text-dark fw-semibold">
            <i class="ri-edit-2-line me-1"></i> Editar Vivência BNCC
          </button>
        </div>
      </BCardBody>
    </BCard>

    <!-- BARRA DE FILTROS RÁPIDOS & BUSCA INTELIGENTE -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <!-- Filtros em Pills -->
      <div class="d-flex flex-wrap gap-1 align-items-center">
        <button 
          type="button" 
          @click="filtroStatus = 'todos'"
          :class="['btn btn-sm py-1 px-3 rounded-pill', filtroStatus === 'todos' ? 'btn-primary' : 'btn-light text-muted border']"
        >
          Todos <span class="badge rounded-pill bg-white text-dark ms-1">{{ alunosDaTurma.length }}</span>
        </button>
        <button 
          type="button" 
          @click="filtroStatus = 'presentes'"
          :class="['btn btn-sm py-1 px-3 rounded-pill', filtroStatus === 'presentes' ? 'btn-success' : 'btn-light text-muted border']"
        >
          <i class="ri-user-check-line me-1"></i> Presentes <span class="badge rounded-pill bg-white text-success ms-1">{{ totalPresentes }}</span>
        </button>
        <button 
          type="button" 
          @click="filtroStatus = 'ausentes'"
          :class="['btn btn-sm py-1 px-3 rounded-pill', filtroStatus === 'ausentes' ? 'btn-danger' : 'btn-light text-muted border']"
        >
          <i class="ri-user-unfollow-line me-1"></i> Faltas <span class="badge rounded-pill bg-white text-danger ms-1">{{ totalAusentes }}</span>
        </button>
        <button 
          type="button" 
          @click="filtroStatus = 'mochila'"
          :class="['btn btn-sm py-1 px-3 rounded-pill', filtroStatus === 'mochila' ? 'btn-warning text-dark' : 'btn-light text-muted border']"
        >
          <i class="ri-shopping-bag-line me-1"></i> Reposição Mochila <span class="badge rounded-pill bg-white text-dark ms-1">{{ totalComReposicao }}</span>
        </button>
        <button 
          type="button" 
          @click="filtroStatus = 'inclusao'"
          :class="['btn btn-sm py-1 px-3 rounded-pill', filtroStatus === 'inclusao' ? 'btn-secondary' : 'btn-light text-muted border']"
        >
          <i class="ri-puzzle-line me-1"></i> TEA / Inclusão <span class="badge rounded-pill bg-white text-dark ms-1">{{ totalInclusao }}</span>
        </button>
      </div>

      <!-- Campo de Busca por Nome -->
      <div class="search-box position-relative" style="width: 250px;">
        <input 
          type="text" 
          v-model="filtroNomeAluno" 
          class="form-control form-control-sm ps-4 rounded-pill" 
          placeholder="Buscar criança na turma..." 
        />
        <i class="ri-search-line search-icon position-absolute top-50 start-0 translate-middle-y ms-2 text-muted fs-13"></i>
        <button 
          v-if="filtroNomeAluno" 
          type="button" 
          @click="filtroNomeAluno = ''" 
          class="btn btn-link position-absolute top-50 end-0 translate-middle-y me-1 p-0 text-muted"
        >
          <i class="ri-close-line"></i>
        </button>
      </div>
    </div>

    <!-- SE NÃO TIVER ALUNOS NO FILTRO -->
    <div v-if="alunosFiltrados.length === 0" class="text-center py-5 bg-white rounded shadow-sm border mb-4">
      <div class="avatar-lg mx-auto mb-3">
        <div class="avatar-title bg-light text-muted rounded-circle fs-36">
          <i class="ri-user-search-line"></i>
        </div>
      </div>
      <h5 class="fs-15 fw-semibold text-muted">Nenhuma criança encontrada</h5>
      <p class="text-muted fs-12 mb-0">Tente ajustar o termo de busca ou limpar o filtro selecionado.</p>
      <button class="btn btn-sm btn-outline-primary mt-2" @click="limparFiltros">Ver toda a turma</button>
    </div>

    <!-- ========================================================================================== -->
    <!-- MODO 1: CARDS INDIVIDUAIS DE ALTA DEFINIÇÃO -->
    <!-- ========================================================================================== -->
    <div v-if="modoVisualizacao === 'cards' && alunosFiltrados.length > 0">
      <div v-for="aluno in alunosFiltrados" :key="aluno.id" class="mb-3">
        <BCard no-body class="shadow-sm border-0 transition-all card-aluno" :class="{ 'card-falta': !getRotina(aluno.id).presente }">
          <BCardBody class="p-3">
            <!-- CABEÇALHO DO ALUNO COM FOTO, HUMOR, TEMPERATURA E AÇÕES -->
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom">
              <!-- Identificação da Criança -->
              <div class="d-flex align-items-center gap-3">
                <div class="position-relative">
                  <img 
                    :src="aluno.foto" 
                    class="rounded-circle avatar-md object-fit-cover border shadow-sm" 
                    alt="Foto do Aluno" 
                  />
                  <span 
                    class="position-absolute bottom-0 end-0 p-1 border border-white rounded-circle"
                    :class="getRotina(aluno.id).presente ? 'bg-success' : 'bg-danger'"
                    style="width: 14px; height: 14px;"
                    :title="getRotina(aluno.id).presente ? 'Presente na creche' : 'Ausente hoje'"
                  ></span>
                </div>
                <div>
                  <div class="d-flex align-items-center gap-2 flex-wrap">
                    <h5 class="fs-15 mb-0 fw-bold text-dark">{{ aluno.nome }}</h5>
                    <span v-if="!getRotina(aluno.id).presente" class="badge bg-danger-subtle text-danger fs-11 fw-bold">
                      FALTA / AUSENTE HOJE
                    </span>
                    <span v-if="getRotina(aluno.id).reposicaoItens?.length" class="badge bg-warning-subtle text-warning border border-warning-subtle fs-11">
                      <i class="ri-shopping-bag-line me-1"></i> Mochila Pendente ({{ getRotina(aluno.id).reposicaoItens.length }})
                    </span>
                  </div>

                  <div class="d-flex flex-wrap gap-1 align-items-center mt-1">
                    <span class="badge bg-light text-muted border fs-11">
                      <i class="ri-time-line me-1"></i> Integral 07h-17h
                    </span>

                    <!-- Selo TEA / Inclusão -->
                    <span v-if="aluno.necessidadesEspeciais && aluno.necessidadesEspeciais !== 'Nenhuma'" class="badge border fs-11" style="background-color: #f3e8ff; color: #7e22ce;">
                      <i class="ri-puzzle-line align-middle me-1"></i> {{ aluno.necessidadesEspeciais }}
                    </span>

                    <!-- Selo Monitor SEDUC -->
                    <span v-if="aluno.precisaMonitor" class="badge bg-info-subtle text-info border fs-11">
                      <i class="ri-user-star-line align-middle me-1"></i> Monitor SEDUC
                    </span>

                    <!-- Alergias -->
                    <span v-if="aluno.alergias && aluno.alergias !== 'Nenhuma'" class="badge bg-danger text-white fs-11">
                      <i class="ri-alert-line align-middle me-1"></i> {{ aluno.alergias }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Controles Rápidos: Humor, Temperatura e Presença -->
              <div class="d-flex flex-wrap align-items-center gap-2" v-if="getRotina(aluno.id).presente">
                <!-- Seletor de Humor do Dia -->
                <div class="humor-selector bg-light p-1 rounded border d-flex align-items-center gap-1">
                  <span class="text-muted fs-11 fw-bold px-1 d-none d-sm-inline">Humor:</span>
                  <button 
                    type="button" 
                    v-for="h in opcoesHumor" 
                    :key="h.valor"
                    @click="setCampo(aluno.id, 'humor', h.valor)"
                    :class="['btn btn-xs rounded-circle p-1', getRotina(aluno.id).humor === h.valor ? 'btn-primary shadow-sm' : 'btn-ghost-secondary']"
                    :title="h.label"
                    style="width: 28px; height: 28px; font-size: 13px;"
                  >
                    {{ h.emoji }}
                  </button>
                </div>

                <!-- Temperatura Corporal -->
                <div class="input-group input-group-sm" style="width: 110px;">
                  <span class="input-group-text bg-white border-end-0 px-2 text-danger">
                    <i class="ri-temp-hot-line"></i>
                  </span>
                  <input 
                    type="text" 
                    v-model="getRotina(aluno.id).temperatura" 
                    @blur="salvarCampo(aluno.id, 'temperatura')" 
                    class="form-control text-center fw-bold"
                    :class="isFebre(getRotina(aluno.id).temperatura) ? 'text-danger bg-danger-subtle' : 'text-dark'"
                    placeholder="36.5" 
                    title="Temperatura Corporal (°C)"
                  />
                  <span class="input-group-text bg-light text-muted px-1 fs-10">°C</span>
                </div>

                <!-- Botão de Presença/Falta -->
                <button 
                  type="button" 
                  @click="alternarPresenca(aluno.id)" 
                  class="btn btn-sm btn-soft-success"
                  title="Clique para marcar ausência"
                >
                  <i class="ri-user-check-line me-1"></i> Presente
                </button>

                <!-- Abrir Agenda Digital Premium -->
                <button @click="abrirCartao(aluno)" class="btn btn-sm btn-primary shadow-sm">
                  <i class="ri-article-line me-1"></i> Agenda Digital
                </button>
              </div>

              <!-- Se estiver ausente, botão de reverter -->
              <div v-else class="d-flex align-items-center gap-2">
                <button 
                  type="button" 
                  @click="alternarPresenca(aluno.id)" 
                  class="btn btn-sm btn-success"
                >
                  <i class="ri-user-follow-line me-1"></i> Marcar como Presente
                </button>
              </div>
            </div>

            <!-- SE O ALUNO ESTIVER AUSENTE -->
            <div v-if="!getRotina(aluno.id).presente" class="alert alert-warning border-0 p-3 mb-0 text-center fs-13 rounded">
              <i class="ri-information-line me-1"></i> Criança ausente hoje (<strong>{{ formatarData(dataSelecionada) }}</strong>). Faltas sincronizadas com o relatório oficial da Prefeitura de Contagem.
            </div>

            <!-- SE ESTIVER PRESENTE: GRADE COMPLETA DAS 4 REFEIÇÕES E CUIDADOS -->
            <div v-else>
              <BRow class="g-3">
                <!-- BLOCO 1: AS 4 REFEIÇÕES DO TURNO INTEGRAL -->
                <BCol lg="6">
                  <div class="p-3 rounded-3 border bg-light h-100">
                    <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                      <div class="d-flex align-items-center gap-2">
                        <span class="avatar-xs flex-shrink-0">
                          <span class="avatar-title rounded bg-primary-subtle text-primary fs-12">
                            <i class="ri-restaurant-line"></i>
                          </span>
                        </span>
                        <div>
                          <h6 class="fs-13 fw-bold text-dark mb-0">Alimentação Integral (4 Refeições)</h6>
                          <span class="text-muted fs-11">Padrão Nutricional SEDUC Contagem</span>
                        </div>
                      </div>
                      <span class="badge bg-success-subtle text-success fs-10 fw-semibold">Cardápio do Dia</span>
                    </div>

                    <div class="d-flex flex-column gap-2">
                      <!-- Café da Manhã (07h30) -->
                      <div class="bg-white p-2 rounded-2 border d-flex align-items-center justify-content-between shadow-xs">
                        <div class="d-flex align-items-center gap-2">
                          <span class="avatar-xs flex-shrink-0">
                            <span class="avatar-title rounded-circle bg-warning-subtle text-warning fs-12">
                              ☕
                            </span>
                          </span>
                          <div>
                            <span class="fs-12 fw-bold text-dark d-block">Café da Manhã</span>
                            <span class="text-muted fs-10">07:30h • Leite, frutas e pãozinho</span>
                          </div>
                        </div>
                        <div class="btn-group btn-group-sm">
                          <button type="button" @click="setRefeicao(aluno.id, 'cafe', 'completo')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).cafe === 'completo' ? 'btn-success fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🟢 Tudo</button>
                          <button type="button" @click="setRefeicao(aluno.id, 'cafe', 'parcial')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).cafe === 'parcial' ? 'btn-warning text-dark fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🟡 Parcial</button>
                          <button type="button" @click="setRefeicao(aluno.id, 'cafe', 'nao')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).cafe === 'nao' ? 'btn-danger fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🔴 Recusou</button>
                        </div>
                      </div>

                      <!-- Almoço Nutritivo (11h00) -->
                      <div class="bg-white p-2 rounded-2 border d-flex align-items-center justify-content-between shadow-xs">
                        <div class="d-flex align-items-center gap-2">
                          <span class="avatar-xs flex-shrink-0">
                            <span class="avatar-title rounded-circle bg-success-subtle text-success fs-12">
                              🍲
                            </span>
                          </span>
                          <div>
                            <span class="fs-12 fw-bold text-dark d-block">Almoço Nutritivo</span>
                            <span class="text-muted fs-10">11:00h • Arroz, feijão, proteína e legumes</span>
                          </div>
                        </div>
                        <div class="btn-group btn-group-sm">
                          <button type="button" @click="setRefeicao(aluno.id, 'almoco', 'completo')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).almoco === 'completo' ? 'btn-success fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🟢 Tudo</button>
                          <button type="button" @click="setRefeicao(aluno.id, 'almoco', 'parcial')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).almoco === 'parcial' ? 'btn-warning text-dark fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🟡 Parcial</button>
                          <button type="button" @click="setRefeicao(aluno.id, 'almoco', 'nao')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).almoco === 'nao' ? 'btn-danger fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🔴 Recusou</button>
                        </div>
                      </div>

                      <!-- Lanche da Tarde (14h30) -->
                      <div class="bg-white p-2 rounded-2 border d-flex align-items-center justify-content-between shadow-xs">
                        <div class="d-flex align-items-center gap-2">
                          <span class="avatar-xs flex-shrink-0">
                            <span class="avatar-title rounded-circle bg-info-subtle text-info fs-12">
                              🥪
                            </span>
                          </span>
                          <div>
                            <span class="fs-12 fw-bold text-dark d-block">Lanche da Tarde</span>
                            <span class="text-muted fs-10">14:30h • Fruta da época e vitamina</span>
                          </div>
                        </div>
                        <div class="btn-group btn-group-sm">
                          <button type="button" @click="setRefeicao(aluno.id, 'lanche', 'completo')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).lanche === 'completo' ? 'btn-success fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🟢 Tudo</button>
                          <button type="button" @click="setRefeicao(aluno.id, 'lanche', 'parcial')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).lanche === 'parcial' ? 'btn-warning text-dark fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🟡 Parcial</button>
                          <button type="button" @click="setRefeicao(aluno.id, 'lanche', 'nao')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).lanche === 'nao' ? 'btn-danger fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🔴 Recusou</button>
                        </div>
                      </div>

                      <!-- Jantar Leve (16h30) -->
                      <div class="bg-white p-2 rounded-2 border d-flex align-items-center justify-content-between shadow-xs">
                        <div class="d-flex align-items-center gap-2">
                          <span class="avatar-xs flex-shrink-0">
                            <span class="avatar-title rounded-circle bg-primary-subtle text-primary fs-12">
                              🥣
                            </span>
                          </span>
                          <div>
                            <span class="fs-12 fw-bold text-dark d-block">Jantar Leve</span>
                            <span class="text-muted fs-10">16:30h • Sopinha / Papinha reforçada</span>
                          </div>
                        </div>
                        <div class="btn-group btn-group-sm">
                          <button type="button" @click="setRefeicao(aluno.id, 'jantar', 'completo')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).jantar === 'completo' ? 'btn-success fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🟢 Tudo</button>
                          <button type="button" @click="setRefeicao(aluno.id, 'jantar', 'parcial')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).jantar === 'parcial' ? 'btn-warning text-dark fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🟡 Parcial</button>
                          <button type="button" @click="setRefeicao(aluno.id, 'jantar', 'nao')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).jantar === 'nao' ? 'btn-danger fw-bold shadow-xs' : 'btn-outline-light text-muted border']">🔴 Recusou</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </BCol>

                <!-- BLOCO 2: HIGIENE, SONO, INTESTINO, REPOSIÇÃO & RECADO -->
                <BCol lg="6">
                  <div class="p-3 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                        <div class="d-flex align-items-center gap-2">
                          <span class="avatar-xs flex-shrink-0">
                            <span class="avatar-title rounded bg-danger-subtle text-danger fs-12">
                              <i class="ri-heart-pulse-line"></i>
                            </span>
                          </span>
                          <div>
                            <h6 class="fs-13 fw-bold text-dark mb-0">Higiene, Descanso & Fisiologia</h6>
                            <span class="text-muted fs-11">Cuidados diários do berçário e maternal</span>
                          </div>
                        </div>
                        <span class="badge bg-info-subtle text-info fs-10">Integral</span>
                      </div>

                      <div class="d-flex flex-column gap-2 mb-3">
                        <!-- Banho & Soneca em Linha -->
                        <div class="row g-2">
                          <!-- Banho -->
                          <div class="col-sm-6">
                            <div class="bg-white p-2 rounded border h-100 d-flex flex-column justify-content-between">
                              <div class="d-flex align-items-center gap-2 mb-1">
                                <i class="ri-drop-line text-primary fs-15"></i>
                                <span class="fs-11 fw-bold text-dark">Banho na Creche:</span>
                              </div>
                              <div class="btn-group btn-group-sm w-100">
                                <button type="button" @click="setCampo(aluno.id, 'banho', true)" :class="['btn btn-xs py-1', getRotina(aluno.id).banho ? 'btn-primary fw-bold' : 'btn-outline-light text-muted border']">Sim 🚿</button>
                                <button type="button" @click="setCampo(aluno.id, 'banho', false)" :class="['btn btn-xs py-1', !getRotina(aluno.id).banho ? 'btn-secondary fw-bold' : 'btn-outline-light text-muted border']">Não</button>
                              </div>
                            </div>
                          </div>

                          <!-- Soneca / Descanso -->
                          <div class="col-sm-6">
                            <div class="bg-white p-2 rounded border h-100 d-flex flex-column justify-content-between">
                              <div class="d-flex align-items-center gap-2 mb-1">
                                <i class="ri-moon-line text-warning fs-15"></i>
                                <span class="fs-11 fw-bold text-dark">Soneca (13h-14h30):</span>
                              </div>
                              <div class="btn-group btn-group-sm w-100">
                                <button type="button" @click="setCampo(aluno.id, 'sono', true)" :class="['btn btn-xs py-1', getRotina(aluno.id).sono ? 'btn-success fw-bold' : 'btn-outline-light text-muted border']">Dormiu 😴</button>
                                <button type="button" @click="setCampo(aluno.id, 'sono', false)" :class="['btn btn-xs py-1', !getRotina(aluno.id).sono ? 'btn-warning text-dark fw-bold' : 'btn-outline-light text-muted border']">Não dormiu</button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Evacuação / Trocas de Fralda -->
                        <div class="bg-white p-2 rounded border d-flex align-items-center justify-content-between">
                          <div class="d-flex align-items-center gap-2">
                            <i class="ri-shield-cross-line text-danger fs-16"></i>
                            <div>
                              <span class="fs-12 fw-bold text-dark d-block">Evacuação / Fralda:</span>
                              <span class="text-muted fs-10">Trocas normais registradas</span>
                            </div>
                          </div>
                          <div class="btn-group btn-group-sm">
                            <button type="button" @click="setCampo(aluno.id, 'intestino', 'normal')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).intestino === 'normal' ? 'btn-success fw-bold' : 'btn-outline-light text-muted border']">Normal ✓</button>
                            <button type="button" @click="setCampo(aluno.id, 'intestino', 'atencao')" :class="['btn btn-xs py-1 px-2', getRotina(aluno.id).intestino === 'atencao' ? 'btn-danger fw-bold' : 'btn-outline-light text-muted border']">⚠️ Diarreia / Atenção</button>
                          </div>
                        </div>

                        <!-- Reposição de Itens da Mochila (Pills Rápidos) -->
                        <div class="bg-white p-2 rounded border">
                          <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="fs-11 fw-bold text-dark">
                              <i class="ri-shopping-bag-line text-warning me-1"></i> Pedir Reposição na Mochila:
                            </span>
                            <span v-if="getRotina(aluno.id).reposicaoItens?.length" class="badge bg-danger-subtle text-danger fs-10">
                              {{ getRotina(aluno.id).reposicaoItens.length }} item(ns)
                            </span>
                          </div>
                          <div class="d-flex flex-wrap gap-1">
                            <button 
                              v-for="item in itensMochilaDisponiveis" 
                              :key="item"
                              type="button" 
                              @click="toggleItemReposicao(aluno.id, item)" 
                              :class="['btn btn-xs py-1 px-2 rounded-pill', temItem(aluno.id, item) ? 'btn-danger fw-bold shadow-xs' : 'btn-light text-muted border']"
                            >
                              <i :class="temItem(aluno.id, item) ? 'ri-check-line me-1' : 'ri-add-line me-1'"></i> {{ item }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Campo de Recado Carinhoso para os Pais -->
                    <div class="pt-2 border-top">
                      <label class="form-label text-muted fs-11 fw-bold mb-1">
                        <i class="ri-chat-smile-2-line text-primary me-1"></i> Recado Afetuoso da Professora para a Família:
                      </label>
                      <div class="input-group input-group-sm">
                        <input 
                          type="text" 
                          v-model="getRotina(aluno.id).recado" 
                          @blur="salvarRecado(aluno.id)" 
                          class="form-control" 
                          placeholder="Ex: Brincou com entusiasmo no circuito e fez amigos..." 
                        />
                        <button type="button" @click="salvarRecado(aluno.id)" class="btn btn-primary" title="Salvar recado">
                          <i class="ri-save-line"></i>
                        </button>
                      </div>
                      <!-- Sugestões Rápidas de Recado -->
                      <div class="d-flex flex-wrap gap-1 mt-1">
                        <span 
                          v-for="sugestao in sugestoesRecado" 
                          :key="sugestao" 
                          @click="aplicarSugestao(aluno.id, sugestao)" 
                          class="badge bg-light text-muted border cursor-pointer hover-badge fs-10"
                        >
                          + {{ sugestao }}
                        </span>
                      </div>
                    </div>
                  </div>
                </BCol>
              </BRow>
            </div>
          </BCardBody>
        </BCard>
      </div>
    </div>

    <!-- ========================================================================================== -->
    <!-- MODO 2: MATRIZ EXPRESS ⚡ (PLANILHA TÁTIL ULTRA-RÁPIDA) -->
    <!-- ========================================================================================== -->
    <div v-if="modoVisualizacao === 'express' && alunosFiltrados.length > 0" class="mb-4">
      <BCard no-body class="border-0 shadow-sm overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 express-table">
            <thead class="table-light fs-11 text-uppercase text-muted">
              <tr>
                <th style="min-width: 220px;">Criança / Aluno</th>
                <th class="text-center" style="width: 90px;">Presença</th>
                <th class="text-center" style="width: 120px;">Humor</th>
                <th class="text-center" style="width: 80px;">Temp.</th>
                <th class="text-center" style="min-width: 110px;">Café (07h30)</th>
                <th class="text-center" style="min-width: 110px;">Almoço (11h)</th>
                <th class="text-center" style="min-width: 110px;">Lanche (14h30)</th>
                <th class="text-center" style="min-width: 110px;">Jantar (16h30)</th>
                <th class="text-center" style="width: 80px;">Banho</th>
                <th class="text-center" style="width: 90px;">Soneca</th>
                <th class="text-center" style="width: 90px;">Intestino</th>
                <th class="text-center" style="min-width: 140px;">Mochila</th>
                <th class="text-center" style="width: 100px;">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in alunosFiltrados" :key="aluno.id" :class="{ 'table-danger-subtle': !getRotina(aluno.id).presente }">
                <!-- Nome & Foto -->
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img :src="aluno.foto" class="avatar-xs rounded-circle object-fit-cover border" alt="Foto" />
                    <div>
                      <span class="fs-13 fw-bold text-dark d-block">{{ aluno.nome }}</span>
                      <div class="d-flex gap-1">
                        <span v-if="aluno.necessidadesEspeciais && aluno.necessidadesEspeciais !== 'Nenhuma'" class="badge badge-xs" style="background-color: #f3e8ff; color: #7e22ce;">
                          TEA
                        </span>
                        <span v-if="aluno.alergias && aluno.alergias !== 'Nenhuma'" class="badge badge-xs bg-danger text-white">
                          Alergia
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Presença -->
                <td class="text-center">
                  <button 
                    type="button" 
                    @click="alternarPresenca(aluno.id)" 
                    :class="['btn btn-xs py-1 px-2 rounded-pill', getRotina(aluno.id).presente ? 'btn-success' : 'btn-danger']"
                  >
                    {{ getRotina(aluno.id).presente ? 'Presente' : 'Falta' }}
                  </button>
                </td>

                <!-- Se ausente, colunas mescladas -->
                <td v-if="!getRotina(aluno.id).presente" colspan="10" class="text-center text-muted fs-12 bg-light">
                  <i class="ri-user-unfollow-line me-1 text-danger"></i> Ausente nesta data (registro sincronizado com o diário oficial de frequência)
                </td>

                <!-- Se presente, colunas interativas -->
                <template v-else>
                  <!-- Humor -->
                  <td class="text-center">
                    <div class="btn-group btn-group-sm">
                      <button 
                        type="button" 
                        v-for="h in opcoesHumor" 
                        :key="h.valor"
                        @click="setCampo(aluno.id, 'humor', h.valor)"
                        :class="['btn btn-xs px-1', getRotina(aluno.id).humor === h.valor ? 'btn-primary' : 'btn-light text-muted border']"
                        :title="h.label"
                      >
                        {{ h.emoji }}
                      </button>
                    </div>
                  </td>

                  <!-- Temperatura -->
                  <td class="text-center">
                    <input 
                      type="text" 
                      v-model="getRotina(aluno.id).temperatura" 
                      @blur="salvarCampo(aluno.id, 'temperatura')" 
                      class="form-control form-control-sm text-center p-1"
                      :class="isFebre(getRotina(aluno.id).temperatura) ? 'text-danger fw-bold bg-danger-subtle' : ''"
                      style="width: 55px; margin: 0 auto; font-size: 11px;"
                    />
                  </td>

                  <!-- Café -->
                  <td class="text-center">
                    <div class="btn-group btn-group-sm">
                      <button type="button" @click="setRefeicao(aluno.id, 'cafe', 'completo')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).cafe === 'completo' ? 'btn-success' : 'btn-light border']">🟢</button>
                      <button type="button" @click="setRefeicao(aluno.id, 'cafe', 'parcial')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).cafe === 'parcial' ? 'btn-warning text-dark' : 'btn-light border']">🟡</button>
                      <button type="button" @click="setRefeicao(aluno.id, 'cafe', 'nao')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).cafe === 'nao' ? 'btn-danger' : 'btn-light border']">🔴</button>
                    </div>
                  </td>

                  <!-- Almoço -->
                  <td class="text-center">
                    <div class="btn-group btn-group-sm">
                      <button type="button" @click="setRefeicao(aluno.id, 'almoco', 'completo')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).almoco === 'completo' ? 'btn-success' : 'btn-light border']">🟢</button>
                      <button type="button" @click="setRefeicao(aluno.id, 'almoco', 'parcial')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).almoco === 'parcial' ? 'btn-warning text-dark' : 'btn-light border']">🟡</button>
                      <button type="button" @click="setRefeicao(aluno.id, 'almoco', 'nao')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).almoco === 'nao' ? 'btn-danger' : 'btn-light border']">🔴</button>
                    </div>
                  </td>

                  <!-- Lanche -->
                  <td class="text-center">
                    <div class="btn-group btn-group-sm">
                      <button type="button" @click="setRefeicao(aluno.id, 'lanche', 'completo')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).lanche === 'completo' ? 'btn-success' : 'btn-light border']">🟢</button>
                      <button type="button" @click="setRefeicao(aluno.id, 'lanche', 'parcial')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).lanche === 'parcial' ? 'btn-warning text-dark' : 'btn-light border']">🟡</button>
                      <button type="button" @click="setRefeicao(aluno.id, 'lanche', 'nao')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).lanche === 'nao' ? 'btn-danger' : 'btn-light border']">🔴</button>
                    </div>
                  </td>

                  <!-- Jantar -->
                  <td class="text-center">
                    <div class="btn-group btn-group-sm">
                      <button type="button" @click="setRefeicao(aluno.id, 'jantar', 'completo')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).jantar === 'completo' ? 'btn-success' : 'btn-light border']">🟢</button>
                      <button type="button" @click="setRefeicao(aluno.id, 'jantar', 'parcial')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).jantar === 'parcial' ? 'btn-warning text-dark' : 'btn-light border']">🟡</button>
                      <button type="button" @click="setRefeicao(aluno.id, 'jantar', 'nao')" :class="['btn btn-xs py-0 px-2', getRotina(aluno.id).jantar === 'nao' ? 'btn-danger' : 'btn-light border']">🔴</button>
                    </div>
                  </td>

                  <!-- Banho -->
                  <td class="text-center">
                    <button 
                      type="button" 
                      @click="setCampo(aluno.id, 'banho', !getRotina(aluno.id).banho)" 
                      :class="['btn btn-xs py-0 px-2 rounded', getRotina(aluno.id).banho ? 'btn-primary' : 'btn-light border text-muted']"
                    >
                      {{ getRotina(aluno.id).banho ? '🚿 Sim' : 'Não' }}
                    </button>
                  </td>

                  <!-- Soneca -->
                  <td class="text-center">
                    <button 
                      type="button" 
                      @click="setCampo(aluno.id, 'sono', !getRotina(aluno.id).sono)" 
                      :class="['btn btn-xs py-0 px-2 rounded', getRotina(aluno.id).sono ? 'btn-success' : 'btn-light border text-muted']"
                    >
                      {{ getRotina(aluno.id).sono ? '😴 Dormiu' : 'Não' }}
                    </button>
                  </td>

                  <!-- Intestino -->
                  <td class="text-center">
                    <button 
                      type="button" 
                      @click="setCampo(aluno.id, 'intestino', getRotina(aluno.id).intestino === 'normal' ? 'atencao' : 'normal')" 
                      :class="['btn btn-xs py-0 px-2 rounded', getRotina(aluno.id).intestino === 'normal' ? 'btn-soft-success' : 'btn-danger fw-bold']"
                    >
                      {{ getRotina(aluno.id).intestino === 'normal' ? 'Normal' : '⚠️ Atenção' }}
                    </button>
                  </td>

                  <!-- Mochila -->
                  <td class="text-center">
                    <span 
                      v-if="getRotina(aluno.id).reposicaoItens?.length" 
                      class="badge bg-warning-subtle text-dark border cursor-pointer"
                      @click="abrirModalMochila(aluno)"
                      title="Clique para gerenciar itens"
                    >
                      🎒 {{ getRotina(aluno.id).reposicaoItens.join(', ') }}
                    </span>
                    <button 
                      v-else 
                      type="button" 
                      @click="abrirModalMochila(aluno)" 
                      class="btn btn-xs btn-link text-muted p-0"
                    >
                      + Pedir item
                    </button>
                  </td>

                  <!-- Ações -->
                  <td class="text-center">
                    <button @click="abrirCartao(aluno)" class="btn btn-xs btn-primary py-1 px-2" title="Ver Agenda Digital / WhatsApp">
                      <i class="ri-article-line me-1"></i> Agenda
                    </button>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </BCard>
    </div>

    <!-- ========================================================================================== -->
    <!-- MODAL 1: AGENDA DIGITAL DO ALUNO (DESIGN PREMIUM SMARTPHONE PREVIEW) -->
    <!-- ========================================================================================== -->
    <div v-if="alunoModal" class="modal show d-block" style="background-color: rgba(15, 23, 42, 0.75); z-index: 1060;" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered" style="max-width: 520px;">
        <div class="modal-content border-0 shadow-lg overflow-hidden rounded-4">
          <!-- Topo Timbrado da Instituição -->
          <div class="modal-header text-white p-3 border-0" style="background: linear-gradient(135deg, #405189 0%, #299cdb 100%);">
            <div class="d-flex align-items-center gap-2">
              <span class="avatar-xs flex-shrink-0">
                <span class="avatar-title rounded-circle bg-white text-primary fw-bold fs-12">
                  CEI
                </span>
              </span>
              <div>
                <h6 class="modal-title mb-0 fs-15 text-white fw-bold">Agenda Digital da Criança</h6>
                <span class="text-white-50 fs-11">CEI Santa Filomena • Educação Infantil Integral</span>
              </div>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="alunoModal = null"></button>
          </div>

          <div class="modal-body p-4 bg-light">
            <!-- CARTÃO PRINCIPAL ESTILO APP DOS PAIS -->
            <div class="bg-white rounded-3 shadow-sm p-3 mb-3 border">
              <div class="d-flex align-items-center gap-3">
                <img :src="alunoModal.foto" class="rounded-circle avatar-lg border shadow-sm object-fit-cover" alt="Foto" />
                <div class="overflow-hidden">
                  <h4 class="fs-17 mb-0 fw-bold text-dark text-truncate">{{ alunoModal.nome }}</h4>
                  <div class="text-muted fs-12 mt-1">
                    <span class="fw-semibold text-primary">{{ getTurmaNome(alunoModal.turmaId) }}</span> • 
                    <span>{{ formatarData(dataSelecionada) }}</span>
                  </div>
                  <!-- Status de Humor & Temperatura -->
                  <div class="d-flex align-items-center gap-2 mt-2">
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle fs-11">
                      {{ getHumorLabel(getRotina(alunoModal.id).humor) }}
                    </span>
                    <span class="badge bg-light text-dark border fs-11">
                      🌡️ {{ getRotina(alunoModal.id).temperatura || '36.5' }}°C
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- VIVÊNCIA PEDAGÓGICA BNCC DO DIA -->
            <div class="bg-white rounded-3 shadow-sm p-3 mb-3 border">
              <div class="d-flex align-items-center gap-2 mb-2">
                <i class="ri-palette-line text-warning fs-16"></i>
                <h6 class="fs-12 fw-bold text-uppercase text-dark mb-0">Vivência Pedagógica (BNCC)</h6>
              </div>
              <strong class="fs-13 text-dark d-block">{{ atividadeTurma.titulo }}</strong>
              <p class="fs-12 text-muted mb-0 mt-1">{{ atividadeTurma.descricao }}</p>
            </div>

            <!-- AS 4 REFEIÇÕES NUTRITIVAS -->
            <div class="bg-white rounded-3 shadow-sm p-3 mb-3 border">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="d-flex align-items-center gap-2">
                  <i class="ri-restaurant-line text-success fs-16"></i>
                  <h6 class="fs-12 fw-bold text-uppercase text-dark mb-0">Alimentação Nutritiva do Dia</h6>
                </div>
                <span class="badge bg-success-subtle text-success fs-10">4 Refeições</span>
              </div>
              <div class="row g-2 fs-12">
                <div class="col-6">
                  <div class="p-2 rounded bg-light border-start border-3" :class="getRefeicaoBorder(getRotina(alunoModal.id).cafe)">
                    <span class="text-muted fs-10 d-block">☕ Café da Manhã:</span>
                    <strong :class="getRefeicaoCor(getRotina(alunoModal.id).cafe)">
                      {{ traduzir(getRotina(alunoModal.id).cafe) }}
                    </strong>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-2 rounded bg-light border-start border-3" :class="getRefeicaoBorder(getRotina(alunoModal.id).almoco)">
                    <span class="text-muted fs-10 d-block">🍲 Almoço:</span>
                    <strong :class="getRefeicaoCor(getRotina(alunoModal.id).almoco)">
                      {{ traduzir(getRotina(alunoModal.id).almoco) }}
                    </strong>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-2 rounded bg-light border-start border-3" :class="getRefeicaoBorder(getRotina(alunoModal.id).lanche)">
                    <span class="text-muted fs-10 d-block">🥪 Lanche:</span>
                    <strong :class="getRefeicaoCor(getRotina(alunoModal.id).lanche)">
                      {{ traduzir(getRotina(alunoModal.id).lanche) }}
                    </strong>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-2 rounded bg-light border-start border-3" :class="getRefeicaoBorder(getRotina(alunoModal.id).jantar)">
                    <span class="text-muted fs-10 d-block">🥣 Jantar:</span>
                    <strong :class="getRefeicaoCor(getRotina(alunoModal.id).jantar)">
                      {{ traduzir(getRotina(alunoModal.id).jantar) }}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- CUIDADOS, SONO & FISIOLOGIA -->
            <div class="bg-white rounded-3 shadow-sm p-3 mb-3 border">
              <div class="d-flex align-items-center gap-2 mb-2">
                <i class="ri-heart-pulse-line text-danger fs-16"></i>
                <h6 class="fs-12 fw-bold text-uppercase text-dark mb-0">Higiene & Descanso</h6>
              </div>
              <div class="row g-2 fs-12 text-center">
                <div class="col-4">
                  <div class="p-2 bg-light rounded border">
                    <span class="text-muted fs-10 d-block">Banho:</span>
                    <strong class="text-dark">{{ getRotina(alunoModal.id).banho ? '🚿 Tomou' : 'Não tomou' }}</strong>
                  </div>
                </div>
                <div class="col-4">
                  <div class="p-2 bg-light rounded border">
                    <span class="text-muted fs-10 d-block">Soneca:</span>
                    <strong class="text-dark">{{ getRotina(alunoModal.id).sono ? '😴 Dormiu bem' : 'Não dormiu' }}</strong>
                  </div>
                </div>
                <div class="col-4">
                  <div class="p-2 bg-light rounded border">
                    <span class="text-muted fs-10 d-block">Intestino:</span>
                    <strong :class="getRotina(alunoModal.id).intestino === 'normal' ? 'text-success' : 'text-danger'">
                      {{ getRotina(alunoModal.id).intestino === 'normal' ? '✓ Normal' : '⚠️ Atenção' }}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- ALERTA DE REPOSIÇÃO NA MOCHILA SE HOUVER -->
            <div v-if="getRotina(alunoModal.id).reposicaoItens?.length" class="alert alert-danger border-0 d-flex align-items-center gap-2 mb-3 shadow-xs">
              <i class="ri-alarm-warning-line fs-20"></i>
              <div>
                <strong class="fs-12 d-block">Favor repor na mochila amanhã:</strong>
                <span class="fs-12">{{ getRotina(alunoModal.id).reposicaoItens.join(', ') }}</span>
              </div>
            </div>

            <!-- RECADO DA PROFESSORA SE HOUVER -->
            <div v-if="getRotina(alunoModal.id).recado" class="alert alert-info border-0 mb-0 shadow-xs">
              <div class="d-flex align-items-center gap-2 mb-1">
                <i class="ri-message-3-line fs-16"></i>
                <strong class="fs-12">Recado Afetuoso da Educadora:</strong>
              </div>
              <p class="fs-12 mb-0 fst-italic">"{{ getRotina(alunoModal.id).recado }}"</p>
            </div>
          </div>

          <!-- Rodapé com Botões de Envio & Impressão -->
          <div class="modal-footer bg-white p-3 d-flex justify-content-between border-top">
            <button type="button" class="btn btn-light btn-sm text-muted" @click="alunoModal = null">Fechar</button>

            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-outline-success" @click="copiarTexto(alunoModal)">
                <i class="ri-file-copy-line me-1"></i> Copiar
              </button>
              <a 
                :href="getLinkWhatsAppDireto(alunoModal)" 
                target="_blank" 
                class="btn btn-sm btn-success shadow-sm"
              >
                <i class="ri-whatsapp-line me-1"></i> Enviar p/ Pai / Mãe
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================================== -->
    <!-- MODAL 2: EDITAR VIVÊNCIA / ATIVIDADE BNCC DA TURMA -->
    <!-- ========================================================================================== -->
    <div v-if="modalAtividadeAberto" class="modal show d-block" style="background-color: rgba(15, 23, 42, 0.7);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-warning text-dark p-3">
            <h5 class="modal-title mb-0 fs-15 fw-bold">
              <i class="ri-palette-line me-1"></i> Planejamento Pedagógico do Dia (BNCC)
            </h5>
            <button type="button" class="btn-close" @click="modalAtividadeAberto = false"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label text-muted fs-11 fw-bold text-uppercase">Campo de Experiências (BNCC):</label>
              <select v-model="formAtividade.campoBncc" class="form-select form-select-sm">
                <option value="O eu, o outro e o nós">O eu, o outro e o nós</option>
                <option value="Corpo, gestos e movimentos">Corpo, gestos e movimentos</option>
                <option value="Traços, sons, cores e formas">Traços, sons, cores e formas</option>
                <option value="Escuta, fala, pensamento e imaginação">Escuta, fala, pensamento e imaginação</option>
                <option value="Espaços, tempos, quantidades, relações e transformações">Espaços, tempos, quantidades, relações e transformações</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label text-muted fs-11 fw-bold text-uppercase">Título da Vivência:</label>
              <input type="text" v-model="formAtividade.titulo" class="form-control form-control-sm" placeholder="Ex: Pintura Sensorial com Cores Naturais" />
            </div>
            <div class="mb-3">
              <label class="form-label text-muted fs-11 fw-bold text-uppercase">Descrição da Atividade:</label>
              <textarea v-model="formAtividade.descricao" class="form-control form-control-sm" rows="3" placeholder="Descreva o que a turma realizou..."></textarea>
            </div>
          </div>
          <div class="modal-footer bg-light p-3">
            <button type="button" class="btn btn-secondary btn-sm" @click="modalAtividadeAberto = false">Cancelar</button>
            <button type="button" class="btn btn-primary btn-sm" @click="salvarAtividade">Salvar Vivência</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================================== -->
    <!-- MODAL 3: GERENCIAR REPOSIÇÃO DE MOCHILA (MODAL RÁPIDO) -->
    <!-- ========================================================================================== -->
    <div v-if="alunoMochilaModal" class="modal show d-block" style="background-color: rgba(15, 23, 42, 0.7);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-primary text-white p-3">
            <h5 class="modal-title mb-0 fs-14 fw-bold">
              <i class="ri-shopping-bag-line me-1"></i> Mochila • {{ alunoMochilaModal.nome.split(' ')[0] }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="alunoMochilaModal = null"></button>
          </div>
          <div class="modal-body p-3">
            <p class="text-muted fs-11 mb-2">Marque os itens que a família precisa repor amanhã:</p>
            <div class="d-flex flex-column gap-2">
              <div 
                v-for="item in itensMochilaDisponiveis" 
                :key="item"
                class="form-check p-2 rounded border cursor-pointer"
                :class="temItem(alunoMochilaModal.id, item) ? 'bg-danger-subtle border-danger' : 'bg-light'"
                @click="toggleItemReposicao(alunoMochilaModal.id, item)"
              >
                <input 
                  type="checkbox" 
                  class="form-check-input ms-0 me-2" 
                  :checked="temItem(alunoMochilaModal.id, item)" 
                  readonly 
                />
                <label class="form-check-label fs-12 fw-semibold text-dark cursor-pointer">{{ item }}</label>
              </div>
            </div>
          </div>
          <div class="modal-footer bg-light p-2">
            <button type="button" class="btn btn-primary btn-sm w-100" @click="alunoMochilaModal = null">Concluir</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================================== -->
    <!-- MODAL 4: DISPARO COLETIVO DE AGENDAS VIA WHATSAPP -->
    <!-- ========================================================================================== -->
    <div v-if="modalDisparoAberto" class="modal show d-block" style="background-color: rgba(15, 23, 42, 0.75);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg rounded-3">
          <div class="modal-header bg-success text-white p-3">
            <div class="d-flex align-items-center gap-2">
              <i class="ri-whatsapp-line fs-20"></i>
              <h5 class="modal-title mb-0 fs-16 text-white fw-bold">Disparo Coletivo de Agendas • {{ getTurmaNome(turmaSelecionadaId) }}</h5>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="modalDisparoAberto = false"></button>
          </div>
          <div class="modal-body p-4">
            <div class="alert alert-info border-0 mb-3 fs-13">
              <i class="ri-information-line me-1"></i>
              Envie a rotina diária individualmente para o WhatsApp dos responsáveis de cada criança com 1 clique.
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light fs-11 text-uppercase text-muted">
                  <tr>
                    <th>Criança</th>
                    <th>Responsável</th>
                    <th>Telefone</th>
                    <th>Status Rotina</th>
                    <th class="text-center">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="aluno in alunosPresentes" :key="aluno.id">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <img :src="aluno.foto" class="avatar-xs rounded-circle object-fit-cover" alt="Foto" />
                        <span class="fs-13 fw-bold text-dark">{{ aluno.nome }}</span>
                      </div>
                    </td>
                    <td class="fs-12 text-muted">
                      {{ aluno.responsaveis[0]?.nome || 'Mãe/Pai' }}
                    </td>
                    <td class="fs-12 text-dark fw-medium">
                      {{ aluno.responsaveis[0]?.telefone || '(31) -' }}
                    </td>
                    <td>
                      <span class="badge bg-success-subtle text-success fs-11">
                        4 refeições registradas
                      </span>
                    </td>
                    <td class="text-center">
                      <a 
                        :href="getLinkWhatsAppDireto(aluno)" 
                        target="_blank" 
                        class="btn btn-xs btn-success py-1 px-3 shadow-xs"
                      >
                        <i class="ri-whatsapp-line me-1"></i> Enviar Mensagem
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer bg-light p-3">
            <button type="button" class="btn btn-secondary btn-sm" @click="modalDisparoAberto = false">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Swal from "sweetalert2";
import Layout from "@/layouts/main.vue";
import { EscolaStorage } from "@/helpers/escola-storage";

export default {
  components: {
    Layout
  },
  data() {
    return {
      turmas: [],
      turmaSelecionadaId: 'mat1',
      dataSelecionada: new Date().toISOString().slice(0, 10),
      alunosDaTurma: [],
      rotinas: {},
      atividadeTurma: {},
      formAtividade: {},
      modalAtividadeAberto: false,
      alunoModal: null,
      alunoMochilaModal: null,
      modalDisparoAberto: false,
      filtroNomeAluno: '',
      filtroStatus: 'todos', // todos, presentes, ausentes, mochila, inclusao
      modoVisualizacao: 'cards', // cards ou express
      itensMochilaDisponiveis: [
        'Fraldas G',
        'Fraldas M',
        'Pomada Assadura',
        'Lenço Umedecido',
        'Muda de Roupa',
        'Mamadeira',
        'Toalha de Banho'
      ],
      opcoesHumor: [
        { valor: 'radiante', emoji: '😊', label: 'Radiante / Feliz' },
        { valor: 'tranquilo', emoji: '😌', label: 'Tranquilo / Calmo' },
        { valor: 'choroso', emoji: '🥺', label: 'Manhoso / Choroso' },
        { valor: 'cansado', emoji: '🥱', label: 'Cansado / Sonolento' },
        { valor: 'agitado', emoji: '⚡', label: 'Agitado / Ativo' }
      ],
      sugestoesRecado: [
        'Brincou muito e dividiu os brinquedos!',
        'Comeu todas as frutas com alegria.',
        'Participou ativamente da pintura sensorial.',
        'Precisou de um colinho extra hoje, mas ficou bem.',
        'Dormiu rápido e descansou tranquilo.'
      ]
    };
  },
  computed: {
    alunosFiltrados() {
      let lista = this.alunosDaTurma;

      // Filtro de status
      if (this.filtroStatus === 'presentes') {
        lista = lista.filter(a => this.getRotina(a.id).presente);
      } else if (this.filtroStatus === 'ausentes') {
        lista = lista.filter(a => !this.getRotina(a.id).presente);
      } else if (this.filtroStatus === 'mochila') {
        lista = lista.filter(a => this.getRotina(a.id).reposicaoItens?.length > 0);
      } else if (this.filtroStatus === 'inclusao') {
        lista = lista.filter(a => a.necessidadesEspeciais && a.necessidadesEspeciais !== 'Nenhuma');
      }

      // Filtro de busca textual
      if (this.filtroNomeAluno.trim()) {
        const busca = this.filtroNomeAluno.toLowerCase();
        lista = lista.filter(a => a.nome.toLowerCase().includes(busca));
      }

      return lista;
    },
    alunosPresentes() {
      return this.alunosDaTurma.filter(a => this.getRotina(a.id).presente);
    },
    totalPresentes() {
      return this.alunosDaTurma.filter(a => this.getRotina(a.id).presente).length;
    },
    totalAusentes() {
      return this.alunosDaTurma.filter(a => !this.getRotina(a.id).presente).length;
    },
    totalComReposicao() {
      return this.alunosDaTurma.filter(a => this.getRotina(a.id).reposicaoItens?.length > 0).length;
    },
    totalInclusao() {
      return this.alunosDaTurma.filter(a => a.necessidadesEspeciais && a.necessidadesEspeciais !== 'Nenhuma').length;
    },
    totalPreenchidos() {
      return this.alunosDaTurma.filter(a => {
        const r = this.getRotina(a.id);
        return r && (r.cafe || !r.presente);
      }).length;
    },
    percentualPreenchido() {
      if (!this.alunosDaTurma.length) return 0;
      return Math.round((this.totalPreenchidos / this.alunosDaTurma.length) * 100);
    },
    momentoAtual() {
      const hora = new Date().getHours();
      const min = new Date().getMinutes();
      const decimal = hora + min / 60;

      if (decimal < 8.5) {
        return { titulo: '07h30 • Café da Manhã & Acolhida', icone: 'ri-cup-line' };
      } else if (decimal < 11) {
        return { titulo: '09h00 • Vivências BNCC & Pátio', icone: 'ri-palette-line' };
      } else if (decimal < 12.5) {
        return { titulo: '11h00 • Almoço Nutritivo da Creche', icone: 'ri-bowl-line' };
      } else if (decimal < 14.5) {
        return { titulo: '13h00 • Higiene, Banho & Soneca', icone: 'ri-moon-line' };
      } else if (decimal < 16) {
        return { titulo: '14h30 • Lanche da Tarde & Frutas', icone: 'ri-apple-line' };
      } else if (decimal < 17) {
        return { titulo: '16h30 • Jantar Leve & Mochilas', icone: 'ri-restaurant-line' };
      }
      return { titulo: '17h00 • Portaria & Saída Segura', icone: 'ri-door-open-line' };
    }
  },
  mounted() {
    EscolaStorage.init();
    this.turmas = EscolaStorage.getTurmas();
    if (this.$route.query.turma) {
      this.turmaSelecionadaId = this.$route.query.turma;
    } else if (this.turmas.length) {
      this.turmaSelecionadaId = this.turmas[0].id;
    }
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      const res = EscolaStorage.getRotinaPorDataETurma(this.dataSelecionada, this.turmaSelecionadaId);
      this.alunosDaTurma = res.alunos;
      this.rotinas = res.rotinas;
      this.atividadeTurma = EscolaStorage.getAtividadeTurma(this.dataSelecionada, this.turmaSelecionadaId);
    },
    setDataHoje() {
      this.dataSelecionada = new Date().toISOString().slice(0, 10);
      this.carregarDados();
    },
    limparFiltros() {
      this.filtroStatus = 'todos';
      this.filtroNomeAluno = '';
    },
    getTurmaNome(id) {
      const t = this.turmas.find(item => item.id === id);
      return t ? `${t.nome} (${t.faixaEtaria})` : 'Turma';
    },
    getRotina(alunoId) {
      if (!this.rotinas[alunoId]) {
        this.rotinas[alunoId] = {
          alunoId,
          data: this.dataSelecionada,
          presente: true,
          humor: 'radiante',
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
      return this.rotinas[alunoId];
    },
    alternarPresenca(alunoId) {
      const r = this.getRotina(alunoId);
      r.presente = !r.presente;
      EscolaStorage.salvarItemRotina(this.dataSelecionada, alunoId, r);
    },
    setRefeicao(alunoId, tipo, valor) {
      const r = this.getRotina(alunoId);
      r[tipo] = valor;
      EscolaStorage.salvarItemRotina(this.dataSelecionada, alunoId, r);
    },
    setCampo(alunoId, campo, valor) {
      const r = this.getRotina(alunoId);
      r[campo] = valor;
      EscolaStorage.salvarItemRotina(this.dataSelecionada, alunoId, r);
    },
    salvarCampo(alunoId) {
      const r = this.getRotina(alunoId);
      EscolaStorage.salvarItemRotina(this.dataSelecionada, alunoId, r);
    },
    toggleItemReposicao(alunoId, item) {
      const r = this.getRotina(alunoId);
      if (!r.reposicaoItens) r.reposicaoItens = [];
      const idx = r.reposicaoItens.indexOf(item);
      if (idx >= 0) {
        r.reposicaoItens.splice(idx, 1);
      } else {
        r.reposicaoItens.push(item);
      }
      EscolaStorage.salvarItemRotina(this.dataSelecionada, alunoId, r);
    },
    temItem(alunoId, item) {
      const r = this.getRotina(alunoId);
      return r.reposicaoItens && r.reposicaoItens.includes(item);
    },
    salvarRecado(alunoId) {
      const r = this.getRotina(alunoId);
      EscolaStorage.salvarItemRotina(this.dataSelecionada, alunoId, r);
      Swal.fire({
        icon: 'success',
        title: 'Recado salvo!',
        text: 'O recado fará parte da agenda digital desta criança.',
        timer: 1200,
        showConfirmButton: false
      });
    },
    aplicarSugestao(alunoId, texto) {
      const r = this.getRotina(alunoId);
      r.recado = r.recado ? `${r.recado} ${texto}` : texto;
      this.salvarRecado(alunoId);
    },
    marcarRefeicaoTurmaToda(tipo, valor) {
      const nomeRef = { cafe: 'Café da Manhã', almoco: 'Almoço', lanche: 'Lanche da Tarde', jantar: 'Jantar' }[tipo];
      this.alunosDaTurma.forEach(a => {
        const r = this.getRotina(a.id);
        if (r.presente) {
          r[tipo] = valor;
          EscolaStorage.salvarItemRotina(this.dataSelecionada, a.id, r);
        }
      });
      Swal.fire({
        icon: 'success',
        title: 'Atualizado!',
        text: `${nomeRef} marcado como "${valor.toUpperCase()}" para todos os alunos presentes.`,
        timer: 1400,
        showConfirmButton: false
      });
    },
    preencherPadraoParaTodos() {
      Swal.fire({
        title: "Preencher Toda a Turma?",
        text: 'Marcar as 4 refeições "Tudo", banho "Sim", soneca "Dormiu" e intestino "Normal" para todos os presentes?',
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0ab39c",
        cancelButtonColor: "#878a99",
        confirmButtonText: "Sim, preencher todos",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.alunosDaTurma.forEach(a => {
            const r = this.getRotina(a.id);
            if (r.presente) {
              r.cafe = 'completo';
              r.almoco = 'completo';
              r.lanche = 'completo';
              r.jantar = 'completo';
              r.banho = true;
              r.sono = true;
              r.intestino = 'normal';
              r.humor = 'radiante';
              EscolaStorage.salvarItemRotina(this.dataSelecionada, a.id, r);
            }
          });
          Swal.fire({
            icon: "success",
            title: "Turma 100% Preenchida!",
            text: 'Todos os registros foram atualizados com sucesso.',
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    },
    abrirCartao(aluno) {
      this.alunoModal = aluno;
    },
    abrirModalMochila(aluno) {
      this.alunoMochilaModal = aluno;
    },
    abrirModalAtividade() {
      this.formAtividade = { ...this.atividadeTurma };
      this.modalAtividadeAberto = true;
    },
    salvarAtividade() {
      this.atividadeTurma = EscolaStorage.salvarAtividadeTurma(this.dataSelecionada, this.turmaSelecionadaId, this.formAtividade);
      this.modalAtividadeAberto = false;
      Swal.fire({
        icon: 'success',
        title: 'Planejamento Salvo!',
        text: 'A vivência BNCC foi atualizada e agora integra a agenda de todas as crianças.',
        timer: 1400,
        showConfirmButton: false
      });
    },
    abrirModalDisparoColetivo() {
      this.modalDisparoAberto = true;
    },
    traduzir(st) {
      if (st === 'completo') return 'Comeu tudo ✓';
      if (st === 'parcial') return 'Parcial';
      if (st === 'nao') return 'Recusou';
      return st || 'Não registrado';
    },
    getRefeicaoCor(st) {
      if (st === 'completo') return 'text-success';
      if (st === 'parcial') return 'text-warning';
      if (st === 'nao') return 'text-danger';
      return 'text-muted';
    },
    getRefeicaoBorder(st) {
      if (st === 'completo') return 'border-success';
      if (st === 'parcial') return 'border-warning';
      if (st === 'nao') return 'border-danger';
      return 'border-secondary';
    },
    getHumorLabel(valor) {
      const h = this.opcoesHumor.find(item => item.valor === valor);
      return h ? `${h.emoji} ${h.label}` : '😊 Tranquilo';
    },
    isFebre(tempStr) {
      if (!tempStr) return false;
      const num = parseFloat(String(tempStr).replace(',', '.'));
      return !isNaN(num) && num >= 37.6;
    },
    formatarData(dt) {
      if (!dt) return '';
      const p = dt.split('-');
      if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
      return dt;
    },
    gerarTextoAgenda(aluno) {
      const r = this.getRotina(aluno.id);
      return `🧸 *CEI Santa Filomena - Agenda da Criança*\n` +
             `*Criança:* ${aluno.nome}\n` +
             `*Turma:* ${this.getTurmaNome(aluno.turmaId)}\n` +
             `*Data:* ${this.formatarData(this.dataSelecionada)} (Integral 07h-17h)\n` +
             `*Humor:* ${this.getHumorLabel(r.humor)} | *Temp:* ${r.temperatura || '36.5'}°C\n\n` +
             `🎨 *Vivência do Dia (BNCC):*\n${this.atividadeTurma.titulo}\n_${this.atividadeTurma.descricao}_\n\n` +
             `🍽️ *Alimentação Integral:*\n` +
             `• Café da Manhã: ${this.traduzir(r.cafe)}\n` +
             `• Almoço Nutritivo: ${this.traduzir(r.almoco)}\n` +
             `• Lanche da Tarde: ${this.traduzir(r.lanche)}\n` +
             `• Jantar Leve: ${this.traduzir(r.jantar)}\n\n` +
             `💤 *Higiene & Descanso:*\n` +
             `• Banho: ${r.banho ? 'Tomou banho na creche 🚿' : 'Não tomou'}\n` +
             `• Soneca: ${r.sono ? 'Dormiu bem 😴' : 'Não dormiu'}\n` +
             `• Evacuação: ${r.intestino === 'normal' ? 'Normal ✓' : 'Atenção ⚠️'}\n` +
             (r.reposicaoItens?.length ? `\n🎒 *FAVOR ENVIAR NA MOCHILA:* ${r.reposicaoItens.join(', ')}\n` : '') +
             (r.recado ? `\n💌 *Recado da Tia:* "${r.recado}"\n` : '') +
             `\n_Fundação Santa Filomena • SEDUC Contagem - MG_`;
    },
    copiarTexto(aluno) {
      const texto = this.gerarTextoAgenda(aluno);
      navigator.clipboard.writeText(texto).then(() => {
        Swal.fire({
          icon: "success",
          title: "Mensagem Copiada!",
          text: "Texto da rotina pronto para colar no WhatsApp dos pais.",
          timer: 1600,
          showConfirmButton: false
        });
      });
    },
    getLinkWhatsAppDireto(aluno) {
      const tel = aluno.responsaveis?.[0]?.telefone || '';
      const texto = encodeURIComponent(this.gerarTextoAgenda(aluno));
      return `https://wa.me/55${tel}?text=${texto}`;
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.hover-badge:hover {
  background-color: #e2e8f0 !important;
  color: #1e293b !important;
}
.card-aluno {
  border-left: 4px solid #405189 !important;
  transition: all 0.2s ease-in-out;
}
.card-aluno:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08) !important;
}
.card-falta {
  border-left: 4px solid #f06548 !important;
  opacity: 0.88;
}
.banner-pedagogico {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-left: 4px solid #f59e0b !important;
}
.btn-xs {
  font-size: 11px;
}
.badge-xs {
  font-size: 9px;
  padding: 2px 4px;
}
.shadow-xs {
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.express-table th, .express-table td {
  padding: 8px 10px;
}
</style>
