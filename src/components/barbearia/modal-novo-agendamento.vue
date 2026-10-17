<template>
  <BModal
    v-model="localVisible"
    size="xl"
    hide-header
    hide-footer
    body-class="p-0 border-0"
    dialog-class="modal-dialog-centered modal-novo-agendamento-dialog"
    @hidden="aoFecharModal"
  >
    <div class="modal-agendamento-shell" :class="[isDarkMode ? 'dark-slate' : 'light-mode']">
      
      <!-- ===================================================================== -->
      <!-- CABEÇALHO MODERNO                                                     -->
      <!-- ===================================================================== -->
      <header class="modal-header-top px-4 py-3 d-flex align-items-center justify-content-between border-bottom">
        <div class="d-flex align-items-center gap-3">
          <div class="header-icon-wrapper">
            <i class="ri-calendar-event-fill text-amber-500"></i>
          </div>
          <div>
            <div class="d-flex align-items-center gap-2">
              <h4 class="modal-title mb-0 fw-bold">Novo Agendamento</h4>
              <span class="badge bg-amber-500-subtle text-amber-500 fw-semibold fs-10 px-2 py-0.5 rounded-pill">
                BarberFlow Pro
              </span>
            </div>
            <p class="modal-subtitle mb-0 text-muted fs-12">
              Selecione o cliente, barbeiro, serviços e confira a disponibilidade de horários em tempo real.
            </p>
          </div>
        </div>
        <button
          type="button"
          class="btn-close-custom"
          @click="localVisible = false"
          aria-label="Fechar"
        >
          <i class="ri-close-line"></i>
        </button>
      </header>

      <!-- ===================================================================== -->
      <!-- CORPO PRINCIPAL COM DUAS COLUNAS                                      -->
      <!-- ===================================================================== -->
      <div class="modal-content-body row g-0">
        
        <!-- COLUNA ESQUERDA: ETAPAS DE SELEÇÃO -->
        <div class="col-lg-7 p-4 modal-left-scroll border-end">
          
          <!-- ================================================================= -->
          <!-- 1. SELEÇÃO DO CLIENTE & CARD PROGRESSIVE DISCLOSURE               -->
          <!-- ================================================================= -->
          <section class="section-block mb-4">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <label class="section-label mb-0">
                <i class="ri-user-3-line text-amber-500 me-1"></i> Cliente
              </label>
              
              <button
                v-if="!mostrarCadastroRapidoCliente"
                type="button"
                class="btn btn-xs btn-outline-amber rounded-pill"
                @click="abrirCadastroRapido()"
              >
                <i class="ri-user-add-line me-1"></i> + Novo Cliente Rápido
              </button>
            </div>

            <!-- CARD EXPANSÍVEL INLINE (PROGRESSIVE DISCLOSURE - SEM MODAL-ON-MODAL) -->
            <transition name="expand-fade">
              <div v-if="mostrarCadastroRapidoCliente" class="card-inline-cadastro p-3 rounded-3 mb-3 border">
                <div class="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-amber-500 text-dark fw-bold fs-10">NOVO</span>
                    <strong class="fs-12 text-slate-100">Cadastro Rápido de Cliente</strong>
                  </div>
                  <button
                    type="button"
                    class="btn-icon-xs text-muted"
                    @click="fecharCadastroRapido()"
                    title="Cancelar"
                  >
                    <i class="ri-close-line"></i>
                  </button>
                </div>

                <div class="row g-2">
                  <div class="col-md-6">
                    <label class="fs-11 text-muted fw-semibold mb-1">Nome Completo *</label>
                    <div class="input-group input-group-sm">
                      <span class="input-group-text"><i class="ri-user-smile-line text-amber-500"></i></span>
                      <input
                        type="text"
                        v-model="novoClienteForm.nome"
                        class="form-control"
                        placeholder="Ex: Matheus Oliveira"
                        ref="inputNovoClienteNomeRef"
                        @keyup.enter="salvarClienteRapidoInline"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="fs-11 text-muted fw-semibold mb-1">WhatsApp / Telefone *</label>
                    <div class="input-group input-group-sm">
                      <span class="input-group-text"><i class="ri-whatsapp-line text-success"></i></span>
                      <input
                        type="tel"
                        v-model="novoClienteForm.telefone"
                        class="form-control"
                        placeholder="(11) 98765-4321"
                        @keyup.enter="salvarClienteRapidoInline"
                      />
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="fs-11 text-muted fw-semibold mb-1">Observações de Estilo / Visagismo (Opcional)</label>
                    <input
                      type="text"
                      v-model="novoClienteForm.observacoes"
                      class="form-control form-control-sm"
                      placeholder="Ex: Prefere corte baixo na tesoura, disfarce navalhado"
                    />
                  </div>
                </div>

                <div class="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
                  <button
                    type="button"
                    class="btn btn-xs btn-outline-secondary"
                    @click="fecharCadastroRapido()"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    class="btn btn-xs btn-amber fw-semibold"
                    :disabled="!novoClienteForm.nome.trim() || !novoClienteForm.telefone.trim()"
                    @click="salvarClienteRapidoInline()"
                  >
                    <i class="ri-check-line me-1"></i> Salvar e Selecionar
                  </button>
                </div>
              </div>
            </transition>

            <!-- SELEÇÃO DE CLIENTE EXISTENTE (COMBOBOX BUSCA INTELIGENTE) -->
            <div v-if="!mostrarCadastroRapidoCliente" class="position-relative">
              <div
                v-if="dropdownClienteAberto"
                class="combobox-backdrop"
                @click="dropdownClienteAberto = false"
              ></div>

              <!-- Trigger: Cliente Selecionado -->
              <div
                v-if="clienteSelecionadoObj"
                class="cliente-trigger-card p-2 px-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer"
                @click="dropdownClienteAberto = !dropdownClienteAberto"
              >
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar-cliente-thumb">
                    <span>{{ obterIniciais(clienteSelecionadoObj.nome) }}</span>
                  </div>
                  <div>
                    <h6 class="fs-13 fw-bold mb-0 text-slate-100">{{ clienteSelecionadoObj.nome }}</h6>
                    <span class="fs-11 text-muted">
                      <i class="ri-whatsapp-line text-success"></i> {{ clienteSelecionadoObj.telefone }}
                      <span class="ms-1 text-slate-400">• {{ clienteSelecionadoObj.totalVisitas || 0 }} cortes</span>
                      <span class="ms-1 text-amber-500 fw-semibold">({{ clienteSelecionadoObj.selosFidelidade || 0 }}/10 VIP)</span>
                    </span>
                  </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="btn-trocar-pill">Alterar</span>
                  <i class="ri-arrow-down-s-line text-muted"></i>
                </div>
              </div>

              <!-- Trigger: Nenhum cliente selecionado ainda -->
              <div
                v-else
                class="cliente-trigger-empty p-2 px-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer"
                @click="dropdownClienteAberto = true"
              >
                <span class="text-muted fs-12 d-flex align-items-center gap-2">
                  <i class="ri-search-line text-amber-500"></i> Buscar cliente por nome ou WhatsApp...
                </span>
                <i class="ri-arrow-down-s-line text-muted"></i>
              </div>

              <!-- Painel Dropdown Flutuante de Busca -->
              <div v-if="dropdownClienteAberto" class="dropdown-cliente-popup shadow-xl rounded-3 border p-2">
                <div class="input-group input-group-sm mb-2">
                  <span class="input-group-text"><i class="ri-search-line text-muted"></i></span>
                  <input
                    type="text"
                    v-model="termoBuscaCliente"
                    class="form-control"
                    placeholder="Digite nome ou telefone..."
                    autofocus
                  />
                  <button
                    v-if="termoBuscaCliente"
                    @click="termoBuscaCliente = ''"
                    class="btn btn-light btn-xs"
                    type="button"
                  >
                    <i class="ri-close-line"></i>
                  </button>
                </div>

                <div class="lista-clientes-scroll">
                  <div v-if="clientesFiltrados.length === 0" class="text-center py-3 text-muted fs-12">
                    <p class="mb-2">Nenhum cliente encontrado com "{{ termoBuscaCliente }}".</p>
                    <button
                      type="button"
                      @click="abrirCadastroRapido(termoBuscaCliente)"
                      class="btn btn-xs btn-amber text-dark fw-semibold"
                    >
                      <i class="ri-user-add-line me-1"></i> Cadastrar "{{ termoBuscaCliente }}"
                    </button>
                  </div>

                  <div
                    v-for="c in clientesFiltrados"
                    :key="c.id"
                    class="item-cliente-option p-2 rounded-2 d-flex align-items-center justify-content-between cursor-pointer mb-1"
                    :class="{ 'item-cliente-ativo': form.clienteId === c.id }"
                    @click="selecionarCliente(c)"
                  >
                    <div class="d-flex align-items-center gap-2">
                      <div class="avatar-mini-circle">
                        {{ obterIniciais(c.nome) }}
                      </div>
                      <div>
                        <strong class="fs-12 text-slate-100 d-block">{{ c.nome }}</strong>
                        <span class="fs-11 text-muted">{{ c.telefone }}</span>
                      </div>
                    </div>
                    <div class="text-end">
                      <span class="badge bg-slate-800 text-slate-300 border border-slate-700 fs-10 d-block">
                        {{ c.totalVisitas || 0 }} cortes
                      </span>
                      <small class="text-amber-500 fs-10 fw-semibold">{{ c.selosFidelidade || 0 }}/10 VIP</small>
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center pt-2 border-top mt-1 px-1">
                  <small class="text-muted fs-10">{{ clientesFiltrados.length }} cadastrado(s)</small>
                  <button
                    type="button"
                    @click="dropdownClienteAberto = false"
                    class="btn btn-xs btn-link text-muted p-0 text-decoration-none"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- ================================================================= -->
          <!-- 2. SELEÇÃO DO BARBEIRO (CARROSSEL HORIZONTAL INTERATIVO)          -->
          <!-- ================================================================= -->
          <section class="section-block mb-4">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <label class="section-label mb-0">
                <i class="ri-scissors-2-line text-amber-500 me-1"></i> Barbeiro Responsável
              </label>
              <div class="d-flex align-items-center gap-2">
                <span class="fs-11 text-muted">{{ barbeiros.length }} profissionais</span>
                <div class="d-flex align-items-center gap-1">
                  <button
                    type="button"
                    @click="scrollBarbeiros(-160)"
                    class="btn-nav-mini"
                    title="Anteriores"
                  >
                    <i class="ri-arrow-left-s-line"></i>
                  </button>
                  <button
                    type="button"
                    @click="scrollBarbeiros(160)"
                    class="btn-nav-mini"
                    title="Próximos"
                  >
                    <i class="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              </div>
            </div>

            <div
              class="barbeiros-scroll-strip d-flex gap-2 pb-2"
              ref="barbeirosScrollRef"
              @wheel.prevent="rolarBarbeirosWheel"
            >
              <div
                v-for="b in barbeiros"
                :key="b.id"
                class="card-barbeiro-item flex-shrink-0 cursor-pointer"
                :class="{ 'card-barbeiro-selecionado': form.barbeiroId === b.id }"
                @click="selecionarBarbeiro(b.id)"
              >
                <div class="barbeiro-avatar-box position-relative mx-auto mb-1">
                  <img :src="b.foto" :alt="b.apelido" class="barbeiro-avatar-img" />
                  <span v-if="form.barbeiroId === b.id" class="badge-check-amber">
                    <i class="ri-check-line"></i>
                  </span>
                </div>
                <h6 class="fs-12 fw-bold text-slate-100 mb-0 text-truncate px-1">{{ b.apelido }}</h6>
                <small class="text-muted fs-10 d-block text-truncate">{{ b.cadeira }}</small>
                <span
                  class="badge-status-barbeiro mt-1"
                  :class="b.status === 'atendendo' ? 'status-atendendo' : 'status-disponivel'"
                >
                  ● {{ b.status === 'atendendo' ? 'Em Cadeira' : 'Disponível' }}
                </span>
              </div>
            </div>
          </section>

          <!-- ================================================================= -->
          <!-- 3. SELEÇÃO DE SERVIÇOS (CATEGORIAS, BUSCA E MULTI-SELEÇÃO)        -->
          <!-- ================================================================= -->
          <section class="section-block mb-4">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
              <div class="d-flex align-items-center gap-2">
                <label class="section-label mb-0">
                  <i class="ri-service-line text-amber-500 me-1"></i> Serviços
                </label>
                <span class="badge bg-amber-500 text-dark fs-10 fw-bold px-2 py-0.5 rounded-pill">
                  {{ servicosSelecionadosIds.length }} selecionado(s)
                </span>
              </div>

              <!-- Busca de serviço -->
              <div class="input-group input-group-sm busca-servico-box">
                <span class="input-group-text"><i class="ri-search-line text-muted fs-11"></i></span>
                <input
                  type="text"
                  v-model="termoBuscaServico"
                  class="form-control"
                  placeholder="Filtrar serviços..."
                />
                <button
                  v-if="termoBuscaServico"
                  @click="termoBuscaServico = ''"
                  class="btn btn-light btn-xs"
                  type="button"
                >
                  <i class="ri-close-line"></i>
                </button>
              </div>
            </div>

            <!-- Categorias em Pill -->
            <div class="d-flex flex-wrap gap-1 mb-2">
              <button
                v-for="cat in categoriasServicos"
                :key="cat"
                type="button"
                @click="categoriaAtiva = cat"
                class="btn-cat-pill"
                :class="{ 'btn-cat-pill-ativo': categoriaAtiva === cat }"
              >
                {{ cat }}
              </button>
            </div>

            <!-- Grade de Serviços com Scroll Controlado -->
            <div class="servicos-scroll-box p-2 rounded-3 border">
              <div v-if="servicosFiltrados.length === 0" class="text-center py-4 text-muted fs-12">
                <i class="ri-scissors-cut-line fs-22 d-block mb-1 text-slate-500"></i>
                Nenhum serviço encontrado para "{{ termoBuscaServico }}" na categoria {{ categoriaAtiva }}.
              </div>
              <div v-else class="row g-2">
                <div
                  v-for="s in servicosFiltrados"
                  :key="s.id"
                  class="col-md-6"
                >
                  <div
                    class="card-servico-item p-2 rounded-3 border cursor-pointer d-flex align-items-center justify-content-between gap-2"
                    :class="{ 'card-servico-selecionado': servicosSelecionadosIds.includes(s.id) }"
                    @click="alternarServico(s.id)"
                  >
                    <div class="d-flex align-items-center gap-2 min-w-0 flex-1 me-1">
                      <div class="servico-icon-tag shrink-0 flex-shrink-0">
                        <i :class="s.icone || 'ri-scissors-2-line'"></i>
                      </div>
                      <div class="min-w-0 flex-1">
                        <h6 class="fs-12 fw-semibold text-slate-100 mb-0 text-truncate d-block" :title="s.nome">{{ s.nome }}</h6>
                        <span class="fs-11 text-muted d-block">{{ s.duracaoMin }}&nbsp;min</span>
                      </div>
                    </div>
                    <div class="d-flex align-items-center gap-2 shrink-0 flex-shrink-0">
                      <span class="servico-preco-tag whitespace-nowrap shrink-0 text-nowrap">R$&nbsp;{{ formatarMoeda(s.preco) }}</span>
                      <div
                        class="checkbox-custom shrink-0 flex-shrink-0"
                        :class="{ 'checked': servicosSelecionadosIds.includes(s.id) }"
                      >
                        <i v-if="servicosSelecionadosIds.includes(s.id)" class="ri-check-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ================================================================= -->
          <!-- 4. DATA & GRADE DE DISPONIBILIDADE EM TEMPO REAL COM BLOQUEIO     -->
          <!-- ================================================================= -->
          <section class="section-block mb-4">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <label class="section-label mb-0">
                <i class="ri-time-line text-amber-500 me-1"></i> Data & Disponibilidade em Tempo Real
              </label>

              <!-- Seletor de Data Direto (Inline, sem modal-on-modal) -->
              <div class="d-flex align-items-center gap-2">
                <label for="inputDataAgendamentoInline" class="btn btn-xs btn-outline-secondary rounded-pill cursor-pointer mb-0">
                  <i class="ri-calendar-2-line me-1 text-amber-500"></i>
                  {{ formatarDataCurta(form.data) }}
                </label>
                <input
                  type="date"
                  id="inputDataAgendamentoInline"
                  v-model="form.data"
                  class="visually-hidden"
                  @change="aoMudarDataManual"
                />
              </div>
            </div>

            <!-- CARROSSEL DE DIAS COMPACTO -->
            <div class="calendario-strip-card p-2 px-3 rounded-3 border mb-3">
              <div class="d-flex align-items-center justify-content-between mb-2 pb-1 border-bottom">
                <span class="fs-12 fw-bold text-slate-100 text-capitalize d-flex align-items-center gap-1">
                  <i class="ri-calendar-check-line text-amber-500"></i>
                  {{ formatarDataExtensa(form.data) }}
                </span>
                <div class="d-flex align-items-center gap-1">
                  <button
                    type="button"
                    @click="navegarDiasCarrossel(-7)"
                    class="btn-nav-mini"
                    title="Semana anterior"
                  >
                    <i class="ri-arrow-left-s-line"></i>
                  </button>
                  <button
                    type="button"
                    @click="definirDataHoje()"
                    class="btn btn-xs btn-slate-pill px-2"
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    @click="navegarDiasCarrossel(7)"
                    class="btn-nav-mini"
                    title="Próxima semana"
                  >
                    <i class="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              </div>

              <!-- Linha dos dias da semana -->
              <div class="d-flex gap-1 overflow-x-auto pb-1 carrossel-dias-strip">
                <div
                  v-for="dia in diasCarrossel"
                  :key="dia.iso"
                  class="card-dia-item cursor-pointer text-center p-1 rounded-3 border flex-shrink-0"
                  :class="{ 'card-dia-selecionado': form.data === dia.iso }"
                  @click="selecionarData(dia.iso)"
                >
                  <span class="fs-9 fw-bold text-uppercase d-block dia-label">{{ dia.label }}</span>
                  <strong class="fs-14 d-block dia-num">{{ dia.diaNum }}</strong>
                  <span class="fs-9 text-muted d-block dia-mes">{{ dia.mes }}</span>
                </div>
              </div>
            </div>

            <!-- GRELHA INTERATIVA DE HORÁRIOS COM CÁLCULO DE DURAÇÃO & BLOQUEIO REAL-TIME -->
            <div class="grade-horarios-card p-3 rounded-3 border">
              
              <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-2 border-bottom">
                <div class="d-flex align-items-center gap-2">
                  <span class="fs-12 text-uppercase fw-bold text-slate-300">Grade de Horários</span>
                  <span class="badge bg-slate-800 text-amber-500 border border-slate-700 fs-10 fw-semibold">
                    Duração Total: {{ duracaoTotalMin }} min
                  </span>
                </div>

                <!-- Filtro de Turnos -->
                <div class="btn-group btn-group-sm">
                  <button
                    type="button"
                    @click="filtroTurno = 'todos'"
                    class="btn btn-xs"
                    :class="filtroTurno === 'todos' ? 'btn-turno-ativo' : 'btn-turno-inativo'"
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    @click="filtroTurno = 'manha'"
                    class="btn btn-xs"
                    :class="filtroTurno === 'manha' ? 'btn-turno-ativo' : 'btn-turno-inativo'"
                  >
                    🌅 Manhã ({{ slotsManhaDisponiveisCount }}/{{ slotsManha.length }})
                  </button>
                  <button
                    type="button"
                    @click="filtroTurno = 'tarde'"
                    class="btn btn-xs"
                    :class="filtroTurno === 'tarde' ? 'btn-turno-ativo' : 'btn-turno-inativo'"
                  >
                    ☀️ Tarde ({{ slotsTardeDisponiveisCount }}/{{ slotsTarde.length }})
                  </button>
                  <button
                    type="button"
                    @click="filtroTurno = 'noite'"
                    class="btn btn-xs"
                    :class="filtroTurno === 'noite' ? 'btn-turno-ativo' : 'btn-turno-inativo'"
                  >
                    🌙 Noite ({{ slotsNoiteDisponiveisCount }}/{{ slotsNoite.length }})
                  </button>
                </div>
              </div>

              <!-- Banner de colisão / ocupação preventiva caso o slot selecionado esteja ocupado -->
              <div
                v-if="form.horario && !verificarDisponibilidadeSlot(form.horario).disponivel"
                class="alert alert-warning py-2 px-3 fs-11 mb-3 d-flex align-items-center justify-content-between rounded-3"
              >
                <span>
                  <i class="ri-alert-line me-1"></i>
                  O horário {{ form.horario }} está indisponível para {{ duracaoTotalMin }} min. Selecione outro horário livre abaixo.
                </span>
                <button
                  type="button"
                  class="btn btn-xs btn-amber text-dark fw-bold"
                  @click="selecionarPrimeiroHorarioLivre()"
                >
                  Selecionar Primeiro Livre
                </button>
              </div>

              <!-- TURNO: MANHÃ -->
              <div v-if="filtroTurno === 'todos' || filtroTurno === 'manha'" class="turno-bloco mb-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="fs-11 fw-semibold text-muted d-flex align-items-center gap-1">
                    🌅 Manhã (08:00 às 11:30)
                  </span>
                  <small class="fs-10 text-slate-400">
                    {{ slotsManhaDisponiveisCount }} livres de {{ slotsManha.length }}
                  </small>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    v-for="slot in slotsManha"
                    :key="slot.hora"
                    type="button"
                    :disabled="!slot.disponivel"
                    class="btn-slot-horario"
                    :class="{
                      'slot-ativo': form.horario === slot.hora,
                      'slot-bloqueado': !slot.disponivel
                    }"
                    :title="slot.disponivel ? `Horário livre (${slot.hora} às ${calcularHorarioTermino(slot.hora, duracaoTotalMin)})` : (slot.motivo || 'Horário Ocupado')"
                    @click="selecionarHorario(slot.hora)"
                  >
                    <i v-if="!slot.disponivel" class="ri-lock-line me-1 fs-10"></i>
                    {{ slot.hora }}
                    <span v-if="!slot.disponivel" class="dot-ocupado"></span>
                  </button>
                </div>
              </div>

              <!-- TURNO: TARDE -->
              <div v-if="filtroTurno === 'todos' || filtroTurno === 'tarde'" class="turno-bloco mb-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="fs-11 fw-semibold text-muted d-flex align-items-center gap-1">
                    ☀️ Tarde (12:00 às 17:30)
                  </span>
                  <small class="fs-10 text-slate-400">
                    {{ slotsTardeDisponiveisCount }} livres de {{ slotsTarde.length }}
                  </small>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    v-for="slot in slotsTarde"
                    :key="slot.hora"
                    type="button"
                    :disabled="!slot.disponivel"
                    class="btn-slot-horario"
                    :class="{
                      'slot-ativo': form.horario === slot.hora,
                      'slot-bloqueado': !slot.disponivel
                    }"
                    :title="slot.disponivel ? `Horário livre (${slot.hora} às ${calcularHorarioTermino(slot.hora, duracaoTotalMin)})` : (slot.motivo || 'Horário Ocupado')"
                    @click="selecionarHorario(slot.hora)"
                  >
                    <i v-if="!slot.disponivel" class="ri-lock-line me-1 fs-10"></i>
                    {{ slot.hora }}
                    <span v-if="!slot.disponivel" class="dot-ocupado"></span>
                  </button>
                </div>
              </div>

              <!-- TURNO: NOITE -->
              <div v-if="filtroTurno === 'todos' || filtroTurno === 'noite'" class="turno-bloco">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <span class="fs-11 fw-semibold text-muted d-flex align-items-center gap-1">
                    🌙 Noite (18:00 às 21:00)
                  </span>
                  <small class="fs-10 text-slate-400">
                    {{ slotsNoiteDisponiveisCount }} livres de {{ slotsNoite.length }}
                  </small>
                </div>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    v-for="slot in slotsNoite"
                    :key="slot.hora"
                    type="button"
                    :disabled="!slot.disponivel"
                    class="btn-slot-horario"
                    :class="{
                      'slot-ativo': form.horario === slot.hora,
                      'slot-bloqueado': !slot.disponivel
                    }"
                    :title="slot.disponivel ? `Horário livre (${slot.hora} às ${calcularHorarioTermino(slot.hora, duracaoTotalMin)})` : (slot.motivo || 'Horário Ocupado')"
                    @click="selecionarHorario(slot.hora)"
                  >
                    <i v-if="!slot.disponivel" class="ri-lock-line me-1 fs-10"></i>
                    {{ slot.hora }}
                    <span v-if="!slot.disponivel" class="dot-ocupado"></span>
                  </button>
                </div>
              </div>

            </div>
          </section>

          <!-- ================================================================= -->
          <!-- 5. OBSERVAÇÕES OPCIONAIS DO ATENDIMENTO                           -->
          <!-- ================================================================= -->
          <section class="section-block">
            <label class="section-label mb-1">
              <i class="ri-sticky-note-line text-amber-500 me-1"></i> Observações do Cliente & Visagismo (Opcional)
            </label>
            <input
              type="text"
              v-model="form.observacoes"
              class="form-control form-control-sm"
              placeholder="Ex: Cerveja cortesia ao chegar, disfarçado alto na navalha"
            />
          </section>

        </div>

        <!-- ===================================================================== -->
        <!-- COLUNA DIREITA: RESUMO VISUAL & DETALHES DO AGENDAMENTO               -->
        <!-- ===================================================================== -->
        <div class="col-lg-5 p-4 modal-right-panel d-flex flex-direction-column">
          <div class="summary-content flex-grow-1 overflow-y-auto pr-1">
            
            <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
              <div>
                <h6 class="fs-13 fw-bold text-slate-100 mb-0 text-uppercase tracking-wider">
                  Resumo do Agendamento
                </h6>
                <span class="fs-11 text-muted">Unidade Jardins • Matriz</span>
              </div>
              <span class="badge bg-amber-500 text-dark fw-bold fs-11 px-2 py-1 rounded-pill">
                Ao Vivo
              </span>
            </div>

            <!-- Card: Cliente -->
            <div class="summary-box p-3 rounded-3 border mb-2">
              <span class="fs-10 text-muted text-uppercase fw-bold d-block mb-1">Cliente Selecionado</span>
              <strong class="fs-13 text-slate-100 d-block">
                {{ form.clienteNome || 'Nenhum cliente definido' }}
              </strong>
              <span class="fs-11 text-muted">
                {{ form.clienteTelefone || '(WhatsApp a definir)' }}
              </span>
            </div>

            <!-- Card: Barbeiro & Cadeira -->
            <div class="summary-box p-3 rounded-3 border mb-2">
              <span class="fs-10 text-muted text-uppercase fw-bold d-block mb-1">Profissional & Cadeira</span>
              <div class="d-flex align-items-center gap-2">
                <img
                  :src="barbeiroSelecionadoObj?.foto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'"
                  :alt="barbeiroSelecionadoObj?.apelido"
                  class="avatar-xs rounded-circle object-fit-cover border border-slate-700"
                />
                <div>
                  <strong class="fs-12 text-slate-100 d-block">
                    {{ barbeiroSelecionadoObj?.apelido || 'Selecione um barbeiro' }}
                  </strong>
                  <span class="fs-11 text-muted">{{ barbeiroSelecionadoObj?.cadeira || 'Cadeira' }}</span>
                </div>
              </div>
            </div>

            <!-- Card: Horário & Previsão Término -->
            <div class="summary-box p-3 rounded-3 border mb-3">
              <div class="d-flex align-items-center justify-content-between mb-1.5">
                <span class="fs-10 text-muted text-uppercase fw-bold">Data & Previsão</span>
                <span class="badge bg-slate-800 text-slate-200 border border-slate-700 fs-11 py-0.5 px-2 rounded-pill whitespace-nowrap shrink-0 text-nowrap">
                  Término: {{ calcularHorarioTermino(form.horario, duracaoTotalMin) }}
                </span>
              </div>
              <strong class="fs-13 text-slate-100 d-block mb-1">
                {{ formatarDataCurta(form.data) }} às {{ form.horario || '--:--' }}
              </strong>
              <div class="d-flex align-items-center gap-1.5 text-muted fs-11 whitespace-nowrap text-nowrap">
                <i class="ri-timer-line text-amber-500"></i>
                <span>Duração total estimada: <strong class="text-slate-300 fw-semibold">{{ duracaoTotalMin }}&nbsp;min</strong></span>
              </div>
            </div>

            <!-- Card: Serviços Selecionados -->
            <div class="summary-box p-3 rounded-3 border mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom">
                <span class="fs-10 text-muted text-uppercase fw-bold">Serviços Selecionados</span>
                <span class="fs-11 text-amber-500 fw-semibold">{{ servicosSelecionados.length }} item(s)</span>
              </div>

              <div v-if="servicosSelecionados.length === 0" class="text-center py-2 text-muted fs-11">
                Nenhum serviço selecionado ainda.
              </div>
              <div v-else class="servicos-selecionados-list">
                <div
                  v-for="s in servicosSelecionados"
                  :key="s.id"
                  class="d-flex justify-content-between align-items-center py-1.5 border-bottom border-slate-800"
                >
                  <div>
                    <span class="fs-12 text-slate-200 fw-medium">{{ s.nome }}</span>
                    <small class="text-muted d-block fs-10">{{ s.duracaoMin }} min</small>
                  </div>
                  <div class="d-flex align-items-center gap-2 whitespace-nowrap shrink-0 flex-shrink-0">
                    <strong class="fs-12 text-slate-100 whitespace-nowrap shrink-0 text-nowrap">R$&nbsp;{{ formatarMoeda(s.preco) }}</strong>
                    <button
                      type="button"
                      @click="alternarServico(s.id)"
                      class="btn-icon-xs text-muted shrink-0"
                      title="Remover"
                    >
                      <i class="ri-close-line fs-14"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Validações Dinâmicas em Tempo Real -->
            <div v-if="!isFormularioValido" class="validacao-banner p-2.5 rounded-3 border mb-2">
              <span class="fs-10 text-uppercase fw-bold text-amber-500 d-block mb-1">
                <i class="ri-information-line me-1"></i> Pré-requisitos para Agendar:
              </span>
              <ul class="mb-0 ps-3 fs-11 text-muted">
                <li :class="{ 'text-success fw-semibold': !!form.clienteNome }">
                  {{ form.clienteNome ? '✓' : '•' }} Cliente identificado
                </li>
                <li :class="{ 'text-success fw-semibold': !!form.barbeiroId }">
                  {{ form.barbeiroId ? '✓' : '•' }} Barbeiro selecionado
                </li>
                <li :class="{ 'text-success fw-semibold': servicosSelecionados.length > 0 }">
                  {{ servicosSelecionados.length > 0 ? '✓' : '•' }} Ao menos 1 serviço
                </li>
                <li :class="{ 'text-success fw-semibold': isHorarioValido }">
                  {{ isHorarioValido ? '✓' : '•' }} Horário livre confirmado
                </li>
              </ul>
            </div>

          </div>

          <!-- ================================================================= -->
          <!-- RODAPÉ FIXO DO MODAL: DURAÇÃO, VALOR BRL & BOTÃO COM LOADING      -->
          <!-- ================================================================= -->
          <footer class="modal-fixed-footer pt-3 mt-auto border-top">
            <div class="d-flex justify-content-between align-items-baseline mb-2">
              <div>
                <span class="fs-10 text-muted fw-bold text-uppercase d-block">Total do Agendamento</span>
                <span class="fs-11 text-slate-400">⏱️ {{ duracaoTotalMin }} min de atendimento</span>
              </div>
              <div class="text-end whitespace-nowrap shrink-0 flex-shrink-0">
                <h3 class="preco-total-destaque fw-bold mb-0 text-amber-500 whitespace-nowrap shrink-0 text-nowrap">
                  R$&nbsp;{{ formatarMoeda(valorTotalCalculado) }}
                </h3>
              </div>
            </div>

            <!-- Checkbox de WhatsApp -->
            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="checkWhatsModal"
                v-model="notificarWhatsAppAoSalvar"
              />
              <label class="form-check-label fs-11 text-muted cursor-pointer" for="checkWhatsModal">
                Abrir WhatsApp para enviar confirmação automática
              </label>
            </div>

            <!-- Botões de Ação Primária -->
            <div class="d-grid gap-2">
              <button
                type="button"
                @click="submeterAgendamento"
                :disabled="!isFormularioValido || isSalvando"
                class="btn btn-salvar-primario fw-bold py-2.5 rounded-3 shadow-md fs-13"
                :class="{ 'opacity-75': !isFormularioValido || isSalvando }"
              >
                <span v-if="isSalvando" class="d-flex align-items-center justify-content-center gap-2">
                  <i class="ri-loader-4-line spin-loading fs-16"></i>
                  A guardar...
                </span>
                <span v-else class="d-flex align-items-center justify-content-center gap-1">
                  <i class="ri-check-line fs-16"></i>
                  Confirmar Agendamento
                </span>
              </button>

              <button
                type="button"
                @click="localVisible = false"
                class="btn btn-link text-muted text-decoration-none btn-sm py-1"
                :disabled="isSalvando"
              >
                Cancelar
              </button>
            </div>
          </footer>

        </div>

      </div>

    </div>
  </BModal>
