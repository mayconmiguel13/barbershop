<template>
  <Layout>
    <PageHeader title="Painel Geral da Barbearia" pageTitle="BarberFlow Pro" />

    <div class="dash-barbearia-wrapper" :class="{ 'theme-dark': isDarkMode, 'theme-light': !isDarkMode }">
      <!-- HEADER COMPACTO COM SAUDAÇÃO E AÇÕES RÁPIDAS -->
      <BRow class="mb-3">
      <BCol cols="12">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h4 class="fw-bold text-body mb-1 d-flex align-items-center gap-2">
              Bom dia, Barbearia Jardins
              <span class="dash-live-badge">
                <span class="dash-live-dot"></span> Aberta
              </span>
            </h4>
            <p class="text-muted fs-13 mb-0">
              <i class="ri-calendar-line me-1"></i>{{ dataHoraFormatada }}
              <span class="mx-2 text-muted">•</span>
              <i class="ri-team-line me-1"></i>{{ totalBarbeirosAtivos }} barbeiros na escala
            </p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button @click="abrirModalNovoAgendamento" class="btn btn-primary fw-semibold px-3">
              <i class="ri-calendar-event-fill align-middle me-1"></i> Novo Agendamento
            </button>
            <button @click="abrirModalNovaComanda" class="btn btn-soft-success fw-semibold px-3">
              <i class="ri-receipt-fill align-middle me-1"></i> Nova Comanda
            </button>
            <button @click="resetarDadosDemonstracao" class="btn btn-soft-secondary px-2" title="Restaurar dados demo">
              <i class="ri-refresh-line fs-16"></i>
            </button>
          </div>
        </div>
      </BCol>
    </BRow>

    <!-- MÉTRICAS PRINCIPAIS - 4 CARDS ELEGANTES -->
    <BRow class="mb-3 g-3">
      <!-- Faturamento Hoje -->
      <BCol xl="3" sm="6">
        <div class="card dash-metric-card mb-0">
          <div class="dash-metric-icon dash-metric-green">
            <i class="ri-money-dollar-circle-line"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="text-muted fs-12 fw-semibold mb-1 text-uppercase ls-1">Faturamento</p>
            <h4 class="fw-bold text-body mb-1">R$ {{ faturamentoHoje.toFixed(2) }}</h4>
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-success-subtle text-success fs-11">
                <i class="ri-arrow-up-s-fill"></i> +18%
              </span>
              <span class="text-muted fs-11">Meta: R$ 2.500</span>
            </div>
          </div>
        </div>
      </BCol>

      <!-- Atendimentos -->
      <BCol xl="3" sm="6">
        <div class="card dash-metric-card mb-0">
          <div class="dash-metric-icon dash-metric-blue">
            <i class="ri-scissors-2-line"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="text-muted fs-12 fw-semibold mb-1 text-uppercase ls-1">Atendimentos</p>
            <h4 class="fw-bold text-body mb-1">
              {{ agendamentosConcluidos.length }}<span class="text-muted fs-14 fw-normal"> / {{ agendamentosHoje.length }}</span>
            </h4>
            <div class="d-flex align-items-center gap-2">
              <span class="text-warning fs-11 fw-semibold">{{ agendamentosEmAndamento.length }} cortando</span>
              <span class="text-muted fs-11">•</span>
              <span class="text-info fs-11 fw-semibold">{{ agendamentosAguardando.length }} aguardando</span>
            </div>
          </div>
        </div>
      </BCol>

      <!-- Ticket Médio -->
      <BCol xl="3" sm="6">
        <div class="card dash-metric-card mb-0">
          <div class="dash-metric-icon dash-metric-amber">
            <i class="ri-shopping-cart-2-line"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="text-muted fs-12 fw-semibold mb-1 text-uppercase ls-1">Ticket Médio</p>
            <h4 class="fw-bold text-body mb-1">R$ {{ ticketMedio.toFixed(2) }}</h4>
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-success-subtle text-success fs-11">
                <i class="ri-arrow-up-s-fill"></i> Acima da meta
              </span>
            </div>
          </div>
        </div>
      </BCol>

      <!-- Ocupação -->
      <BCol xl="3" sm="6">
        <div class="card dash-metric-card mb-0">
          <div class="dash-metric-icon dash-metric-purple">
            <i class="ri-armchair-line"></i>
          </div>
          <div class="flex-grow-1 ms-3">
            <p class="text-muted fs-12 fw-semibold mb-1 text-uppercase ls-1">Ocupação</p>
            <h4 class="fw-bold text-body mb-1">
              {{ Math.round((barbeirosOcupados / (barbeiros.length || 1)) * 100) }}%
            </h4>
            <div class="d-flex align-items-center gap-2">
              <span class="text-body fs-11 fw-semibold">{{ barbeirosOcupados }}/{{ barbeiros.length }}</span>
              <span class="text-muted fs-11">cadeiras ativas</span>
            </div>
          </div>
        </div>
      </BCol>
    </BRow>

    <!-- CADEIRAS AO VIVO -->
    <BRow class="mb-3">
      <BCol cols="12">
        <BCard no-body class="dash-section-card">
          <BCardHeader class="dash-section-header">
            <div class="d-flex align-items-center gap-2">
              <div class="dash-section-icon-sm bg-warning-subtle text-warning">
                <i class="ri-armchair-fill"></i>
              </div>
              <div>
                <h6 class="card-title mb-0 fw-bold text-body">Cadeiras ao Vivo</h6>
                <span class="text-muted fs-11">Status em tempo real das estações</span>
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-success-subtle text-success border-0 fs-11">● {{ barbeirosOcupados }} Cortando</span>
              <span class="badge bg-primary-subtle text-primary border-0 fs-11">● {{ barbeiros.filter(b => b.status === 'disponivel').length }} Livres</span>
              <span class="badge bg-secondary-subtle text-secondary border-0 fs-11">● {{ barbeiros.filter(b => b.status === 'intervalo').length }} Pausa</span>
            </div>
          </BCardHeader>
          <BCardBody class="p-3">
            <BRow class="g-3">
              <BCol xl="3" md="6" v-for="barbeiro in barbeiros" :key="barbeiro.id">
                <div class="dash-station-card h-100"
                  :class="{
                    'dash-station-cutting': barbeiro.status === 'atendendo',
                    'dash-station-free': barbeiro.status === 'disponivel',
                    'dash-station-break': barbeiro.status === 'intervalo'
                  }">

                  <!-- Barbeiro Info -->
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="d-flex align-items-center gap-2">
                      <div class="position-relative">
                        <img :src="barbeiro.foto" :alt="barbeiro.nome" class="rounded-circle object-fit-cover border" width="40" height="40" />
                        <span class="dash-status-dot"
                          :class="{
                            'bg-success': barbeiro.status === 'atendendo',
                            'bg-primary': barbeiro.status === 'disponivel',
                            'bg-secondary': barbeiro.status === 'intervalo'
                          }"></span>
                      </div>
                      <div>
                        <h6 class="fs-13 fw-bold mb-0 text-body">{{ barbeiro.apelido }}</h6>
                        <span class="text-muted fs-11">{{ barbeiro.cadeira }}</span>
                      </div>
                    </div>
                    <span class="dash-status-tag"
                      :class="{
                        'dash-tag-success': barbeiro.status === 'atendendo',
                        'dash-tag-primary': barbeiro.status === 'disponivel',
                        'dash-tag-muted': barbeiro.status === 'intervalo'
                      }">
                      {{ barbeiro.status === 'atendendo' ? 'Cortando' : (barbeiro.status === 'disponivel' ? 'Livre' : 'Pausa') }}
                    </span>
                  </div>

                  <!-- Status da Estação -->
                  <div v-if="barbeiro.status === 'atendendo'" class="dash-station-info mb-3">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="text-muted fs-11 text-uppercase fw-semibold">Na cadeira</span>
                      <span class="text-danger fs-11 fw-semibold"><i class="ri-timer-line me-1"></i>~15 min</span>
                    </div>
                    <p class="fw-bold text-body fs-13 mb-1">{{ getClienteNaCadeira(barbeiro.id) }}</p>
                    <span class="badge bg-warning-subtle text-warning fs-11 border-0">
                      <i class="ri-scissors-2-line me-1"></i>{{ getServicoNaCadeira(barbeiro.id) }}
                    </span>
                  </div>

                  <div v-else-if="barbeiro.status === 'disponivel'" class="dash-station-info dash-station-empty mb-3">
                    <div class="text-center py-2">
                      <i class="ri-check-double-line text-primary fs-20 d-block mb-1"></i>
                      <span class="text-primary fw-bold fs-12">Pronta & Livre</span>
                    </div>
                  </div>

                  <div v-else class="dash-station-info dash-station-paused mb-3">
                    <div class="text-center py-2">
                      <i class="ri-cup-line text-muted fs-20 d-block mb-1"></i>
                      <span class="text-muted fw-bold fs-12">Intervalo</span>
                    </div>
                  </div>

                  <!-- Métricas e Ações -->
                  <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center fs-11 text-muted mb-2 pt-2 border-top">
                      <span>Cortes: <strong class="text-body">{{ barbeiro.totalCortesHoje }}</strong></span>
                      <span>Comissão: <strong class="text-success">R$ {{ (barbeiro.totalCortesHoje * 35).toFixed(0) }}</strong></span>
                      <span class="text-warning">★ {{ barbeiro.avaliacao }}</span>
                    </div>
                    <div class="d-flex gap-1">
                      <button v-if="barbeiro.status !== 'atendendo'" @click="alternarStatusBarbeiro(barbeiro.id, 'atendendo')" class="btn btn-sm btn-soft-success flex-fill fs-11 py-1">Ocupar</button>
                      <button v-if="barbeiro.status !== 'disponivel'" @click="alternarStatusBarbeiro(barbeiro.id, 'disponivel')" class="btn btn-sm btn-soft-primary flex-fill fs-11 py-1">Liberar</button>
                      <button v-if="barbeiro.status !== 'intervalo'" @click="alternarStatusBarbeiro(barbeiro.id, 'intervalo')" class="btn btn-sm btn-soft-secondary flex-fill fs-11 py-1">Pausa</button>
                    </div>
                  </div>

                </div>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- GRÁFICOS: Fluxo + Receita por Categoria -->
    <BRow class="mb-3 g-3">
      <BCol xl="8">
        <BCard no-body class="dash-section-card h-100">
          <BCardHeader class="dash-section-header">
            <div class="d-flex align-items-center gap-2">
              <div class="dash-section-icon-sm bg-primary-subtle text-primary">
                <i class="ri-bar-chart-grouped-line"></i>
              </div>
              <div>
                <h6 class="card-title mb-0 fw-bold text-body">Fluxo de Atendimentos</h6>
                <span class="text-muted fs-11">Volume por horário (09h às 21h)</span>
              </div>
            </div>
            <span class="badge bg-warning-subtle text-warning fs-11 border-0">
              <i class="ri-fire-fill me-1"></i>Pico: 17h–20h
            </span>
          </BCardHeader>
          <BCardBody class="p-3">
            <apexchart
              type="bar"
              height="280"
              :key="isDarkMode ? 'bar-dark' : 'bar-light'"
              :options="chartHorariosOptions"
              :series="chartHorariosSeries"
            ></apexchart>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="4">
        <BCard no-body class="dash-section-card h-100">
          <BCardHeader class="dash-section-header">
            <div class="d-flex align-items-center gap-2">
              <div class="dash-section-icon-sm bg-info-subtle text-info">
                <i class="ri-pie-chart-2-line"></i>
              </div>
              <div>
                <h6 class="card-title mb-0 fw-bold text-body">Receita por Categoria</h6>
                <span class="text-muted fs-11">Distribuição do faturamento</span>
              </div>
            </div>
          </BCardHeader>
          <BCardBody class="d-flex flex-column align-items-center justify-content-center p-3">
            <apexchart
              type="donut"
              width="280"
              height="250"
              :key="isDarkMode ? 'donut-dark' : 'donut-light'"
              :options="chartCategoriasOptions"
              :series="chartCategoriasSeries"
            ></apexchart>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- TABELA DE AGENDAMENTOS + RANKING DE BARBEIROS -->
    <BRow class="g-3">
      <!-- Agendamentos de Hoje -->
      <BCol xl="8">
        <BCard no-body class="dash-section-card mb-3">
          <BCardHeader class="dash-section-header">
            <div class="d-flex align-items-center gap-2">
              <div class="dash-section-icon-sm bg-success-subtle text-success">
                <i class="ri-calendar-check-line"></i>
              </div>
              <div>
                <h6 class="card-title mb-0 fw-bold text-body">Agendamentos de Hoje</h6>
                <span class="text-muted fs-11">Gerencie a fila de clientes</span>
              </div>
            </div>
            <div class="d-flex flex-wrap align-items-center gap-2">
              <div class="position-relative">
                <input type="text" v-model="buscaClienteHoje" class="form-control form-control-sm dash-search-input" placeholder="Buscar cliente..." />
                <i class="ri-search-line dash-search-icon"></i>
              </div>
              <div class="btn-group btn-group-sm">
                <button @click="filtroStatus = 'todos'" class="btn" :class="filtroStatus === 'todos' ? 'btn-primary' : 'btn-soft-secondary'">Todos</button>
                <button @click="filtroStatus = 'em_atendimento'" class="btn" :class="filtroStatus === 'em_atendimento' ? 'btn-primary' : 'btn-soft-secondary'">Na Cadeira</button>
                <button @click="filtroStatus = 'aguardando'" class="btn" :class="filtroStatus === 'aguardando' ? 'btn-primary' : 'btn-soft-secondary'">Aguardando</button>
              </div>
            </div>
          </BCardHeader>
          <BCardBody class="p-0">
            <div class="table-responsive">
              <table class="table table-hover align-middle table-nowrap mb-0">
                <thead class="fs-12 text-muted">
                  <tr>
                    <th class="ps-3">Horário</th>
                    <th>Cliente</th>
                    <th>Barbeiro</th>
                    <th>Serviço(s)</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th class="text-end pe-3">Ações</th>
                  </tr>
                </thead>
                <tbody class="fs-13">
                  <tr v-if="agendamentosFiltrados.length === 0">
                    <td colspan="7" class="text-center py-5 text-muted fs-13">
                      <i class="ri-calendar-line fs-24 d-block mb-2 text-muted opacity-50"></i>
                      Nenhum agendamento encontrado.
                    </td>
                  </tr>
                  <tr v-for="ag in agendamentosFiltrados" :key="ag.id">
                    <td class="ps-3">
                      <span class="fw-bold text-body fs-13">{{ ag.horario }}</span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="dash-avatar-initials bg-primary-subtle text-primary">
                          {{ ag.clienteNome.substring(0, 2).toUpperCase() }}
                        </div>
                        <div>
                          <h6 class="fs-13 mb-0 fw-semibold text-body">{{ ag.clienteNome }}</h6>
                          <span class="fs-11 text-muted">{{ ag.clienteTelefone }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="fw-semibold text-body fs-12">{{ getNomeBarbeiro(ag.barbeiroId) }}</span>
                    </td>
                    <td>
                      <div class="d-flex flex-wrap gap-1">
                        <span class="badge bg-body-secondary text-body fs-11 fw-normal" v-for="s in ag.servicos" :key="s.id">
                          {{ s.nome }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <strong class="text-success fs-13">R$ {{ ag.valorTotal.toFixed(2) }}</strong>
                    </td>
                    <td>
                      <span class="dash-status-pill"
                        :class="{
                          'dash-pill-warning': ag.status === 'em_atendimento',
                          'dash-pill-info': ag.status === 'aguardando',
                          'dash-pill-primary': ag.status === 'confirmado',
                          'dash-pill-success': ag.status === 'concluido',
                          'dash-pill-danger': ag.status === 'cancelado'
                        }">
                        {{ getStatusLabel(ag.status) }}
                      </span>
                    </td>
                    <td class="text-end pe-3">
                      <div class="d-flex align-items-center justify-content-end gap-1">
                        <button v-if="ag.status === 'aguardando' || ag.status === 'confirmado'"
                          @click="iniciarAtendimento(ag)" class="btn btn-sm btn-soft-success" title="Iniciar na Cadeira">
                          <i class="ri-scissors-2-fill"></i>
                        </button>
                        <button v-if="ag.status === 'em_atendimento'"
                          @click="concluirAtendimento(ag)" class="btn btn-sm btn-soft-primary" title="Concluir">
                          <i class="ri-check-double-line"></i>
                        </button>
                        <a :href="gerarLinkWhatsApp(ag)" target="_blank" class="btn btn-sm btn-soft-success" title="WhatsApp">
                          <i class="ri-whatsapp-line"></i>
                        </a>
                        <button @click="cancelarAgendamento(ag)" class="btn btn-sm btn-soft-danger" title="Cancelar">
                          <i class="ri-close-line"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Ranking de Barbeiros -->
      <BCol xl="4">
        <BCard no-body class="dash-section-card mb-3">
          <BCardHeader class="dash-section-header">
            <div class="d-flex align-items-center gap-2">
              <div class="dash-section-icon-sm bg-warning-subtle text-warning">
                <i class="ri-trophy-line"></i>
              </div>
              <div>
                <h6 class="card-title mb-0 fw-bold text-body">Ranking do Dia</h6>
                <span class="text-muted fs-11">Produtividade & comissões</span>
              </div>
            </div>
          </BCardHeader>
          <BCardBody class="p-3">
            <div class="d-flex flex-column gap-2">
              <div v-for="(b, idx) in barbeirosOrdenados" :key="b.id"
                class="dash-leaderboard-item">
                <div class="d-flex align-items-center gap-3">
                  <!-- Position badge -->
                  <div class="dash-rank-badge"
                    :class="{
                      'dash-rank-gold': idx === 0,
                      'dash-rank-silver': idx === 1,
                      'dash-rank-bronze': idx === 2,
                      'dash-rank-default': idx > 2
                    }">
                    <i v-if="idx === 0" class="ri-vip-crown-fill"></i>
                    <span v-else>{{ idx + 1 }}</span>
                  </div>
                  <img :src="b.foto" :alt="b.nome" class="rounded-circle object-fit-cover" width="36" height="36" />
                  <div class="flex-grow-1 min-width-0">
                    <h6 class="fs-13 fw-bold mb-0 text-body text-truncate">{{ b.apelido }}</h6>
                    <div class="d-flex align-items-center gap-2">
                      <span class="fs-11 text-muted">{{ b.totalCortesHoje }} cortes</span>
                      <div class="dash-mini-progress flex-grow-1">
                        <div class="dash-mini-progress-bar" :style="{ width: Math.min(100, (b.totalCortesHoje / 10) * 100) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                  <div class="text-end flex-shrink-0">
                    <span class="d-block fw-bold text-success fs-13">R$ {{ (b.totalCortesHoje * 35).toFixed(0) }}</span>
                    <span class="fs-10 text-muted">comissão</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fechamento -->
            <div class="mt-3 pt-3 border-top">
              <button @click="fecharTurno" class="btn btn-soft-primary w-100 fw-semibold py-2">
                <i class="ri-file-list-3-line me-1"></i> Relatório do Turno
              </button>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    </div>

    <!-- MODAL DE NOVO AGENDAMENTO (COMPONENTE PADRONIZADO DA AGENDA) -->
    <ModalNovoAgendamento
      v-model="modalAgendamento"
      @salvo="carregarDados"
    />

    <!-- MODAL DE NOVA COMANDA -->
    <BModal v-model="modalComanda" title="Nova Comanda / PDV Rápido" size="lg" hide-footer>
      <form @submit.prevent="salvarNovaComanda">
        <BRow class="g-3">
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Nome do Cliente</label>
            <input type="text" v-model="formComanda.clienteNome" class="form-control" placeholder="Cliente Balcão / Avulso" required />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Barbeiro</label>
            <select v-model="formComanda.barbeiroId" class="form-select" required>
              <option value="" disabled>Selecione...</option>
              <option v-for="b in barbeiros" :key="b.id" :value="b.id">{{ b.nome }}</option>
            </select>
          </BCol>

          <BCol cols="12">
            <h6 class="fs-13 fw-bold text-body border-bottom pb-2">Produtos & Bebidas</h6>
            <div class="row g-2">
              <div class="col-md-6" v-for="prod in produtos" :key="prod.id">
                <div class="d-flex align-items-center justify-content-between p-2 border rounded bg-body-secondary">
                  <div>
                    <span class="fw-semibold text-body fs-12 d-block">{{ prod.nome }}</span>
                    <span class="text-success fw-bold fs-12">R$ {{ prod.precoVenda.toFixed(2) }}</span>
                    <span class="text-muted fs-11 ms-2">({{ prod.estoque }} un)</span>
                  </div>
                  <button type="button" @click="adicionarProdutoComanda(prod)" class="btn btn-sm btn-soft-primary">
                    <i class="ri-add-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </BCol>

          <BCol cols="12" v-if="comandaItens.length > 0">
            <div class="table-responsive border rounded">
              <table class="table table-sm align-middle mb-0">
                <thead class="fs-11">
                  <tr>
                    <th>Item</th>
                    <th>Qtd</th>
                    <th>Valor</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="fs-12">
                  <tr v-for="(item, idx) in comandaItens" :key="idx">
                    <td>{{ item.nome }}</td>
                    <td>{{ item.qtd }}</td>
                    <td>R$ {{ item.preco.toFixed(2) }}</td>
                    <td class="fw-bold">R$ {{ (item.preco * item.qtd).toFixed(2) }}</td>
                    <td class="text-end">
                      <button type="button" @click="removerItemComanda(idx)" class="btn btn-xs btn-soft-danger">
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </BCol>
        </BRow>

        <div class="mt-4 p-3 bg-light-subtle border rounded d-flex justify-content-between align-items-center">
          <div>
            <span class="text-muted fs-12 d-block">Status: <strong>Comanda Aberta</strong></span>
            <span class="text-muted fs-12">{{ totalItensComanda }} itens</span>
          </div>
          <div class="text-end">
            <span class="text-muted fs-12 d-block">Total</span>
            <h4 class="text-success fw-bold mb-0">R$ {{ totalValorComanda.toFixed(2) }}</h4>
          </div>
        </div>

        <div class="mt-4 d-flex justify-content-end gap-2">
          <button type="button" @click="modalComanda = false" class="btn btn-light">Fechar</button>
          <button type="submit" class="btn btn-success fw-semibold px-4">
            <i class="ri-receipt-line align-middle me-1"></i> Abrir Comanda
          </button>
        </div>
      </form>
    </BModal>
  </Layout>
