<template>
  <Layout>
    <PageHeader title="Contribuições Sociais (R$ 120)" pageTitle="Fundação Santa Filomena" />

    <!-- Métricas Financeiras -->
    <BRow class="mb-4">
      <BCol md="4">
        <BCard no-body class="card-animate">
          <BCardBody>
            <p class="text-uppercase fw-medium text-muted mb-0">Total Previsto</p>
            <h4 class="fs-22 fw-semibold ff-secondary mt-2 mb-1">R$ {{ totalEsperado.toFixed(2) }}</h4>
            <span class="text-muted fs-12">{{ contribuicoes.length }} contribuições de R$ 120,00</span>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol md="4">
        <BCard no-body class="card-animate">
          <BCardBody>
            <p class="text-uppercase fw-medium text-muted mb-0">Arrecadado no Mês</p>
            <h4 class="fs-22 fw-semibold text-success mt-2 mb-1">R$ {{ totalArrecadado.toFixed(2) }}</h4>
            <span class="text-success fs-12">{{ totalPagas }} famílias contribuíram</span>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol md="4">
        <BCard no-body class="card-animate">
          <BCardBody>
            <p class="text-uppercase fw-medium text-muted mb-0">Pendente</p>
            <h4 class="fs-22 fw-semibold text-warning mt-2 mb-1">R$ {{ totalPendente.toFixed(2) }}</h4>
            <span class="text-warning fs-12">{{ contribuicoes.length - totalPagas }} pendentes</span>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Tabela Oficial de Contribuições -->
    <BCard no-body>
      <BCardHeader class="d-flex align-items-center">
        <h5 class="card-title mb-0 flex-grow-1">Lista de Contribuições - Outubro/2026</h5>
      </BCardHeader>
      <BCardBody>
        <div class="table-responsive table-card">
          <table class="table table-hover align-middle table-nowrap mb-0">
            <thead class="table-light text-muted">
              <tr>
                <th>Aluno(a)</th>
                <th>Responsável</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data Pagamento</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in contribuicoes" :key="c.id">
                <td>
                  <h5 class="fs-14 my-1 fw-medium">{{ getNomeAluno(c.alunoId) }}</h5>
                  <span class="text-muted fs-12">Matrícula CEI</span>
                </td>
                <td>{{ getResponsavel(c.alunoId) }}</td>
                <td><span class="fw-semibold">R$ {{ c.valor.toFixed(2) }}</span></td>
                <td>
                  <span v-if="c.status === 'pago'" class="badge bg-success-subtle text-success">
                    <i class="ri-check-line align-middle me-1"></i> Pago ({{ c.metodo }})
                  </span>
                  <span v-else class="badge bg-warning-subtle text-warning">
                    <i class="ri-time-line align-middle me-1"></i> Pendente
                  </span>
                </td>
                <td>{{ c.dataPagamento || '-' }}</td>
                <td class="text-end">
                  <button v-if="c.status !== 'pago'" @click="marcarComoPago(c.id)" class="btn btn-sm btn-success me-1">
                    <i class="ri-checkbox-circle-line align-middle me-1"></i> Baixa PIX
                  </button>
                  <button v-if="c.status === 'pago'" @click="verRecibo(c)" class="btn btn-sm btn-soft-primary">
                    <i class="ri-file-text-line align-middle me-1"></i> Ver Recibo
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BCardBody>
    </BCard>

    <!-- Modal Recibo Oficial Timbrado -->
    <div v-if="reciboModal" class="modal show d-block" style="background-color: rgba(15, 23, 42, 0.65);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-body p-4 text-center" id="recibo-imprimivel">
            <!-- Cabeçalho Oficial Timbrado do Recibo -->
            <div class="border-bottom pb-3 mb-3">
              <div class="d-flex align-items-center justify-content-center gap-2 mb-1">
                <i class="ri-government-line text-primary fs-28"></i>
                <h5 class="fw-bold mb-0 text-dark fs-18">FUNDAÇÃO SANTA FILOMENA</h5>
              </div>
              <small class="text-muted d-block fs-12">Centro de Educação Infantil Santa Filomena • Contagem / MG</small>
              <small class="text-muted fs-11">CNPJ: 21.034.982/0001-44 • Convênio SEDUC Contagem</small>
              <div class="mt-2">
                <span class="badge bg-primary text-white fs-12 py-1 px-3">RECIBO DE CONTRIBUIÇÃO SOCIAL</span>
              </div>
            </div>

            <!-- Dados da Contribuição -->
            <div class="text-start bg-light p-3 rounded mb-3 fs-13 border">
              <div class="d-flex justify-content-between mb-2 pb-2 border-bottom">
                <span class="text-muted">Nº do Recibo:</span>
                <strong>#REC-{{ reciboModal.id.replace('contrib-', '').toUpperCase() }}</strong>
              </div>
              <p class="mb-1"><strong>Aluno(a):</strong> {{ getNomeAluno(reciboModal.alunoId) }}</p>
              <p class="mb-1"><strong>Responsável Financeiro:</strong> {{ getResponsavel(reciboModal.alunoId) }}</p>
              <p class="mb-1"><strong>Mês de Referência:</strong> {{ reciboModal.mesReferencia }}</p>
              <p class="mb-1"><strong>Valor Pago:</strong> <span class="fs-15 fw-bold text-success">R$ {{ reciboModal.valor.toFixed(2) }}</span></p>
              <p class="mb-1"><strong>Forma de Quitação:</strong> {{ reciboModal.metodo || 'PIX' }}</p>
              <p class="mb-0"><strong>Data da Baixa:</strong> {{ reciboModal.dataPagamento || 'Hoje' }}</p>
            </div>

            <p class="text-muted fs-11 mb-4 text-center px-2">
              Declaramos para os devidos fins que recebemos a contribuição voluntária acima especificada, destinada à manutenção das atividades pedagógicas e operacionais da educação infantil integral.
            </p>

            <!-- Linha de Assinatura da Tesouraria (Visível na Impressão) -->
            <div class="pt-3 border-top w-75 mx-auto text-center mb-3">
              <strong class="fs-12 text-dark d-block">Tesouraria / Diretoria Financeira</strong>
              <small class="text-muted fs-11">Fundação Santa Filomena • Contagem - MG</small>
            </div>

            <div class="d-flex justify-content-center gap-2 mt-3 nao-imprimir">
              <button class="btn btn-secondary btn-sm" @click="reciboModal = null">Fechar</button>
              <button class="btn btn-primary btn-sm" @click="imprimir">
                <i class="ri-printer-line align-middle me-1"></i> Imprimir Recibo A4
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      contribuicoes: [],
      alunos: [],
      reciboModal: null
    };
  },
  computed: {
    totalEsperado() {
      return this.contribuicoes.reduce((acc, c) => acc + c.valor, 0);
    },
    totalArrecadado() {
      return this.contribuicoes
        .filter(c => c.status === 'pago')
        .reduce((acc, c) => acc + c.valor, 0);
    },
    totalPagas() {
      return this.contribuicoes.filter(c => c.status === 'pago').length;
    },
    totalPendente() {
      return this.totalEsperado - this.totalArrecadado;
    }
  },
  mounted() {
    EscolaStorage.init();
    this.contribuicoes = EscolaStorage.getContribuicoes();
    this.alunos = EscolaStorage.getAlunos();
  },
  methods: {
    getNomeAluno(id) {
      const a = this.alunos.find(item => item.id === id);
      return a ? a.nome : 'Aluno';
    },
    getResponsavel(id) {
      const a = this.alunos.find(item => item.id === id);
      return a?.responsaveis[0]?.nome || 'Não informado';
    },
    marcarComoPago(id) {
      Swal.fire({
        title: "Confirmar Pagamento",
        text: "Deseja dar baixa no valor de R$ 120,00 da contribuição voluntária?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0ab39c",
        cancelButtonColor: "#878a99",
        confirmButtonText: "Sim, confirmar recebimento",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          EscolaStorage.registrarPagamento(id, 'PIX');
          this.contribuicoes = EscolaStorage.getContribuicoes();
          Swal.fire({
            icon: "success",
            title: "Baixa Concluída!",
            text: "Recibo da Fundação Santa Filomena já disponível para impressão.",
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    },
    verRecibo(c) {
      this.reciboModal = c;
    },
    imprimir() {
      window.print();
    }
  }
};
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .modal,
  .modal-dialog,
  .modal-content,
  #recibo-imprimivel,
  #recibo-imprimivel * {
    visibility: visible;
  }
  .modal {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    background-color: white !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .modal-dialog {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
  }
  .modal-content {
    border: none !important;
    box-shadow: none !important;
  }
  .nao-imprimir {
    display: none !important;
  }
  #recibo-imprimivel {
    padding: 20mm 25mm !important;
    font-size: 11pt !important;
    color: #000 !important;
  }
  .bg-light {
    background-color: #f8f9fa !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
