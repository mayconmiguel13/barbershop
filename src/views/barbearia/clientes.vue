<template>
  <Layout>
    <PageHeader title="Clientes & Fidelidade (CRM Barbearia)" pageTitle="BarberFlow Pro" />

    <!-- KPIS DO CRM -->
    <BRow class="mb-4">
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Total de Clientes</p>
                <h4 class="fs-22 fw-bold text-dark mb-0 mt-2">{{ clientes.length }} Cadastrados</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-primary-subtle text-primary rounded-circle fs-3">
                  <i class="ri-user-star-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Base ativa e recorrente</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Assinantes VIP (Clube)</p>
                <h4 class="fs-22 fw-bold text-warning mb-0 mt-2">{{ clientesVipCount }} Membros</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-warning-subtle text-warning rounded-circle fs-3">
                  <i class="ri-vip-crown-fill"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Receita recorrente garantida</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Perto de Ganhar Corte (9/10)</p>
                <h4 class="fs-22 fw-bold text-success mb-0 mt-2">{{ quaseFidelizadosCount }} Clientes</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-success-subtle text-success rounded-circle fs-3">
                  <i class="ri-gift-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <span>Próxima visita gera corte cortesia</span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-semibold text-muted mb-0 fs-12">Clientes para Resgate (+30d)</p>
                <h4 class="fs-22 fw-bold text-danger mb-0 mt-2">{{ clientesParaResgateCount }} Inativos</h4>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-danger-subtle text-danger rounded-circle fs-3">
                  <i class="ri-alarm-warning-line"></i>
                </span>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top text-muted fs-11">
              <a href="javascript:void(0)" @click="dispararCampanhaResgate" class="text-danger fw-medium text-decoration-none">
                Disparar Cupom WhatsApp &rarr;
              </a>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- LISTAGEM E CRM DE CLIENTES -->
    <BCard no-body class="shadow-sm border-0">
      <BCardHeader class="bg-light-subtle d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom">
        <div>
          <h5 class="card-title mb-0 fs-15 fw-bold text-dark">
            <i class="ri-contacts-book-line text-warning me-1"></i> Fichas de Clientes & Programa de Fidelidade
          </h5>
          <span class="text-muted fs-11">Acompanhe histórico, preferências de corte, selos do cartão fidelidade e LTV</span>
        </div>
        <div class="d-flex flex-wrap align-items-center gap-2">
          <div class="search-box">
            <input type="text" v-model="busca" class="form-control form-control-sm" placeholder="Buscar por nome ou fone..." />
          </div>
          <button @click="abrirModalNovoCliente" class="btn btn-primary btn-sm fw-semibold">
            <i class="ri-user-add-line align-middle me-1"></i> Novo Cliente
          </button>
        </div>
      </BCardHeader>
      <BCardBody class="p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light fs-12 text-muted">
              <tr>
                <th>Cliente</th>
                <th>Contato / WhatsApp</th>
                <th>Barbeiro Preferido</th>
                <th>Cartão Fidelidade</th>
                <th>Status / Clube</th>
                <th>Última Visita</th>
                <th>Total Gasto (LTV)</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody class="fs-13">
              <tr v-for="cli in clientesFiltrados" :key="cli.id">
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <img :src="cli.foto" :alt="cli.nome" class="avatar-xs rounded-circle object-fit-cover shadow-sm" />
                    <div>
                      <h6 class="fs-13 mb-0 fw-semibold text-dark">{{ cli.nome }}</h6>
                      <span class="fs-11 text-muted">{{ cli.totalVisitas }} cortes realizados</span>
                    </div>
                  </div>
                </td>
                <td>
                  <a :href="gerarLinkWhatsApp(cli)" target="_blank" class="badge bg-success-subtle text-success fs-12 text-decoration-none">
                    <i class="ri-whatsapp-line align-middle me-1"></i> {{ cli.telefone }}
                  </a>
                </td>
                <td>
                  <span class="fw-medium text-dark">{{ getNomeBarbeiro(cli.barbeiroPreferidoId) }}</span>
                </td>
                <td style="min-width: 170px;">
                  <div class="d-flex align-items-center gap-2">
                    <div class="progress flex-grow-1" style="height: 8px;">
                      <div class="progress-bar bg-warning" role="progressbar"
                        :style="{ width: (cli.selosFidelidade * 10) + '%' }"></div>
                    </div>
                    <span class="fs-11 fw-bold text-dark">{{ cli.selosFidelidade }}/10</span>
                  </div>
                  <span v-if="cli.selosFidelidade >= 9" class="badge bg-success-subtle text-success fs-10 mt-1">
                    Próximo corte Grátis!
                  </span>
                </td>
                <td>
                  <span v-if="cli.planoVip" class="badge bg-warning text-dark fs-11">
                    <i class="ri-vip-crown-fill me-1"></i> VIP Black
                  </span>
                  <span v-else class="badge bg-light text-muted border fs-11">
                    Cliente Regular
                  </span>
                </td>
                <td>
                  <span class="fs-12 text-muted">{{ formatarData(cli.ultimaVisita) }}</span>
                  <span v-if="isClienteSumido(cli.ultimaVisita)" class="d-block badge bg-danger-subtle text-danger fs-10 mt-1">
                    +30 dias sem vir
                  </span>
                </td>
                <td>
                  <strong class="text-success fs-13">R$ {{ (cli.totalGasto || 0).toFixed(2) }}</strong>
                </td>
                <td class="text-end">
                  <div class="d-flex align-items-center justify-content-end gap-1">
                    <button @click="verFichaCliente(cli)" class="btn btn-xs btn-outline-primary" title="Ver Histórico & Visagismo">
                      <i class="ri-file-user-line"></i> Ficha
                    </button>
                    <a :href="gerarLinkWhatsAppResgate(cli)" target="_blank" class="btn btn-xs btn-outline-success" title="WhatsApp">
                      <i class="ri-whatsapp-line"></i>
                    </a>
                    <button @click="editarCliente(cli)" class="btn btn-xs btn-outline-secondary" title="Editar">
                      <i class="ri-edit-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BCardBody>
    </BCard>

    <!-- MODAL FICHA DE VISAGISMO E HISTÓRICO -->
    <BModal v-model="modalFicha" title="Ficha de Atendimento & Visagismo" size="lg" hide-footer>
      <div v-if="clienteSelecionado">
        <div class="d-flex align-items-center gap-3 p-3 bg-light rounded mb-3">
          <img :src="clienteSelecionado.foto" class="avatar-md rounded-circle object-fit-cover shadow-sm" />
          <div>
            <h5 class="fs-16 fw-bold text-dark mb-1">{{ clienteSelecionado.nome }}</h5>
            <span class="text-muted fs-12">{{ clienteSelecionado.telefone }} • {{ clienteSelecionado.email }}</span>
          </div>
          <div class="ms-auto text-end">
            <span class="badge bg-warning text-dark fs-12 mb-1">{{ clienteSelecionado.selosFidelidade }} de 10 Cortes Realizados</span>
            <span class="d-block fs-11 text-muted">LTV Acumulado: <strong>R$ {{ clienteSelecionado.totalGasto.toFixed(2) }}</strong></span>
          </div>
        </div>

        <div class="card border mb-3">
          <div class="card-header bg-light-subtle py-2">
            <h6 class="fs-13 fw-bold mb-0 text-dark">
              <i class="ri-file-text-line text-primary me-1"></i> Observações Técnicas & Visagismo
            </h6>
          </div>
          <div class="card-body">
            <p class="fs-13 text-dark mb-0 bg-light p-3 rounded border">
              {{ clienteSelecionado.observacoes || 'Nenhuma observação técnica registrada para este cliente.' }}
            </p>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
          <button @click="modalFicha = false" class="btn btn-light">Fechar</button>
          <a :href="gerarLinkWhatsApp(clienteSelecionado)" target="_blank" class="btn btn-success fw-semibold">
            <i class="ri-whatsapp-line me-1"></i> Chamar no WhatsApp
          </a>
        </div>
      </div>
    </BModal>

    <!-- MODAL NOVO/EDITAR CLIENTE -->
    <BModal v-model="modalCliente" :title="editando ? 'Editar Cliente' : 'Cadastrar Novo Cliente'" size="lg" hide-footer>
      <form @submit.prevent="salvarCliente">
        <BRow class="g-3">
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Nome Completo <span class="text-danger">*</span></label>
            <input type="text" v-model="formCliente.nome" class="form-control" required />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">WhatsApp / Celular <span class="text-danger">*</span></label>
            <input type="text" v-model="formCliente.telefone" class="form-control" required />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">E-mail</label>
            <input type="email" v-model="formCliente.email" class="form-control" />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Barbeiro Preferido</label>
            <select v-model="formCliente.barbeiroPreferidoId" class="form-select">
              <option v-for="b in barbeiros" :key="b.id" :value="b.id">{{ b.nome }}</option>
            </select>
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Selos no Cartão Fidelidade (0 a 10)</label>
            <input type="number" v-model.number="formCliente.selosFidelidade" class="form-control" min="0" max="10" />
          </BCol>
          <BCol md="6">
            <label class="form-label fw-semibold fs-12">Membro do Clube VIP?</label>
            <select v-model="formCliente.planoVip" class="form-select">
              <option :value="false">Não (Cliente Avulso)</option>
              <option :value="true">Sim (Assinante Clube VIP)</option>
            </select>
          </BCol>
          <BCol cols="12">
            <label class="form-label fw-semibold fs-12">Preferências de Corte & Visagismo</label>
            <textarea v-model="formCliente.observacoes" class="form-control" rows="3" placeholder="Ex: Degradê navalhado 0 alta nas laterais, gosta de cerveja IPA ao chegar"></textarea>
          </BCol>
        </BRow>

        <div class="mt-4 text-end d-flex justify-content-end gap-2">
          <button type="button" @click="modalCliente = false" class="btn btn-light">Cancelar</button>
          <button type="submit" class="btn btn-primary fw-semibold px-4">Salvar</button>
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
      clientes: [],
      barbeiros: [],
      busca: '',
      modalFicha: false,
      modalCliente: false,
      editando: false,
      clienteSelecionado: null,

      formCliente: {
        id: null,
        nome: '',
        telefone: '',
        email: '',
        foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        totalVisitas: 1,
        selosFidelidade: 1,
        totalGasto: 60.00,
        barbeiroPreferidoId: '',
        planoVip: false,
        planoNome: null,
        observacoes: ''
      }
    };
  },
  computed: {
    clientesFiltrados() {
      if (!this.busca) return this.clientes;
      const b = this.busca.toLowerCase();
      return this.clientes.filter(c =>
        c.nome.toLowerCase().includes(b) ||
        (c.telefone && c.telefone.includes(b))
      );
    },
    clientesVipCount() {
      return this.clientes.filter(c => c.planoVip).length;
    },
    quaseFidelizadosCount() {
      return this.clientes.filter(c => c.selosFidelidade >= 8).length;
    },
    clientesParaResgateCount() {
      return this.clientes.filter(c => this.isClienteSumido(c.ultimaVisita)).length;
    }
  },
  mounted() {
    this.carregarDados();
  },
  methods: {
    carregarDados() {
      this.clientes = BarbeariaStorage.getClientes();
      this.barbeiros = BarbeariaStorage.getBarbeiros();
    },
    formatarData(dataStr) {
      if (!dataStr) return 'Não registrada';
      const p = dataStr.split('-');
      if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
      return dataStr;
    },
    getNomeBarbeiro(id) {
      const b = this.barbeiros.find(item => item.id === id);
      return b ? b.apelido : 'Qualquer Barbeiro';
    },
    isClienteSumido(ultimaVisita) {
      if (!ultimaVisita) return false;
      const ult = new Date(ultimaVisita);
      const hoje = new Date();
      const diffDias = Math.floor((hoje - ult) / (1000 * 60 * 60 * 24));
      return diffDias > 30;
    },
    gerarLinkWhatsApp(cli) {
      const tel = (cli.telefone || '').replace(/\D/g, '');
      const msg = `Fala ${cli.nome}! Como você está? Passando da Barbearia para saber se já está na hora de dar aquele tapa no visual. Te aguardamos! 💈✂️`;
      return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
    },
    gerarLinkWhatsAppResgate(cli) {
      const tel = (cli.telefone || '').replace(/\D/g, '');
      const msg = `Fala ${cli.nome}! Faz um tempo que você não vem aqui na Barbearia. Preparamos uma condição especial: marque seu corte essa semana e ganhe um Chopp artesanal trincando por nossa conta! Bora agendar? 🍺✂️`;
      return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
    },
    verFichaCliente(cli) {
      this.clienteSelecionado = cli;
      this.modalFicha = true;
    },
    abrirModalNovoCliente() {
      this.editando = false;
      this.formCliente = {
        id: null,
        nome: '',
        telefone: '(11) 9',
        email: '',
        foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        totalVisitas: 1,
        selosFidelidade: 1,
        totalGasto: 0,
        barbeiroPreferidoId: this.barbeiros[0] ? this.barbeiros[0].id : '',
        planoVip: false,
        planoNome: null,
        observacoes: ''
      };
      this.modalCliente = true;
    },
    editarCliente(cli) {
      this.editando = true;
      this.formCliente = { ...cli };
      this.modalCliente = true;
    },
    salvarCliente() {
      BarbeariaStorage.saveCliente(this.formCliente);
      this.modalCliente = false;
      this.carregarDados();
      Swal.fire({
        icon: 'success',
        title: this.editando ? 'Atualizado!' : 'Cliente Cadastrado!',
        text: `${this.formCliente.nome} foi salvo com sucesso.`,
        confirmButtonColor: '#405189'
      });
    },
    dispararCampanhaResgate() {
      Swal.fire({
        title: 'Campanha de Resgate WhatsApp',
        text: `Deseja enviar cupom de Chopp/Corte Cortesia para os ${this.clientesParaResgateCount} clientes inativos há mais de 30 dias?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0ab39c',
        cancelButtonColor: '#878a99',
        confirmButtonText: 'Sim, Disparar Campanha',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Disparado!', 'Mensagens enviadas via fila do WhatsApp com sucesso.', 'success');
        }
      });
    }
  }
};
</script>