</template>

<script setup lang="ts">
/* eslint-disable */
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Swal from 'sweetalert2';
import { BarbeariaStorage } from '@/helpers/barbearia-storage';
import { useStore } from 'vuex';
import type {
  Barbeiro,
  Cliente,
  Servico,
  Agendamento,
  AgendamentoPayload,
  SlotStatus
} from '@/types/barbearia';

// ============================================================================
// PROPS & EMITS COM TIPAGEM VUE 3 COMPOSITION API
// ============================================================================
interface Props {
  modelValue?: boolean;
  visible?: boolean;
  dataPadrao?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  visible: false,
  dataPadrao: () => new Date().toISOString().split('T')[0]
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:visible', value: boolean): void;
  (e: 'salvo', agendamento: Agendamento): void;
}>();

// ============================================================================
// CONTROLE DE VISIBILIDADE REATIVA
// ============================================================================
const localVisible = computed({
  get: () => props.visible || props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val);
    emit('update:visible', val);
  }
});

// ============================================================================
// CONTROLE DE TEMA (DARK SLATE/ZINC & LIGHT)
// ============================================================================
const store = useStore();
const currentTheme = ref<string>(
  (typeof document !== 'undefined' && document.documentElement.getAttribute('data-bs-theme')) || 'dark'
);
let themeObserver: MutationObserver | null = null;

