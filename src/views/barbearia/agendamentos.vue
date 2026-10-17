<template>
  <Layout>
    <PageHeader title="Agenda & Horários da Barbearia" pageTitle="BarberFlow Pro" />

    <!-- BARRA SUPERIOR DE FILTROS & AÇÕES RÁPIDAS -->
    <BCard no-body class="shadow-sm border-0 mb-4">
      <BCardBody class="p-3">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div class="d-flex flex-wrap align-items-center gap-3">
            <!-- Seletor de Data com Mini Calendário Personalizado -->
            <div>
              <label class="form-label fs-11 text-muted text-uppercase fw-bold mb-1">Data da Agenda</label>
              <div class="d-flex align-items-center gap-1">
                <div class="input-group input-group-sm cursor-pointer shadow-2xs" @click="modalCalendarioFiltroAberto = true" title="Clique para abrir o calendário">
                  <span class="input-group-text border-end-0"><i class="ri-calendar-2-fill text-warning"></i></span>
                  <div class="form-control border-start-0 d-flex align-items-center justify-content-between pe-2" style="min-width: 125px;">
                    <span class="fs-12 fw-semibold text-body">{{ formatarData(dataFiltro) }}</span>
                    <i class="ri-arrow-down-s-line text-muted fs-14"></i>
                  </div>
                </div>
                <button type="button" @click="definirDataHoje" class="btn btn-sm btn-soft-secondary fs-11" title="Ir para hoje">Hoje</button>
              </div>
            </div>

            <!-- Filtro Barbeiro -->
            <div>
              <label class="form-label fs-11 text-muted text-uppercase fw-bold mb-1">Filtrar por Barbeiro</label>
              <select v-model="barbeiroFiltro" class="form-select form-select-sm">
                <option value="todos">Todos os Barbeiros</option>
                <option v-for="b in barbeiros" :key="b.id" :value="b.id">{{ b.apelido }} ({{ b.cadeira }})</option>
              </select>
            </div>

            <!-- Filtro Status -->
            <div>
              <label class="form-label fs-11 text-muted text-uppercase fw-bold mb-1">Status</label>
              <select v-model="statusFiltro" class="form-select form-select-sm">
                <option value="todos">Todos os Status</option>
                <option value="confirmado">Confirmados</option>
                <option value="aguardando">Aguardando no Lounge</option>
                <option value="em_atendimento">Na Cadeira</option>
                <option value="concluido">Concluídos</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
          </div>

          <div class="d-flex align-items-center gap-2">
            <!-- Botão Novo Agendamento Premium -->
            <button @click="abrirModalNovo" class="btn btn-warning fw-bold btn-sm shadow-sm px-3 py-2 text-dark">
              <i class="ri-add-circle-fill align-middle me-1 fs-14"></i> Novo Agendamento
            </button>
            <!-- Botão Enviar Lembrete em Massa -->
            <button @click="enviarLembretesDia" class="btn btn-outline-success fw-semibold btn-sm py-2" title="Disparar confirmação para agendados">
              <i class="ri-whatsapp-line align-middle me-1"></i> Confirmar Dia no WhatsApp
            </button>
          </div>
        </div>
      </BCardBody>
    </BCard>

    <!-- CARDS RESUMO DO DIA SELECIONADO -->
    <BRow class="mb-3">
      <BCol md="3" sm="6">
        <div class="card bg-primary-subtle border-0 shadow-sm p-3 mb-3 card-hover card-resumo-primary">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-muted fs-12 mb-0 fw-semibold text-uppercase">Total Agendados</p>
              <h4 class="text-primary fw-bold mb-0 mt-1 fs-22">{{ agendamentosFiltrados.length }}</h4>
            </div>
            <div class="avatar-sm">
              <span class="avatar-title bg-primary text-white rounded-circle fs-18 shadow-sm">
                <i class="ri-calendar-event-line"></i>
              </span>
            </div>
          </div>
        </div>
      </BCol>
      <BCol md="3" sm="6">
        <div class="card bg-success-subtle border-0 shadow-sm p-3 mb-3 card-hover card-resumo-success">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-muted fs-12 mb-0 fw-semibold text-uppercase">Concluídos</p>
              <h4 class="text-success fw-bold mb-0 mt-1 fs-22">{{ agendamentosFiltrados.filter(a => a.status === 'concluido').length }}</h4>
            </div>
            <div class="avatar-sm">
              <span class="avatar-title bg-success text-white rounded-circle fs-18 shadow-sm">
                <i class="ri-check-double-line"></i>
              </span>
            </div>
          </div>
        </div>
      </BCol>
      <BCol md="3" sm="6">
        <div class="card bg-warning-subtle border-0 shadow-sm p-3 mb-3 card-hover card-resumo-warning">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-muted fs-12 mb-0 fw-semibold text-uppercase">Em Andamento</p>
              <h4 class="text-warning fw-bold mb-0 mt-1 fs-22">{{ agendamentosFiltrados.filter(a => a.status === 'em_atendimento').length }}</h4>
            </div>
            <div class="avatar-sm">
              <span class="avatar-title bg-warning text-dark rounded-circle fs-18 shadow-sm">
                <i class="ri-scissors-2-fill"></i>
              </span>
            </div>
          </div>
        </div>
      </BCol>
      <BCol md="3" sm="6">
        <div class="card bg-info-subtle border-0 shadow-sm p-3 mb-3 card-hover card-resumo-info">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-muted fs-12 mb-0 fw-semibold text-uppercase">Faturamento Previsto</p>
              <h4 class="text-info fw-bold mb-0 mt-1 fs-22">R$ {{ totalFaturamentoPrevisto.toFixed(2) }}</h4>
            </div>
            <div class="avatar-sm">
              <span class="avatar-title bg-info text-white rounded-circle fs-18 shadow-sm">
                <i class="ri-money-dollar-circle-fill"></i>
              </span>
            </div>
          </div>
        </div>
      </BCol>
    </BRow>

    <!-- GRADE DE HORÁRIOS & TABELA INTERATIVA -->
    <BCard no-body class="shadow-sm border-0">
      <BCardHeader class="d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom py-3">
        <div>
          <div class="d-flex align-items-center gap-2">
            <h5 class="card-title mb-0 fs-15 fw-bold text-body">
              <i class="ri-time-line text-warning me-1"></i> Agendamentos • {{ formatarDataExtensa(dataFiltro) }}
            </h5>
            <span class="badge bg-dark text-warning fs-11">{{ agendamentosFiltrados.length }} horários</span>
          </div>
          <span class="text-muted fs-12">
            <i class="ri-information-line text-primary"></i> Clique em qualquer linha ou card para abrir os <strong class="text-body">detalhes e editar</strong> as informações.
          </span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div class="btn-group btn-group-sm shadow-none">
            <button @click="modoExibicao = 'tabela'" class="btn" :class="modoExibicao === 'tabela' ? 'btn-primary' : 'btn-soft-secondary'">
              <i class="ri-list-check me-1"></i> Lista
            </button>
            <button @click="modoExibicao = 'cards'" class="btn" :class="modoExibicao === 'cards' ? 'btn-primary' : 'btn-soft-secondary'">
              <i class="ri-grid-fill me-1"></i> Grade Barbeiros
            </button>
          </div>
        </div>
      </BCardHeader>

      <!-- VISÃO EM TABELA INTERATIVA (CLIQUE PARA ABRIR MODAL) -->
      <BCardBody v-if="modoExibicao === 'tabela'" class="p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 table-nowrap">
            <thead class="table-light fs-12 text-muted">
              <tr>
                <th style="width: 100px;">Horário</th>
                <th>Cliente</th>
                <th>Contato / WhatsApp</th>
                <th>Barbeiro / Cadeira</th>
                <th>Serviço(s) Contratados</th>
                <th>Duração</th>
                <th>Valor Total</th>
                <th>Status</th>
                <th class="text-end">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody class="fs-13">
              <tr v-if="agendamentosFiltrados.length === 0">
                <td colspan="9" class="text-center py-5 text-muted">
                  <div class="avatar-lg mx-auto mb-2 text-muted opacity-50">
                    <i class="ri-calendar-close-line fs-48"></i>
                  </div>
                  <h6 class="text-body fw-bold">Nenhum agendamento encontrado</h6>
                  <p class="fs-12 text-muted mb-3">Não há horários marcados para esta data ou filtro selecionado.</p>
                  <button @click="abrirModalNovo" class="btn btn-sm btn-warning fw-semibold text-dark">
                    <i class="ri-add-line"></i> Agendar Primeiro Horário
                  </button>
                </td>
              </tr>
              <tr v-for="ag in agendamentosPaginados" :key="ag.id" @click="abrirDetalhesAgendamento(ag)" class="cursor-pointer row-agendamento">
                <td>
                  <span class="badge bg-dark text-warning fs-12 fw-bold px-2 py-1 shadow-sm">
                    <i class="ri-time-line me-1"></i> {{ ag.horario }}
                  </span>
                </td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="avatar-xs flex-shrink-0">
                      <span class="avatar-title rounded-circle bg-warning text-dark fw-bold fs-12 border">
                        {{ ag.clienteNome.substring(0, 2).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <h6 class="fs-13 mb-0 fw-bold text-body">{{ ag.clienteNome }}</h6>
                      <small class="text-muted fs-11" v-if="getClienteData(ag.clienteId)">
                        ★ {{ getClienteData(ag.clienteId).totalVisitas }} cortes realizados
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <a :href="gerarLinkWhatsApp(ag)" target="_blank" @click.stop class="badge bg-success-subtle text-success fs-12 text-decoration-none border border-success-subtle">
                    <i class="ri-whatsapp-line align-middle me-1"></i> {{ ag.clienteTelefone }}
                  </a>
                </td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img :src="getFotoBarbeiro(ag.barbeiroId)" class="avatar-xs rounded-circle object-fit-cover shadow-sm border" />
                    <div>
                      <span class="fw-semibold text-body fs-12">{{ getNomeBarbeiro(ag.barbeiroId) }}</span>
                      <span class="d-block fs-11 text-muted">{{ getCadeiraBarbeiro(ag.barbeiroId) }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-wrap gap-1">
                    <span v-for="s in ag.servicos" :key="s.id" class="badge bg-light text-body border">
                      {{ s.nome }}
                    </span>
                  </div>
                  <small v-if="ag.observacoes" class="text-muted d-block mt-1 fst-italic text-truncate" style="max-width: 200px;">
                    <i class="ri-chat-1-line text-warning"></i> {{ ag.observacoes }}
                  </small>
                </td>
                <td>
                  <span class="text-muted fs-12">
                    <i class="ri-timer-line text-primary"></i> {{ ag.duracaoTotalMin }} min
                  </span>
                </td>
                <td>
                  <strong class="text-success fs-14">R$ {{ ag.valorTotal.toFixed(2) }}</strong>
                </td>
                <td>
                  <span class="badge fs-11 px-2 py-1"
                    :class="{
                      'bg-warning-subtle text-warning border border-warning': ag.status === 'em_atendimento',
                      'bg-info-subtle text-info border border-info': ag.status === 'aguardando',
                      'bg-primary-subtle text-primary border border-primary': ag.status === 'confirmado',
                      'bg-success-subtle text-success border border-success': ag.status === 'concluido',
                      'bg-danger-subtle text-danger border border-danger': ag.status === 'cancelado'
                    }">
                    <i :class="getStatusIcon(ag.status)" class="me-1"></i>
                    {{ getStatusLabel(ag.status) }}
                  </span>
                </td>
                <td class="text-end" @click.stop>
                  <div class="d-flex align-items-center justify-content-end gap-1">
                    <button v-if="ag.status === 'confirmado'" @click="mudarStatus(ag, 'aguardando')" class="btn btn-xs btn-outline-info" title="Marcar Chegada no Lounge">
                      <i class="ri-cup-line"></i> Lounge
                    </button>
                    <button v-if="ag.status === 'aguardando' || ag.status === 'confirmado'" @click="mudarStatus(ag, 'em_atendimento')" class="btn btn-xs btn-success" title="Iniciar Atendimento">
                      <i class="ri-scissors-2-fill"></i> Iniciar
                    </button>
                    <button v-if="ag.status === 'em_atendimento'" @click="mudarStatus(ag, 'concluido')" class="btn btn-xs btn-primary" title="Finalizar Corte">
                      <i class="ri-check-double-line"></i> Concluir
                    </button>
                    <button @click="abrirDetalhesAgendamento(ag)" class="btn btn-xs btn-soft-secondary" title="Ver Detalhes & Editar">
                      <i class="ri-eye-line text-body"></i>
                    </button>
                    <button @click="cancelarAgendamento(ag)" class="btn btn-xs btn-outline-danger" title="Cancelar Horário">
                      <i class="ri-close-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PAGINAÇÃO DA TABELA -->
        <div v-if="agendamentosFiltrados.length > 0" class="d-flex flex-wrap align-items-center justify-content-between p-3 border-top gap-2">
          <div class="d-flex align-items-center gap-3">
            <span class="fs-12 text-muted">
              Mostrando <strong class="text-body">{{ indiceInicio + 1 }}</strong> a 
              <strong class="text-body">{{ indiceFim }}</strong> de 
              <strong class="text-body">{{ agendamentosFiltrados.length }}</strong> agendamentos
            </span>
            <div class="d-flex align-items-center gap-1">
              <span class="fs-11 text-muted text-uppercase fw-semibold">Por página:</span>
              <select v-model.number="itensPorPagina" class="form-select form-select-sm py-0 px-2" style="width: 70px; height: 28px; font-size: 11px;">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="15">15</option>
                <option :value="25">25</option>
              </select>
            </div>
          </div>

          <div class="d-flex align-items-center gap-1" v-if="totalPaginas > 1">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: paginaAtual === 1 }">
                <button type="button" class="page-link" @click="irParaPagina(1)" title="Primeira página" :disabled="paginaAtual === 1">
                  <i class="ri-arrow-left-double-line"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: paginaAtual === 1 }">
                <button type="button" class="page-link" @click="paginaAnterior" title="Anterior" :disabled="paginaAtual === 1">
                  <i class="ri-arrow-left-s-line"></i>
                </button>
              </li>
              <li v-for="p in paginasVisiveis" :key="p" class="page-item" :class="{ active: paginaAtual === p }">
                <button type="button" class="page-link" @click="irParaPagina(p)">
                  {{ p }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: paginaAtual === totalPaginas }">
                <button type="button" class="page-link" @click="proximaPagina" title="Próximo" :disabled="paginaAtual === totalPaginas">
                  <i class="ri-arrow-right-s-line"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: paginaAtual === totalPaginas }">
                <button type="button" class="page-link" @click="irParaPagina(totalPaginas)" title="Última página" :disabled="paginaAtual === totalPaginas">
                  <i class="ri-arrow-right-double-line"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </BCardBody>

      <!-- VISÃO GRADE POR BARBEIRO -->
      <BCardBody v-else class="p-3">
        <BRow class="g-3">
          <BCol xl="3" md="6" v-for="b in barbeiros" :key="b.id">
            <div class="card h-100 border shadow-sm">
              <div class="card-header bg-dark text-white p-3 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2">
                  <img :src="b.foto" class="avatar-xs rounded-circle object-fit-cover border border-warning" />
                  <div>
                    <h6 class="text-white mb-0 fs-13 fw-bold">{{ b.apelido }}</h6>
                    <span class="text-white-50 fs-11">{{ b.cadeira }}</span>
                  </div>
                </div>
                <span class="badge bg-warning text-dark fs-11">
                  {{ getAgendamentosPorBarbeiro(b.id).length }} agendados
                </span>
              </div>
              <div class="card-body p-2 bg-light-subtle" style="max-height: 520px; overflow-y: auto;">
                <div v-if="getAgendamentosPorBarbeiro(b.id).length === 0" class="text-center py-4 text-muted fs-12">
                  <i class="ri-calendar-line fs-24 d-block mb-1 text-muted"></i>
                  Nenhum horário agendado hoje.
                </div>
                <div v-for="ag in getAgendamentosPorBarbeiro(b.id)" :key="ag.id"
                  @click="abrirDetalhesAgendamento(ag)"
                  class="card mb-2 p-2 border shadow-none bg-white cursor-pointer card-agendamento-grade">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge bg-dark text-warning fs-11">{{ ag.horario }}</span>
                    <span class="badge fs-10"
                      :class="{
                        'bg-warning-subtle text-warning': ag.status === 'em_atendimento',
                        'bg-info-subtle text-info': ag.status === 'aguardando',
                        'bg-primary-subtle text-primary': ag.status === 'confirmado',
                        'bg-success-subtle text-success': ag.status === 'concluido'
                      }">
                      {{ getStatusLabel(ag.status) }}
                    </span>
                  </div>
                  <h6 class="fs-12 fw-bold text-dark mb-1">{{ ag.clienteNome }}</h6>
                  <p class="fs-11 text-muted mb-2">
                    {{ ag.servicos.map(s => s.nome).join(', ') }}
                  </p>
                  <div class="d-flex justify-content-between align-items-center pt-2 border-top mt-1" @click.stop>
                    <span class="text-success fw-bold fs-12">R$ {{ ag.valorTotal.toFixed(2) }}</span>
                    <div class="btn-group btn-group-sm">
                      <a :href="gerarLinkWhatsApp(ag)" target="_blank" class="btn btn-xs btn-outline-success">
                        <i class="ri-whatsapp-line"></i>
                      </a>
                      <button v-if="ag.status === 'confirmado'" @click="mudarStatus(ag, 'em_atendimento')" class="btn btn-xs btn-success">
                        Iniciar
                      </button>
                      <button v-if="ag.status === 'em_atendimento'" @click="mudarStatus(ag, 'concluido')" class="btn btn-xs btn-primary">
                        Concluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BCol>
        </BRow>
      </BCardBody>
    </BCard>

    <!-- ================================================================= -->
    <!-- MODAL 1: DETALHES COMPLETOS & EDIÇÃO (REDESENHADO & PREMIUM)       -->
    <!-- ================================================================= -->
    <BModal v-model="modalDetalhes" size="lg" hide-header hide-footer body-class="p-0 border-0" dialog-class="modal-dialog-centered">
      <div v-if="agendamentoSelecionado" class="modal-detalhes-card">
        
        <!-- CABEÇALHO INTEGRADO & SOFISTICADO -->
        <div class="modal-detalhes-header p-4 pb-3 border-bottom d-flex align-items-start justify-content-between">
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-cliente-detalhes">
              {{ agendamentoSelecionado.clienteNome.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                <h4 class="fs-18 fw-bold text-body mb-0 tracking-tight">{{ agendamentoSelecionado.clienteNome }}</h4>
                <span class="badge-status-pill" :class="'status-' + agendamentoSelecionado.status">
                  <span class="status-dot"></span>
                  {{ getStatusLabel(agendamentoSelecionado.status) }}
                </span>
              </div>
              <div class="d-flex flex-wrap align-items-center gap-3 text-muted fs-12">
                <a :href="gerarLinkWhatsApp(agendamentoSelecionado)" target="_blank" class="text-success text-decoration-none fw-medium d-inline-flex align-items-center gap-1">
                  <i class="ri-whatsapp-line"></i> {{ agendamentoSelecionado.clienteTelefone }}
                </a>
                <span class="text-muted d-inline-flex align-items-center gap-1">
                  <i class="ri-calendar-line text-warning"></i> {{ formatarData(agendamentoSelecionado.data) }} às {{ agendamentoSelecionado.horario }}
                </span>
                <span class="text-muted d-inline-flex align-items-center gap-1">
                  <i class="ri-time-line text-primary"></i> {{ agendamentoSelecionado.duracaoTotalMin }} min
                </span>
              </div>
            </div>
          </div>

          <!-- Ações do Header (Editar & Fechar) -->
          <div class="d-flex align-items-center gap-2">
            <button v-if="!modoEdicaoDetalhes" @click="iniciarEdicaoDetalhes" class="btn btn-sm btn-outline-secondary rounded-pill px-3 fs-12 fw-medium">
              <i class="ri-edit-line me-1"></i> Editar
            </button>
            <button v-else @click="cancelarEdicaoDetalhes" class="btn btn-sm btn-soft-secondary rounded-pill px-3 fs-12">
              Cancelar Edição
            </button>
            <button type="button" @click="modalDetalhes = false" class="btn-modal-close" aria-label="Close">
              <i class="ri-close-line"></i>
            </button>
          </div>
        </div>

        <!-- MODO 1: VISUALIZAÇÃO DOS DETALHES -->
        <div v-if="!modoEdicaoDetalhes" class="p-4 modal-detalhes-body">
          
          <!-- BANNER ELEGANTE DO PROFISSIONAL E HORÁRIO -->
          <div class="info-strip-card p-3 mb-3 rounded-3 border">
            <BRow class="align-items-center g-3">
              <!-- Barbeiro Responsável -->
              <BCol sm="6" class="border-sm-end">
                <div class="d-flex align-items-center gap-3">
                  <img :src="getFotoBarbeiro(agendamentoSelecionado.barbeiroId)" class="avatar-sm rounded-circle object-fit-cover border shadow-2xs" />
                  <div>
                    <span class="fs-11 text-muted text-uppercase fw-semibold d-block">Barbeiro Designado</span>
                    <h6 class="fs-13 fw-bold text-body mb-0">{{ getNomeBarbeiro(agendamentoSelecionado.barbeiroId) }}</h6>
                    <span class="fs-11 text-muted">{{ getCadeiraBarbeiro(agendamentoSelecionado.barbeiroId) }}</span>
                  </div>
                </div>
              </BCol>
              <!-- Horário e Término Previsto -->
              <BCol sm="6" class="ps-sm-4">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <span class="fs-11 text-muted text-uppercase fw-semibold d-block">Horário Previsto</span>
                    <div class="d-flex align-items-baseline gap-2">
                      <h5 class="fs-16 fw-bold text-body mb-0">{{ agendamentoSelecionado.horario }}</h5>
                      <span class="fs-12 text-muted">até {{ calcularHorarioTermino(agendamentoSelecionado.horario, agendamentoSelecionado.duracaoTotalMin) }}</span>
                    </div>
                    <small class="fs-11 text-muted">{{ formatarDataExtensa(agendamentoSelecionado.data) }}</small>
                  </div>
                  <span class="badge bg-light text-body border px-2 py-1 fs-11 fw-semibold">
                    {{ agendamentoSelecionado.duracaoTotalMin }} min
                  </span>
                </div>
              </BCol>
            </BRow>
          </div>

          <!-- LISTA LIMPA DE SERVIÇOS SELECIONADOS -->
          <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fs-12 text-uppercase fw-bold text-muted tracking-wider">Serviços Contratados</span>
              <span class="badge bg-light text-muted border fs-11">{{ agendamentoSelecionado.servicos.length }} itens</span>
            </div>

            <div class="servicos-receipt-card rounded-3 border overflow-hidden">
              <div v-for="(s, idx) in agendamentoSelecionado.servicos" :key="s.id"
                class="d-flex align-items-center justify-content-between p-3"
                :class="{ 'border-bottom': idx < agendamentoSelecionado.servicos.length - 1 }">
                <div class="d-flex align-items-center gap-3">
                  <div class="servico-icon-box">
                    <i :class="s.icone || 'ri-scissors-2-line'"></i>
                  </div>
                  <div>
                    <h6 class="fs-13 fw-semibold text-body mb-0">{{ s.nome }}</h6>
                    <span class="fs-11 text-muted">{{ s.categoria || 'Serviço' }} • {{ s.duracaoMin }} minutos</span>
                  </div>
                </div>
                <div class="text-end">
                  <strong class="fs-14 fw-bold text-body">R$ {{ s.preco.toFixed(2) }}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- OBSERVAÇÕES / PREFERÊNCIAS TÉCNICAS (SE HOUVER) -->
          <div class="mb-3" v-if="agendamentoSelecionado.observacoes">
            <div class="observacoes-card p-3 rounded-3 border">
              <div class="d-flex align-items-start gap-2">
                <i class="ri-chat-1-line text-warning fs-16 mt-0"></i>
                <div>
                  <span class="fs-11 text-muted fw-bold text-uppercase d-block mb-1">Observações do Cliente & Visagismo</span>
                  <p class="fs-12 text-body mb-0 fst-italic">{{ agendamentoSelecionado.observacoes }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD FINANCEIRO & REPASSE DE COMISSÃO (DISCRETO E PROFISSIONAL) -->
          <div class="financeiro-summary-card p-3 rounded-3 border mb-4">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <span class="fs-11 text-muted text-uppercase fw-semibold d-block">Total do Atendimento</span>
                <h3 class="fs-22 fw-bold text-body mb-0">R$ {{ agendamentoSelecionado.valorTotal.toFixed(2) }}</h3>
              </div>
              <div class="text-end">
                <span class="fs-11 text-muted text-uppercase fw-semibold d-block">Comissão Estimada do Barbeiro</span>
                <span class="fs-14 fw-bold text-success">
                  R$ {{ (agendamentoSelecionado.valorTotal * (getComissaoBarbeiro(agendamentoSelecionado.barbeiroId) / 100)).toFixed(2) }}
                  <small class="text-muted fw-normal fs-11">({{ getComissaoBarbeiro(agendamentoSelecionado.barbeiroId) }}%)</small>
                </span>
              </div>
            </div>
          </div>

          <!-- RODAPÉ DE AÇÕES COM HIERARQUIA VISUAL PERFEITA -->
          <div class="modal-detalhes-footer d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top">
            <!-- Ações Principais de Fluxo -->
            <div class="d-flex flex-wrap align-items-center gap-2">
              <!-- Botão Dinâmico de Próxima Etapa -->
              <button v-if="agendamentoSelecionado.status === 'confirmado'"
                @click="mudarStatus(agendamentoSelecionado, 'aguardando')"
                class="btn btn-sm btn-dark text-warning fw-semibold px-3 py-2 shadow-2xs">
                <i class="ri-cup-line me-1"></i> Chegou no Lounge
              </button>

              <button v-if="agendamentoSelecionado.status === 'aguardando'"
                @click="mudarStatus(agendamentoSelecionado, 'em_atendimento')"
                class="btn btn-sm btn-warning text-dark fw-bold px-3 py-2 shadow-2xs">
                <i class="ri-scissors-2-fill me-1"></i> Iniciar Atendimento
              </button>

              <button v-if="agendamentoSelecionado.status === 'em_atendimento'"
                @click="mudarStatus(agendamentoSelecionado, 'concluido')"
                class="btn btn-sm btn-success fw-semibold px-3 py-2 shadow-2xs">
                <i class="ri-check-double-line me-1"></i> Concluir Atendimento
              </button>

              <!-- Botão WhatsApp -->
              <a :href="gerarLinkWhatsApp(agendamentoSelecionado)" target="_blank" class="btn btn-sm btn-outline-success fw-medium px-3 py-2">
                <i class="ri-whatsapp-line me-1"></i> WhatsApp
              </a>
            </div>

            <!-- Ações Secundárias (Cancelar e Fechar) -->
            <div class="d-flex align-items-center gap-2">
              <button @click="deletarAgendamento(agendamentoSelecionado)" class="btn btn-sm btn-link text-danger text-decoration-none px-2 fs-12">
                <i class="ri-delete-bin-line me-1"></i> Cancelar Agendamento
              </button>
              <button @click="modalDetalhes = false" class="btn btn-sm btn-light px-3 py-2">
                Fechar
              </button>
            </div>
          </div>

        </div>

        <!-- MODO 2: EDIÇÃO DO AGENDAMENTO -->
        <div v-else class="p-4 modal-detalhes-body">
          <form @submit.prevent="salvarEdicaoDetalhes">
            <BRow class="g-3">
              <BCol md="6">
                <label class="form-label fs-12 fw-semibold text-dark">Nome do Cliente <span class="text-danger">*</span></label>
                <input type="text" v-model="formEdicao.clienteNome" class="form-control form-control-sm" required />
              </BCol>
              <BCol md="6">
                <label class="form-label fs-12 fw-semibold text-dark">WhatsApp <span class="text-danger">*</span></label>
                <input type="text" v-model="formEdicao.clienteTelefone" class="form-control form-control-sm" required />
              </BCol>

              <BCol md="6">
                <label class="form-label fs-12 fw-semibold text-dark">Barbeiro Responsável <span class="text-danger">*</span></label>
                <select v-model="formEdicao.barbeiroId" class="form-select form-select-sm" required>
                  <option v-for="b in barbeiros" :key="b.id" :value="b.id">{{ b.nome }} ({{ b.cadeira }})</option>
                </select>
              </BCol>
              <BCol md="3">
                <label class="form-label fs-12 fw-semibold text-dark">Data <span class="text-danger">*</span></label>
                <input type="date" v-model="formEdicao.data" class="form-control form-control-sm" required />
              </BCol>
              <BCol md="3">
                <label class="form-label fs-12 fw-semibold text-dark">Horário <span class="text-danger">*</span></label>
                <select v-model="formEdicao.horario" class="form-select form-select-sm" required>
                  <option v-for="h in horariosPadrao" :key="h" :value="h">{{ h }}</option>
                </select>
              </BCol>

              <BCol cols="12">
                <label class="form-label fs-12 fw-semibold text-dark">Serviços Contratados</label>
                <div class="row g-2">
                  <div class="col-md-6" v-for="s in servicos" :key="s.id">
                    <div class="card p-2 mb-0 border cursor-pointer transition-all card-servico-edicao"
                      :class="{ 'selecionado': formEdicaoServicosIds.includes(s.id) }"
                      @click="toggleServicoEdicao(s.id)">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-2">
                          <input type="checkbox" :checked="formEdicaoServicosIds.includes(s.id)" class="form-check-input mt-0" />
                          <span class="fs-12 fw-medium text-dark">{{ s.nome }}</span>
                        </div>
                        <span class="text-dark fw-bold fs-12">R$ {{ s.preco.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </BCol>

              <BCol cols="12">
                <label class="form-label fs-12 fw-semibold text-dark">Status Atual</label>
                <select v-model="formEdicao.status" class="form-select form-select-sm">
                  <option value="confirmado">Confirmado</option>
                  <option value="aguardando">Aguardando no Lounge</option>
                  <option value="em_atendimento">Na Cadeira</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </BCol>

              <BCol cols="12">
                <label class="form-label fs-12 fw-semibold text-dark">Observações & Preferências</label>
                <textarea v-model="formEdicao.observacoes" class="form-control form-control-sm" rows="2"></textarea>
              </BCol>
            </BRow>

            <!-- Resumo Financeiro da Edição -->
            <div class="mt-4 p-3 bg-light rounded-3 d-flex justify-content-between align-items-center border">
              <div>
                <span class="fs-11 text-muted d-block">Nova Duração: <strong>{{ duracaoEdicaoCalculada }} min</strong></span>
                <span class="fs-11 text-muted">Término previsto: <strong>{{ calcularHorarioTermino(formEdicao.horario, duracaoEdicaoCalculada) }}</strong></span>
              </div>
              <div class="text-end">
                <span class="fs-11 text-muted d-block">NOVO VALOR TOTAL</span>
                <h4 class="text-dark fw-bold mb-0">R$ {{ valorEdicaoCalculado.toFixed(2) }}</h4>
              </div>
            </div>

            <div class="mt-4 text-end d-flex justify-content-end gap-2 border-top pt-3">
              <button type="button" @click="cancelarEdicaoDetalhes" class="btn btn-light btn-sm px-3">Descartar</button>
              <button type="submit" class="btn btn-warning fw-bold btn-sm px-4 text-dark">
                <i class="ri-check-line align-middle me-1"></i> Salvar Alterações
              </button>
            </div>
          </form>
        </div>

      </div>
    </BModal>

    <!-- ================================================================= -->
    <!-- MODAL 2: CRIAÇÃO DE NOVO AGENDAMENTO (PADRONIZADO VUE 3)          -->
    <!-- ================================================================= -->
    <ModalNovoAgendamento
      v-model="modalNovo"
      :dataPadrao="dataFiltro"
      @salvo="carregarDados"
    />

    <!-- MINI CALENDÁRIO PARA FILTRO SUPERIOR DA AGENDA -->
    <MiniCalendarioModal
      v-model:visible="modalCalendarioFiltroAberto"
      v-model="dataFiltro"
      titulo="Data da Agenda"
      @confirmar="aoMudarDataFiltro"
    />

  </Layout>
</template>

<script>
import Swal from "sweetalert2";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import MiniCalendarioModal from "@/components/barbearia/mini-calendario-modal.vue";
import ModalNovoAgendamento from "@/components/barbearia/modal-novo-agendamento.vue";
import { BarbeariaStorage } from "@/helpers/barbearia-storage";

export default {
  components: {
    Layout,
    PageHeader,
    MiniCalendarioModal,
    ModalNovoAgendamento
  },
  data() {
    return {
      modalCalendarioAberto: false,
      modalCalendarioFiltroAberto: false,
      barbeiros: [],
      servicos: [],
      clientes: [],
      agendamentos: [],

      dataFiltro: new Date().toISOString().split('T')[0],
      barbeiroFiltro: 'todos',
      statusFiltro: 'todos',
      modoExibicao: 'tabela',

      // Paginação da Tabela
      paginaAtual: 1,
      itensPorPagina: 10,

      // Modal 1: Detalhes & Edição
      modalDetalhes: false,
      modoEdicaoDetalhes: false,
      agendamentoSelecionado: null,
      formEdicao: {
        id: null,
        clienteNome: '',
        clienteTelefone: '',
        barbeiroId: '',
        data: '',
        horario: '',
        status: 'confirmado',
        observacoes: ''
      },
      formEdicaoServicosIds: [],

      // Drag e Scroll Barbeiros
      isDraggingBarbeiros: false,
      dragStartX: 0,
      dragScrollLeft: 0,

      // Modal 2: Novo Agendamento Reformulado
      modalNovo: false,
      tipoSelecaoCliente: 'cadastrado',
      clienteSelecionadoId: '',
      buscaCliente: '',
      dropdownClienteAberto: false,
      buscaServico: '',
      turnoFiltro: 'todos',
      offsetDiasCarrossel: 0,
      categoriaAtiva: 'Todos',
      categoriasServicos: ['Todos', 'Cabelo', 'Barba', 'Combo', 'Química', 'Estética'],
      novoAgendamento: {
        clienteNome: '',
        clienteTelefone: '',
        clienteId: null,
        barbeiroId: '',
        data: new Date().toISOString().split('T')[0],
        horario: '15:00',
        observacoes: ''
      },
      novoAgendamentoServicosIds: [],
      notificarWhatsAppAoSalvar: true,

      horariosManha: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
      horariosTarde: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
      horariosNoite: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'],
      horariosPadrao: [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
        '20:00', '20:30', '21:00'
      ]
    };
  },
  computed: {
    agendamentosFiltrados() {
      return this.agendamentos.filter(a => {
        const bateData = a.data === this.dataFiltro;
        const bateBarbeiro = this.barbeiroFiltro === 'todos' || a.barbeiroId === this.barbeiroFiltro;
        const bateStatus = this.statusFiltro === 'todos' || a.status === this.statusFiltro;
        return bateData && bateBarbeiro && bateStatus;
      });
    },
    totalPaginas() {
      return Math.ceil(this.agendamentosFiltrados.length / this.itensPorPagina) || 1;
    },
    indiceInicio() {
      return (this.paginaAtual - 1) * this.itensPorPagina;
    },
    indiceFim() {
      return Math.min(this.indiceInicio + this.itensPorPagina, this.agendamentosFiltrados.length);
    },
    agendamentosPaginados() {
      return this.agendamentosFiltrados.slice(this.indiceInicio, this.indiceFim);
    },
    paginasVisiveis() {
      const paginas = [];
      const maxBotoes = 5;
      let start = Math.max(1, this.paginaAtual - Math.floor(maxBotoes / 2));
      let end = Math.min(this.totalPaginas, start + maxBotoes - 1);
      if (end - start + 1 < maxBotoes) {
        start = Math.max(1, end - maxBotoes + 1);
      }
      for (let i = start; i <= end; i++) {
        paginas.push(i);
      }
      return paginas;
    },
    totalFaturamentoPrevisto() {
      return this.agendamentosFiltrados
        .filter(a => a.status !== 'cancelado')
        .reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);
    },
    clientesFiltrados() {
      if (!this.buscaCliente || !this.buscaCliente.trim()) return this.clientes;
      const q = this.buscaCliente.toLowerCase().trim();
      return this.clientes.filter(c => 
        (c.nome && c.nome.toLowerCase().includes(q)) ||
        (c.telefone && c.telefone.toLowerCase().includes(q))
      );
    },
    clienteSelecionadoObj() {
      return this.clientes.find(c => c.id === this.novoAgendamento.clienteId) || null;
    },
    servicosFiltradosPorCategoria() {
      let lista = this.servicos;
      if (this.categoriaAtiva !== 'Todos') {
        lista = lista.filter(s => s.categoria === this.categoriaAtiva);
      }
      if (this.buscaServico && this.buscaServico.trim()) {
        const q = this.buscaServico.toLowerCase().trim();
        lista = lista.filter(s => 
          (s.nome && s.nome.toLowerCase().includes(q)) ||
          (s.categoria && s.categoria.toLowerCase().includes(q))
        );
      }
      return lista;
    },
    diasCarrossel() {
      const dias = [];
      const hoje = new Date();
      hoje.setDate(hoje.getDate() + this.offsetDiasCarrossel);
      const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      for (let i = 0; i < 7; i++) {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() + i);
        const iso = d.toISOString().split('T')[0];
        const isHojeReal = iso === new Date().toISOString().split('T')[0];
        const dAmanha = new Date();
        dAmanha.setDate(dAmanha.getDate() + 1);
        const isAmanhaReal = iso === dAmanha.toISOString().split('T')[0];

        let label = nomesDias[d.getDay()];
        if (isHojeReal) label = 'Hoje';
        else if (isAmanhaReal) label = 'Amanhã';

        dias.push({
          iso,
          diaNum: d.getDate(),
          diaSemana: nomesDias[d.getDay()],
          label,
          mes: meses[d.getMonth()]
        });
      }
      return dias;
    },
    novoAgendamentoServicosObjs() {
      return this.servicos.filter(s => this.novoAgendamentoServicosIds.includes(s.id));
    },
    duracaoNovoCalculada() {
      return this.novoAgendamentoServicosObjs.reduce((acc, curr) => acc + curr.duracaoMin, 0);
    },
    valorNovoCalculado() {
      return this.novoAgendamentoServicosObjs.reduce((acc, curr) => acc + curr.preco, 0);
    },
    duracaoEdicaoCalculada() {
      return this.servicos
        .filter(s => this.formEdicaoServicosIds.includes(s.id))
        .reduce((acc, curr) => acc + curr.duracaoMin, 0);
    },
    valorEdicaoCalculado() {
      return this.servicos
        .filter(s => this.formEdicaoServicosIds.includes(s.id))
        .reduce((acc, curr) => acc + curr.preco, 0);
    },
    isDataNovoHoje() {
      return this.novoAgendamento.data === new Date().toISOString().split('T')[0];
    },
    isDataNovoAmanha() {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return this.novoAgendamento.data === d.toISOString().split('T')[0];
    }
  },
  watch: {
    barbeiroFiltro() {
      this.paginaAtual = 1;
    },
    statusFiltro() {
      this.paginaAtual = 1;
    },
    dataFiltro() {
      this.paginaAtual = 1;
    },
    itensPorPagina() {
      this.paginaAtual = 1;
    }
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      this.barbeiros = BarbeariaStorage.getBarbeiros();
      this.servicos = BarbeariaStorage.getServicos();
      this.clientes = BarbeariaStorage.getClientes();
      this.agendamentos = BarbeariaStorage.getAgendamentos();

      if (this.barbeiros.length > 0 && !this.novoAgendamento.barbeiroId) {
        this.novoAgendamento.barbeiroId = this.barbeiros[0].id;
      }
    },
    aoMudarDataFiltro(novaData) {
      this.dataFiltro = novaData;
      this.paginaAtual = 1;
      this.carregarDados();
    },
    irParaPagina(p) {
      if (p >= 1 && p <= this.totalPaginas) {
        this.paginaAtual = p;
      }
    },
    paginaAnterior() {
      if (this.paginaAtual > 1) {
        this.paginaAtual--;
      }
    },
    proximaPagina() {
      if (this.paginaAtual < this.totalPaginas) {
        this.paginaAtual++;
      }
    },
    definirDataHoje() {
      this.dataFiltro = new Date().toISOString().split('T')[0];
      this.paginaAtual = 1;
      this.carregarDados();
    },
    formatarData(dataStr) {
      if (!dataStr) return '';
      const partes = dataStr.split('-');
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      return dataStr;
    },
    formatarDataExtensa(dataStr) {
      if (!dataStr) return '';
      const [ano, mes, dia] = dataStr.split('-');
      const d = new Date(ano, mes - 1, dia);
      return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    },
    calcularHorarioTermino(horarioInicio, duracaoMinutos) {
      if (!horarioInicio || !duracaoMinutos) return horarioInicio || '--:--';
      const [h, m] = horarioInicio.split(':').map(Number);
      const totalMin = h * 60 + m + duracaoMinutos;
      const fimH = Math.floor(totalMin / 60) % 24;
      const fimM = totalMin % 60;
      return `${String(fimH).padStart(2, '0')}:${String(fimM).padStart(2, '0')}`;
    },
    getNomeBarbeiro(id) {
      const b = this.barbeiros.find(item => item.id === id);
      return b ? b.apelido : 'Barbeiro';
    },
    getFotoBarbeiro(id) {
      const b = this.barbeiros.find(item => item.id === id);
      return b ? b.foto : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
    },
    getCadeiraBarbeiro(id) {
      const b = this.barbeiros.find(item => item.id === id);
      return b ? b.cadeira : 'Cadeira Geral';
    },
    getComissaoBarbeiro(id) {
      const b = this.barbeiros.find(item => item.id === id);
      return b ? (b.comissaoServico || 50) : 50;
    },
    getClienteData(clienteId) {
      if (!clienteId) return null;
      return this.clientes.find(c => c.id === clienteId);
    },
    getStatusLabel(status) {
      const mapa = {
        'confirmado': 'Confirmado',
        'aguardando': 'No Lounge (Espera)',
        'em_atendimento': 'Na Cadeira',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado'
      };
      return mapa[status] || status;
    },
    getStatusIcon(status) {
      const mapa = {
        'confirmado': 'ri-checkbox-circle-line',
        'aguardando': 'ri-cup-line',
        'em_atendimento': 'ri-scissors-2-fill',
        'concluido': 'ri-check-double-line',
        'cancelado': 'ri-close-circle-line'
      };
      return mapa[status] || 'ri-time-line';
    },
    getAgendamentosPorBarbeiro(barbeiroId) {
      return this.agendamentosFiltrados.filter(a => a.barbeiroId === barbeiroId);
    },

    // ABRIR DETALHES DO AGENDAMENTO (AO CLICAR NA TABELA OU CARD)
    abrirDetalhesAgendamento(ag) {
      this.agendamentoSelecionado = { ...ag };
      this.modoEdicaoDetalhes = false;
      this.modalDetalhes = true;
    },
    iniciarEdicaoDetalhes() {
      this.formEdicao = {
        id: this.agendamentoSelecionado.id,
        clienteNome: this.agendamentoSelecionado.clienteNome,
        clienteTelefone: this.agendamentoSelecionado.clienteTelefone,
        barbeiroId: this.agendamentoSelecionado.barbeiroId,
        data: this.agendamentoSelecionado.data,
        horario: this.agendamentoSelecionado.horario,
        status: this.agendamentoSelecionado.status,
        observacoes: this.agendamentoSelecionado.observacoes || ''
      };
      this.formEdicaoServicosIds = (this.agendamentoSelecionado.servicos || []).map(s => s.id);
      this.modoEdicaoDetalhes = true;
    },
    cancelarEdicaoDetalhes() {
      this.modoEdicaoDetalhes = false;
    },
    toggleServicoEdicao(servId) {
      const idx = this.formEdicaoServicosIds.indexOf(servId);
      if (idx >= 0) {
        if (this.formEdicaoServicosIds.length > 1) {
          this.formEdicaoServicosIds.splice(idx, 1);
        } else {
          Swal.fire('Atenção', 'O agendamento precisa ter pelo menos um serviço.', 'warning');
        }
      } else {
        this.formEdicaoServicosIds.push(servId);
      }
    },
    salvarEdicaoDetalhes() {
      if (this.formEdicaoServicosIds.length === 0) {
        Swal.fire('Atenção', 'Selecione pelo menos um serviço.', 'warning');
        return;
      }
      const novosServs = this.servicos.filter(s => this.formEdicaoServicosIds.includes(s.id));
      const atualizado = {
        ...this.agendamentoSelecionado,
        clienteNome: this.formEdicao.clienteNome,
        clienteTelefone: this.formEdicao.clienteTelefone,
        barbeiroId: this.formEdicao.barbeiroId,
        data: this.formEdicao.data,
        horario: this.formEdicao.horario,
        status: this.formEdicao.status,
        observacoes: this.formEdicao.observacoes,
        servicos: novosServs,
        duracaoTotalMin: this.duracaoEdicaoCalculada,
        valorTotal: this.valorEdicaoCalculado
      };

      BarbeariaStorage.saveAgendamento(atualizado);
      this.agendamentoSelecionado = { ...atualizado };
      this.modoEdicaoDetalhes = false;
      this.carregarDados();

      Swal.fire({
        icon: 'success',
        title: 'Agendamento Atualizado!',
        text: 'As novas informações foram salvas com sucesso.',
        timer: 1600,
        showConfirmButton: false
      });
    },

    mudarStatus(ag, novoStatus) {
      BarbeariaStorage.updateAgendamentoStatus(ag.id, novoStatus);
      if (novoStatus === 'em_atendimento') {
        BarbeariaStorage.updateBarbeiroStatus(ag.barbeiroId, 'atendendo');
      } else if (novoStatus === 'concluido') {
        BarbeariaStorage.updateBarbeiroStatus(ag.barbeiroId, 'disponivel');
        const b = this.barbeiros.find(item => item.id === ag.barbeiroId);
        if (b) {
          b.totalCortesHoje = (b.totalCortesHoje || 0) + 1;
          BarbeariaStorage.saveBarbeiro(b);
        }
      }
      this.carregarDados();
      if (this.agendamentoSelecionado && this.agendamentoSelecionado.id === ag.id) {
        this.agendamentoSelecionado.status = novoStatus;
      }
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Status atualizado: ${this.getStatusLabel(novoStatus)}`,
        showConfirmButton: false,
        timer: 1500
      });
    },

    cancelarAgendamento(ag) {
      Swal.fire({
        title: 'Cancelar Horário?',
        text: `Deseja cancelar o horário de ${ag.clienteNome} às ${ag.horario}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, cancelar',
        cancelButtonText: 'Não',
        confirmButtonColor: '#f06548'
      }).then((result) => {
        if (result.isConfirmed) {
          BarbeariaStorage.updateAgendamentoStatus(ag.id, 'cancelado');
          this.carregarDados();
          if (this.agendamentoSelecionado && this.agendamentoSelecionado.id === ag.id) {
            this.agendamentoSelecionado.status = 'cancelado';
          }
          Swal.fire('Cancelado!', 'Horário desmarcado.', 'success');
        }
      });
    },

    deletarAgendamento(ag) {
      Swal.fire({
        title: 'Excluir Agendamento?',
        text: `Remover permanentemente o agendamento de ${ag.clienteNome}?`,
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Sim, Excluir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          BarbeariaStorage.deleteAgendamento(ag.id);
          this.modalDetalhes = false;
          this.carregarDados();
          Swal.fire('Excluído!', 'O agendamento foi removido da grade.', 'success');
        }
      });
    },

    gerarLinkWhatsApp(ag) {
      const tel = (ag.clienteTelefone || '').replace(/\D/g, '');
      const barbeiro = this.getNomeBarbeiro(ag.barbeiroId);
      const msg = `Fala ${ag.clienteNome}! Passando para confirmar seu horário na Barbearia no dia ${this.formatarData(ag.data)} às ${ag.horario} com ${barbeiro}. Chegue 5 minutinhos antes para tomar uma cerveja no lounge! 💈✂️`;
      return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
    },

    enviarLembretesDia() {
      Swal.fire({
        icon: 'success',
        title: 'Confirmações Enviadas!',
        text: `Notificações de confirmação de horário preparadas para os ${this.agendamentosFiltrados.length} clientes da data selecionada.`,
        confirmButtonColor: '#0ab39c'
      });
    },

    // AÇÕES DO NOVO MODAL DE CRIAÇÃO
    abrirModalNovo() {
      this.tipoSelecaoCliente = 'cadastrado';
      this.buscaCliente = '';
      this.buscaServico = '';
      this.dropdownClienteAberto = false;
      this.turnoFiltro = 'todos';
      this.offsetDiasCarrossel = 0;
      const c = this.clientes[0];
      this.novoAgendamento = {
        clienteId: c ? c.id : null,
        clienteNome: c ? c.nome : '',
        clienteTelefone: c ? c.telefone : '',
        barbeiroId: this.barbeiros[0] ? this.barbeiros[0].id : '',
        data: this.dataFiltro || new Date().toISOString().split('T')[0],
        horario: '15:00',
        observacoes: ''
      };
      this.novoAgendamentoServicosIds = [this.servicos[0] ? this.servicos[0].id : ''];
      this.notificarWhatsAppAoSalvar = true;
      this.modalNovo = true;
    },

    selecionarClienteDropdown(c) {
      this.novoAgendamento.clienteId = c.id;
      this.novoAgendamento.clienteNome = c.nome;
      this.novoAgendamento.clienteTelefone = c.telefone;
      if (c.barbeiroPreferidoId) {
        this.novoAgendamento.barbeiroId = c.barbeiroPreferidoId;
      }
      this.dropdownClienteAberto = false;
      this.buscaCliente = '';
    },

    alternarParaNovoClienteRapido() {
      this.tipoSelecaoCliente = 'novo';
      this.novoAgendamento.clienteNome = this.buscaCliente;
      this.novoAgendamento.clienteId = null;
      this.dropdownClienteAberto = false;
      this.buscaCliente = '';
    },

    selecionarHorario(hora) {
      if (!this.isHorarioOcupado(hora)) {
        this.novoAgendamento.horario = hora;
      }
    },

    isHorarioOcupado(horario) {
      if (!this.novoAgendamento.barbeiroId || !this.novoAgendamento.data) return false;
      return this.agendamentos.some(a => 
        a.barbeiroId === this.novoAgendamento.barbeiroId &&
        a.data === this.novoAgendamento.data &&
        a.horario === horario &&
        a.status !== 'cancelado'
      );
    },

    navegarDiasCarrossel(delta) {
      this.offsetDiasCarrossel += delta;
      if (this.offsetDiasCarrossel < 0) this.offsetDiasCarrossel = 0;
    },

    definirDataNovoAgendamento(tipo) {
      const d = new Date();
      if (tipo === 'amanha') {
        d.setDate(d.getDate() + 1);
      }
      this.offsetDiasCarrossel = 0;
      this.novoAgendamento.data = d.toISOString().split('T')[0];
    },

    aoMudarDataManual() {
      if (this.novoAgendamento.data) {
        const [ano, mes, dia] = this.novoAgendamento.data.split('-').map(Number);
        const selDate = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        selDate.setHours(0, 0, 0, 0);
        const diffTime = selDate.getTime() - hoje.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        this.offsetDiasCarrossel = diffDays >= 0 ? diffDays : 0;
      }
    },

    aoConfirmarDataModal(dataStr) {
      this.novoAgendamento.data = dataStr;
      this.aoMudarDataManual();
    },

    scrollBarbeiros(offset) {
      if (this.$refs.barbeirosScrollRef) {
        this.$refs.barbeirosScrollRef.scrollBy({ left: offset, behavior: 'smooth' });
      }
    },

    rolarBarbeirosWheel(e) {
      if (this.$refs.barbeirosScrollRef) {
        this.$refs.barbeirosScrollRef.scrollLeft += (e.deltaY || e.deltaX);
      }
    },

    iniciarDragBarbeiros(e) {
      this.isDraggingBarbeiros = true;
      this.dragStartX = e.pageX - this.$refs.barbeirosScrollRef.offsetLeft;
      this.dragScrollLeft = this.$refs.barbeirosScrollRef.scrollLeft;
    },

    pararDragBarbeiros() {
      this.isDraggingBarbeiros = false;
    },

    moverDragBarbeiros(e) {
      if (!this.isDraggingBarbeiros) return;
      e.preventDefault();
      const x = e.pageX - this.$refs.barbeirosScrollRef.offsetLeft;
      const walk = (x - this.dragStartX) * 1.5;
      this.$refs.barbeirosScrollRef.scrollLeft = this.dragScrollLeft - walk;
    },

    toggleServicoNovo(servId) {
      const idx = this.novoAgendamentoServicosIds.indexOf(servId);
      if (idx >= 0) {
        if (this.novoAgendamentoServicosIds.length > 1) {
          this.novoAgendamentoServicosIds.splice(idx, 1);
        } else {
          Swal.fire('Atenção', 'O agendamento precisa ter ao menos um serviço.', 'warning');
        }
      } else {
        this.novoAgendamentoServicosIds.push(servId);
      }
    },

    salvarNovoAgendamentoProfissional() {
      if (!this.novoAgendamento.clienteNome) {
        Swal.fire('Nome Obrigatório', 'Informe o nome do cliente.', 'warning');
        return;
      }
      if (this.novoAgendamentoServicosIds.length === 0) {
        Swal.fire('Serviço Obrigatório', 'Selecione ao menos um serviço.', 'warning');
        return;
      }

      const servs = this.servicos.filter(s => this.novoAgendamentoServicosIds.includes(s.id));
      const novo = {
        clienteId: this.novoAgendamento.clienteId,
        clienteNome: this.novoAgendamento.clienteNome,
        clienteTelefone: this.novoAgendamento.clienteTelefone,
        barbeiroId: this.novoAgendamento.barbeiroId,
        servicos: servs,
        produtos: [],
        data: this.novoAgendamento.data,
        horario: this.novoAgendamento.horario,
        duracaoTotalMin: this.duracaoNovoCalculada,
        valorTotal: this.valorNovoCalculado,
        status: 'confirmado',
        observacoes: this.novoAgendamento.observacoes
      };

      BarbeariaStorage.saveAgendamento(novo);
      this.modalNovo = false;
      this.carregarDados();

      // Se optou por notificar WhatsApp
      if (this.notificarWhatsAppAoSalvar && novo.clienteTelefone) {
        window.open(this.gerarLinkWhatsApp(novo), '_blank');
      }

      Swal.fire({
        icon: 'success',
        title: 'Horário Confirmado!',
        text: `Agendamento criado para ${novo.clienteNome} às ${novo.horario} com ${this.getNomeBarbeiro(novo.barbeiroId)}.`,
        confirmButtonColor: '#405189'
      });
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.transition-all {
  transition: all 0.2s ease-in-out;
}
.row-agendamento:hover {
  background-color: rgba(var(--vz-primary-rgb, 64, 81, 137), 0.05) !important;
}
[data-bs-theme="dark"] .row-agendamento:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
.card-hover:hover {
  transform: translateY(-2px);
  transition: transform 0.2s;
}
.card-agendamento-grade:hover {
  border-color: #f7b84b !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06) !important;
}

/* ========================================================= */
/* MODAL DETALHES & EDIÇÃO - ESTÉTICA LUXURY & SAAS CLEAN    */
/* ========================================================= */
.modal-detalhes-card {
  background-color: var(--vz-card-bg, #ffffff);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
}

.modal-detalhes-header {
  background: var(--vz-card-bg, #ffffff);
}

.avatar-cliente-detalhes {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fcd34d;
  box-shadow: 0 2px 5px rgba(245, 158, 11, 0.15);
}

.badge-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.badge-status-pill.status-em_atendimento {
  background-color: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}
.badge-status-pill.status-em_atendimento .status-dot {
  background-color: #f59e0b;
}

.badge-status-pill.status-aguardando {
  background-color: #f5f3ff;
  color: #6d28d9;
  border: 1px solid #ddd6fe;
}
.badge-status-pill.status-aguardando .status-dot {
  background-color: #8b5cf6;
}

.badge-status-pill.status-confirmado {
  background-color: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
.badge-status-pill.status-confirmado .status-dot {
  background-color: #3b82f6;
}

.badge-status-pill.status-concluido {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}
.badge-status-pill.status-concluido .status-dot {
  background-color: #10b981;
}

.badge-status-pill.status-cancelado {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
.badge-status-pill.status-cancelado .status-dot {
  background-color: #ef4444;
}

.btn-modal-close {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 16px;
  padding: 0;
}
.btn-modal-close:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.info-strip-card {
  background: #f8fafc;
  border-color: #e2e8f0 !important;
}

.servicos-receipt-card {
  border-color: #e2e8f0 !important;
}
.servico-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #fef3c7;
  color: #b45309;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.observacoes-card {
  background-color: #fcfcfc;
  border-color: #e2e8f0 !important;
  border-left: 3px solid #f59e0b !important;
}

.financeiro-summary-card {
  background: #ffffff;
  border-color: #e2e8f0 !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.card-servico-edicao {
  border-color: #e2e8f0;
}
.card-servico-edicao.selecionado {
  border-color: #f59e0b !important;
  background-color: #fffbeb !important;
}

/* ========================================================= */
/* MODAL NOVO AGENDAMENTO - ESTÉTICA SAAS MINIMALISTA        */
/* ========================================================= */
.modal-novo-card {
  background-color: var(--vz-card-bg, #ffffff);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-detalhes-body {
  max-height: calc(85vh - 90px);
  overflow-y: auto;
}

.card-barbeiro-minimal {
  position: relative;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background-color: #ffffff;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}
.card-barbeiro-minimal:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
  transform: translateY(-2px);
}
.card-barbeiro-minimal.selecionado {
  border-color: #f59e0b !important;
  background-color: #fffbeb !important;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.12);
}

.badge-check-mini {
  position: absolute;
  top: -3px;
  right: -3px;
  background-color: #f59e0b;
  color: #0f172a;
  font-size: 10px;
  font-weight: 700;
  border-radius: 50%;
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.card-servico-minimal {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background-color: #ffffff;
  transition: all 0.15s ease;
  user-select: none;
}
.card-servico-minimal:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
}
.card-servico-minimal.selecionado {
  border-color: #f59e0b !important;
  background-color: #fffbeb !important;
}
.card-servico-minimal.selecionado .servico-icon-mini {
  background-color: #fde68a;
  color: #92400e;
}

.servico-icon-mini {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.15s ease;
}

.btn-chip-minimal {
  border-radius: 8px;
  padding: 5px 11px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  color: #334155;
  transition: all 0.15s ease;
}
.btn-chip-minimal:hover {
  border-color: #f59e0b;
  background-color: #fffbeb;
  color: #b45309;
}
.btn-chip-minimal.active {
  background-color: #0f172a !important;
  color: #fbbf24 !important;
  border-color: #0f172a !important;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.25);
}

.btn-xs {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
}

.shadow-2xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.tracking-tight {
  letter-spacing: -0.02em;
}
.tracking-wider {
  letter-spacing: 0.05em;
}
.fs-9 {
  font-size: 9px;
}
.fs-10 {
  font-size: 10px;
}

/* Combobox do Cliente */
.combobox-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1040;
  background: transparent;
}
.combobox-trigger {
  border-color: #e2e8f0;
  transition: all 0.15s ease;
  user-select: none;
}
.combobox-trigger:hover {
  border-color: #f59e0b;
}
.dropdown-cliente-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1050;
  border-color: #e2e8f0;
  box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.14), 0 8px 10px -6px rgba(0, 0, 0, 0.06);
}
.item-cliente-dropdown {
  transition: all 0.15s ease;
}
.item-cliente-dropdown:hover {
  background-color: #f1f5f9;
}
.item-cliente-dropdown.selecionado-item {
  background-color: #fffbeb !important;
  border: 1px solid #fde68a;
}

/* Input Invisível para o Seletor de Data Nativo */
.input-date-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

/* ========================================================= */
/* OCULTAR COMPLETAMENTE TODAS AS BARRAS DE ROLAGEM          */
/* ========================================================= */
.modal-novo-card,
.modal-detalhes-body,
.servicos-scroll-wrapper,
.mini-calendario-strip,
.lista-clientes-scroll,
.barbeiros-scroll-strip,
.hide-scrollbar,
.no-scrollbar {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.modal-novo-card::-webkit-scrollbar,
.modal-detalhes-body::-webkit-scrollbar,
.servicos-scroll-wrapper::-webkit-scrollbar,
.mini-calendario-strip::-webkit-scrollbar,
.lista-clientes-scroll::-webkit-scrollbar,
.barbeiros-scroll-strip::-webkit-scrollbar,
.hide-scrollbar::-webkit-scrollbar,
.no-scrollbar::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
}

/* Rolagem Lateral de Barbeiros */
.barbeiros-scroll-strip {
  overflow-x: auto;
  scroll-behavior: smooth;
  cursor: grab;
  user-select: none;
}
.barbeiros-scroll-strip:active {
  cursor: grabbing;
}
.barbeiro-strip-col {
  width: 135px;
}

.nav-btn-barbeiro {
  width: 22px;
  height: 22px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border: 1px solid #e2e8f0;
}
.nav-btn-barbeiro:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.servicos-scroll-wrapper {
  max-height: 220px;
  overflow-y: auto;
}

/* Mini Calendário Personalizado */
.mini-calendario-card {
  border-color: #e2e8f0 !important;
}
.mini-calendario-strip {
  overflow-x: auto;
}
.dia-card-mini {
  min-width: 52px;
  border-color: #e2e8f0;
  background: #ffffff;
  user-select: none;
  padding: 3px 6px !important;
}
.dia-card-mini:hover {
  border-color: #f59e0b;
  background: #fffbeb;
  transform: translateY(-1px);
}
.dia-card-mini.selecionado {
  background-color: #0f172a !important;
  border-color: #0f172a !important;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.2);
}
.dia-card-mini.selecionado .dia-label {
  color: #fbbf24 !important;
}
.dia-card-mini.selecionado .dia-num {
  color: #ffffff !important;
}
.dia-card-mini.selecionado .dia-mes {
  color: #94a3b8 !important;
}

/* Turnos e Horários */
.horarios-turnos-card {
  border-color: #e2e8f0 !important;
}
.slot-ocupado-dot {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ef4444;
}
</style>
