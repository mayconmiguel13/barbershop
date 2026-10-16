<template>
  <Layout>
    <PageHeader title="Financeiro, Fluxo de Caixa & DRE" pageTitle="BarberFlow Pro" />

    <!-- 4 WIDGETS DO DRE DA BARBEARIA -->
    <BRow class="mb-4">
      <!-- Receita Bruta Total -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Receita Bruta Total</p>
                <h4 class="fs-22 fw-bold text-success mb-0 mt-2">R$ {{ receitaTotal.toFixed(2) }}</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-success-subtle text-success rounded-circle fs-3">
                  <i class="ri-arrow-up-circle-fill"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Serviços + Lounge + Clube VIP</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Comissões Repassadas -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Repasse de Comissões</p>
                <h4 class="fs-22 fw-bold text-warning mb-0 mt-2">R$ {{ totalComissoesRepassadas.toFixed(2) }}</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-warning-subtle text-warning rounded-circle fs-3">
                  <i class="ri-hand-coin-fill"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Equipe de 4 barbeiros</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Custos Fixos & Insumos -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Despesas Operacionais</p>
                <h4 class="fs-22 fw-bold text-danger mb-0 mt-2">R$ {{ despesasTotais.toFixed(2) }}</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-danger-subtle text-danger rounded-circle fs-3">
                  <i class="ri-arrow-down-circle-fill"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Insumos, Lâminas & Estoque</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Lucro Líquido Real -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Lucro Líquido Real</p>
                <h4 class="fs-22 fw-bold text-primary mb-0 mt-2">R$ {{ lucroLiquido.toFixed(2) }}</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-primary-subtle text-primary rounded-circle fs-3">
                  <i class="ri-wallet-3-fill"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Margem líquida da Barbearia: ~39%</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- GRÁFICOS FINANCEIROS -->
    <BRow class="mb-4">
      <!-- Fluxo Semanal -->
      <BCol xl="8">
        <BCard no-body class="shadow-sm border-0 h-100">
          <BCardHeader class="bg-light-subtle d-flex justify-content-between align-items-center border-bottom">
            <h5 class="card-title mb-0 fs-14 fw-bold text-dark">
              <i class="ri-line-chart-fill text-primary me-1"></i> Entradas vs Saídas (Últimas 4 Semanas)
            </h5>
            <span class="badge bg-success-subtle text-success fs-11">Saldo Positivo</span>
          </BCardHeader>
          <BCardBody>
            <apexchart
              type="area"
              height="300"
              :options="chartFinanceiroOptions"
              :series="chartFinanceiroSeries"
            ></apexchart>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Formas de Pagamento -->
      <BCol xl="4">
        <BCard no-body class="shadow-sm border-0 h-100">
          <BCardHeader class="bg-light-subtle border-bottom">
            <h5 class="card-title mb-0 fs-14 fw-bold text-dark">
              <i class="ri-pie-chart-fill text-warning me-1"></i> Formas de Pagamento
            </h5>
          </BCardHeader>
          <BCardBody class="d-flex flex-column align-items-center justify-content-center">
            <apexchart
              type="donut"
              width="310"
              :options="chartPagamentosOptions"
              :series="chartPagamentosSeries"
            ></apexchart>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- EXTRATO DE LANÇAMENTOS -->
    <BCard no-body class="shadow-sm border-0">
      <BCardHeader class="bg-light-subtle d-flex flex-wrap justify-content-between align-items-center gap-2 border-bottom">
        <div>
          <h5 class="card-title mb-0 fs-15 fw-bold text-dark">
            <i class="ri-exchange-dollar-line text-success me-1"></i> Extrato de Movimentações Financeiras
          </h5>
          <span class="text-muted fs-11">Receitas de comandas, compras de produtos e despesas do salão</span>
        </div>
        <button @click="abrirModalLancamento" class="btn btn-primary btn-sm fw-semibold shadow-sm">
          <i class="ri-add-line align-middle me-1"></i> Novo Lançamento
        </button>
      </BCardHeader>
      <BCardBody class="p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light fs-12 text-muted">
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Data / Hora</th>
                <th>Forma de Pagto</th>
                <th class="text-end">Valor</th>
              </tr>
            </thead>
            <tbody class="fs-13">
              <tr v-for="item in financeiro" :key="item.id">
                <td>
                  <span class="badge fs-11"
                    :class="item.tipo === 'receita' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                    <i :class="item.tipo === 'receita' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'" class="me-1"></i>
                    {{ item.tipo === 'receita' ? 'Receita' : 'Despesa' }}
                  </span>
                </td>
                <td><strong class="text-dark">{{ item.descricao }}</strong></td>
                <td><span class="badge bg-light text-muted border">{{ item.categoria }}</span></td>
                <td><span class="text-muted fs-12">{{ item.data }}</span></td>
                <td>{{ item.formaPagamento }}</td>
                <td class="text-end fw-bold" :class="item.tipo === 'receita' ? 'text-success' : 'text-danger'">
                  {{ item.tipo === 'receita' ? '+' : '-' }} R$ {{ item.valor.toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BCardBody>
    </BCard>

    <!-- MODAL DE NOVO LANÇAMENTO -->
    <BModal v-model="modalLancamento" title="Registrar Movimentação no Caixa" hide-footer>
      <form @submit.prevent="salvarLancamento">
        <div class="mb-3">
          <label class="form-label fw-semibold fs-12">Tipo de Movimentação</label>
          <select v-model="formLancamento.tipo" class="form-select">
            <option value="receita">Receita (Entrada)</option>
            <option value="despesa">Despesa (Saída)</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold fs-12">Descrição</label>
          <input type="text" v-model="formLancamento.descricao" class="form-control" placeholder="Ex: Compra de toalhas e golas higiênicas" required />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold fs-12">Categoria</label>
          <input type="text" v-model="formLancamento.categoria" class="form-control" placeholder="Ex: Insumos de Barbearia" required />
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Valor (R$)</label>
            <input type="number" step="0.01" v-model.number="formLancamento.valor" class="form-control" required />
          </div>
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Forma de Pagto</label>
            <select v-model="formLancamento.formaPagamento" class="form-select">
              <option value="PIX">PIX</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Cartão de Débito">Cartão de Débito</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Boleto">Boleto</option>
            </select>
          </div>
        </div>
        <div class="text-end d-flex justify-content-end gap-2">
          <button type="button" @click="modalLancamento = false" class="btn btn-light">Cancelar</button>
          <button type="submit" class="btn btn-primary fw-semibold">Salvar Lançamento</button>
        </div>
      </form>
    </BModal>
  </Layout>
</template>

<script>
import Swal from "sweetalert2";
import Layout from "@/layouts/main.vue";
import PageHeader from "@/components/page-header.vue";
import { BarbeariaStorage } from "@/helpers/barbearia-storage";

export default {
  components: {
    Layout,
    PageHeader
  },
  data() {
    return {
      financeiro: [],
      barbeiros: [],
      modalLancamento: false,
      formLancamento: {
        tipo: 'receita',
        descricao: '',
        categoria: 'Serviços & Atendimentos',
        valor: 0,
        formaPagamento: 'PIX'
      },

      chartFinanceiroSeries: [
        {
          name: "Receitas",
          data: [5400, 6800, 7200, 8100]
        },
        {
          name: "Despesas & Repasses",
          data: [3100, 3900, 4200, 4800]
        }
      ],
      chartFinanceiroOptions: {
        chart: {
          type: "area",
          height: 300,
          toolbar: { show: false }
        },
        colors: ["#0ab39c", "#f06548"],
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        xaxis: {
          categories: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"]
        },
        yaxis: {
          labels: {
            formatter: (val) => "R$ " + val
          }
        }
      },

      chartPagamentosSeries: [64, 22, 10, 4],
      chartPagamentosOptions: {
        chart: {
          type: "donut",
          height: 300
        },
        labels: ["PIX (64%)", "Cartão Crédito (22%)", "Cartão Débito (10%)", "Dinheiro (4%)"],
        colors: ["#0ab39c", "#405189", "#f7b84b", "#6c757d"],
        legend: { position: "bottom" }
      }
    };
  },
  computed: {
    receitaTotal() {
      const somaFin = this.financeiro
        .filter(f => f.tipo === 'receita')
        .reduce((acc, curr) => acc + curr.valor, 0);
      return somaFin + 27490.00; // Soma competência do mês
    },
    totalComissoesRepassadas() {
      return this.barbeiros.reduce((acc, curr) => acc + (curr.comissaoMes || 0), 0);
    },
    despesasTotais() {
      const somaDesp = this.financeiro
        .filter(f => f.tipo === 'despesa')
        .reduce((acc, curr) => acc + curr.valor, 0);
      return somaDesp + 2800.00; // Aluguel + Água/Luz + Insumos
    },
    lucroLiquido() {
      return this.receitaTotal - this.totalComissoesRepassadas - this.despesasTotais;
    }
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      this.financeiro = BarbeariaStorage.getFinanceiro();
      this.barbeiros = BarbeariaStorage.getBarbeiros();
    },
    abrirModalLancamento() {
      this.formLancamento = {
        tipo: 'receita',
        descricao: '',
        categoria: 'Serviços & Atendimentos',
        valor: 0,
        formaPagamento: 'PIX'
      };
      this.modalLancamento = true;
    },
    salvarLancamento() {
      BarbeariaStorage.addLancamentoFinanceiro({
        ...this.formLancamento,
        data: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'concluido'
      });
      this.modalLancamento = false;
      this.carregarDados();
      Swal.fire({
        icon: 'success',
        title: 'Lançamento Registrado!',
        text: 'O caixa foi atualizado imediatamente.',
        confirmButtonColor: '#0ab39c'
      });
    }
  }
};
</script>
