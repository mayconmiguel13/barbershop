<template>
  <Layout>
    <PageHeader title="Gestão de Barbeiros & Comissões" pageTitle="BarberFlow Pro" />

    <!-- BANNER DE RESUMO DA EQUIPE -->
    <BRow class="mb-4">
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Total de Barbeiros</p>
                <h4 class="fs-22 fw-bold text-dark mb-0 mt-2">{{ barbeiros.length }} Profissionais</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-primary-subtle text-primary rounded-circle fs-3">
                  <i class="ri-team-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>{{ barbeirosAtivosCount }} em escala normal</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Faturamento Gerado Equipe</p>
                <h4 class="fs-22 fw-bold text-success mb-0 mt-2">R$ {{ totalFaturadoMes.toFixed(2) }}</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-success-subtle text-success rounded-circle fs-3">
                  <i class="ri-money-dollar-box-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Competência mês atual</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Comissões a Repassar</p>
                <h4 class="fs-22 fw-bold text-warning mb-0 mt-2">R$ {{ totalComissoesMes.toFixed(2) }}</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-warning-subtle text-warning rounded-circle fs-3">
                  <i class="ri-hand-coin-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Média de repasse: ~51%</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Cortes Realizados Hoje</p>
                <h4 class="fs-22 fw-bold text-info mb-0 mt-2">{{ totalCortesHojeEquipe }} Atendimentos</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-info-subtle text-info rounded-circle fs-3">
                  <i class="ri-scissors-2-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Média de 4.5 cortes/barbeiro</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- BARRA DE AÇÕES -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fs-15 fw-bold text-dark mb-0">Corpo de Profissionais da Barbearia</h5>
      <button @click="abrirModalNovoBarbeiro" class="btn btn-primary fw-semibold btn-sm shadow-sm">
        <i class="ri-user-add-line align-middle me-1"></i> Cadastrar Novo Barbeiro
      </button>
    </div>

    <!-- CARDS DOS BARBEIROS -->
    <BRow class="g-3">
      <BCol xl="6" v-for="b in barbeiros" :key="b.id">
        <BCard no-body class="shadow-sm border-0 h-100">
          <BCardBody class="p-3">
            <div class="d-flex flex-wrap align-items-start gap-3">
              <img :src="b.foto" :alt="b.nome" class="avatar-lg rounded-3 object-fit-cover shadow-sm border" />
              <div class="flex-grow-1">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 class="fs-15 fw-bold text-dark mb-1">{{ b.nome }}</h5>
                    <span class="badge bg-warning text-dark me-1">{{ b.apelido }}</span>
                    <span class="badge bg-light text-muted border">{{ b.cargo }}</span>
                  </div>
                  <span class="badge fs-11 text-uppercase"
                    :class="{
                      'bg-success-subtle text-success': b.status === 'atendendo',
                      'bg-primary-subtle text-primary': b.status === 'disponivel',
                      'bg-secondary-subtle text-secondary': b.status === 'intervalo'
                    }">
                    {{ b.status === 'atendendo' ? 'Em Cadeira' : (b.status === 'disponivel' ? 'Disponível' : 'Intervalo') }}
                  </span>
                </div>

                <p class="fs-12 text-muted mb-2 mt-2">
                  <i class="ri-star-fill text-warning me-1"></i><strong>{{ b.avaliacao }}</strong> • {{ b.especialidade }}
                </p>

                <div class="d-flex flex-wrap gap-2 fs-11 text-muted mb-3">
                  <span><i class="ri-phone-line text-primary"></i> {{ b.telefone }}</span>
                  <span><i class="ri-armchair-line text-warning"></i> {{ b.cadeira }}</span>
                </div>

                <!-- Box de Comissões e Finanças -->
                <div class="p-2 bg-light rounded border d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span class="fs-11 text-muted d-block">Comissão Cadastrada</span>
                    <strong class="fs-12 text-dark">{{ b.comissaoServico }}% Serviços • {{ b.comissaoProduto }}% Produtos</strong>
                  </div>
                  <div class="text-end">
                    <span class="fs-11 text-muted d-block">Comissão a Pagar (Mês)</span>
                    <strong class="fs-14 text-success">R$ {{ b.comissaoMes.toFixed(2) }}</strong>
                  </div>
                </div>

                <!-- Ações do Barbeiro -->
                <div class="d-flex flex-wrap gap-2 justify-content-end">
                  <button @click="abrirExtratoComissao(b)" class="btn btn-sm btn-outline-success">
                    <i class="ri-receipt-line align-middle me-1"></i> Fechar Comissão / PIX
                  </button>
                  <button @click="editarBarbeiro(b)" class="btn btn-sm btn-outline-primary">
                    <i class="ri-edit-line align-middle me-1"></i> Editar
                  </button>
                </div>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- MODAL EXTRATO E FECHAMENTO DE COMISSÃO -->
    <BModal v-model="modalComissao" title="Fechamento de Comissão do Barbeiro" size="lg" hide-footer>
      <div v-if="barbeiroSelecionado">
        <div class="d-flex align-items-center gap-3 mb-3 p-3 bg-light rounded">
          <img :src="barbeiroSelecionado.foto" class="avatar-md rounded-circle object-fit-cover" />
          <div>
            <h5 class="fs-15 fw-bold text-dark mb-0">{{ barbeiroSelecionado.nome }}</h5>
            <span class="text-muted fs-12">{{ barbeiroSelecionado.cargo }} • {{ barbeiroSelecionado.cadeira }}</span>
          </div>
          <div class="ms-auto text-end">
            <span class="text-muted fs-12 d-block">Chave PIX Cadastrada</span>
            <span class="badge bg-dark fs-12">{{ barbeiroSelecionado.telefone }}</span>
          </div>
        </div>

        <h6 class="fs-13 fw-bold text-dark border-bottom pb-2">Demonstrativo de Repasse (Competência Vigente)</h6>
        <div class="table-responsive mb-3">
          <table class="table table-sm align-middle fs-12">
            <thead class="table-light">
              <tr>
                <th>Origem</th>
                <th>Volume Bruto</th>
                <th>Taxa de Comissão</th>
                <th class="text-end">Valor a Repassar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Serviços Executados (Cortes & Barba)</td>
                <td>R$ {{ barbeiroSelecionado.faturamentoMes.toFixed(2) }}</td>
                <td><span class="badge bg-primary-subtle text-primary">{{ barbeiroSelecionado.comissaoServico }}%</span></td>
                <td class="text-end fw-bold text-success">R$ {{ (barbeiroSelecionado.faturamentoMes * (barbeiroSelecionado.comissaoServico / 100)).toFixed(2) }}</td>
              </tr>
              <tr>
                <td>Vendas de Pomadas, Óleos & Produtos</td>
                <td>R$ 480.00</td>
                <td><span class="badge bg-warning-subtle text-warning">{{ barbeiroSelecionado.comissaoProduto }}%</span></td>
                <td class="text-end fw-bold text-success">R$ {{ (480 * (barbeiroSelecionado.comissaoProduto / 100)).toFixed(2) }}</td>
              </tr>
              <tr class="table-light fw-bold fs-13">
                <td colspan="3">Total Líquido a Pagar ao Barbeiro</td>
                <td class="text-end text-success fs-15">R$ {{ barbeiroSelecionado.comissaoMes.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-4 pt-2 border-top">
          <button @click="modalComissao = false" class="btn btn-light">Fechar</button>
          <button @click="confirmarPagamentoComissao" class="btn btn-success fw-semibold">
            <i class="ri-check-double-line align-middle me-1"></i> Efetuar Pagamento & Gerar Recibo
          </button>
        </div>
      </div>
    </BModal>

    <!-- MODAL DE CADASTRO / EDIÇÃO DE BARBEIRO -->
    <BModal v-model="modalBarbeiro" :title="editando ? 'Editar Barbeiro' : 'Cadastrar Barbeiro'" size="lg" hide-footer>
      <form @submit.prevent="salvarBarbeiro">
        <BRow class="g-3">
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Nome Completo <span class="text-danger">*</span></label>
            <input type="text" v-model="formBarbeiro.nome" class="form-control" placeholder="Ex: Lucas Ferreira" required />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Apelido / Nome Artístico <span class="text-danger">*</span></label>
            <input type="text" v-model="formBarbeiro.apelido" class="form-control" placeholder="Ex: Lucas Fade" required />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">WhatsApp / Contato <span class="text-danger">*</span></label>
            <input type="text" v-model="formBarbeiro.telefone" class="form-control" placeholder="(11) 99999-9999" required />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Cadeira / Estação de Trabalho</label>
            <input type="text" v-model="formBarbeiro.cadeira" class="form-control" placeholder="Ex: Cadeira 02" required />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Comissão em Serviços (%) <span class="text-danger">*</span></label>
            <input type="number" v-model.number="formBarbeiro.comissaoServico" class="form-control" min="0" max="100" required />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Comissão em Produtos (%) <span class="text-danger">*</span></label>
            <input type="number" v-model.number="formBarbeiro.comissaoProduto" class="form-control" min="0" max="100" required />
          </BCol>
          <BCol cols="12">
            <label class="form-label fw-semibold fs-12">Especialidades & Técnicas</label>
            <input type="text" v-model="formBarbeiro.especialidade" class="form-control" placeholder="Ex: Skin Fade, Barboterapia, Navalhado, Visagismo" />
          </BCol>
          <BCol cols="12">
            <label class="form-label fw-semibold fs-12">URL da Foto do Profissional</label>
            <input type="text" v-model="formBarbeiro.foto" class="form-control" placeholder="https://..." />
          </BCol>
        </BRow>

        <div class="mt-4 text-end d-flex justify-content-end gap-2">
          <button type="button" @click="modalBarbeiro = false" class="btn btn-light">Cancelar</button>
          <button type="submit" class="btn btn-primary fw-semibold px-4">
            <i class="ri-check-line align-middle me-1"></i> Salvar Barbeiro
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
import { BarbeariaStorage } from "@/helpers/barbearia-storage";

export default {
  components: {
    Layout,
    PageHeader
  },
  data() {
    return {
      barbeiros: [],
      modalComissao: false,
      modalBarbeiro: false,
      barbeiroSelecionado: null,
      editando: false,

      formBarbeiro: {
        id: null,
        nome: '',
        apelido: '',
        cargo: 'Barbeiro Profissional',
        especialidade: '',
        telefone: '',
        comissaoServico: 50,
        comissaoProduto: 15,
        cadeira: 'Cadeira 01',
        foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        status: 'disponivel',
        faturamentoMes: 0,
        comissaoMes: 0,
        totalCortesHoje: 0,
        avaliacao: 5.0,
        ativo: true
      }
    };
  },
  computed: {
    barbeirosAtivosCount() {
      return this.barbeiros.filter(b => b.ativo).length;
    },
    totalFaturadoMes() {
      return this.barbeiros.reduce((acc, curr) => acc + (curr.faturamentoMes || 0), 0);
    },
    totalComissoesMes() {
      return this.barbeiros.reduce((acc, curr) => acc + (curr.comissaoMes || 0), 0);
    },
    totalCortesHojeEquipe() {
      return this.barbeiros.reduce((acc, curr) => acc + (curr.totalCortesHoje || 0), 0);
    }
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      this.barbeiros = BarbeariaStorage.getBarbeiros();
    },
    abrirModalNovoBarbeiro() {
      this.editando = false;
      this.formBarbeiro = {
        id: null,
        nome: '',
        apelido: '',
        cargo: 'Barbeiro Profissional',
        especialidade: 'Corte Degradê, Barba e Sobrancelha',
        telefone: '(11) 9',
        comissaoServico: 50,
        comissaoProduto: 15,
        cadeira: `Cadeira 0${this.barbeiros.length + 1}`,
        foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        status: 'disponivel',
        faturamentoMes: 0,
        comissaoMes: 0,
        totalCortesHoje: 0,
        avaliacao: 5.0,
        ativo: true
      };
      this.modalBarbeiro = true;
    },
    editarBarbeiro(b) {
      this.editando = true;
      this.formBarbeiro = { ...b };
      this.modalBarbeiro = true;
    },
    salvarBarbeiro() {
      BarbeariaStorage.saveBarbeiro(this.formBarbeiro);
      this.modalBarbeiro = false;
      this.carregarDados();
      Swal.fire({
        icon: 'success',
        title: this.editando ? 'Atualizado com Sucesso!' : 'Barbeiro Cadastrado!',
        text: `${this.formBarbeiro.nome} está pronto para receber agendamentos.`,
        confirmButtonColor: '#405189'
      });
    },
    abrirExtratoComissao(b) {
      this.barbeiroSelecionado = b;
      this.modalComissao = true;
    },
    confirmarPagamentoComissao() {
      Swal.fire({
        title: 'Confirmar Repasse de Comissão?',
        text: `Registrar repasse de R$ ${this.barbeiroSelecionado.comissaoMes.toFixed(2)} via PIX para ${this.barbeiroSelecionado.nome}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0ab39c',
        cancelButtonColor: '#878a99',
        confirmButtonText: 'Sim, Confirmar e Pagar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Lança despesa no financeiro
          BarbeariaStorage.addLancamentoFinanceiro({
            tipo: 'despesa',
            categoria: 'Comissões de Barbeiros',
            descricao: `Repasse de Comissão - ${this.barbeiroSelecionado.apelido}`,
            valor: this.barbeiroSelecionado.comissaoMes,
            formaPagamento: 'PIX',
            data: new Date().toISOString().replace('T', ' ').substring(0, 16),
            status: 'concluido'
          });

          this.modalComissao = false;
          Swal.fire({
            icon: 'success',
            title: 'Pagamento Registrado!',
            text: 'Comprovante emitido e registrado no fluxo de caixa.',
            confirmButtonColor: '#0ab39c'
          });
        }
      });
    }
  }
};
</script>
