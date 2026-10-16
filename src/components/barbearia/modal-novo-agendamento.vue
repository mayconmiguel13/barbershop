<template>
  <div>
    <BModal
      v-model="localVisible"
      size="xl"
      hide-header
      hide-footer
      body-class="p-0 border-0"
      dialog-class="modal-dialog-centered"
      @hidden="onModalHidden"
    >
      <div class="modal-novo-card" :class="{ 'theme-dark': isDarkMode, 'theme-light': !isDarkMode }">
        
        <!-- CABEÇALHO LIMPO & MODERNO -->
        <div class="p-3 px-4 border-bottom d-flex align-items-center justify-content-between modal-header-bar flex-shrink-0">
          <div>
            <div class="d-flex align-items-center gap-2">
              <span class="avatar-title bg-warning-subtle text-warning rounded-circle fs-16 fw-bold header-icon-box">
                <i class="ri-calendar-event-fill"></i>
              </span>
              <h4 class="fs-17 fw-bold modal-title-text mb-0 tracking-tight">Novo Agendamento</h4>
            </div>
            <p class="fs-12 text-muted mb-0 mt-1 ms-4 ps-2">Selecione o cliente, o profissional, os serviços e o horário desejado.</p>
          </div>
          <button type="button" @click="localVisible = false" class="btn-modal-close" aria-label="Close">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <BRow class="g-0 modal-body-row">
          <!-- COLUNA ESQUERDA: FORMULÁRIO DE SELEÇÃO -->
          <BCol lg="7" class="p-4 border-end modal-form-col">
            
            <!-- SEÇÃO 1: CLIENTE COM BUSCA INTELIGENTE (COMBOBOX) -->
            <div class="mb-4 position-relative">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <label class="fs-12 text-uppercase fw-bold text-muted mb-0 tracking-wider">
                  <i class="ri-user-3-line text-warning me-1"></i> Cliente
                </label>
                <div class="btn-group btn-group-sm">
                  <button type="button" @click="tipoSelecaoCliente = 'cadastrado'" class="btn btn-xs rounded-start-pill"
                    :class="tipoSelecaoCliente === 'cadastrado' ? 'btn-tipo-cliente-active' : 'btn-tipo-cliente-inactive'">
                    Cliente da Casa
                  </button>
                  <button type="button" @click="tipoSelecaoCliente = 'novo'" class="btn btn-xs rounded-end-pill"
                    :class="tipoSelecaoCliente === 'novo' ? 'btn-tipo-cliente-active' : 'btn-tipo-cliente-inactive'">
                    Novo / Rápido
                  </button>
                </div>
              </div>

              <!-- Seleção de Cliente Cadastrado com Busca Dinâmica -->
              <div v-if="tipoSelecaoCliente === 'cadastrado'" class="position-relative">
                <div v-if="dropdownClienteAberto" class="combobox-backdrop" @click="dropdownClienteAberto = false"></div>

                <!-- Botão de Trigger (Exibe o cliente selecionado ou convite para busca) -->
                <div v-if="clienteSelecionadoObj"
                  class="p-2 px-3 border rounded-3 bg-light-subtle d-flex align-items-center justify-content-between cursor-pointer combobox-trigger"
                  @click="dropdownClienteAberto = !dropdownClienteAberto">
                  <div class="d-flex align-items-center gap-2">
                    <div class="avatar-xs flex-shrink-0">
                      <span class="avatar-title rounded-circle bg-warning text-dark fw-bold fs-12">
                        {{ clienteSelecionadoObj.nome.substring(0, 2).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <h6 class="fs-13 fw-bold text-body mb-0">{{ clienteSelecionadoObj.nome }}</h6>
                      <span class="fs-11 text-muted">
                        <i class="ri-whatsapp-line text-success"></i> {{ clienteSelecionadoObj.telefone }} • 
                        <span class="text-body fw-semibold">{{ clienteSelecionadoObj.totalVisitas }} cortes</span> 
                        <span class="text-warning fw-bold ms-1">({{ clienteSelecionadoObj.selosFidelidade }}/10 selos VIP)</span>
                      </span>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <span class="btn btn-xs btn-outline-secondary rounded-pill">Alterar</span>
                    <i class="ri-arrow-down-s-line text-muted"></i>
                  </div>
                </div>

                <div v-else
                  class="p-2 px-3 border rounded-3 d-flex align-items-center justify-content-between cursor-pointer combobox-trigger"
                  @click="dropdownClienteAberto = true">
                  <span class="text-muted fs-12 d-flex align-items-center gap-2">
                    <i class="ri-search-line text-warning"></i> Buscar cliente por nome ou WhatsApp...
                  </span>
                  <i class="ri-arrow-down-s-line text-muted"></i>
                </div>

                <!-- Painel Flutuante de Busca do Cliente -->
                <div v-if="dropdownClienteAberto" class="dropdown-cliente-panel shadow-lg border rounded-3 p-2">
                  <div class="input-group input-group-sm mb-2">
                    <span class="input-group-text bg-light border-end-0"><i class="ri-search-line text-muted"></i></span>
                    <input type="text" v-model="buscaCliente" ref="inputBuscaCliente"
                      class="form-control border-start-0" placeholder="Digite o nome ou telefone..." autofocus />
                    <button v-if="buscaCliente" @click="buscaCliente = ''" class="btn btn-light border-start-0" type="button">
                      <i class="ri-close-line"></i>
                    </button>
                  </div>

                  <div class="lista-clientes-scroll" style="max-height: 220px; overflow-y: auto;">
                    <div v-if="clientesFiltrados.length === 0" class="text-center py-3 text-muted fs-12">
                      <p class="mb-2">Nenhum cliente encontrado com "{{ buscaCliente }}".</p>
                      <button type="button" @click="alternarParaNovoClienteRapido" class="btn btn-xs btn-outline-warning text-dark">
                        <i class="ri-user-add-line me-1"></i> Cadastrar "{{ buscaCliente }}"
                      </button>
                    </div>

                    <div v-for="c in clientesFiltrados" :key="c.id"
                      class="p-2 rounded-2 item-cliente-dropdown cursor-pointer d-flex align-items-center justify-content-between mb-1"
                      :class="{ 'selecionado-item': novoAgendamento.clienteId === c.id }"
                      @click="selecionarClienteDropdown(c)">
                      <div class="d-flex align-items-center gap-2">
                        <div class="avatar-xs flex-shrink-0">
                          <span class="avatar-title rounded-circle bg-light text-body fw-bold fs-11 border">
                            {{ c.nome.substring(0, 2).toUpperCase() }}
                          </span>
                        </div>
                        <div>
                          <strong class="fs-12 text-body d-block">{{ c.nome }}</strong>
                          <span class="fs-11 text-muted">{{ c.telefone }}</span>
                        </div>
                      </div>
                      <div class="text-end">
                        <span class="badge bg-light text-body border fs-10 d-block">{{ c.totalVisitas }} cortes</span>
                        <small class="text-warning fs-10 fw-bold">{{ c.selosFidelidade }}/10 selos</small>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center pt-2 border-top mt-1 px-1">
                    <small class="text-muted fs-10">{{ clientesFiltrados.length }} clientes disponíveis</small>
                    <button type="button" @click="dropdownClienteAberto = false" class="btn btn-xs btn-link text-muted text-decoration-none p-0">
                      Fechar
                    </button>
                  </div>
                </div>
              </div>

              <!-- Cadastro Rápido de Novo Cliente -->
              <div v-else class="row g-2">
                <div class="col-md-6">
                  <div class="input-group input-group-sm">
                    <span class="input-group-text bg-light border-end-0"><i class="ri-user-line text-muted"></i></span>
                    <input type="text" v-model="novoAgendamento.clienteNome" class="form-control border-start-0" placeholder="Nome completo" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="input-group input-group-sm">
                    <span class="input-group-text bg-light border-end-0"><i class="ri-whatsapp-line text-success"></i></span>
                    <input type="text" v-model="novoAgendamento.clienteTelefone" class="form-control border-start-0" placeholder="(11) 99999-9999" required />
                  </div>
                </div>
              </div>
            </div>

            <!-- SEÇÃO 2: PROFISSIONAL (ROLAGEM LATERAL INTERATIVA) -->
            <div class="mb-4">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <label class="fs-12 text-uppercase fw-bold text-muted mb-0 tracking-wider">
                  <i class="ri-scissors-2-line text-warning me-1"></i> Barbeiro Responsável
                </label>
                <div class="d-flex align-items-center gap-2">
                  <span class="fs-11 text-muted">{{ barbeiros.length }} profissionais</span>
                  <div class="d-flex align-items-center gap-1">
                    <button type="button" @click="scrollBarbeiros(-150)" class="btn btn-xs btn-light rounded-circle nav-btn-barbeiro" title="Ver anteriores">
                      <i class="ri-arrow-left-s-line"></i>
                    </button>
                    <button type="button" @click="scrollBarbeiros(150)" class="btn btn-xs btn-light rounded-circle nav-btn-barbeiro" title="Ver próximos">
                      <i class="ri-arrow-right-s-line"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="d-flex gap-2 overflow-x-auto pb-2 barbeiros-scroll-strip hide-scrollbar"
                ref="barbeirosScrollRef"
                @wheel.prevent="rolarBarbeirosWheel"
                @mousedown="iniciarDragBarbeiros"
                @mouseleave="pararDragBarbeiros"
                @mouseup="pararDragBarbeiros"
                @mousemove="moverDragBarbeiros">
                <div v-for="b in barbeiros" :key="b.id" class="barbeiro-strip-col flex-shrink-0">
                  <div class="card p-2 mb-0 border cursor-pointer h-100 card-barbeiro-minimal text-center transition-all"
                    :class="{ 'selecionado': novoAgendamento.barbeiroId === b.id }"
                    @click="novoAgendamento.barbeiroId = b.id">
                    <div class="position-relative d-inline-block mx-auto mb-1">
                      <img :src="b.foto" class="avatar-sm rounded-circle object-fit-cover border shadow-2xs" />
                      <span v-if="novoAgendamento.barbeiroId === b.id" class="badge-check-mini">
                        <i class="ri-check-line"></i>
                      </span>
                    </div>
                    <h6 class="fs-12 fw-bold text-body mb-0 text-truncate px-1" style="max-width: 125px;">{{ b.apelido }}</h6>
                    <small class="text-muted fs-10 d-block text-truncate">{{ b.cadeira }}</small>
                    <span class="badge mt-1 fs-9 text-nowrap"
                      :class="b.status === 'atendendo' ? 'bg-light text-muted border' : 'bg-success-subtle text-success'">
                      ● {{ b.status === 'atendendo' ? 'Em Cadeira' : 'Disponível' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- SEÇÃO 3: SERVIÇOS (COM BUSCA, CATEGORIAS E SCROLL INTELIGENTE) -->
            <div class="mb-4">
              <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                <div class="d-flex align-items-center gap-2">
                  <label class="fs-12 text-uppercase fw-bold text-muted mb-0 tracking-wider">
                    <i class="ri-service-line text-warning me-1"></i> Serviços
                  </label>
                  <span class="badge bg-warning text-dark fs-10 fw-bold">
                    {{ novoAgendamentoServicosIds.length }} selecionado(s)
                  </span>
                </div>
                <!-- Barra de Busca Rápida de Serviços -->
                <div class="input-group input-group-sm" style="max-width: 220px;">
                  <span class="input-group-text bg-light border-end-0 py-0"><i class="ri-search-line text-muted fs-11"></i></span>
                  <input type="text" v-model="buscaServico" class="form-control border-start-0 py-1 fs-11" placeholder="Buscar serviço..." />
                  <button v-if="buscaServico" @click="buscaServico = ''" class="btn btn-light btn-xs border-start-0" type="button">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
              </div>

              <!-- Categorias de Serviços -->
              <div class="d-flex flex-wrap gap-1 mb-2">
                <button v-for="cat in categoriasServicos" :key="cat" type="button"
                  @click="categoriaAtiva = cat"
                  class="btn btn-xs rounded-pill"
                  :class="categoriaAtiva === cat ? 'btn-cat-active' : 'btn-cat-inactive'">
                  {{ cat }}
                </button>
              </div>

              <!-- Container Scrollável com Altura Controlada -->
              <div class="servicos-scroll-wrapper border rounded-3 p-2 bg-light-subtle">
                <div v-if="servicosFiltradosPorCategoria.length === 0" class="text-center py-4 text-muted fs-12">
                  <i class="ri-scissors-cut-line fs-20 d-block mb-1 text-muted"></i>
                  Nenhum serviço encontrado para "{{ buscaServico }}" em {{ categoriaAtiva }}.
                </div>
                <div v-else class="row g-2">
                  <div class="col-md-6" v-for="s in servicosFiltradosPorCategoria" :key="s.id">
                    <div class="card p-2 mb-0 border cursor-pointer transition-all card-servico-minimal"
                      :class="{ 'selecionado': novoAgendamentoServicosIds.includes(s.id) }"
                      @click="toggleServicoNovo(s.id)">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-2">
                          <div class="servico-icon-mini">
                            <i :class="s.icone || 'ri-scissors-2-line'"></i>
                          </div>
                          <div>
                            <h6 class="fs-12 fw-semibold text-body mb-0">{{ s.nome }}</h6>
                            <span class="fs-11 text-muted">{{ s.duracaoMin }} min</span>
                          </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <span class="text-body fw-bold fs-12">R$ {{ s.preco.toFixed(2) }}</span>
                          <input type="checkbox" :checked="novoAgendamentoServicosIds.includes(s.id)" class="form-check-input mt-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SEÇÃO 4: DATA & HORÁRIO (MINI CALENDÁRIO COMPACTO & SEPARAÇÃO POR TURNOS) -->
            <div class="mb-4">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <label class="fs-12 text-uppercase fw-bold text-muted mb-0 tracking-wider">
                  <i class="ri-calendar-check-line text-warning me-1"></i> Data & Horário
                </label>
                <div class="d-flex align-items-center gap-1">
                  <button type="button" @click="modalCalendarioAberto = true" class="btn btn-xs btn-outline-secondary rounded-pill">
                    <i class="ri-calendar-2-line me-1 text-warning"></i> Outra Data
                  </button>
                </div>
              </div>

              <!-- MINI CALENDÁRIO PERSONALIZADO COMPACTO -->
              <div class="mini-calendario-card p-2 px-3 rounded-3 border mb-2">
                <div class="d-flex align-items-center justify-content-between mb-2 pb-1 border-bottom">
                  <div class="d-flex align-items-center gap-2">
                    <span class="fs-12 fw-bold text-body text-capitalize">
                      <i class="ri-calendar-line text-warning me-1"></i> {{ formatarDataExtensa(novoAgendamento.data) }}
                    </span>
                  </div>
                  <div class="d-flex align-items-center gap-1">
                    <button type="button" @click="navegarDiasCarrossel(-7)" class="btn btn-xs btn-light rounded-circle" title="Semana anterior">
                      <i class="ri-arrow-left-s-line"></i>
                    </button>
                    <button type="button" @click="definirDataNovoAgendamento('hoje')" class="btn btn-xs btn-light px-2" title="Hoje">
                      Hoje
                    </button>
                    <button type="button" @click="navegarDiasCarrossel(7)" class="btn btn-xs btn-light rounded-circle" title="Próxima semana">
                      <i class="ri-arrow-right-s-line"></i>
                    </button>
                  </div>
                </div>

                <!-- CARROSSEL DE DIAS COMPACTO -->
                <div class="d-flex gap-1 overflow-x-auto pb-1 mini-calendario-strip hide-scrollbar">
                  <div v-for="dia in diasCarrossel" :key="dia.iso"
                    class="dia-card-mini cursor-pointer text-center p-1 rounded-3 border transition-all flex-shrink-0"
                    :class="{ 'selecionado': novoAgendamento.data === dia.iso }"
                    @click="novoAgendamento.data = dia.iso">
                    <span class="fs-9 fw-bold text-uppercase d-block mb-0 dia-label">{{ dia.label }}</span>
                    <strong class="fs-14 d-block dia-num">{{ dia.diaNum }}</strong>
                    <span class="fs-9 text-muted d-block dia-mes">{{ dia.mes }}</span>
                  </div>
                </div>
              </div>

              <!-- HORÁRIOS SEPARADOS POR MANHÃ, TARDE E NOITE -->
              <div class="horarios-turnos-card p-3 rounded-3 border">
                <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                  <span class="fs-12 text-uppercase fw-bold text-muted tracking-wider">Horários da Grade</span>
                  <div class="btn-group btn-group-sm">
                    <button type="button" @click="turnoFiltro = 'todos'" class="btn btn-xs"
                      :class="turnoFiltro === 'todos' ? 'btn-turno-active' : 'btn-turno-inactive'">
                      Todos
                    </button>
                    <button type="button" @click="turnoFiltro = 'manha'" class="btn btn-xs"
                      :class="turnoFiltro === 'manha' ? 'btn-turno-active' : 'btn-turno-inactive'">
                      🌅 Manhã
                    </button>
                    <button type="button" @click="turnoFiltro = 'tarde'" class="btn btn-xs"
                      :class="turnoFiltro === 'tarde' ? 'btn-turno-active' : 'btn-turno-inactive'">
                      ☀️ Tarde
                    </button>
                    <button type="button" @click="turnoFiltro = 'noite'" class="btn btn-xs"
                      :class="turnoFiltro === 'noite' ? 'btn-turno-active' : 'btn-turno-inactive'">
                      🌙 Noite
                    </button>
                  </div>
                </div>

                <!-- TURNO: MANHÃ -->
                <div v-if="turnoFiltro === 'todos' || turnoFiltro === 'manha'" class="mb-3">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge bg-warning-subtle text-body border fs-11 fw-semibold">
                      🌅 Manhã (08:00 às 11:30)
                    </span>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <button v-for="hora in horariosManha" :key="hora" type="button"
                      @click="selecionarHorario(hora)"
                      :disabled="isHorarioOcupado(hora)"
                      class="btn btn-sm btn-chip-minimal position-relative"
                      :class="{
                        'active': novoAgendamento.horario === hora,
                        'ocupado': isHorarioOcupado(hora)
                      }">
                      {{ hora }}
                      <span v-if="isHorarioOcupado(hora)" class="slot-ocupado-dot" title="Horário Ocupado"></span>
                    </button>
                  </div>
                </div>

                <!-- TURNO: TARDE -->
                <div v-if="turnoFiltro === 'todos' || turnoFiltro === 'tarde'" class="mb-3">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge bg-primary-subtle text-primary border fs-11 fw-semibold">
                      ☀️ Tarde (12:00 às 17:30)
                    </span>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <button v-for="hora in horariosTarde" :key="hora" type="button"
                      @click="selecionarHorario(hora)"
                      :disabled="isHorarioOcupado(hora)"
                      class="btn btn-sm btn-chip-minimal position-relative"
                      :class="{
                        'active': novoAgendamento.horario === hora,
                        'ocupado': isHorarioOcupado(hora)
                      }">
                      {{ hora }}
                      <span v-if="isHorarioOcupado(hora)" class="slot-ocupado-dot" title="Horário Ocupado"></span>
                    </button>
                  </div>
                </div>

                <!-- TURNO: NOITE -->
                <div v-if="turnoFiltro === 'todos' || turnoFiltro === 'noite'">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="badge bg-dark text-white border fs-11 fw-semibold">
                      🌙 Noite (18:00 às 21:00)
                    </span>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <button v-for="hora in horariosNoite" :key="hora" type="button"
                      @click="selecionarHorario(hora)"
                      :disabled="isHorarioOcupado(hora)"
                      class="btn btn-sm btn-chip-minimal position-relative"
                      :class="{
                        'active': novoAgendamento.horario === hora,
                        'ocupado': isHorarioOcupado(hora)
                      }">
                      {{ hora }}
                      <span v-if="isHorarioOcupado(hora)" class="slot-ocupado-dot" title="Horário Ocupado"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- SEÇÃO 5: OBSERVAÇÕES -->
            <div>
              <label class="fs-12 text-uppercase fw-bold text-muted mb-1 tracking-wider d-block">
                Observações do Cliente & Visagismo (Opcional)
              </label>
              <input type="text" v-model="novoAgendamento.observacoes" class="form-control form-control-sm" placeholder="Ex: Cerveja cortesia ao chegar, máquina zero disfarçada" />
            </div>

          </BCol>

          <!-- COLUNA DIREITA: RESUMO MODERNO & CONFIRMAÇÃO -->
          <BCol lg="5" class="p-4 modal-summary-col">
            <div class="modal-summary-content">
              <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                <div>
                  <h6 class="fs-13 fw-bold text-body mb-0 text-uppercase tracking-wider">Resumo do Horário</h6>
                  <span class="fs-11 text-muted">Unidade Jardins • Matriz</span>
                </div>
                <span class="badge bg-warning text-dark fw-semibold fs-11">Barbearia Aberta</span>
              </div>

              <!-- Card Cliente -->
              <div class="p-3 summary-inner-card rounded-3 border mb-2 shadow-2xs">
                <span class="fs-10 text-muted text-uppercase fw-bold d-block mb-1">Cliente</span>
                <strong class="text-body fs-13 d-block">{{ novoAgendamento.clienteNome || 'Selecione ou digite o nome' }}</strong>
                <span class="fs-11 text-muted">{{ novoAgendamento.clienteTelefone || '(WhatsApp a definir)' }}</span>
              </div>

              <!-- Card Barbeiro -->
              <div class="p-3 summary-inner-card rounded-3 border mb-2 shadow-2xs">
                <span class="fs-10 text-muted text-uppercase fw-bold d-block mb-1">Profissional & Cadeira</span>
                <div class="d-flex align-items-center gap-2">
                  <img :src="getFotoBarbeiro(novoAgendamento.barbeiroId)" class="avatar-xs rounded-circle object-fit-cover border" />
                  <div>
                    <strong class="text-body fs-12 d-block">{{ getNomeBarbeiro(novoAgendamento.barbeiroId) }}</strong>
                    <span class="fs-11 text-muted">{{ getCadeiraBarbeiro(novoAgendamento.barbeiroId) }}</span>
                  </div>
                </div>
              </div>

              <!-- Card Horário -->
              <div class="p-3 summary-inner-card rounded-3 border mb-3 shadow-2xs">
                <span class="fs-10 text-muted text-uppercase fw-bold d-block mb-1">Data & Previsão</span>
                <div class="d-flex justify-content-between align-items-center">
                  <strong class="text-body fs-12">{{ formatarData(novoAgendamento.data) }} às {{ novoAgendamento.horario }}</strong>
                  <span class="badge bg-light text-body border fs-11 horario-termino-badge">
                    Até {{ calcularHorarioTermino(novoAgendamento.horario, duracaoNovoCalculada) }}
                  </span>
                </div>
              </div>

              <!-- Lista de Serviços Selecionados -->
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fs-11 text-muted text-uppercase fw-bold">Serviços Selecionados</span>
                  <span class="fs-11 text-muted">{{ duracaoNovoCalculada }} minutos</span>
                </div>
                
                <div v-if="novoAgendamentoServicosObjs.length === 0" class="p-3 summary-inner-card rounded-3 border text-center text-muted fs-12">
                  Nenhum serviço selecionado ainda.
                </div>
                <div v-else class="p-2 summary-inner-card rounded-3 border">
                  <div v-for="s in novoAgendamentoServicosObjs" :key="s.id" class="d-flex justify-content-between align-items-center py-1 border-bottom">
                    <div>
                      <span class="fs-12 fw-medium text-body">{{ s.nome }}</span>
                      <small class="text-muted d-block fs-10">{{ s.duracaoMin }} min</small>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <strong class="text-body fs-12">R$ {{ s.preco.toFixed(2) }}</strong>
                      <button type="button" @click="toggleServicoNovo(s.id)" class="btn btn-xs btn-link text-muted p-0 text-decoration-none" title="Remover">
                        <i class="ri-close-line fs-14"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bloco de Confirmação e Preço Final (Sempre Visível no Rodapé) -->
            <div class="pt-3 border-top modal-summary-footer">
              <div class="d-flex justify-content-between align-items-baseline mb-2">
                <span class="fs-11 text-muted fw-bold text-uppercase">Total a Pagar</span>
                <h3 class="total-preco-text fw-bold mb-0">R$ {{ valorNovoCalculado.toFixed(2) }}</h3>
              </div>

              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" id="checkNotificarWhatsModal" v-model="notificarWhatsAppAoSalvar">
                <label class="form-check-label fs-11 text-muted cursor-pointer" for="checkNotificarWhatsModal">
                  Abrir WhatsApp para enviar confirmação automática
                </label>
              </div>

              <div class="d-grid gap-2">
                <button type="button" @click="salvarNovoAgendamentoProfissional" class="btn btn-confirmar-modal fw-bold py-2 shadow-sm fs-13">
                  <i class="ri-check-line align-middle me-1"></i> Confirmar Agendamento
                </button>
                <button type="button" @click="localVisible = false" class="btn btn-link text-muted text-decoration-none btn-sm py-1">
                  Cancelar
                </button>
              </div>
            </div>

          </BCol>
        </BRow>

      </div>
    </BModal>

    <!-- MINI CALENDÁRIO MODAL PARA OUTRA DATA -->
    <MiniCalendarioModal
      v-model:visible="modalCalendarioAberto"
      v-model="novoAgendamento.data"
      @confirmar="aoConfirmarDataModal"
    />
  </div>
</template>

<script>
import Swal from "sweetalert2";
import MiniCalendarioModal from "@/components/barbearia/mini-calendario-modal.vue";
import { BarbeariaStorage } from "@/helpers/barbearia-storage";
import { layoutComputed } from "@/state/helpers";

export default {
  name: "ModalNovoAgendamento",
  components: {
    MiniCalendarioModal
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    dataPadrao: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    }
  },
  emits: ["update:modelValue", "update:visible", "salvo"],
  data() {
    return {
      barbeiros: [],
      servicos: [],
      clientes: [],
      agendamentos: [],

      // Controle de Tema
      currentTheme: (typeof document !== 'undefined' && document.documentElement.getAttribute('data-bs-theme')) || 'light',
      themeObserver: null,

      modalCalendarioAberto: false,
      tipoSelecaoCliente: 'cadastrado',
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
        data: this.dataPadrao || new Date().toISOString().split('T')[0],
        horario: '15:00',
        observacoes: ''
      },
      novoAgendamentoServicosIds: [],
      notificarWhatsAppAoSalvar: true,

      // Drag e Scroll Barbeiros
      isDraggingBarbeiros: false,
      dragStartX: 0,
      dragScrollLeft: 0,

      horariosManha: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
      horariosTarde: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
      horariosNoite: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.visible || this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
        this.$emit("update:visible", val);
      }
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
    ...layoutComputed,
    isDarkMode() {
      return this.currentTheme === 'dark' || this.mode === 'dark';
    }
  },
  watch: {
    localVisible(newVal) {
      if (newVal) {
        this.inicializarDados();
      }
    },
    mode(newMode) {
      if (newMode && this.currentTheme !== newMode) {
        this.currentTheme = newMode;
      }
    }
  },
  mounted() {
    this.carregarDados();
    const activeTheme = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-bs-theme')) || this.mode || 'light';
    this.currentTheme = activeTheme;

    if (typeof MutationObserver !== 'undefined') {
      this.themeObserver = new MutationObserver(() => {
        const t = document.documentElement.getAttribute('data-bs-theme') || 'light';
        if (this.currentTheme !== t) {
          this.currentTheme = t;
        }
      });
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-bs-theme']
      });
    }
  },
  beforeUnmount() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  },
  methods: {
    carregarDados() {
      BarbeariaStorage.init();
      this.barbeiros = BarbeariaStorage.getBarbeiros();
      this.servicos = BarbeariaStorage.getServicos();
      this.clientes = BarbeariaStorage.getClientes();
      this.agendamentos = BarbeariaStorage.getAgendamentos();
    },
    inicializarDados() {
      this.carregarDados();
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
        data: this.dataPadrao || new Date().toISOString().split('T')[0],
        horario: '15:00',
        observacoes: ''
      };
      this.novoAgendamentoServicosIds = [this.servicos[0] ? this.servicos[0].id : ''];
      this.notificarWhatsAppAoSalvar = true;
    },
    onModalHidden() {
      this.dropdownClienteAberto = false;
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
    formatarData(dataStr) {
      if (!dataStr) return '';
      const [ano, mes, dia] = dataStr.split('-');
      return `${dia}/${mes}/${ano}`;
    },
    formatarDataExtensa(dataStr) {
      if (!dataStr) return '';
      const [ano, mes, dia] = dataStr.split('-').map(Number);
      const d = new Date(ano, mes - 1, dia);
      const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'long' });
      const mesNome = d.toLocaleDateString('pt-BR', { month: 'long' });
      return `${diaSemana}, ${dia} de ${mesNome}`;
    },
    getNomeBarbeiro(id) {
      const b = this.barbeiros.find(item => item.id === id);
      return b ? b.apelido : 'Barbeiro';
    },
    getFotoBarbeiro(id) {
      const b = this.barbeiros.find(item => item.id === id);
      return b ? b.foto : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
    },
    getCadeiraBarbeiro(id) {
      const b = this.barbeiros.find(item => item.id === id);
      return b ? b.cadeira : 'Cadeira 01';
    },
    calcularHorarioTermino(horarioInicio, duracaoMin) {
      if (!horarioInicio) return '--:--';
      const [h, m] = horarioInicio.split(':').map(Number);
      const dataTermino = new Date();
      dataTermino.setHours(h, m + (duracaoMin || 0), 0);
      return `${String(dataTermino.getHours()).padStart(2, '0')}:${String(dataTermino.getMinutes()).padStart(2, '0')}`;
    },
    gerarLinkWhatsApp(ag) {
      const telefoneLimpo = (ag.clienteTelefone || '').replace(/\D/g, '');
      const barbeiro = this.getNomeBarbeiro(ag.barbeiroId);
      const msg = `Fala ${ag.clienteNome}! Passando para confirmar seu horário agendado para ${this.formatarData(ag.data)} às ${ag.horario} com o barbeiro ${barbeiro} na Barbearia Jardins. 💈✂️`;
      return `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(msg)}`;
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
        observacoes: this.novoAgendamento.observacoes,
        comandaId: null
      };

      BarbeariaStorage.saveAgendamento(novo);
      this.localVisible = false;
      this.$emit("salvo", novo);

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