const isDarkMode = computed<boolean>(() => {
  const storeMode = store?.state?.layout?.mode;
  return currentTheme.value === 'dark' || storeMode === 'dark';
});

// ============================================================================
// ESTADO REATIVO DO FORMULÁRIO E DADOS
// ============================================================================
const barbeiros = ref<Barbeiro[]>([]);
const servicos = ref<Servico[]>([]);
const clientes = ref<Cliente[]>([]);
const agendamentos = ref<Agendamento[]>([]);

const isSalvando = ref<boolean>(false);
const notificarWhatsAppAoSalvar = ref<boolean>(true);

// Busca & Filtros
const termoBuscaCliente = ref<string>('');
const dropdownClienteAberto = ref<string | boolean>(false);
const termoBuscaServico = ref<string>('');
const categoriaAtiva = ref<string>('Todos');
const categoriasServicos = ['Todos', 'Cabelo', 'Barba', 'Combo', 'Química', 'Estética'];
const filtroTurno = ref<'todos' | 'manha' | 'tarde' | 'noite'>('todos');
const offsetDiasCarrossel = ref<number>(0);

// Elementos DOM & Refs
const barbeirosScrollRef = ref<HTMLElement | null>(null);
const inputNovoClienteNomeRef = ref<HTMLInputElement | null>(null);

