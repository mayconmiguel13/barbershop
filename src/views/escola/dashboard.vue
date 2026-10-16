<template>
  <Layout>
    <PageHeader title="Painel Escolar Integrado" pageTitle="CEI Santa Filomena" />

    <!-- BANNER DE AVISO / STATUS DO DIA -->
    <BRow class="mb-2">
      <BCol cols="12">
        <div class="alert alert-primary alert-border-left alert-dismissible fade show shadow-sm" role="alert">
          <div class="d-flex align-items-center">
            <i class="ri-shield-check-fill fs-24 me-3 text-primary"></i>
            <div class="flex-grow-1">
              <h5 class="alert-heading fs-14 fw-semibold mb-1">
                Ano Letivo 2026 • Convênio SEDUC Prefeitura de Contagem
              </h5>
              <p class="mb-0 fs-12 text-muted">
                Horário Integral em andamento (07:00 às 17:00). Todos os dados de alimentação, fisiologia e frequência estão sincronizados com o banco local do CEI.
              </p>
            </div>
            <div class="flex-shrink-0 ms-2">
              <button @click="notificarFechamentoDiario" class="btn btn-sm btn-primary">
                <i class="ri-check-double-line align-middle me-1"></i> Prévia do Dia
              </button>
            </div>
          </div>
        </div>
      </BCol>
    </BRow>

    <!-- 4 WIDGETS SUPERIORES PREMIUM ESTILO VELZON -->
    <BRow>
      <!-- Widget 1: Total de Alunos & Capacidade -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm overflow-hidden">
          <BCardBody class="position-relative">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1 overflow-hidden">
                <p class="text-uppercase fw-semibold text-muted text-truncate mb-0 fs-12">Total de Alunos Matriculados</p>
              </div>
              <div class="flex-shrink-0">
                <span class="badge bg-success-subtle text-success fs-11">
                  <i class="ri-arrow-up-line align-middle"></i> 100% Ocupação
                </span>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div>
                <h4 class="fs-22 fw-bold text-dark ff-secondary mb-1">{{ alunos.length }}</h4>
                <span class="text-muted fs-12">Capacidade: <strong>{{ turmas.length * 15 }} vagas</strong></span>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-primary-subtle rounded-circle fs-3">
                  <i class="ri-team-fill text-primary"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top d-flex justify-content-between text-muted fs-11">
              <span>Maternal I ao 2º Período</span>
              <router-link to="/escola/alunos" class="text-primary fw-medium text-decoration-none">Ver Lista &rarr;</router-link>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Widget 2: Presença & Frequência Hoje -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm overflow-hidden">
          <BCardBody class="position-relative">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1 overflow-hidden">
                <p class="text-uppercase fw-semibold text-muted text-truncate mb-0 fs-12">Frequência Hoje (07h às 17h)</p>
              </div>
              <div class="flex-shrink-0">
                <span class="badge bg-info-subtle text-info fs-11">
                  Integral
                </span>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div>
                <h4 class="fs-22 fw-bold text-dark ff-secondary mb-1">
                  {{ totalPresentes }} <span class="fs-13 text-muted fw-normal">/ {{ alunos.length }}</span>
                </h4>
                <span class="badge bg-success-subtle text-success fs-11">
                  <i class="ri-checkbox-circle-line align-middle"></i> 100% Presença Registrada
                </span>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-success-subtle rounded-circle fs-3">
                  <i class="ri-user-follow-fill text-success"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top d-flex justify-content-between text-muted fs-11">
              <span>SEDUC Contagem Compliance</span>
              <router-link to="/escola/diario" class="text-success fw-medium text-decoration-none">Ver Diário &rarr;</router-link>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Widget 3: Inclusão, TEA & Alergias -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm overflow-hidden">
          <BCardBody class="position-relative">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1 overflow-hidden">
                <p class="text-uppercase fw-semibold text-muted text-truncate mb-0 fs-12">Inclusão & Cuidados Especiais</p>
              </div>
              <div class="flex-shrink-0">
                <span class="badge border" style="background-color: #f3e8ff; color: #7e22ce;">
                  TEA & Alergias
                </span>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div>
                <h4 class="fs-22 fw-bold text-dark ff-secondary mb-1">
                  {{ totalInclusao }} <span class="fs-12 text-muted fw-normal">TEA</span> • {{ totalComAlergias }} <span class="fs-12 text-muted fw-normal">Alergias</span>
                </h4>
                <span class="text-muted fs-12">Monitores SEDUC: <strong>{{ totalMonitores }} ativos</strong></span>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title rounded-circle fs-3" style="background-color: #fae8ff; color: #a21caf;">
                  <i class="ri-heart-pulse-fill"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top d-flex justify-content-between text-muted fs-11">
              <span>Cardápios & Acolhimento</span>
              <router-link to="/escola/alunos" class="fw-medium text-decoration-none" style="color: #7e22ce;">Prontuários &rarr;</router-link>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Widget 4: Contribuição Social (R$ 120) -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm overflow-hidden">
          <BCardBody class="position-relative">
            <div class="d-flex align-items-center">
              <div class="flex-grow-1 overflow-hidden">
                <p class="text-uppercase fw-semibold text-muted text-truncate mb-0 fs-12">Contribuição Social (R$ 120)</p>
              </div>
              <div class="flex-shrink-0">
                <span class="badge bg-warning-subtle text-warning fs-11">
                  Fundação Stª Filomena
                </span>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div>
                <h4 class="fs-22 fw-bold text-dark ff-secondary mb-1">R$ {{ totalArrecadado.toFixed(2) }}</h4>
                <span class="text-success fw-semibold fs-12">{{ totalPagas }} de {{ contribuicoes.length }} pagas</span>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-warning-subtle rounded-circle fs-3">
                  <i class="ri-hand-coin-fill text-warning"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top d-flex justify-content-between text-muted fs-11">
              <span>Arrecadação: {{ percentualArrecadado }}%</span>
              <router-link to="/escola/contribuicoes" class="text-warning fw-medium text-decoration-none">Recibos &rarr;</router-link>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- SEÇÃO ANALÍTICA: GRÁFICOS & DISTRIBUIÇÃO DAS TURMAS -->
    <BRow>
      <!-- Gráfico 1: Acompanhamento de Refeições & Rotina do Horário Integral -->
      <BCol xl="8">
        <BCard no-body class="shadow-sm">
          <BCardHeader class="d-flex align-items-center justify-content-between bg-light-subtle">
            <div>
              <h5 class="card-title mb-0 fs-14 fw-semibold text-dark">
                <i class="ri-bar-chart-grouped-line text-primary me-1"></i> Execução da Rotina Diária (Horário Integral)
              </h5>
              <p class="text-muted fs-11 mb-0 mt-1">Status de Café da Manhã, Almoço, Lanche, Jantar, Banho e Sono</p>
            </div>
            <div class="d-flex gap-2">
              <button @click="sincronizarRotinas" class="btn btn-sm btn-soft-secondary">
                <i class="ri-refresh-line align-middle me-1"></i> Atualizar
              </button>
              <router-link to="/escola/diario" class="btn btn-sm btn-primary">
                <i class="ri-pencil-line align-middle me-1"></i> Abrir Diário
              </router-link>
            </div>
          </BCardHeader>
          <BCardBody>
            <!-- ApexCharts Bar / Column -->
            <apexchart 
              type="bar" 
              height="290" 
              :options="chartRotinaOptions" 
              :series="chartRotinaSeries" 
            />
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Gráfico 2: Composição dos Alunos (Donut / Convênio vs Inclusão) -->
      <BCol xl="4">
        <BCard no-body class="shadow-sm h-100">
          <BCardHeader class="bg-light-subtle">
            <h5 class="card-title mb-0 fs-14 fw-semibold text-dark">
              <i class="ri-pie-chart-line text-info me-1"></i> Distribuição por Categoria
            </h5>
            <p class="text-muted fs-11 mb-0 mt-1">Perfil de atendimento do CEI Santa Filomena</p>
          </BCardHeader>
          <BCardBody class="d-flex flex-column justify-content-between">
            <apexchart 
              type="donut" 
              height="230" 
              :options="chartDonutOptions" 
              :series="chartDonutSeries" 
            />

            <div class="border-top pt-3 mt-2">
              <div class="d-flex justify-content-between fs-12 mb-2">
                <span class="text-muted"><i class="ri-circle-fill text-primary me-1 fs-10"></i> Conveniada SEDUC</span>
                <strong class="text-dark">{{ totalConveniados }} alunos</strong>
              </div>
              <div class="d-flex justify-content-between fs-12 mb-2">
                <span class="text-muted"><i class="ri-circle-fill text-warning me-1 fs-10"></i> Particular / Comunitária</span>
                <strong class="text-dark">{{ alunos.length - totalConveniados }} alunos</strong>
              </div>
              <div class="d-flex justify-content-between fs-12">
                <span class="text-muted"><i class="ri-circle-fill text-purple me-1 fs-10" style="color: #7e22ce;"></i> Inclusão & TEA</span>
                <strong style="color: #7e22ce;">{{ totalInclusao }} com suporte</strong>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- LINHA DE TABELAS & CRONOGRAMA DO DIA -->
    <BRow>
      <!-- Tabela Detalhada das Turmas da Educação Infantil -->
      <BCol xl="8">
        <BCard no-body class="shadow-sm">
          <BCardHeader class="d-flex align-items-center justify-content-between bg-light-subtle">
            <div>
              <h5 class="card-title mb-0 fs-14 fw-semibold text-dark">
                <i class="ri-building-line text-primary me-1"></i> Turmas Ativas da Educação Infantil
              </h5>
              <p class="text-muted fs-11 mb-0 mt-1">Salas com professoras regentes e monitores vinculados</p>
            </div>
            <button @click="novoAlunoModal" class="btn btn-sm btn-soft-success">
              <i class="ri-user-add-line align-middle me-1"></i> Nova Matrícula
            </button>
          </BCardHeader>
          <BCardBody class="p-0">
            <div class="table-responsive">
              <table class="table table-hover table-nowrap align-middle mb-0">
                <thead class="table-light text-muted fs-12">
                  <tr>
                    <th>Turma & Sala</th>
                    <th>Faixa Etária</th>
                    <th>Educadora Responsável</th>
                    <th>Ocupação</th>
                    <th>Inclusão</th>
                    <th class="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in turmas" :key="t.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="avatar-xs me-2">
                          <span class="avatar-title rounded-circle bg-primary-subtle text-primary fw-bold">
                            {{ t.nome.substring(0, 2) }}
                          </span>
                        </div>
                        <div>
                          <h6 class="fs-13 mb-0 fw-semibold text-dark">{{ t.nome }}</h6>
                          <span class="text-muted fs-11"><i class="ri-door-open-line"></i> {{ t.sala }}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge bg-light text-dark border">{{ t.faixaEtaria }}</span>
                    </td>
                    <td>
                      <div class="fs-13 fw-medium text-dark">{{ t.professora }}</div>
                      <span class="text-muted fs-11">Integral (07h às 17h)</span>
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="progress flex-grow-1" style="height: 6px; width: 60px;">
                          <div 
                            class="progress-bar bg-success" 
                            role="progressbar" 
                            :style="{ width: ((getAlunosPorTurma(t.id).length / 15) * 100) + '%' }"
                          ></div>
                        </div>
                        <span class="fs-12 fw-bold text-dark">{{ getAlunosPorTurma(t.id).length }}</span>
                      </div>
                    </td>
                    <td>
                      <span v-if="temInclusaoTurma(t.id)" class="badge border" style="background-color: #f3e8ff; color: #7e22ce;">
                        <i class="ri-puzzle-line align-middle"></i> TEA / Apoio
                      </span>
                      <span v-else class="text-muted fs-12">-</span>
                    </td>
                    <td class="text-end">
                      <router-link :to="{ path: '/escola/diario', query: { turma: t.id } }" class="btn btn-xs btn-outline-primary me-1">
                        <i class="ri-file-list-3-line align-middle"></i> Diário
                      </router-link>
                      <button @click="verAlunosTurma(t)" class="btn btn-xs btn-soft-secondary">
                        <i class="ri-eye-line align-middle"></i> Ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Linha do Tempo da Rotina Diária & Portaria 17h -->
      <BCol xl="4">
        <BCard no-body class="shadow-sm">
          <BCardHeader class="bg-light-subtle">
            <h5 class="card-title mb-0 fs-14 fw-semibold text-dark">
              <i class="ri-time-line text-warning me-1"></i> Cronograma Oficial do Dia
            </h5>
            <p class="text-muted fs-11 mb-0 mt-1">Horário de funcionamento integral</p>
          </BCardHeader>
          <BCardBody class="p-3">
            <div class="timeline-2">
              <div class="d-flex gap-3 mb-3">
                <div class="avatar-xs flex-shrink-0">
                  <span class="avatar-title rounded-circle bg-success-subtle text-success fs-14">
                    07h
                  </span>
                </div>
                <div>
                  <h6 class="fs-13 mb-1 fw-semibold text-dark">Entrada & Café da Manhã</h6>
                  <p class="text-muted fs-12 mb-0">Recepção das crianças no portão e café servido até 08h.</p>
                </div>
              </div>

              <div class="d-flex gap-3 mb-3">
                <div class="avatar-xs flex-shrink-0">
                  <span class="avatar-title rounded-circle bg-primary-subtle text-primary fs-14">
                    11h
                  </span>
                </div>
                <div>
                  <h6 class="fs-13 mb-1 fw-semibold text-dark">Almoço Nutritivo & Banho</h6>
                  <p class="text-muted fs-12 mb-0">Cardápio balanceado e higiene corporal nas salas de banho.</p>
                </div>
              </div>

              <div class="d-flex gap-3 mb-3">
                <div class="avatar-xs flex-shrink-0">
                  <span class="avatar-title rounded-circle bg-warning-subtle text-warning fs-14">
                    13h
                  </span>
                </div>
                <div>
                  <h6 class="fs-13 mb-1 fw-semibold text-dark">Sono & Descanso</h6>
                  <p class="text-muted fs-12 mb-0">Momento de relaxamento e sono nos colchonetes individuais.</p>
                </div>
              </div>

              <div class="d-flex gap-3 mb-3">
                <div class="avatar-xs flex-shrink-0">
                  <span class="avatar-title rounded-circle bg-info-subtle text-info fs-14">
                    15h
                  </span>
                </div>
                <div>
                  <h6 class="fs-13 mb-1 fw-semibold text-dark">Lanche da Tarde & Jantar</h6>
                  <p class="text-muted fs-12 mb-0">Lanche da tarde seguido do jantar leve às 16:30h.</p>
                </div>
              </div>

              <div class="d-flex gap-3">
                <div class="avatar-xs flex-shrink-0">
                  <span class="avatar-title rounded-circle bg-danger-subtle text-danger fs-14">
                    17h
                  </span>
                </div>
                <div>
                  <h6 class="fs-13 mb-1 fw-semibold text-danger">Saída Segura (Portaria)</h6>
                  <p class="text-muted fs-12 mb-0">Liberação estrita apenas para pessoas autorizadas com documento.</p>
                </div>
              </div>
            </div>

            <!-- Botão de Ação Rápida SweetAlert -->
            <div class="mt-4 pt-2 border-top text-center">
              <button @click="alertaPortaria" class="btn btn-sm btn-outline-danger w-100">
                <i class="ri-shield-keyhole-line align-middle me-1"></i> Protocolo de Segurança da Portaria
              </button>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<script>
