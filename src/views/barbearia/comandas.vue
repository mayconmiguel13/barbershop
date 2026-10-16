<template>
  <Layout>
    <PageHeader title="Comandas Eletrônicas & Caixa (PDV)" pageTitle="BarberFlow Pro" />

    <!-- RESUMO DO CAIXA HOJE -->
    <BRow class="mb-4">
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Comandas em Aberto</p>
                <h4 class="fs-22 fw-bold text-warning mb-0 mt-2">{{ comandasAbertas.length }} Mesas / Cadeiras</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-warning-subtle text-warning rounded-circle fs-3">
                  <i class="ri-receipt-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Consumo ativo no salão e lounge</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Total em Aberto</p>
                <h4 class="fs-22 fw-bold text-dark mb-0 mt-2">R$ {{ totalEmAberto.toFixed(2) }}</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-primary-subtle text-primary rounded-circle fs-3">
                  <i class="ri-time-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Aguardando fechamento no caixa</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Comandas Fechadas Hoje</p>
                <h4 class="fs-22 fw-bold text-success mb-0 mt-2">R$ {{ totalFechadoHoje.toFixed(2) }}</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-success-subtle text-success rounded-circle fs-3">
                  <i class="ri-checkbox-circle-fill"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>{{ comandasFechadas.length }} comandas liquidadas</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Comissões da Equipe Hoje</p>
                <h4 class="fs-22 fw-bold text-info mb-0 mt-2">R$ {{ totalComissaoHoje.toFixed(2) }}</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-info-subtle text-info rounded-circle fs-3">
                  <i class="ri-hand-coin-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Calculadas e provisionadas</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- BARRA DE AÇÃO RÁPIDA -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fs-15 fw-bold text-dark mb-0">Comandas Ativas no Salão</h5>
      <button @click="abrirModalNovaComanda" class="btn btn-success fw-semibold btn-sm shadow-sm">
        <i class="ri-add-line align-middle me-1"></i> Abrir Nova Comanda
      </button>
    </div>

    <!-- CARDS DE COMANDAS EM ABERTO -->
    <BRow class="g-3 mb-4">
      <BCol xl="4" md="6" v-for="cmd in comandasAbertas" :key="cmd.id">
        <BCard no-body class="shadow-sm border border-warning h-100">
          <div class="card-header bg-warning-subtle py-2 d-flex justify-content-between align-items-center">
            <span class="badge bg-warning text-dark fw-bold fs-12">{{ cmd.numero }}</span>
            <span class="fs-11 text-muted"><i class="ri-time-line"></i> {{ cmd.dataHora }}</span>
          </div>
          <BCardBody class="p-3 d-flex flex-column justify-content-between">
            <div>
              <div class="d-flex align-items-center justify-content-between mb-2">
                <h5 class="fs-14 fw-bold text-dark mb-0">{{ cmd.clienteNome }}</h5>
                <span class="badge bg-light text-muted border">{{ cmd.barbeiroNome }}</span>
              </div>

              <!-- Lista de Itens (Serviços e Produtos) -->
              <div class="bg-light p-2 rounded border mb-3 fs-12">
                <div v-for="s in cmd.servicos" :key="'s-' + s.id" class="d-flex justify-content-between py-1 border-bottom">
                  <span><i class="ri-scissors-2-line text-warning me-1"></i> {{ s.nome }}</span>
                  <strong class="text-dark">R$ {{ s.preco.toFixed(2) }}</strong>
                </div>
                <div v-for="p in cmd.produtos" :key="'p-' + p.id" class="d-flex justify-content-between py-1">
                  <span><i class="ri-cup-line text-primary me-1"></i> {{ p.qtd }}x {{ p.nome }}</span>
                  <strong class="text-dark">R$ {{ (p.preco * p.qtd).toFixed(2) }}</strong>
                </div>
              </div>
            </div>

            <div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fs-12 text-muted">Subtotal Comanda:</span>
                <h4 class="text-success fw-bold mb-0 fs-16">R$ {{ cmd.subtotal.toFixed(2) }}</h4>
              </div>

              <div class="d-flex gap-2">
                <button @click="abrirAdicionarItem(cmd)" class="btn btn-sm btn-outline-dark w-50">
                  <i class="ri-add-line"></i> + Item
                </button>
                <button @click="iniciarFechamento(cmd)" class="btn btn-sm btn-success w-50 fw-semibold">
                  <i class="ri-money-dollar-circle-line"></i> Fechar Caixa
                </button>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol cols="12" v-if="comandasAbertas.length === 0">
        <div class="alert alert-info text-center py-4">
          <i class="ri-check-double-line fs-24 d-block mb-2"></i>
          Nenhuma comanda aberta no momento. Todas as contas foram liquidadas no caixa.
        </div>
      </BCol>
    </BRow>

    <!-- HISTÓRICO DE COMANDAS FECHADAS -->
    <BCard no-body class="shadow-sm border-0">
      <BCardHeader class="bg-light-subtle border-bottom">
        <h5 class="card-title mb-0 fs-14 fw-bold text-dark">
          <i class="ri-history-line text-primary me-1"></i> Histórico de Comandas Fechadas Recentemente
        </h5>
      </BCardHeader>
      <BCardBody class="p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light fs-12 text-muted">
              <tr>
                <th>Comanda</th>
                <th>Cliente</th>
                <th>Barbeiro</th>
                <th>Data / Hora</th>
                <th>Forma de Pagamento</th>
                <th>Total Pago</th>
                <th>Comissão Barbeiro</th>
                <th class="text-end">Recibo</th>
              </tr>
            </thead>
            <tbody class="fs-13">
              <tr v-for="c in comandasFechadas" :key="c.id">
                <td><span class="badge bg-dark fs-12">{{ c.numero }}</span></td>
                <td><strong class="text-dark">{{ c.clienteNome }}</strong></td>
                <td>{{ c.barbeiroNome }}</td>
                <td><span class="text-muted fs-12">{{ c.dataHora }}</span></td>
                <td>
                  <span class="badge bg-success-subtle text-success fs-11">
                    {{ c.formaPagamento || 'PIX' }}
                  </span>
                </td>
                <td><strong class="text-success fs-14">R$ {{ c.total.toFixed(2) }}</strong></td>
                <td><span class="text-info fw-semibold">R$ {{ ((c.comissaoBarbeiroServico || 0) + (c.comissaoBarbeiroProduto || 0)).toFixed(2) }}</span></td>
                <td class="text-end">
                  <button @click="verRecibo(c)" class="btn btn-xs btn-outline-primary">
                    <i class="ri-printer-line"></i> Recibo
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BCardBody>
    </BCard>

    <!-- MODAL DE FECHAMENTO DE COMANDA -->
    <BModal v-model="modalFechamento" title="Liquidação de Comanda no Caixa" size="md" hide-footer>
      <div v-if="comandaAtiva">
        <div class="p-3 bg-light rounded mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span class="fs-12 text-muted">Comanda:</span>
            <strong>{{ comandaAtiva.numero }}</strong>
          </div>
          <div class="d-flex justify-content-between mb-1">
            <span class="fs-12 text-muted">Cliente:</span>
            <strong>{{ comandaAtiva.clienteNome }}</strong>
          </div>
          <div class="d-flex justify-content-between">
            <span class="fs-12 text-muted">Barbeiro:</span>
            <strong>{{ comandaAtiva.barbeiroNome }}</strong>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold fs-12">Forma de Pagamento <span class="text-danger">*</span></label>
          <select v-model="formaPagamentoEscolhida" class="form-select">
            <option value="PIX">PIX (Chave / QrCode na Cadeira)</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Cartão de Débito">Cartão de Débito</option>
            <option value="Dinheiro">Dinheiro Físico</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold fs-12">Desconto / Cortesia (R$)</label>
          <input type="number" step="0.01" v-model.number="descontoAplicado" class="form-control" placeholder="0.00" />
        </div>

        <div class="p-3 bg-success-subtle rounded border border-success d-flex justify-content-between align-items-center mb-4">
          <div>
            <span class="text-muted fs-12 d-block">Subtotal: R$ {{ comandaAtiva.subtotal.toFixed(2) }}</span>
            <span class="text-danger fs-12" v-if="descontoAplicado > 0">- Desconto: R$ {{ descontoAplicado.toFixed(2) }}</span>
          </div>
          <div class="text-end">
            <span class="fs-11 text-muted d-block">VALOR FINAL</span>
            <h3 class="text-success fw-bold mb-0">R$ {{ (Math.max(0, comandaAtiva.subtotal - descontoAplicado)).toFixed(2) }}</h3>
          </div>
        </div>

        <div class="d-flex justify-content-between gap-2">
          <button @click="modalFechamento = false" class="btn btn-light w-50">Cancelar</button>
          <button @click="confirmarFechamento" class="btn btn-success fw-semibold w-50">
            <i class="ri-check-double-line align-middle me-1"></i> Receber & Fechar
          </button>
        </div>
      </div>
    </BModal>

    <!-- MODAL DE ADICIONAR ITEM NA COMANDA -->
    <BModal v-model="modalAdicionarItem" title="Adicionar Bebida ou Produto na Comanda" hide-footer>
      <div v-if="comandaAtiva">
        <label class="form-label fw-semibold fs-12">Escolha o Produto / Bebida do Lounge</label>
        <div class="list-group mb-3">
          <div v-for="p in produtos" :key="p.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <span class="fw-semibold text-dark fs-13 d-block">{{ p.nome }}</span>
              <span class="text-success fw-bold fs-12">R$ {{ p.precoVenda.toFixed(2) }}</span>
            </div>
            <button @click="inserirProduto(p)" class="btn btn-xs btn-primary">
              <i class="ri-add-line"></i> Adicionar
            </button>
          </div>
        </div>
        <div class="text-end">
          <button @click="modalAdicionarItem = false" class="btn btn-light">Pronto</button>
        </div>
      </div>
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
      comandas: [],
      produtos: [],
      barbeiros: [],
      modalFechamento: false,
      modalAdicionarItem: false,
      comandaAtiva: null,
      formaPagamentoEscolhida: 'PIX',
      descontoAplicado: 0
    };
  },
  computed: {
    comandasAbertas() {
      return this.comandas.filter(c => c.status === 'aberta');
    },
    comandasFechadas() {
      return this.comandas.filter(c => c.status === 'fechada');
    },
    totalEmAberto() {
      return this.comandasAbertas.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
    },
    totalFechadoHoje() {
      return this.comandasFechadas.reduce((acc, curr) => acc + (curr.total || 0), 0);
    },
    totalComissaoHoje() {
      return this.comandasFechadas.reduce((acc, curr) =>
        acc + (curr.comissaoBarbeiroServico || 0) + (curr.comissaoBarbeiroProduto || 0), 0);
    }
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      this.comandas = BarbeariaStorage.getComandas();
      this.produtos = BarbeariaStorage.getProdutos();
      this.barbeiros = BarbeariaStorage.getBarbeiros();
    },
    abrirModalNovaComanda() {
      const b = this.barbeiros[0];
      const nova = {
        clienteNome: 'Cliente Balcão ' + Math.floor(10 + Math.random() * 90),
        barbeiroId: b ? b.id : 'barb-1',
        barbeiroNome: b ? b.apelido : 'Barbeiro',
        dataHora: new Date().toISOString().replace('T', ' ').substring(0, 16),
        servicos: [{ id: 'serv-1', nome: 'Degradê Navalhado', preco: 60.00 }],
        produtos: [{ id: 'prod-6', nome: 'Cerveja Artesanal IPA', preco: 18.00, qtd: 1 }],
        subtotal: 78.00,
        desconto: 0,
        total: 78.00,
        status: 'aberta',
        comissaoBarbeiroServico: 33.00,
        comissaoBarbeiroProduto: 2.70
      };
      BarbeariaStorage.saveComanda(nova);
      this.carregarDados();
      Swal.fire({
        icon: 'success',
        title: 'Comanda Aberta!',
        text: `Comanda aberta com sucesso para ${nova.clienteNome}.`,
        timer: 1500,
        showConfirmButton: false
      });
    },
    abrirAdicionarItem(cmd) {
      this.comandaAtiva = cmd;
      this.modalAdicionarItem = true;
    },
    inserirProduto(p) {
      const existe = this.comandaAtiva.produtos.find(item => item.id === p.id);
      if (existe) {
        existe.qtd += 1;
      } else {
        this.comandaAtiva.produtos.push({
          id: p.id,
          nome: p.nome,
          preco: p.precoVenda,
          qtd: 1
        });
      }
      this.comandaAtiva.subtotal += p.precoVenda;
      this.comandaAtiva.total = this.comandaAtiva.subtotal;
      BarbeariaStorage.saveComanda(this.comandaAtiva);
      BarbeariaStorage.updateEstoque(p.id, -1);
      this.carregarDados();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${p.nome} adicionado!`,
        timer: 1200,
        showConfirmButton: false
      });
    },
    iniciarFechamento(cmd) {
      this.comandaAtiva = cmd;
      this.formaPagamentoEscolhida = 'PIX';
      this.descontoAplicado = 0;
      this.modalFechamento = true;
    },
    confirmarFechamento() {
      BarbeariaStorage.fecharComanda(this.comandaAtiva.id, this.formaPagamentoEscolhida, this.descontoAplicado);
      this.modalFechamento = false;
      this.carregarDados();
      Swal.fire({
        icon: 'success',
        title: 'Comanda Paga com Sucesso!',
        text: `Valor liquidado via ${this.formaPagamentoEscolhida}. Comissão repassada para o profissional.`,
        confirmButtonColor: '#0ab39c'
      });
    },
    verRecibo(c) {
      Swal.fire({
        title: `Cupom ${c.numero}`,
        html: `
          <div class="text-start fs-12 p-3 bg-light rounded">
            <div class="text-center border-bottom pb-2 mb-2">
              <h5 class="mb-0 fw-bold">BARBERFLOW PRO</h5>
              <small class="text-muted">Unidade Jardins • São Paulo/SP</small>
            </div>
            <p class="mb-1"><strong>Cliente:</strong> ${c.clienteNome}</p>
            <p class="mb-1"><strong>Barbeiro:</strong> ${c.barbeiroNome}</p>
            <p class="mb-1"><strong>Data/Hora:</strong> ${c.dataHora}</p>
            <p class="mb-1"><strong>Forma de Pagto:</strong> ${c.formaPagamento || 'PIX'}</p>
            <hr/>
            <div class="d-flex justify-content-between fw-bold fs-14 text-dark">
              <span>TOTAL PAGO:</span>
              <span class="text-success">R$ ${c.total.toFixed(2)}</span>
            </div>
          </div>
        `,
        confirmButtonText: 'Imprimir Recibo',
        showCancelButton: true,
        cancelButtonText: 'Fechar',
        confirmButtonColor: '#405189'
      });
    }
  }
};
</script>