// Card Inline de Progressive Disclosure (Cadastro Rápido)
const mostrarCadastroRapidoCliente = ref<boolean>(false);
const novoClienteForm = reactive({
  nome: '',
  telefone: '',
  observacoes: ''
});

// Payload do Agendamento
const form = reactive({
  clienteId: null as string | number | null,
  clienteNome: '',
  clienteTelefone: '',
  barbeiroId: '',
  data: props.dataPadrao || new Date().toISOString().split('T')[0],
  horario: '15:00',
  observacoes: ''
});

const servicosSelecionadosIds = ref<string[]>([]);

// Grade de Horários Base
const HORARIOS_MANHA: string[] = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const HORARIOS_TARDE: string[] = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
const HORARIOS_NOITE: string[] = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

// ============================================================================
// FUNÇÕES REATIVAS DE ARMAZENAMENTO & DADOS (SUBSTITUINDO CÓDIGO IMPERATIVO)
// ============================================================================
function recarregarDados(): void {
  BarbeariaStorage.init();
  barbeiros.value = (BarbeariaStorage.getBarbeiros() || []) as Barbeiro[];
  servicos.value = (BarbeariaStorage.getServicos() || []) as Servico[];
  clientes.value = (BarbeariaStorage.getClientes() || []) as Cliente[];
  agendamentos.value = (BarbeariaStorage.getAgendamentos() || []) as Agendamento[];
}