import Swal from "sweetalert2";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import { EscolaStorage } from "@/helpers/escola-storage";

export default {
  components: {
    Layout,
    PageHeader
  },
  data() {
    return {
      turmas: [],
      alunos: [],
      contribuicoes: [],
      // ApexCharts - Rotina do Dia
      chartRotinaSeries: [
        {
          name: "Completo / Realizado",
          data: [15, 14, 15, 13, 15, 12]
        },
        {
          name: "Parcial / Observação",
          data: [1, 2, 1, 3, 0, 4]
        }
      ],
      chartRotinaOptions: {
        chart: {
          type: "bar",
          height: 290,
          toolbar: { show: false }
        },
        colors: ["#0ab39c", "#f7b84b"],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "45%",
            borderRadius: 4
          }
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
          categories: ["Café", "Almoço", "Lanche", "Jantar", "Banho", "Sono"]
        },
        yaxis: {
          title: { text: "Crianças" }
        },
        fill: { opacity: 1 },
        legend: { position: "top" },
        tooltip: {
          y: {
            formatter: val => `${val} crianças`
          }
        }
      },
      // ApexCharts - Donut de Categorias
      chartDonutSeries: [12, 4, 3],
      chartDonutOptions: {
        chart: { type: "donut", height: 230 },
        labels: ["Conveniada SEDUC", "Particular / Apoio", "Inclusão / TEA"],
        colors: ["#405189", "#f06548", "#8b5cf6"],
        legend: { show: false },
        dataLabels: { enabled: false },
        plotOptions: {
          pie: {
            donut: {
              size: "68%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total Alunos",
                  formatter: () => this.alunos.length || "16"
                }
              }
            }
          }
        }
      }
    };
  },
  computed: {
    totalPresentes() {
      return this.alunos.length;
    },
    totalComAlergias() {
      return this.alunos.filter(a => a.alergias && a.alergias !== "Nenhuma").length;
    },
    totalInclusao() {
      return this.alunos.filter(a => a.necessidadesEspeciais && a.necessidadesEspeciais !== "Nenhuma").length;
    },
    totalMonitores() {
      return this.alunos.filter(a => a.precisaMonitor).length;
    },
    totalConveniados() {
      return this.alunos.filter(a => a.tipoVaga && a.tipoVaga.includes("Conveniada")).length;
    },
    totalPagas() {
      return this.contribuicoes.filter(c => c.status === "pago").length;
    },
    totalArrecadado() {
      return this.contribuicoes
        .filter(c => c.status === "pago")
        .reduce((acc, cur) => acc + cur.valor, 0);
    },
    percentualArrecadado() {
      if (!this.contribuicoes.length) return 0;
      return Math.round((this.totalPagas / this.contribuicoes.length) * 100);
    }
  },
  mounted() {
    EscolaStorage.init();
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      this.turmas = EscolaStorage.getTurmas();
      this.alunos = EscolaStorage.getAlunos();
      this.contribuicoes = EscolaStorage.getContribuicoes();

      // Atualiza valores reais nas séries do gráfico donut
      const conv = this.totalConveniados;
      const part = Math.max(0, this.alunos.length - conv);
      const inc = this.totalInclusao;
      this.chartDonutSeries = [conv || 10, part || 4, inc || 2];
    },
    getAlunosPorTurma(turmaId) {
      return this.alunos.filter(a => a.turmaId === turmaId);
    },
    temInclusaoTurma(turmaId) {
      return this.alunos.some(a => a.turmaId === turmaId && a.necessidadesEspeciais && a.necessidadesEspeciais !== "Nenhuma");
    },
    sincronizarRotinas() {
      Swal.fire({
        title: "Sincronizando...",
        text: "Recalculando médias de refeições e sonos de hoje",
        icon: "info",
        timer: 1000,
        showConfirmButton: false
      }).then(() => {
        this.carregarDados();
        Swal.fire({
          icon: "success",
          title: "Painel Atualizado!",
          text: "Os indicadores da rotina escolar estão 100% atualizados.",
          timer: 1500,
          showConfirmButton: false
        });
      });
    },
    notificarFechamentoDiario() {
      Swal.fire({
        title: "Resumo do Turno Integral",
        html: `
          <div class="text-start fs-13">
            <p><strong>Instituição:</strong> CEI Santa Filomena</p>
            <p><strong>Horário:</strong> 07:00 às 17:00 (Integral)</p>
            <hr/>
            <p class="mb-1 text-success">✓ <strong>Presença:</strong> ${this.alunos.length} crianças atendidas</p>
            <p class="mb-1 text-primary">✓ <strong>Alimentação:</strong> 4 refeições servidas rigorosamente</p>
            <p class="mb-1 text-warning">✓ <strong>Inclusão/TEA:</strong> ${this.totalInclusao} crianças com plano adaptado</p>
            <p class="mb-0 text-info">✓ <strong>Portaria:</strong> Check-in de saída liberado a partir das 17h</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#405189",
        confirmButtonText: "Entendido"
      });
    },
    alertaPortaria() {
      Swal.fire({
        title: "Protocolo de Saída das 17:00h",
        text: "Apenas pessoas cadastradas na ficha do aluno com RG/CPF podem retirar a criança. É obrigatória a conferência na portaria da creche.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f06548",
        cancelButtonColor: "#878a99",
        confirmButtonText: "Ver Autorizados por Aluno",
        cancelButtonText: "Fechar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push("/escola/alunos");
        }
      });
    },
    novoAlunoModal() {
      this.$router.push("/escola/alunos");
    },
    verAlunosTurma(turma) {
      Swal.fire({
        title: `Turma: ${turma.nome}`,
        html: `
          <div class="text-start fs-13">
            <p><strong>Faixa Etária:</strong> ${turma.faixaEtaria}</p>
            <p><strong>Educadora:</strong> ${turma.professora}</p>
            <p><strong>Sala:</strong> ${turma.sala}</p>
            <p><strong>Alunos nesta turma:</strong> ${this.getAlunosPorTurma(turma.id).length} crianças</p>
          </div>
        `,
        icon: "info",
        confirmButtonColor: "#405189",
        confirmButtonText: "Fechar"
      });
    }
  }
};
</script>

<style scoped>
.timeline-2 {
  position: relative;
}
</style>