</template>

<script>
import Swal from "sweetalert2";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import ModalNovoAgendamento from "@/components/barbearia/modal-novo-agendamento.vue";
import { BarbeariaStorage } from "@/helpers/barbearia-storage";
import { layoutComputed } from "@/state/helpers";

export default {
  components: {
    Layout,
    PageHeader,
    ModalNovoAgendamento
  },
  data() {
    return {
      barbeiros: [],
      servicos: [],
      produtos: [],
      agendamentos: [],
      comandas: [],
      financeiro: [],

      filtroStatus: 'todos',
      buscaClienteHoje: '',
      dataHoraAtual: new Date(),
      intervaloRelogio: null,
      modalAgendamento: false,
      modalComanda: false,

      // Controle de tema
      currentTheme: (typeof document !== 'undefined' && document.documentElement.getAttribute('data-bs-theme')) || 'light',
      themeObserver: null,

      // Form Nova Comanda
      formComanda: {
        clienteNome: '',
        barbeiroId: ''
      },
      comandaItens: [],

      // Gráficos ApexCharts - Séries
      chartHorariosSeries: [{
        name: "Clientes Atendidos",
        data: [4, 6, 9, 8, 5, 7, 12, 16, 18, 14, 8, 3]
      }],
      chartCategoriasSeries: [45, 25, 18, 12]
    };
  },
  computed: {
    ...layoutComputed,
    isDarkMode() {
      return this.currentTheme === 'dark' || this.mode === 'dark';
    },
    chartHorariosOptions() {
      const isDark = this.isDarkMode;
      const mutedColor = '#878a99';
      const gridBorder = isDark ? '#2e343a' : 'var(--vz-border-color, #f1f1f1)';

      return {
        chart: {
          type: "bar",
          height: 280,
          toolbar: { show: false },
          fontFamily: 'inherit'
        },
        colors: ["#405189"],
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: "50%",
            distributed: false
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: ["09h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h"],
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: { colors: mutedColor, fontSize: '11px' }
          }
        },
        yaxis: {
          labels: {
            style: { colors: mutedColor, fontSize: '11px' }
          }
        },
        grid: {
          borderColor: gridBorder,
          strokeDashArray: 3
        },
        tooltip: {
          theme: isDark ? 'dark' : 'light'
        }
      };
    },
    chartCategoriasOptions() {
      const isDark = this.isDarkMode;
      const textColor = isDark ? '#f3f6f9' : '#212529';
      const strokeColor = isDark ? '#212529' : '#ffffff';
      const mutedColor = '#878a99';

      return {
        chart: {
          type: "donut",
          height: 250,
          fontFamily: 'inherit'
        },
        labels: ["Cortes & Fade", "Barboterapia", "Combos", "Lounge / Produtos"],
        colors: ["#405189", "#0ab39c", "#f7b84b", "#f06548"],
        stroke: {
          width: 2,
          colors: [strokeColor]
        },
        legend: {
          position: "bottom",
          fontSize: '11px',
          itemMargin: {
            horizontal: 6,
            vertical: 2
          },
          labels: {
            colors: mutedColor
          }
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          pie: {
            donut: {
              size: '72%',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '12px',
                  color: mutedColor,
                  offsetY: -4
                },
                value: {
                  show: true,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: textColor,
                  offsetY: 4,
                  formatter: (val) => val + '%'
                },
                total: {
                  show: true,
                  label: 'Total',
                  fontSize: '12px',
                  color: mutedColor,
                  formatter: () => '100%'
                }
              }
            }
          }
        },
        tooltip: {
          theme: isDark ? 'dark' : 'light',
          y: {
            formatter: (val) => val + '%'
          }
        }
      };
    },
    totalBarbeirosAtivos() {
      return this.barbeiros.filter(b => b.ativo).length;
    },
    barbeirosOcupados() {
      return this.barbeiros.filter(b => b.status === 'atendendo').length;
    },
    hojeDataStr() {
      return new Date().toISOString().split('T')[0];
    },
    agendamentosHoje() {
      return this.agendamentos.filter(a => a.data === this.hojeDataStr);
    },
    agendamentosConcluidos() {
      return this.agendamentosHoje.filter(a => a.status === 'concluido');
    },
    agendamentosEmAndamento() {
      return this.agendamentosHoje.filter(a => a.status === 'em_atendimento');
    },
    agendamentosAguardando() {
      return this.agendamentosHoje.filter(a => a.status === 'aguardando');
    },
    faturamentoHoje() {
      return this.agendamentosHoje
        .filter(a => a.status === 'concluido' || a.status === 'em_atendimento')
        .reduce((acc, curr) => acc + (curr.valorTotal || 0), 0) + 480.00;
    },
    faturamentoMesTotal() {
      return this.barbeiros.reduce((acc, curr) => acc + (curr.faturamentoMes || 0), 0);
    },
    ticketMedio() {
      const concluidos = this.agendamentosConcluidos.length || 1;
      return (this.faturamentoHoje / concluidos) || 85.50;
    },
    dataHoraFormatada() {
      const d = this.dataHoraAtual;
      const diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'long' });
      const dia = d.getDate();
      const mes = d.toLocaleDateString('pt-BR', { month: 'long' });
      const hora = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, ${dia} de ${mes} • ${hora}:${min}`;
    },
    agendamentosFiltrados() {
      let lista = this.agendamentosHoje;
      if (this.filtroStatus !== 'todos') {
        lista = lista.filter(a => a.status === this.filtroStatus);
      }
      if (this.buscaClienteHoje && this.buscaClienteHoje.trim()) {
        const q = this.buscaClienteHoje.toLowerCase().trim();
        lista = lista.filter(a => 
          (a.clienteNome && a.clienteNome.toLowerCase().includes(q)) ||
          (a.clienteTelefone && a.clienteTelefone.includes(q)) ||
          (this.getNomeBarbeiro(a.barbeiroId).toLowerCase().includes(q))
        );
      }
      return lista;
    },
    barbeirosOrdenados() {
      return [...this.barbeiros].sort((a, b) => (b.totalCortesHoje || 0) - (a.totalCortesHoje || 0));
    },
    totalItensComanda() {
      return this.comandaItens.reduce((acc, curr) => acc + curr.qtd, 0);
    },
    totalValorComanda() {
      return this.comandaItens.reduce((acc, curr) => acc + (curr.preco * curr.qtd), 0);
    }
  },
  watch: {
    mode(newMode) {
      if (newMode && this.currentTheme !== newMode) {
        this.currentTheme = newMode;
      }
    }
  },
  mounted() {
    this.carregarDados();
    this.intervaloRelogio = setInterval(() => {
      this.dataHoraAtual = new Date();
    }, 15000);

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
    if (this.intervaloRelogio) {
      clearInterval(this.intervaloRelogio);
    }
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  },
  methods: {
    carregarDados() {
      BarbeariaStorage.init();
      this.barbeiros = BarbeariaStorage.getBarbeiros();
      this.servicos = BarbeariaStorage.getServicos();
      this.produtos = BarbeariaStorage.getProdutos();
      this.agendamentos = BarbeariaStorage.getAgendamentos();
      this.comandas = BarbeariaStorage.getComandas();
      this.financeiro = BarbeariaStorage.getFinanceiro();

      if (this.barbeiros.length > 0 && !this.formComanda.barbeiroId) {
        this.formComanda.barbeiroId = this.barbeiros[0].id;
      }
    },
    getNomeBarbeiro(id) {
      const b = this.barbeiros.find(item => item.id === id);
      return b ? b.apelido : 'Barbeiro';
    },
    getStatusLabel(status) {
      const mapa = {
        'em_atendimento': 'Na Cadeira',
        'aguardando': 'Aguardando',
        'confirmado': 'Confirmado',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado'
      };
      return mapa[status] || status;
    },
    getClienteNaCadeira(barbeiroId) {
      const ag = this.agendamentosHoje.find(a => a.barbeiroId === barbeiroId && a.status === 'em_atendimento');
      return ag ? ag.clienteNome : 'Cliente Avulso';
    },
    getServicoNaCadeira(barbeiroId) {
      const ag = this.agendamentosHoje.find(a => a.barbeiroId === barbeiroId && a.status === 'em_atendimento');
      if (ag && ag.servicos && ag.servicos.length > 0) {
        return ag.servicos.map(s => s.nome).join(' + ');
      }
      return 'Corte Tradicional';
    },
    alternarStatusBarbeiro(barbeiroId, novoStatus) {
      BarbeariaStorage.updateBarbeiroStatus(barbeiroId, novoStatus);
      this.carregarDados();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Status alterado para ${novoStatus.toUpperCase()}`,
        showConfirmButton: false,
        timer: 1500
      });
    },
    iniciarAtendimento(ag) {
      BarbeariaStorage.updateAgendamentoStatus(ag.id, 'em_atendimento');
      BarbeariaStorage.updateBarbeiroStatus(ag.barbeiroId, 'atendendo');
      this.carregarDados();
      Swal.fire({
        icon: 'success',
        title: 'Atendimento Iniciado!',
        text: `${ag.clienteNome} na cadeira com ${this.getNomeBarbeiro(ag.barbeiroId)}.`,
        timer: 1800,
        showConfirmButton: false
      });
    },
    concluirAtendimento(ag) {
      BarbeariaStorage.updateAgendamentoStatus(ag.id, 'concluido');
      BarbeariaStorage.updateBarbeiroStatus(ag.barbeiroId, 'disponivel');

      const b = this.barbeiros.find(item => item.id === ag.barbeiroId);
      if (b) {
        b.totalCortesHoje = (b.totalCortesHoje || 0) + 1;
        BarbeariaStorage.saveBarbeiro(b);
      }

      this.carregarDados();
      Swal.fire({
        icon: 'success',
        title: 'Corte Concluído!',
        text: `Valor: R$ ${ag.valorTotal.toFixed(2)}`,
        confirmButtonText: 'Ir para Comandas',
        showCancelButton: true,
        cancelButtonText: 'Fechar',
        confirmButtonColor: '#0ab39c'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push('/barbearia/comandas');
        }
      });
    },
    cancelarAgendamento(ag) {
      Swal.fire({
        title: 'Cancelar Agendamento?',
        text: `Cancelar o horário de ${ag.clienteNome} às ${ag.horario}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f06548',
        cancelButtonColor: '#878a99',
        confirmButtonText: 'Sim, Cancelar',
        cancelButtonText: 'Não'
      }).then((result) => {
        if (result.isConfirmed) {
          BarbeariaStorage.updateAgendamentoStatus(ag.id, 'cancelado');
          this.carregarDados();
          Swal.fire('Cancelado!', 'Horário liberado.', 'success');
        }
      });
    },
    gerarLinkWhatsApp(ag) {
      const telefoneLimpo = (ag.clienteTelefone || '').replace(/\D/g, '');
      const barbeiro = this.getNomeBarbeiro(ag.barbeiroId);
      const msg = `Fala ${ag.clienteNome}! Confirmando seu horário hoje às ${ag.horario} com ${barbeiro} na Barbearia. 💈✂️`;
      return `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(msg)}`;
    },
    abrirModalNovoAgendamento() {
      this.modalAgendamento = true;
    },
    abrirModalNovaComanda() {
      this.formComanda = {
        clienteNome: '',
        barbeiroId: this.barbeiros[0] ? this.barbeiros[0].id : ''
      };
      this.comandaItens = [];
      this.modalComanda = true;
    },
    adicionarProdutoComanda(prod) {
      const existe = this.comandaItens.find(item => item.id === prod.id);
      if (existe) {
        existe.qtd += 1;
      } else {
        this.comandaItens.push({
          id: prod.id,
          nome: prod.nome,
          preco: prod.precoVenda,
          qtd: 1
        });
      }
    },
    removerItemComanda(index) {
      this.comandaItens.splice(index, 1);
    },
    salvarNovaComanda() {
      if (this.comandaItens.length === 0) {
        Swal.fire('Atenção', 'Adicione ao menos um item.', 'warning');
        return;
      }
      const barbeiro = this.barbeiros.find(b => b.id === this.formComanda.barbeiroId);
      const novaCmd = {
        clienteNome: this.formComanda.clienteNome || 'Cliente Balcão',
        clienteTelefone: '',
        barbeiroId: this.formComanda.barbeiroId,
        barbeiroNome: barbeiro ? barbeiro.nome : 'Geral',
        dataHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
        servicos: [],
        produtos: this.comandaItens,
        subtotal: this.totalValorComanda,
        desconto: 0,
        total: this.totalValorComanda,
        status: 'aberta',
        formaPagamento: null,
        comissaoBarbeiroServico: 0,
        comissaoBarbeiroProduto: this.totalValorComanda * 0.15
      };

      BarbeariaStorage.saveComanda(novaCmd);
      this.modalComanda = false;
      this.carregarDados();

      Swal.fire({
        icon: 'success',
        title: 'Comanda Aberta!',
        text: `Comanda para ${novaCmd.clienteNome} criada.`,
        confirmButtonColor: '#0ab39c'
      });
    },
    fecharTurno() {
      Swal.fire({
        title: 'Fechamento de Turno',
        html: `
          <div class="text-start fs-13">
            <p><strong>Unidade:</strong> Matriz Jardins</p>
            <p><strong>Atendimentos:</strong> ${this.agendamentosConcluidos.length} concluídos</p>
            <p><strong>Faturamento:</strong> R$ ${this.faturamentoHoje.toFixed(2)}</p>
            <p><strong>Destaque:</strong> ${this.barbeirosOrdenados[0] ? this.barbeirosOrdenados[0].apelido : 'Nenhum'}</p>
            <hr/>
            <p class="text-success mb-0">✓ Caixa conferido com sucesso.</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Fechar e Exportar',
        confirmButtonColor: '#405189'
      });
    },
    resetarDadosDemonstracao() {
      Swal.fire({
        title: 'Restaurar Dados Demo?',
        text: 'Redefinir barbeiros, cortes e produtos para demonstração original.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, restaurar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          BarbeariaStorage.resetAll();
          this.carregarDados();
          Swal.fire('Restaurado!', 'Dados atualizados.', 'success');
        }
      });
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.ls-1 {
  letter-spacing: 0.5px;
}