function inicializarFormulario(): void {
  recarregarDados();
  mostrarCadastroRapidoCliente.value = false;
  termoBuscaCliente.value = '';
  termoBuscaServico.value = '';
  dropdownClienteAberto.value = false;
  filtroTurno.value = 'todos';
  offsetDiasCarrossel.value = 0;
  isSalvando.value = false;

  const primeiroCliente = clientes.value[0];
  form.clienteId = primeiroCliente ? primeiroCliente.id : null;
  form.clienteNome = primeiroCliente ? primeiroCliente.nome : '';
  form.clienteTelefone = primeiroCliente ? primeiroCliente.telefone : '';

  const primeiroBarbeiro = barbeiros.value[0];
  form.barbeiroId = primeiroBarbeiro ? primeiroBarbeiro.id : '';

  form.data = props.dataPadrao || new Date().toISOString().split('T')[0];
  form.horario = '14:00';
  form.observacoes = '';

  const primeiroServico = servicos.value[0];
  servicosSelecionadosIds.value = primeiroServico ? [primeiroServico.id] : [];
  notificarWhatsAppAoSalvar.value = true;

  // Ajusta offset do carrossel para a data padrão
  aoMudarDataManual();

  // Se o horário inicial não estiver livre, seleciona o primeiro disponível
  nextTick(() => {
    if (!verificarDisponibilidadeSlot(form.horario).disponivel) {
      selecionarPrimeiroHorarioLivre();
    }
  });
}

function persistirAgendamentoNoStorage(payload: AgendamentoPayload): Agendamento {
  const agendamentoCriado = BarbeariaStorage.saveAgendamento(payload);
  agendamentos.value = (BarbeariaStorage.getAgendamentos() || []) as Agendamento[];
  return agendamentoCriado;
}

function persistirClienteRapido(dados: { nome: string; telefone: string; observacoes?: string }): Cliente {
  const novoCliente = BarbeariaStorage.saveCliente({
    nome: dados.nome.trim(),
    telefone: dados.telefone.trim(),
    email: '',
    totalVisitas: 0,
    selosFidelidade: 0,
    observacoes: dados.observacoes?.trim() || ''
  });
  clientes.value = (BarbeariaStorage.getClientes() || []) as Cliente[];
  return novoCliente;
}

// ============================================================================
// COMPUTEDS REATIVOS (SERVIÇOS, VALORES, CLIENTE E DURAÇÃO)
// ============================================================================
const clientesFiltrados = computed<Cliente[]>(() => {
  if (!termoBuscaCliente.value || !termoBuscaCliente.value.trim()) {
    return clientes.value;
  }
  const q = termoBuscaCliente.value.toLowerCase().trim();
  return clientes.value.filter(c =>
    (c.nome && c.nome.toLowerCase().includes(q)) ||
    (c.telefone && c.telefone.toLowerCase().includes(q))
  );
});

const clienteSelecionadoObj = computed<Cliente | null>(() => {
  return clientes.value.find(c => c.id === form.clienteId) || null;
});

const barbeiroSelecionadoObj = computed<Barbeiro | null>(() => {
  return barbeiros.value.find(b => b.id === form.barbeiroId) || null;
});

const servicosFiltrados = computed<Servico[]>(() => {
  let lista = servicos.value;
  if (categoriaAtiva.value !== 'Todos') {
    lista = lista.filter(s => s.categoria === categoriaAtiva.value);
  }
  if (termoBuscaServico.value && termoBuscaServico.value.trim()) {
    const q = termoBuscaServico.value.toLowerCase().trim();
    lista = lista.filter(s =>
      (s.nome && s.nome.toLowerCase().includes(q)) ||
      (s.categoria && s.categoria.toLowerCase().includes(q))
    );
  }
  return lista;
});

const servicosSelecionados = computed<Servico[]>(() => {
  return servicos.value.filter(s => servicosSelecionadosIds.value.includes(s.id));
});

const duracaoTotalMin = computed<number>(() => {
  const total = servicosSelecionados.value.reduce((acc, curr) => acc + (curr.duracaoMin || 30), 0);
  return total > 0 ? total : 30;
});

const valorTotalCalculado = computed<number>(() => {
  return servicosSelecionados.value.reduce((acc, curr) => acc + (curr.preco || 0), 0);
});

// ============================================================================
// ALGORITMO REATIVO DE CÁLCULO DE HORÁRIOS & BLOQUEIO DE COLISÕES EM TEMPO REAL
// ============================================================================
function timeToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const agendamentosDoBarbeiroNoDia = computed<Agendamento[]>(() => {
  if (!form.barbeiroId || !form.data) return [];
  return agendamentos.value.filter(a =>
    a.barbeiroId === form.barbeiroId &&
    a.data === form.data &&
    a.status !== 'cancelado'
  );
});

function verificarDisponibilidadeSlot(horaStr: string): SlotStatus {
  if (!form.barbeiroId || !form.data) {
    return { hora: horaStr, disponivel: true };
  }

  const slotStart = timeToMinutes(horaStr);
  const duracao = duracaoTotalMin.value;
  const slotEnd = slotStart + duracao;

  // Fechamento da barbearia às 22:00 (1320 minutos)
  if (slotEnd > 22 * 60) {
    return {
      hora: horaStr,
      disponivel: false,
      motivo: `Ultrapassa horário de fechamento (${minutesToTime(slotEnd)} > 22:00)`
    };
  }

  // Checa colisão com cada agendamento existente do barbeiro
  for (const ag of agendamentosDoBarbeiroNoDia.value) {
    const agStart = timeToMinutes(ag.horario);
    const agDuracao = ag.duracaoTotalMin || 45;
    const agEnd = agStart + agDuracao;

    // Fórmula canônica de overlap: [slotStart, slotEnd] se sobrepõe a [agStart, agEnd]
    if (slotStart < agEnd && agStart < slotEnd) {
      return {
        hora: horaStr,
        disponivel: false,
        motivo: `Conflito com atendimento de ${ag.clienteNome} (${ag.horario} às ${minutesToTime(agEnd)})`,
        ocupadoPor: ag.clienteNome
      };
    }
  }

  return { hora: horaStr, disponivel: true };
}

