<template>
  <Layout>
    <PageHeader title="Serviços, Produtos & Estoque" pageTitle="BarberFlow Pro" />

    <!-- ABAS PRINCIPAIS: SERVIÇOS VS PRODUTOS -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
      <ul class="nav nav-pills nav-custom nav-custom-light">
        <li class="nav-item">
          <a class="nav-link cursor-pointer fw-semibold fs-13" :class="{ active: abaAtiva === 'servicos' }" @click="abaAtiva = 'servicos'">
            <i class="ri-scissors-2-line me-1"></i> Catálogo de Serviços ({{ servicos.length }})
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link cursor-pointer fw-semibold fs-13" :class="{ active: abaAtiva === 'produtos' }" @click="abaAtiva = 'produtos'">
            <i class="ri-shopping-bag-3-line me-1"></i> Estoque Produtos & Lounge ({{ produtos.length }})
          </a>
        </li>
      </ul>

      <div>
        <button v-if="abaAtiva === 'servicos'" @click="abrirModalServico" class="btn btn-primary fw-semibold btn-sm shadow-sm">
          <i class="ri-add-line align-middle me-1"></i> Novo Serviço
        </button>
        <button v-else @click="abrirModalProduto" class="btn btn-warning fw-semibold btn-sm shadow-sm">
          <i class="ri-add-line align-middle me-1"></i> Novo Produto / Bebida
        </button>
      </div>
    </div>

    <!-- CONTEÚDO DA ABA SERVIÇOS -->
    <div v-if="abaAtiva === 'servicos'">
      <BRow class="g-3">
        <BCol xl="3" md="6" v-for="serv in servicos" :key="serv.id">
          <BCard no-body class="shadow-sm border-0 h-100 card-animate">
            <BCardBody class="p-3 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <span class="badge bg-light text-dark border fs-11">
                    {{ serv.categoria }}
                  </span>
                  <div class="avatar-xs">
                    <span class="avatar-title bg-warning-subtle text-warning rounded-circle fs-16">
                      <i :class="serv.icone || 'ri-scissors-2-line'"></i>
                    </span>
                  </div>
                </div>

                <h5 class="fs-14 fw-bold text-dark mb-1">{{ serv.nome }}</h5>
                <p class="fs-12 text-muted mb-3">{{ serv.descricao }}</p>
              </div>

              <div class="border-top pt-2">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fs-12 text-muted">
                    <i class="ri-timer-line"></i> {{ serv.duracaoMin }} min
                  </span>
                  <h4 class="text-success fw-bold mb-0 fs-16">R$ {{ serv.preco.toFixed(2) }}</h4>
                </div>

                <div class="d-flex justify-content-end gap-1">
                  <button @click="editarServico(serv)" class="btn btn-xs btn-outline-primary">
                    <i class="ri-edit-line"></i> Editar
                  </button>
                  <button @click="deletarServico(serv)" class="btn btn-xs btn-outline-danger">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </div>

    <!-- CONTEÚDO DA ABA PRODUTOS & LOUNGE -->
    <div v-else>
      <BCard no-body class="shadow-sm border-0">
        <BCardHeader class="bg-light-subtle d-flex justify-content-between align-items-center border-bottom">
          <div>
            <h5 class="card-title mb-0 fs-15 fw-bold text-dark">
              <i class="ri-store-2-line text-warning me-1"></i> Controle de Estoque & Bebidas do Lounge
            </h5>
            <span class="text-muted fs-11">Acompanhe quantidade em tempo real, ponto de reposição e lucratividade</span>
          </div>
          <span class="badge bg-danger-subtle text-danger fs-11">
            {{ produtosEstoqueBaixoCount }} produtos com estoque baixo
          </span>
        </BCardHeader>
        <BCardBody class="p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light fs-12 text-muted">
                <tr>
                  <th>Produto / Item</th>
                  <th>Categoria</th>
                  <th>Preço Custo</th>
                  <th>Preço Venda</th>
                  <th>Margem Lucro</th>
                  <th>Estoque Atual</th>
                  <th>Status Reposição</th>
                  <th class="text-end">Ações de Estoque</th>
                </tr>
              </thead>
              <tbody class="fs-13">
                <tr v-for="prod in produtos" :key="prod.id">
                  <td>
                    <div>
                      <h6 class="fs-13 fw-semibold text-dark mb-0">{{ prod.nome }}</h6>
                      <span class="fs-11 text-muted">{{ prod.marca }} • Cód: {{ prod.codigoBarras }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border">{{ prod.categoria }}</span>
                  </td>
                  <td>R$ {{ prod.precoCusto.toFixed(2) }}</td>
                  <td><strong class="text-success">R$ {{ prod.precoVenda.toFixed(2) }}</strong></td>
                  <td>
                    <span class="badge bg-success-subtle text-success fs-11">
                      +{{ (((prod.precoVenda - prod.precoCusto) / prod.precoCusto) * 100).toFixed(0) }}%
                    </span>
                  </td>
                  <td>
                    <h5 class="fs-14 fw-bold mb-0" :class="prod.estoque <= prod.estoqueMinimo ? 'text-danger' : 'text-dark'">
                      {{ prod.estoque }} un
                    </h5>
                    <small class="text-muted fs-10">Mínimo: {{ prod.estoqueMinimo }}</small>
                  </td>
                  <td>
                    <span v-if="prod.estoque <= prod.estoqueMinimo" class="badge bg-danger-subtle text-danger fs-11">
                      <i class="ri-alert-fill me-1"></i> Estoque Baixo
                    </span>
                    <span v-else class="badge bg-success-subtle text-success fs-11">
                      <i class="ri-check-line me-1"></i> Normal
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button @click="alterarEstoque(prod.id, -1)" class="btn btn-outline-danger" title="Dar saída -1">
                        -1
                      </button>
                      <button @click="alterarEstoque(prod.id, 5)" class="btn btn-outline-success" title="Adicionar +5">
                        +5
                      </button>
                      <button @click="alterarEstoque(prod.id, 10)" class="btn btn-outline-primary" title="Adicionar +10">
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </BCardBody>
      </BCard>
    </div>

    <!-- MODAL SERVIÇO -->
    <BModal v-model="modalServico" :title="editandoServico ? 'Editar Serviço' : 'Novo Serviço de Barbearia'" hide-footer>
      <form @submit.prevent="salvarServico">
        <div class="mb-3">
          <label class="form-label fw-semibold fs-12">Nome do Serviço <span class="text-danger">*</span></label>
          <input type="text" v-model="formServico.nome" class="form-control" placeholder="Ex: Fade Navalhado Premium" required />
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Categoria <span class="text-danger">*</span></label>
            <select v-model="formServico.categoria" class="form-select" required>
              <option value="Cabelo">Cabelo</option>
              <option value="Barba">Barba</option>
              <option value="Combo">Combo</option>
              <option value="Química">Química</option>
              <option value="Estética">Estética</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Duração (Minutos) <span class="text-danger">*</span></label>
            <input type="number" v-model.number="formServico.duracaoMin" class="form-control" required />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold fs-12">Preço de Venda (R$) <span class="text-danger">*</span></label>
          <input type="number" step="0.01" v-model.number="formServico.preco" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold fs-12">Descrição do Serviço</label>
          <textarea v-model="formServico.descricao" class="form-control" rows="2" placeholder="Detalhes da técnica e acabamento"></textarea>
        </div>
        <div class="text-end d-flex justify-content-end gap-2">
          <button type="button" @click="modalServico = false" class="btn btn-light">Cancelar</button>
          <button type="submit" class="btn btn-primary fw-semibold">Salvar Serviço</button>
        </div>
      </form>
    </BModal>

    <!-- MODAL PRODUTO -->
    <BModal v-model="modalProduto" title="Cadastrar Produto / Bebida" hide-footer>
      <form @submit.prevent="salvarProduto">
        <div class="mb-3">
          <label class="form-label fw-semibold fs-12">Nome do Produto <span class="text-danger">*</span></label>
          <input type="text" v-model="formProduto.nome" class="form-control" placeholder="Ex: Pomada Efeito Matte 150g" required />
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Categoria</label>
            <select v-model="formProduto.categoria" class="form-select">
              <option value="Cabelo">Cabelo</option>
              <option value="Barba">Barba</option>
              <option value="Bebidas">Bebidas / Lounge</option>
              <option value="Tratamento">Tratamento</option>
            </select>
          </div>
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Marca / Fabricante</label>
            <input type="text" v-model="formProduto.marca" class="form-control" placeholder="Ex: BarberFlow Lab" />
          </div>
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Preço de Custo (R$)</label>
            <input type="number" step="0.01" v-model.number="formProduto.precoCusto" class="form-control" required />
          </div>
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Preço de Venda (R$)</label>
            <input type="number" step="0.01" v-model.number="formProduto.precoVenda" class="form-control" required />
          </div>
        </div>
        <div class="row g-2 mb-3">
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Estoque Inicial</label>
            <input type="number" v-model.number="formProduto.estoque" class="form-control" required />
          </div>
          <div class="col-6">
            <label class="form-label fw-semibold fs-12">Estoque Mínimo (Alerta)</label>
            <input type="number" v-model.number="formProduto.estoqueMinimo" class="form-control" required />
          </div>
        </div>
        <div class="text-end d-flex justify-content-end gap-2">
          <button type="button" @click="modalProduto = false" class="btn btn-light">Cancelar</button>
          <button type="submit" class="btn btn-warning fw-semibold">Salvar Produto</button>
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
      abaAtiva: 'servicos',
      servicos: [],
      produtos: [],

      modalServico: false,
      editandoServico: false,
      formServico: {
        id: null,
        nome: '',
        categoria: 'Cabelo',
        preco: 50.00,
        duracaoMin: 35,
        descricao: '',
        icone: 'ri-scissors-2-line'
      },

      modalProduto: false,
      formProduto: {
        id: null,
        nome: '',
        marca: 'BarberFlow Lab',
        categoria: 'Cabelo',
        precoCusto: 15.00,
        precoVenda: 40.00,
        estoque: 20,
        estoqueMinimo: 8,
        codigoBarras: '7891234567890'
      }
    };
  },
  computed: {
    produtosEstoqueBaixoCount() {
      return this.produtos.filter(p => p.estoque <= p.estoqueMinimo).length;
    }
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      this.servicos = BarbeariaStorage.getServicos();
      this.produtos = BarbeariaStorage.getProdutos();
    },
    abrirModalServico() {
      this.editandoServico = false;
      this.formServico = {
        id: null,
        nome: '',
        categoria: 'Cabelo',
        preco: 50.00,
        duracaoMin: 35,
        descricao: '',
        icone: 'ri-scissors-2-line'
      };
      this.modalServico = true;
    },
    editarServico(serv) {
      this.editandoServico = true;
      this.formServico = { ...serv };
      this.modalServico = true;
    },
    salvarServico() {
      BarbeariaStorage.saveServico(this.formServico);
      this.modalServico = false;
      this.carregarDados();
      Swal.fire({
        icon: 'success',
        title: 'Serviço Salvo!',
        text: 'O serviço já está disponível na grade de agendamentos.',
        confirmButtonColor: '#405189'
      });
    },
    deletarServico(serv) {
      Swal.fire({
        title: 'Remover Serviço?',
        text: `Deseja remover "${serv.nome}" do catálogo?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f06548',
        confirmButtonText: 'Sim, remover'
      }).then((result) => {
        if (result.isConfirmed) {
          BarbeariaStorage.deleteServico(serv.id);
          this.carregarDados();
          Swal.fire('Removido!', 'Serviço deletado.', 'success');
        }
      });
    },
    abrirModalProduto() {
      this.formProduto = {
        id: null,
        nome: '',
        marca: 'BarberFlow Lab',
        categoria: 'Cabelo',
        precoCusto: 15.00,
        precoVenda: 40.00,
        estoque: 20,
        estoqueMinimo: 8,
        codigoBarras: '7891234567890'
      };
      this.modalProduto = true;
    },
    salvarProduto() {
      BarbeariaStorage.saveProduto(this.formProduto);
      this.modalProduto = false;
      this.carregarDados();
      Swal.fire({
        icon: 'success',
        title: 'Produto Salvo!',
        text: 'Produto cadastrado no estoque.',
        confirmButtonColor: '#0ab39c'
      });
    },
    alterarEstoque(produtoId, variacao) {
      BarbeariaStorage.updateEstoque(produtoId, variacao);
      this.carregarDados();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Estoque atualizado (${variacao > 0 ? '+' : ''}${variacao})`,
        showConfirmButton: false,
        timer: 1200
      });
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