/* ========================================================= */
/* LIVE BADGE                                                 */
/* ========================================================= */
.dash-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 179, 156, 0.1);
  color: #0ab39c;
  border: 1px solid rgba(10, 179, 156, 0.25);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.dash-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #0ab39c;
  animation: dash-pulse 2s infinite;
}
@keyframes dash-pulse {
  0%, 100% { opacity: 0.6; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* ========================================================= */
/* METRIC CARDS                                               */
/* ========================================================= */
.dash-metric-card {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background-color: var(--vz-card-bg, #ffffff) !important;
  border: 1px solid var(--vz-border-color, #e9ebec) !important;
  border-radius: 10px;
  transition: all 0.2s ease;
  height: 100%;
}
.dash-barbearia-wrapper.theme-dark .dash-metric-card,
[data-bs-theme="dark"] .dash-metric-card {
  background-color: #212529 !important;
  border-color: #32383e !important;
}
.dash-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.dash-barbearia-wrapper.theme-dark .dash-metric-card:hover,
[data-bs-theme="dark"] .dash-metric-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}
.dash-metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.dash-metric-green {
  background: rgba(10, 179, 156, 0.12);
  color: #0ab39c;
}
.dash-metric-blue {
  background: rgba(64, 81, 137, 0.12);
  color: #405189;
}
.dash-metric-amber {
  background: rgba(247, 184, 75, 0.12);
  color: #f7b84b;
}
.dash-metric-purple {
  background: rgba(135, 82, 204, 0.12);
  color: #8752cc;
}

/* ========================================================= */
/* SECTION CARDS                                              */
/* ========================================================= */
.dash-section-card {
  background-color: var(--vz-card-bg, #ffffff) !important;
  border: 1px solid var(--vz-border-color, #e9ebec) !important;
  border-radius: 10px;
  box-shadow: none;
  overflow: hidden;
}
.dash-barbearia-wrapper.theme-dark .dash-section-card,
[data-bs-theme="dark"] .dash-section-card {
  background-color: #212529 !important;
  border-color: #32383e !important;
}
.dash-section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vz-border-color, #e9ebec);
  background: transparent;
}
.dash-barbearia-wrapper.theme-dark .dash-section-header,
[data-bs-theme="dark"] .dash-section-header {
  border-color: #32383e !important;
}
.dash-section-icon-sm {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

/* ========================================================= */
/* STATION CARDS (CADEIRAS AO VIVO)                          */
/* ========================================================= */
.dash-station-card {
  background-color: var(--vz-card-bg, #ffffff) !important;
  border: 1px solid var(--vz-border-color, #e9ebec) !important;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}
.dash-barbearia-wrapper.theme-dark .dash-station-card,
[data-bs-theme="dark"] .dash-station-card {
  background-color: #212529 !important;
  border-color: #32383e !important;
}
.dash-station-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.dash-barbearia-wrapper.theme-dark .dash-station-card:hover,
[data-bs-theme="dark"] .dash-station-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}
.dash-station-cutting {
  border-left: 3px solid #0ab39c !important;
}
.dash-station-free {
  border-left: 3px solid #405189 !important;
}
.dash-station-break {
  border-left: 3px solid #878a99 !important;
  opacity: 0.75;
}
.dash-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--vz-card-bg, #ffffff);
}
.dash-barbearia-wrapper.theme-dark .dash-status-dot,
[data-bs-theme="dark"] .dash-status-dot {
  border-color: #212529 !important;
}
.dash-status-tag {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.3px;
}
.dash-tag-success {
  background: rgba(10, 179, 156, 0.12);
  color: #0ab39c;
}
.dash-tag-primary {
  background: rgba(64, 81, 137, 0.12);
  color: #405189;
}
.dash-tag-muted {
  background: rgba(135, 138, 153, 0.12);
  color: #878a99;
}

.dash-station-info {
  background: var(--vz-light, #f3f6f9);
  border-radius: 8px;
  padding: 12px;
}
.dash-barbearia-wrapper.theme-dark .dash-station-info,
[data-bs-theme="dark"] .dash-station-info {
  background: #282d33 !important;
  border: 1px solid #363c44;
}
.dash-station-empty,
.dash-station-paused {
  border: 1px dashed var(--vz-border-color, #e9ebec);
  background: transparent !important;
}
.dash-barbearia-wrapper.theme-dark .dash-station-empty,
.dash-barbearia-wrapper.theme-dark .dash-station-paused,
[data-bs-theme="dark"] .dash-station-empty,
[data-bs-theme="dark"] .dash-station-paused {
  border-color: #3a4149 !important;
}

/* ========================================================= */
/* SEARCH INPUT                                               */
/* ========================================================= */
.dash-search-input {
  padding-left: 32px !important;
  width: 180px;
}
.dash-search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #878a99;
  font-size: 13px;
}

/* ========================================================= */
/* TABLE AVATAR INITIALS                                      */
/* ========================================================= */
.dash-avatar-initials {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

/* ========================================================= */
/* STATUS PILLS                                               */
/* ========================================================= */
.dash-status-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}
.dash-pill-warning {
  background: rgba(247, 184, 75, 0.12);
  color: #f7b84b;
}
.dash-pill-info {
  background: rgba(41, 156, 219, 0.12);
  color: #299cdb;
}
.dash-pill-primary {
  background: rgba(64, 81, 137, 0.12);
  color: #405189;
}
.dash-pill-success {
  background: rgba(10, 179, 156, 0.12);
  color: #0ab39c;
}
.dash-pill-danger {
  background: rgba(240, 101, 72, 0.12);
  color: #f06548;
}

/* ========================================================= */
/* LEADERBOARD                                                */
/* ========================================================= */
.dash-leaderboard-item {
  padding: 12px;
  border-radius: 8px;
  background: var(--vz-light, #f3f6f9);
  transition: all 0.15s ease;
}
.dash-barbearia-wrapper.theme-dark .dash-leaderboard-item,
[data-bs-theme="dark"] .dash-leaderboard-item {
  background: rgba(255, 255, 255, 0.04);
}
.dash-leaderboard-item:hover {
  background: var(--vz-light, #eef0f4);
}
.dash-barbearia-wrapper.theme-dark .dash-leaderboard-item:hover,
[data-bs-theme="dark"] .dash-leaderboard-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.dash-rank-badge {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}
.dash-rank-gold {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
}
.dash-barbearia-wrapper.theme-dark .dash-rank-gold,
[data-bs-theme="dark"] .dash-rank-gold {
  background: linear-gradient(135deg, #78350f, #b45309);
  color: #fef3c7;
}
.dash-rank-silver {
  background: #f1f5f9;
  color: #475569;
}
.dash-barbearia-wrapper.theme-dark .dash-rank-silver,
[data-bs-theme="dark"] .dash-rank-silver {
  background: #334155;
  color: #e2e8f0;
}
.dash-rank-bronze {
  background: #fff7ed;
  color: #9a3412;
}
.dash-barbearia-wrapper.theme-dark .dash-rank-bronze,
[data-bs-theme="dark"] .dash-rank-bronze {
  background: #431407;
  color: #fdba74;
}
.dash-rank-default {
  background: transparent;
  color: #94a3b8;
}

/* Mini progress bar */
.dash-mini-progress {
  height: 3px;
  background: var(--vz-border-color, #e9ebec);
  border-radius: 2px;
  max-width: 60px;
}
.dash-mini-progress-bar {
  height: 100%;
  background: #f7b84b;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* ========================================================= */
/* TABLE REFINEMENTS                                          */
/* ========================================================= */
.dash-section-card .table thead th {
  background: var(--vz-light, #f3f6f9);
  border-bottom: 1px solid var(--vz-border-color, #e9ebec);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #878a99;
  padding: 10px 12px;
}
.dash-barbearia-wrapper.theme-dark .dash-section-card .table thead th,
[data-bs-theme="dark"] .dash-section-card .table thead th {
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
}
.dash-section-card .table tbody td {
  padding: 12px;
  border-bottom: 1px solid var(--vz-border-color, #e9ebec);
}

/* Override flashbang hover in dark mode */
.dash-barbearia-wrapper.theme-dark .dash-section-card .table-hover > tbody > tr:hover,
[data-bs-theme="dark"] .dash-section-card .table-hover > tbody > tr:hover {
  --bs-table-hover-bg: rgba(255, 255, 255, 0.03);
}
.dash-barbearia-wrapper.theme-dark .dash-section-card .table-hover > tbody > tr:hover > *,
[data-bs-theme="dark"] .dash-section-card .table-hover > tbody > tr:hover > * {
  background-color: transparent;
  color: inherit;
}

/* ========================================================= */
/* APEXCHARTS DONUT CENTER TEXT CONTRAST                     */
/* ========================================================= */
:deep(.apexcharts-datalabels-group text.apexcharts-datalabel-label) {
  fill: #878a99 !important;
}
:deep(.apexcharts-datalabels-group text.apexcharts-datalabel-value) {
  font-weight: 700 !important;
}

/* Light mode */
.dash-barbearia-wrapper.theme-light :deep(.apexcharts-datalabels-group text.apexcharts-datalabel-value) {
  fill: #212529 !important;
}
.dash-barbearia-wrapper.theme-light :deep(.apexcharts-pie-series path) {
  stroke: #ffffff !important;
}

/* Dark mode */
.dash-barbearia-wrapper.theme-dark :deep(.apexcharts-datalabels-group text.apexcharts-datalabel-value) {
  fill: #f3f6f9 !important;
}
.dash-barbearia-wrapper.theme-dark :deep(.apexcharts-pie-series path) {
  stroke: #212529 !important;
}
</style>