// Slots por Turnos
const slotsManha = computed<SlotStatus[]>(() => {
  return HORARIOS_MANHA.map(h => verificarDisponibilidadeSlot(h));
});

const slotsTarde = computed<SlotStatus[]>(() => {
  return HORARIOS_TARDE.map(h => verificarDisponibilidadeSlot(h));
});

const slotsNoite = computed<SlotStatus[]>(() => {
  return HORARIOS_NOITE.map(h => verificarDisponibilidadeSlot(h));
});

const slotsManhaDisponiveisCount = computed(() => slotsManha.value.filter(s => s.disponivel).length);
const slotsTardeDisponiveisCount = computed(() => slotsTarde.value.filter(s => s.disponivel).length);
const slotsNoiteDisponiveisCount = computed(() => slotsNoite.value.filter(s => s.disponivel).length);

const todosSlots = computed<SlotStatus[]>(() => [
  ...slotsManha.value,
  ...slotsTarde.value,
  ...slotsNoite.value
]);

const isHorarioValido = computed<boolean>(() => {
  if (!form.horario) return false;
  return verificarDisponibilidadeSlot(form.horario).disponivel;
});

const isFormularioValido = computed<boolean>(() => {
  const temCliente = !!(form.clienteId || (form.clienteNome && form.clienteNome.trim()));
  const temBarbeiro = !!form.barbeiroId;
  const temServicos = servicosSelecionados.value.length > 0;
  const temData = !!form.data;
  return temCliente && temBarbeiro && temServicos && temData && isHorarioValido.value;
});

// ============================================================================
// CARROSSEL DE DIAS COMPACTO & OUTRA DATA
// ============================================================================
interface DiaCarrossel {
  iso: string;
  diaNum: number;
  diaSemana: string;
  label: string;
  mes: string;
}

const diasCarrossel = computed<DiaCarrossel[]>(() => {
  const dias: DiaCarrossel[] = [];
  const base = new Date();
  base.setDate(base.getDate() + offsetDiasCarrossel.value);
  const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const hojeIso = new Date().toISOString().split('T')[0];
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const amanhaIso = amanha.toISOString().split('T')[0];

  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = d.toISOString().split('T')[0];

    let label = nomesDias[d.getDay()];
    if (iso === hojeIso) label = 'Hoje';
    else if (iso === amanhaIso) label = 'Amanhã';

    dias.push({
      iso,
      diaNum: d.getDate(),
      diaSemana: nomesDias[d.getDay()],
      label,
      mes: meses[d.getMonth()]
    });
  }
  return dias;
});

function navegarDiasCarrossel(delta: number): void {
  offsetDiasCarrossel.value += delta;
  if (offsetDiasCarrossel.value < 0) offsetDiasCarrossel.value = 0;
}

function definirDataHoje(): void {
  offsetDiasCarrossel.value = 0;
  form.data = new Date().toISOString().split('T')[0];
}

function selecionarData(iso: string): void {
  form.data = iso;
}

function aoMudarDataManual(): void {
  if (form.data) {
    const [ano, mes, dia] = form.data.split('-').map(Number);
    const selDate = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    selDate.setHours(0, 0, 0, 0);
    const diffTime = selDate.getTime() - hoje.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    offsetDiasCarrossel.value = diffDays >= 0 ? diffDays : 0;
  }
}

// ============================================================================
// PROGRESSIVE DISCLOSURE: CADASTRO RÁPIDO DE NOVO CLIENTE (INLINE)
// ============================================================================
function abrirCadastroRapido(termoInicial?: string): void {
  mostrarCadastroRapidoCliente.value = true;
  dropdownClienteAberto.value = false;
  novoClienteForm.nome = termoInicial || termoBuscaCliente.value || '';
  novoClienteForm.telefone = '';
  novoClienteForm.observacoes = '';
  nextTick(() => {
    if (inputNovoClienteNomeRef.value) {
      inputNovoClienteNomeRef.value.focus();
    }
  });
}

function fecharCadastroRapido(): void {
  mostrarCadastroRapidoCliente.value = false;
  novoClienteForm.nome = '';
  novoClienteForm.telefone = '';
  novoClienteForm.observacoes = '';
}

function salvarClienteRapidoInline(): void {
  if (!novoClienteForm.nome.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Nome Obrigatório',
      text: 'Por favor, informe o nome do cliente.',
      confirmButtonColor: '#f59e0b'
    });
    return;
  }
  if (!novoClienteForm.telefone.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'WhatsApp Obrigatório',
      text: 'Por favor, informe o telefone de contato.',
      confirmButtonColor: '#f59e0b'
    });
    return;
  }

  const clienteCriado = persistirClienteRapido(novoClienteForm);
  form.clienteId = clienteCriado.id;
  form.clienteNome = clienteCriado.nome;
  form.clienteTelefone = clienteCriado.telefone;

  fecharCadastroRapido();

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: `Cliente ${clienteCriado.nome} cadastrado e selecionado!`,
    showConfirmButton: false,
    timer: 2500
  });
}

// ============================================================================
// INTERAÇÕES DE SELEÇÃO (CLIENTE, BARBEIRO, SERVIÇOS, HORÁRIOS)
// ============================================================================
function selecionarCliente(c: Cliente): void {
  form.clienteId = c.id;
  form.clienteNome = c.nome;
  form.clienteTelefone = c.telefone;
  if (c.barbeiroPreferidoId) {
    form.barbeiroId = c.barbeiroPreferidoId;
  }
  dropdownClienteAberto.value = false;
  termoBuscaCliente.value = '';
}

function selecionarBarbeiro(barbeiroId: string): void {
  form.barbeiroId = barbeiroId;
  // Se o horário atualmente selecionado colidir com o novo barbeiro, avança para o primeiro livre
  nextTick(() => {
    if (form.horario && !verificarDisponibilidadeSlot(form.horario).disponivel) {
      selecionarPrimeiroHorarioLivre();
    }
  });
}

function alternarServico(servId: string): void {
  const idx = servicosSelecionadosIds.value.indexOf(servId);
  if (idx >= 0) {
    if (servicosSelecionadosIds.value.length > 1) {
      servicosSelecionadosIds.value.splice(idx, 1);
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Serviço Obrigatório',
        text: 'O agendamento precisa conter ao menos um serviço selecionado.',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }
  } else {
    servicosSelecionadosIds.value.push(servId);
  }

  // Verifica se o aumento de duração gerou colisão no horário selecionado
  nextTick(() => {
    if (form.horario && !verificarDisponibilidadeSlot(form.horario).disponivel) {
      selecionarPrimeiroHorarioLivre();
    }
  });
}

function selecionarHorario(horaStr: string): void {
  const status = verificarDisponibilidadeSlot(horaStr);
  if (status.disponivel) {
    form.horario = horaStr;
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Horário Indisponível',
      text: status.motivo || 'Este horário já está ocupado por outro cliente.',
      confirmButtonColor: '#f59e0b'
    });
  }
}

function selecionarPrimeiroHorarioLivre(): void {
  const primeiroLivre = todosSlots.value.find(s => s.disponivel);
  if (primeiroLivre) {
    form.horario = primeiroLivre.hora;
  }
}

function scrollBarbeiros(offset: number): void {
  if (barbeirosScrollRef.value) {
    barbeirosScrollRef.value.scrollBy({ left: offset, behavior: 'smooth' });
  }
}

function rolarBarbeirosWheel(e: WheelEvent): void {
  if (barbeirosScrollRef.value) {
    barbeirosScrollRef.value.scrollLeft += (e.deltaY || e.deltaX);
  }
}

function aoFecharModal(): void {
  dropdownClienteAberto.value = false;
  mostrarCadastroRapidoCliente.value = false;
}

// ============================================================================
// FORMATAÇÃO E HELPERS VISUAIS
// ============================================================================
function formatarMoeda(val: number): string {
  if (!val && val !== 0) return '0,00';
  return val.toFixed(2).replace('.', ',');
}

function formatarDataCurta(dataStr: string): string {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarDataExtensa(dataStr: string): string {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'long' });
  const mesNome = d.toLocaleDateString('pt-BR', { month: 'long' });
  return `${diaSemana}, ${dia} de ${mesNome}`;
}

function calcularHorarioTermino(horarioInicio: string, duracaoMin: number): string {
  if (!horarioInicio) return '--:--';
  const mins = timeToMinutes(horarioInicio) + (duracaoMin || 0);
  return minutesToTime(mins);
}