/* ========================================================= */
/* LAYOUT E ESTRUTURA DO MODAL (SEM CORTES OU TRANSBORDAMENTO)*/
/* ========================================================= */
.modal-novo-card {
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  max-height: 88vh;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.4);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.modal-header-bar {
  flex-shrink: 0;
  border-bottom: 1px solid var(--vz-border-color, #e2e8f0);
}

.modal-body-row {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.modal-form-col {
  height: 100%;
  max-height: calc(88vh - 75px);
  overflow-y: auto;
  scrollbar-width: thin;
}

.modal-summary-col {
  height: 100%;
  max-height: calc(88vh - 75px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.modal-summary-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.modal-summary-footer {
  flex-shrink: 0;
  margin-top: auto;
}

/* Scrollbar sutil para navegação confortável */
.modal-form-col::-webkit-scrollbar,
.modal-summary-content::-webkit-scrollbar,
.servicos-scroll-wrapper::-webkit-scrollbar {
  width: 5px;
}
.modal-form-col::-webkit-scrollbar-track,
.modal-summary-content::-webkit-scrollbar-track,
.servicos-scroll-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
.modal-form-col::-webkit-scrollbar-thumb,
.modal-summary-content::-webkit-scrollbar-thumb,
.servicos-scroll-wrapper::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 4px;
}

.header-icon-box {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-modal-close {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--vz-border-color, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 16px;
  padding: 0;
}

.card-barbeiro-minimal {
  position: relative;
  border: 1.5px solid var(--vz-border-color, #e2e8f0);
  border-radius: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}
.card-barbeiro-minimal:hover {
  transform: translateY(-2px);
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
  border: 1.5px solid var(--vz-border-color, #e2e8f0);
  border-radius: 10px;
  transition: all 0.15s ease;
  user-select: none;
}

.servico-icon-mini {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 8px;
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
  transition: all 0.15s ease;
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
  transition: all 0.15s ease;
  user-select: none;
}
.dropdown-cliente-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1050;
}
.item-cliente-dropdown {
  transition: all 0.15s ease;
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
}

.servicos-scroll-wrapper {
  max-height: 220px;
  overflow-y: auto;
}

.mini-calendario-strip {
  overflow-x: auto;
}
.dia-card-mini {
  min-width: 52px;
  user-select: none;
  padding: 3px 6px !important;
}
.dia-card-mini:hover {
  border-color: #f59e0b;
  transform: translateY(-1px);
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

/* ========================================================= */
/* TEMA CLARO (LIGHT MODE)                                   */
/* ========================================================= */
.theme-light.modal-novo-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
}
.theme-light .modal-header-bar {
  background-color: #ffffff;
  border-color: #e2e8f0 !important;
}
.theme-light .modal-title-text {
  color: #0f172a;
}
.theme-light .btn-modal-close {
  background-color: #ffffff;
  border-color: #e2e8f0;
  color: #64748b;
}
.theme-light .btn-modal-close:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}
.theme-light .modal-form-col {
  background-color: #ffffff;
  border-color: #e2e8f0 !important;
}
.theme-light .modal-summary-col {
  background-color: #f8fafc;
  border-color: #e2e8f0 !important;
}
.theme-light .summary-inner-card {
  background-color: #ffffff;
  border-color: #e2e8f0 !important;
}
.theme-light .btn-tipo-cliente-active {
  background-color: #0f172a !important;
  color: #ffffff !important;
  border-color: #0f172a !important;
}
.theme-light .btn-tipo-cliente-inactive {
  background-color: #f1f5f9 !important;
  color: #475569 !important;
  border-color: #e2e8f0 !important;
}
.theme-light .btn-cat-active {
  background-color: #0f172a !important;
  color: #ffffff !important;
  border-color: #0f172a !important;
}
.theme-light .btn-cat-inactive {
  background-color: #f1f5f9 !important;
  color: #475569 !important;
  border-color: #e2e8f0 !important;
}
.theme-light .btn-turno-active {
  background-color: #0f172a !important;
  color: #ffffff !important;
  border-color: #0f172a !important;
}
.theme-light .btn-turno-inactive {
  background-color: #f1f5f9 !important;
  color: #475569 !important;
  border-color: #e2e8f0 !important;
}
.theme-light .card-barbeiro-minimal {
  background-color: #ffffff;
  border-color: #e2e8f0;
}
.theme-light .card-barbeiro-minimal.selecionado {
  border-color: #f59e0b !important;
  background-color: rgba(245, 158, 11, 0.08) !important;
}
.theme-light .card-servico-minimal {
  background-color: #ffffff;
  border-color: #e2e8f0;
}
.theme-light .card-servico-minimal.selecionado {
  border-color: #f59e0b !important;
  background-color: rgba(245, 158, 11, 0.08) !important;
}
.theme-light .servico-icon-mini {
  background-color: #f1f5f9;
  color: #475569;
}
.theme-light .card-servico-minimal.selecionado .servico-icon-mini {
  background-color: #fde68a;
  color: #92400e;
}
.theme-light .combobox-trigger {
  background-color: #f8fafc;
  border-color: #e2e8f0;
}
.theme-light .dropdown-cliente-panel {
  background-color: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.2);
}
.theme-light .mini-calendario-card {
  background-color: #ffffff;
  border-color: #e2e8f0 !important;
}
.theme-light .dia-card-mini {
  background-color: #ffffff;
  border-color: #e2e8f0;
  color: #0f172a;
}
.theme-light .dia-card-mini.selecionado {
  background-color: #0f172a !important;
  border-color: #0f172a !important;
}
.theme-light .dia-card-mini.selecionado .dia-label {
  color: #fbbf24 !important;
}
.theme-light .dia-card-mini.selecionado .dia-num {
  color: #ffffff !important;
}
.theme-light .dia-card-mini.selecionado .dia-mes {
  color: #94a3b8 !important;
}
.theme-light .horarios-turnos-card {
  background-color: #ffffff;
  border-color: #e2e8f0 !important;
}
.theme-light .btn-chip-minimal {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  color: #0f172a;
}
.theme-light .btn-chip-minimal.active {
  background-color: #0f172a !important;
  color: #fbbf24 !important;
  border-color: #0f172a !important;
}
.theme-light .total-preco-text {
  color: #0f172a;
}
.theme-light .btn-confirmar-modal {
  background-color: #0f172a !important;
  color: #fbbf24 !important;
  border-color: #0f172a !important;
}
.theme-light .btn-confirmar-modal:hover {
  background-color: #1e293b !important;
}

/* ========================================================= */
/* TEMA ESCURO (DARK MODE PROFISSIONAL)                      */
/* ========================================================= */
.theme-dark.modal-novo-card {
  background-color: #212529 !important;
  border: 1px solid #363c44 !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7) !important;
}
.theme-dark .modal-header-bar {
  background-color: #212529 !important;
  border-color: #32383e !important;
}
.theme-dark .modal-title-text {
  color: #f8fafc !important;
}
.theme-dark .btn-modal-close {
  background-color: #282d33 !important;
  border-color: #363c44 !important;
  color: #cbd5e1 !important;
}
.theme-dark .btn-modal-close:hover {
  background-color: #32383e !important;
  color: #ffffff !important;
}
.theme-dark .modal-form-col {
  background-color: #212529 !important;
  border-color: #32383e !important;
}
.theme-dark .modal-summary-col {
  background-color: #1a1d21 !important;
  border-color: #32383e !important;
}
.theme-dark .modal-summary-footer {
  border-color: #32383e !important;
}
.theme-dark .summary-inner-card {
  background-color: #24282e !important;
  border-color: #363c44 !important;
}
.theme-dark .summary-inner-card strong,
.theme-dark .summary-inner-card .text-body {
  color: #f8fafc !important;
}
.theme-dark .horario-termino-badge {
  background-color: #2e343d !important;
  border-color: #3d454f !important;
  color: #cbd5e1 !important;
}
.theme-dark .btn-tipo-cliente-active {
  background-color: #f59e0b !important;
  color: #0f172a !important;
  border-color: #f59e0b !important;
  font-weight: 700 !important;
}
.theme-dark .btn-tipo-cliente-inactive {
  background-color: #282d33 !important;
  color: #cbd5e1 !important;
  border-color: #363c44 !important;
}
.theme-dark .btn-cat-active {
  background-color: #f59e0b !important;
  color: #0f172a !important;
  border-color: #f59e0b !important;
  font-weight: 700 !important;
}
.theme-dark .btn-cat-inactive {
  background-color: #282d33 !important;
  color: #cbd5e1 !important;
  border-color: #363c44 !important;
}
.theme-dark .btn-turno-active {
  background-color: #f59e0b !important;
  color: #0f172a !important;
  border-color: #f59e0b !important;
  font-weight: 700 !important;
}
.theme-dark .btn-turno-inactive {
  background-color: #282d33 !important;
  color: #cbd5e1 !important;
  border-color: #363c44 !important;
}
.theme-dark .card-barbeiro-minimal {
  background-color: #262b30 !important;
  border-color: #363c44 !important;
  color: #e2e8f0 !important;
}
.theme-dark .card-barbeiro-minimal:hover {
  background-color: #2d333a !important;
  border-color: #4b5563 !important;
}
.theme-dark .card-barbeiro-minimal.selecionado {
  background-color: rgba(245, 158, 11, 0.15) !important;
  border-color: #f59e0b !important;
}
.theme-dark .nav-btn-barbeiro {
  background-color: #282d33 !important;
  border-color: #363c44 !important;
  color: #cbd5e1 !important;
}
.theme-dark .card-servico-minimal {
  background-color: #262b30 !important;
  border-color: #363c44 !important;
  color: #e2e8f0 !important;
}
.theme-dark .card-servico-minimal .text-body {
  color: #f8fafc !important;
}
.theme-dark .card-servico-minimal:hover {
  background-color: #2d333a !important;
  border-color: #4b5563 !important;
}
.theme-dark .card-servico-minimal.selecionado {
  background-color: rgba(245, 158, 11, 0.15) !important;
  border-color: #f59e0b !important;
}
.theme-dark .servico-icon-mini {
  background-color: #32383e !important;
  color: #cbd5e1 !important;
}
.theme-dark .card-servico-minimal.selecionado .servico-icon-mini {
  background-color: rgba(245, 158, 11, 0.25) !important;
  color: #fbbf24 !important;
}
.theme-dark .combobox-trigger {
  background-color: #282d33 !important;
  border-color: #363c44 !important;
}
.theme-dark .combobox-trigger .text-body {
  color: #f8fafc !important;
}
.theme-dark .combobox-trigger .btn-outline-secondary {
  border-color: #4b5563 !important;
  color: #cbd5e1 !important;
  background-color: #32383e !important;
}
.theme-dark .dropdown-cliente-panel {
  background-color: #24282d !important;
  border-color: #363c44 !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7) !important;
}
.theme-dark .dropdown-cliente-panel .form-control {
  background-color: #1a1d21 !important;
  border-color: #363c44 !important;
  color: #f8fafc !important;
}
.theme-dark .item-cliente-dropdown:hover {
  background-color: #2f353d !important;
}
.theme-dark .item-cliente-dropdown.selecionado-item {
  background-color: rgba(245, 158, 11, 0.15) !important;
  border-color: #f59e0b !important;
}
.theme-dark .mini-calendario-card {
  background-color: #262b30 !important;
  border-color: #363c44 !important;
}
.theme-dark .mini-calendario-card .border-bottom {
  border-color: #363c44 !important;
}
.theme-dark .mini-calendario-card .btn-light {
  background-color: #282d33 !important;
  border-color: #363c44 !important;
  color: #cbd5e1 !important;
}
.theme-dark .btn-outline-secondary {
  border-color: #4b5563 !important;
  color: #cbd5e1 !important;
  background-color: #282d33 !important;
}
.theme-dark .dia-card-mini {
  background-color: #212529 !important;
  border-color: #363c44 !important;
  color: #f8fafc !important;
}
.theme-dark .dia-card-mini:hover {
  background-color: #2c3238 !important;
  border-color: #f59e0b !important;
}
.theme-dark .dia-card-mini.selecionado {
  background-color: #f59e0b !important;
  border-color: #f59e0b !important;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3) !important;
}
.theme-dark .dia-card-mini.selecionado .dia-label {
  color: #0f172a !important;
  font-weight: 800 !important;
}
.theme-dark .dia-card-mini.selecionado .dia-num {
  color: #0f172a !important;
  font-weight: 900 !important;
}
.theme-dark .dia-card-mini.selecionado .dia-mes {
  color: #451a03 !important;
  font-weight: 700 !important;
}
.theme-dark .horarios-turnos-card {
  background-color: #262b30 !important;
  border-color: #363c44 !important;
}
.theme-dark .horarios-turnos-card .border-bottom {
  border-color: #363c44 !important;
}
.theme-dark .btn-chip-minimal {
  background-color: #212529 !important;
  border-color: #363c44 !important;
  color: #f1f5f9 !important;
}
.theme-dark .btn-chip-minimal:hover {
  background-color: #2d333a !important;
  border-color: #f59e0b !important;
  color: #fbbf24 !important;
}
.theme-dark .btn-chip-minimal.active {
  background-color: #f59e0b !important;
  color: #0f172a !important;
  border-color: #f59e0b !important;
  font-weight: 800 !important;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35) !important;
}
.theme-dark .btn-chip-minimal.ocupado {
  background-color: #1a1d21 !important;
  border-color: #2a2f35 !important;
  color: #555b63 !important;
  opacity: 0.45;
}
.theme-dark .servicos-scroll-wrapper {
  background-color: #212529 !important;
  border-color: #363c44 !important;
}
.theme-dark .form-control {
  background-color: #282d33 !important;
  border-color: #363c44 !important;
  color: #f8fafc !important;
}
.theme-dark .input-group-text {
  background-color: #282d33 !important;
  border-color: #363c44 !important;
  color: #94a3b8 !important;
}
.theme-dark .total-preco-text {
  color: #f59e0b !important;
}
.theme-dark .btn-confirmar-modal {
  background-color: #f59e0b !important;
  color: #0f172a !important;
  border-color: #f59e0b !important;
  font-weight: 800 !important;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3) !important;
}
.theme-dark .btn-confirmar-modal:hover {
  background-color: #d97706 !important;
  border-color: #d97706 !important;
}
.theme-dark .border-bottom,
.theme-dark .border-top,
.theme-dark .border-end {
  border-color: #32383e !important;
}
</style>