function obterIniciais(nome: string): string {
  if (!nome) return 'CL';
  const partes = nome.trim().split(' ');
  if (partes.length >= 2) {
    return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
  }
  return nome.substring(0, 2).toUpperCase();
}

function gerarLinkWhatsApp(ag: Agendamento): string {
  const telefoneLimpo = (ag.clienteTelefone || '').replace(/\D/g, '');
  const barbeiro = barbeiroSelecionadoObj.value?.apelido || 'seu barbeiro';
  const msg = `Fala ${ag.clienteNome}! Passando para confirmar seu horário agendado para ${formatarDataCurta(ag.data)} às ${ag.horario} com o barbeiro ${barbeiro} na Barbearia Jardins. 💈✂️`;
  return `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(msg)}`;
}

// ============================================================================
// SUBMISSÃO DO AGENDAMENTO COM TRATAMENTO DE LOADING REATIVO
// ============================================================================
async function submeterAgendamento(): Promise<void> {
  if (!isFormularioValido.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos Pendentes',
      text: 'Por favor, revise as seleções pendentes antes de confirmar.',
      confirmButtonColor: '#f59e0b'
    });
    return;
  }

  isSalvando.value = true;

  try {
    // Simulação sutil de rede para UX profissional de feedback imediato
    await new Promise(resolve => setTimeout(resolve, 350));

    const payload: AgendamentoPayload = {
      clienteId: form.clienteId,
      clienteNome: form.clienteNome.trim(),
      clienteTelefone: form.clienteTelefone.trim(),
      barbeiroId: form.barbeiroId,
      servicos: servicosSelecionados.value,
      produtos: [],
      data: form.data,
      horario: form.horario,
      duracaoTotalMin: duracaoTotalMin.value,
      valorTotal: valorTotalCalculado.value,
      status: 'confirmado',
      observacoes: form.observacoes.trim(),
      comandaId: null
    };

    const novoAgendamento = persistirAgendamentoNoStorage(payload);

    localVisible.value = false;
    emit('salvo', novoAgendamento);

    if (notificarWhatsAppAoSalvar.value && novoAgendamento.clienteTelefone) {
      window.open(gerarLinkWhatsApp(novoAgendamento), '_blank');
    }

    Swal.fire({
      icon: 'success',
      title: 'Horário Confirmado!',
      text: `Agendamento criado para ${novoAgendamento.clienteNome} às ${novoAgendamento.horario} com ${barbeiroSelecionadoObj.value?.apelido || 'o profissional'}.`,
      confirmButtonColor: '#f59e0b',
      timer: 3000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erro ao Salvar',
      text: 'Ocorreu uma falha ao registrar o agendamento. Tente novamente.',
      confirmButtonColor: '#f59e0b'
    });
  } finally {
    isSalvando.value = false;
  }
}

// ============================================================================
// WATCHERS E LIFECYCLE HOOKS
// ============================================================================
watch(localVisible, (isAberta) => {
  if (isAberta) {
    inicializarFormulario();
  }
});

watch(() => form.data, () => {
  aoMudarDataManual();
  nextTick(() => {
    if (form.horario && !verificarDisponibilidadeSlot(form.horario).disponivel) {
      selecionarPrimeiroHorarioLivre();
    }
  });
});

onMounted(() => {
  recarregarDados();

  const activeTheme = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-bs-theme')) || 'dark';
  currentTheme.value = activeTheme;

  if (typeof MutationObserver !== 'undefined') {
    themeObserver = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-bs-theme') || 'dark';
      if (currentTheme.value !== t) {
        currentTheme.value = t;
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme']
    });
  }
});

onBeforeUnmount(() => {
  if (themeObserver) {
    themeObserver.disconnect();
  }
});
</script>

<style scoped>
/* ==========================================================================
   PALETA SLATE / ZINC & DESTAQUES EM AMBER-500
   ========================================================================== */
.cursor-pointer {
  cursor: pointer;
}

.text-amber-500 {
  color: #f59e0b !important;
}

.bg-amber-500 {
  background-color: #f59e0b !important;
}

.bg-amber-500-subtle {
  background-color: rgba(245, 158, 11, 0.15) !important;
}

.border-amber-500 {
  border-color: #f59e0b !important;
}

/* Base Modal Shell */
.modal-agendamento-shell {
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  max-height: 88vh;
  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.6);
  font-family: inherit;
  transition: background-color 0.25s ease, color 0.25s ease;
}

/* ==========================================================================
   TEMA DARK: SLATE / ZINC (Tailwind Slate-950 / Slate-900 / Slate-800)
   ========================================================================== */
.dark-slate {
  background-color: #0b1120;
  color: #f1f5f9;
}

.dark-slate .modal-header-top {
  background-color: #0f172a;
  border-bottom: 1px solid #1e293b !important;
}

.dark-slate .modal-left-scroll {
  background-color: #0f172a;
  border-color: #1e293b !important;
}

.dark-slate .modal-right-panel {
  background-color: #090e1a;
}

.dark-slate .section-label {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark-slate .modal-title {
  color: #f8fafc;
  font-size: 16px;
  letter-spacing: -0.02em;
}

.dark-slate .text-slate-100 {
  color: #f1f5f9 !important;
}
.dark-slate .text-slate-200 {
  color: #e2e8f0 !important;
}
.dark-slate .text-slate-300 {
  color: #cbd5e1 !important;
}
.dark-slate .text-slate-400 {
  color: #94a3b8 !important;
}
.dark-slate .text-muted {
  color: #94a3b8 !important;
}

/* Inputs & Form Controls */
.dark-slate .form-control {
  background-color: #182234 !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}
.dark-slate .form-control:focus {
  border-color: #f59e0b !important;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important;
}
.dark-slate .input-group-text {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #94a3b8 !important;
}

/* Progressive Disclosure: Card Inline de Cadastro */
.card-inline-cadastro {
  background-color: #141d2e;
  border-color: #334155 !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

/* Triggers de Cliente */
.dark-slate .cliente-trigger-card,
.dark-slate .cliente-trigger-empty {
  background-color: #141d2e;
  border-color: #1e293b !important;
  transition: all 0.2s ease;
}
.dark-slate .cliente-trigger-card:hover,
.dark-slate .cliente-trigger-empty:hover {
  border-color: #f59e0b !important;
  background-color: #182234;
}

.avatar-cliente-thumb {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #0f172a;
  font-weight: 800;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-trocar-pill {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 9999px;
  background-color: #1e293b;
  color: #cbd5e1;
  border: 1px solid #334155;
  transition: all 0.15s ease;
}
.btn-trocar-pill:hover {
  background-color: #334155;
  color: #f8fafc;
}

/* Popup de Busca de Clientes */
.dropdown-cliente-popup {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: #141d2e;
  border-color: #334155 !important;
  z-index: 1050;
}
.combobox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1040;
}
.lista-clientes-scroll {
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.item-cliente-option {
  transition: background-color 0.15s ease;
}
.dark-slate .item-cliente-option:hover {
  background-color: #1e293b;
}
.dark-slate .item-cliente-option.item-cliente-ativo {
  background-color: rgba(245, 158, 11, 0.15);
  border: 1px solid #f59e0b;
}
.avatar-mini-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #1e293b;
  border: 1px solid #334155;
  color: #f8fafc;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Barbeiros Strip */
.barbeiros-scroll-strip {
  overflow-x: auto;
  scrollbar-width: none;
}
.barbeiros-scroll-strip::-webkit-scrollbar {
  display: none;
}
.card-barbeiro-item {
  width: 130px;
  padding: 10px 8px;
  border-radius: 12px;
  border: 1.5px solid #1e293b;
  background-color: #141d2e;
  text-align: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}
.card-barbeiro-item:hover {
  transform: translateY(-2px);
  border-color: #475569;
  background-color: #182234;
}
.card-barbeiro-selecionado {
  border-color: #f59e0b !important;
  background-color: rgba(245, 158, 11, 0.08) !important;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.15);
}
.barbeiro-avatar-box {
  width: 48px;
  height: 48px;
}
.barbeiro-avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #334155;
}
.card-barbeiro-selecionado .barbeiro-avatar-img {
  border-color: #f59e0b;
}
.badge-check-amber {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #f59e0b;
  color: #0f172a;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0f172a;
}
.badge-status-barbeiro {
  display: inline-block;
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 6px;
}
.status-disponivel {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
}
.status-atendendo {
  background-color: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
}

/* Categorias & Serviços */
.btn-cat-pill {
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9999px;
  border: 1px solid #334155;
  background-color: #141d2e;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-cat-pill:hover {
  background-color: #1e293b;
  color: #f8fafc;
}
.btn-cat-pill-ativo {
  background-color: #f59e0b !important;
  color: #0f172a !important;
  border-color: #f59e0b !important;
  font-weight: 700;
}

.servicos-scroll-box {
  background-color: #141d2e;
  border-color: #1e293b !important;
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.card-servico-item {
  background-color: #0f172a;
  border-color: #1e293b !important;
  transition: all 0.15s ease;
  user-select: none;
}
.card-servico-item:hover {
  border-color: #475569 !important;
  background-color: #182234;
}
.card-servico-selecionado {
  border-color: #f59e0b !important;
  background-color: rgba(245, 158, 11, 0.08) !important;
}
.servico-icon-tag {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: #1e293b;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}
.servico-preco-tag {
  font-size: 12px;
  font-weight: 700;
  color: #f8fafc;
}
.checkbox-custom {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid #475569;
  background-color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #0f172a;
}
.checkbox-custom.checked {
  background-color: #f59e0b;
  border-color: #f59e0b;
}

/* Calendário & Grade de Horários */
.calendario-strip-card,
.grade-horarios-card {
  background-color: #141d2e;
  border-color: #1e293b !important;
}

.carrossel-dias-strip {
  scrollbar-width: none;
}
.carrossel-dias-strip::-webkit-scrollbar {
  display: none;
}
.card-dia-item {
  width: 62px;
  background-color: #0f172a;
  border-color: #1e293b !important;
  color: #cbd5e1;
  transition: all 0.15s ease;
  user-select: none;
}
.card-dia-item:hover {
  background-color: #1e293b;
  border-color: #475569 !important;
}
.card-dia-selecionado {
  border-color: #f59e0b !important;
  background-color: rgba(245, 158, 11, 0.15) !important;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.2) !important;
}
.card-dia-selecionado .dia-label {
  color: #f59e0b !important;
  font-weight: 800 !important;
}
.card-dia-selecionado .dia-num {
  color: #fbbf24 !important;
  font-weight: 900 !important;
}
.card-dia-selecionado .dia-mes {
  color: #f59e0b !important;
  font-weight: 600 !important;
}

/* Botões de Turnos */
.btn-turno-ativo {
  background-color: #f59e0b !important;
  color: #0f172a !important;
  border-color: #f59e0b !important;
  font-weight: 700;
}
.btn-turno-inativo {
  background-color: #182234 !important;
  color: #94a3b8 !important;
  border-color: #334155 !important;
}
.btn-turno-inativo:hover {
  color: #f8fafc !important;
  background-color: #1e293b !important;
}

/* Slots de Horários com Bloqueio Real-time */
.btn-slot-horario {
  min-width: 68px;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #334155;
  background-color: #0f172a;
  color: #f1f5f9;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
  user-select: none;
}
.btn-slot-horario:hover:not(:disabled) {
  border-color: #f59e0b;
  color: #fbbf24;
  background-color: #1e293b;
  transform: translateY(-1px);
}
.btn-slot-horario.slot-ativo {
  background-color: #f59e0b !important;
  color: #0f172a !important;
  border-color: #f59e0b !important;
  font-weight: 800 !important;
  box-shadow: 0 2px 10px rgba(245, 158, 11, 0.35);
}
.btn-slot-horario.slot-bloqueado {
  background-color: #080c16 !important;
  border-color: #1e293b !important;
  color: #475569 !important;
  cursor: not-allowed !important;
  opacity: 0.55;
  text-decoration: line-through;
}
.dot-ocupado {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #ef4444;
  display: inline-block;
  margin-left: 3px;
  vertical-align: middle;
}

/* Coluna Direita & Summary Box */
.summary-box {
  background-color: #141d2e;
  border-color: #1e293b !important;
}
.validacao-banner {
  background-color: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.25) !important;
}

/* Rodapé Fixo */
.modal-fixed-footer {
  border-color: #1e293b !important;
}
.btn-salvar-primario {
  background-color: #f59e0b;
  border: 1px solid #f59e0b;
  color: #0f172a;
  transition: all 0.15s ease;
}
.btn-salvar-primario:hover:not(:disabled) {
  background-color: #fbbf24;
  border-color: #fbbf24;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
}

.spin-loading {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Transição suave do card de Progressive Disclosure */
.expand-fade-enter-active,
.expand-fade-leave-active {
  transition: all 0.25s ease;
  max-height: 250px;
  overflow: hidden;
}
.expand-fade-enter-from,
.expand-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

/* Botões Auxiliares */
.btn-nav-mini {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #334155;
  background-color: #1e293b;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  transition: all 0.15s ease;
}
.btn-nav-mini:hover {
  background-color: #334155;
  color: #f8fafc;
}

.btn-icon-xs {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-icon-xs:hover {
  color: #f8fafc;
}

.btn-slate-pill {
  background-color: #1e293b;
  color: #cbd5e1;
  border: 1px solid #334155;
  border-radius: 9999px;
  font-size: 11px;
}
.btn-slate-pill:hover {
  background-color: #334155;
  color: #f8fafc;
}

.btn-outline-amber {
  border: 1px solid #f59e0b;
  color: #f59e0b;
  background: transparent;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.15s ease;
}
.btn-outline-amber:hover {
  background-color: #f59e0b;
  color: #0f172a;
}

.btn-amber {
  background-color: #f59e0b;
  border: 1px solid #f59e0b;
  color: #0f172a;
}
.btn-amber:hover {
  background-color: #fbbf24;
}

.header-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(245, 158, 11, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.btn-close-custom {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #334155;
  background-color: #1e293b;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.15s ease;
}
.btn-close-custom:hover {
  background-color: #ef4444;
  border-color: #ef4444;
  color: #ffffff;
}

.busca-servico-box {
  max-width: 200px;
}

/* Utility classes para Whitespace, Truncate e Flex */
.whitespace-nowrap {
  white-space: nowrap !important;
}
.shrink-0 {
  flex-shrink: 0 !important;
}
.min-w-0 {
  min-width: 0 !important;
}
.flex-1 {
  flex: 1 1 0% !important;
}

/* Scrollbars Internas Customizadas (Dark Mode / Slate) */
.modal-left-scroll,
.servicos-scroll-box,
.lista-clientes-scroll,
.summary-content {
  scrollbar-width: thin;
  scrollbar-color: #334155 transparent;
}

.modal-left-scroll {
  height: 100%;
  max-height: calc(88vh - 72px);
  overflow-y: auto;
}

.modal-left-scroll::-webkit-scrollbar,
.servicos-scroll-box::-webkit-scrollbar,
.lista-clientes-scroll::-webkit-scrollbar,
.summary-content::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.modal-left-scroll::-webkit-scrollbar-track,
.servicos-scroll-box::-webkit-scrollbar-track,
.lista-clientes-scroll::-webkit-scrollbar-track,
.summary-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-left-scroll::-webkit-scrollbar-thumb,
.servicos-scroll-box::-webkit-scrollbar-thumb,
.lista-clientes-scroll::-webkit-scrollbar-thumb,
.summary-content::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 9999px;
  transition: background-color 0.15s ease;
}

.modal-left-scroll::-webkit-scrollbar-thumb:hover,
.servicos-scroll-box::-webkit-scrollbar-thumb:hover,
.lista-clientes-scroll::-webkit-scrollbar-thumb:hover,
.summary-content::-webkit-scrollbar-thumb:hover {
  background-color: #475569;
}

/* ==========================================================================
   TEMA LIGHT: ADAPTAÇÃO HARMONIOSA COM ACENTOS EM AMBER-500
   ========================================================================== */
.light-mode {
  background-color: #ffffff;
  color: #1e293b;
}
.light-mode .modal-header-top {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0 !important;
}
.light-mode .modal-left-scroll {
  background-color: #ffffff;
  border-color: #e2e8f0 !important;
}
.light-mode .modal-right-panel {
  background-color: #f8fafc;
}
.light-mode .modal-title {
  color: #0f172a;
}
.light-mode .text-slate-100 {
  color: #0f172a !important;
}
.light-mode .text-slate-200 {
  color: #1e293b !important;
}
.light-mode .text-slate-300 {
  color: #334155 !important;
}
.light-mode .card-inline-cadastro,
.light-mode .cliente-trigger-card,
.light-mode .cliente-trigger-empty,
.light-mode .card-barbeiro-item,
.light-mode .servicos-scroll-box,
.light-mode .card-servico-item,
.light-mode .calendario-strip-card,
.light-mode .grade-horarios-card,
.light-mode .card-dia-item,
.light-mode .summary-box {
  background-color: #ffffff;
  border-color: #e2e8f0 !important;
}
.light-mode .btn-slot-horario {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  color: #1e293b;
}
.light-mode .btn-slot-horario.slot-bloqueado {
  background-color: #f1f5f9 !important;
  border-color: #e2e8f0 !important;
  color: #94a3b8 !important;
}
.light-mode .modal-fixed-footer {
  border-color: #e2e8f0 !important;
}
</style>
