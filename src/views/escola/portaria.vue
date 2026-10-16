<template>
  <Layout>
    <PageHeader title="Portaria & Saída Segura (17:00h)" pageTitle="Controle de Liberação de Alunos" />

    <!-- BANNER DE STATUS DO HORÁRIO INTEGRAL & SEGURANÇA -->
    <BRow class="mb-3">
      <BCol cols="12">
        <div class="alert alert-danger alert-border-left alert-dismissible fade show shadow-sm" role="alert">
          <div class="d-flex align-items-center">
            <i class="ri-shield-keyhole-fill fs-24 me-3 text-danger"></i>
            <div class="flex-grow-1">
              <h5 class="alert-heading fs-14 fw-bold mb-1">
                Protocolo Rigoroso de Portaria • Saída das 17:00h
              </h5>
              <p class="mb-0 fs-12 text-muted">
                <strong>ATENÇÃO:</strong> A criança só pode ser entregue a pessoas cadastradas na lista de autorizados com conferência de documento. Em caso de divergência ou pessoa não autorizada, contate imediatamente a coordenação.
              </p>
            </div>
            <div class="flex-shrink-0 ms-2 d-none d-md-block text-end">
              <span class="badge bg-danger fs-12 p-2">
                <i class="ri-time-line align-middle me-1"></i> Liberação a partir das 17h
              </span>
            </div>
          </div>
        </div>
      </BCol>
    </BRow>

    <!-- METRICAS DA SAÍDA HOJE -->
    <BRow class="mb-3">
      <!-- Total Presentes -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody class="p-3">
            <div class="d-flex align-items-center">
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-primary-subtle text-primary rounded-circle fs-3">
                  <i class="ri-team-line"></i>
                </span>
              </div>
              <div class="flex-grow-1 ms-3">
                <p class="text-uppercase fw-semibold fs-11 text-muted mb-0">Total na Sala Hoje</p>
                <h4 class="fs-20 fw-bold mb-0 text-dark">{{ alunos.length }} crianças</h4>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Saídas Já Liberadas -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody class="p-3">
            <div class="d-flex align-items-center">
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-success-subtle text-success rounded-circle fs-3">
                  <i class="ri-check-double-line"></i>
                </span>
              </div>
              <div class="flex-grow-1 ms-3">
                <p class="text-uppercase fw-semibold fs-11 text-muted mb-0">Já Liberadas na Portaria</p>
                <h4 class="fs-20 fw-bold mb-0 text-success">{{ totalLiberados }} liberados</h4>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Aguardando Pais -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody class="p-3">
            <div class="d-flex align-items-center">
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-warning-subtle text-warning rounded-circle fs-3">
                  <i class="ri-user-shared-line"></i>
                </span>
              </div>
              <div class="flex-grow-1 ms-3">
                <p class="text-uppercase fw-semibold fs-11 text-muted mb-0">Aguardando na Escola</p>
                <h4 class="fs-20 fw-bold mb-0 text-warning">{{ totalAguardando }} crianças</h4>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Inclusão / Atenção -->
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate border-0 shadow-sm">
          <BCardBody class="p-3">
            <div class="d-flex align-items-center">
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title rounded-circle fs-3" style="background-color: #f3e8ff; color: #7e22ce;">
                  <i class="ri-puzzle-line"></i>
                </span>
              </div>
              <div class="flex-grow-1 ms-3">
                <p class="text-uppercase fw-semibold fs-11 text-muted mb-0">Inclusão / TEA</p>
                <h4 class="fs-20 fw-bold mb-0" style="color: #7e22ce;">{{ totalInclusao }} com suporte</h4>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- BARRA DE CONTROLES: FILTRO POR TURMA & BUSCA RÁPIDA DE PORTARIA -->
    <BCard no-body class="border-0 shadow-sm mb-4">
      <BCardBody class="p-3">
        <BRow class="align-items-center g-3">
          <!-- Filtro por Turma -->
          <BCol md="3">
            <label class="form-label text-muted fs-11 fw-semibold text-uppercase mb-1">Filtrar por Turma:</label>
            <select v-model="filtroTurma" class="form-select form-select-sm">
              <option value="">Todas as Turmas (Maternal e Período)</option>
              <option v-for="t in turmas" :key="t.id" :value="t.id">{{ t.nome }} ({{ t.faixaEtaria }})</option>
            </select>
          </BCol>

          <!-- Filtro por Status da Saída -->
          <BCol md="3">
            <label class="form-label text-muted fs-11 fw-semibold text-uppercase mb-1">Status da Liberação:</label>
            <select v-model="filtroStatus" class="form-select form-select-sm">
              <option value="todos">Todos os Alunos</option>
              <option value="aguardando">Apenas Aguardando (Na Escola)</option>
              <option value="liberado">Apenas Liberados</option>
            </select>
          </BCol>

          <!-- Busca Instantânea de Portaria -->
          <BCol md="4">
            <label class="form-label text-muted fs-11 fw-semibold text-uppercase mb-1">Buscar Criança ou Responsável:</label>
            <div class="search-box position-relative">
              <input 
                type="text" 
                v-model="filtroBusca" 
                class="form-control form-control-sm ps-4" 
                placeholder="Digitar nome da criança ou quem veio buscar..." 
              />
              <i class="ri-search-line position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"></i>
            </div>
          </BCol>

          <BCol md="2" class="text-md-end">
            <label class="form-label text-muted fs-11 fw-semibold text-uppercase mb-1 d-block">Data:</label>
            <input type="date" v-model="dataSelecionada" @change="carregarDados" class="form-control form-control-sm" />
          </BCol>
        </BRow>
      </BCardBody>
    </BCard>

    <!-- LISTAGEM DE CARDS DE PORTARIA (GRADE RESPONSIVA DE CONFERÊNCIA) -->
    <BRow class="g-3">
      <BCol xl="6" v-for="aluno in alunosFiltrados" :key="aluno.id">
        <BCard no-body class="shadow-sm border transition-all h-100" :class="{ 'border-success bg-success-subtle-light': foiLiberado(aluno.id) }">
          <BCardBody class="p-3">
            <!-- Cabeçalho do Card: Foto do Aluno + Badges -->
            <div class="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
              <div class="d-flex align-items-center gap-3">
                <img :src="aluno.foto" class="rounded-circle avatar-md object-fit-cover border shadow-sm" alt="Foto Aluno" />
                <div>
                  <h5 class="fs-15 mb-0 fw-bold text-dark">{{ aluno.nome }}</h5>
                  <div class="d-flex flex-wrap gap-1 align-items-center mt-1">
                    <span class="badge bg-primary-subtle text-primary fs-11">{{ getTurmaNome(aluno.turmaId) }}</span>
                    <span v-if="aluno.necessidadesEspeciais && aluno.necessidadesEspeciais !== 'Nenhuma'" class="badge border fs-11" style="background-color: #f3e8ff; color: #7e22ce;">
                      <i class="ri-puzzle-line align-middle"></i> TEA
                    </span>
                  </div>
                </div>
              </div>

              <!-- Status de Liberação -->
              <div class="text-end">
                <div v-if="foiLiberado(aluno.id)">
                  <span class="badge bg-success fs-12 p-2 d-block">
                    <i class="ri-check-line align-middle me-1"></i> LIBERADO ÀS {{ getDadosSaida(aluno.id).horario }}
                  </span>
                  <small class="text-muted fs-11 d-block mt-1">Retirado por: <strong>{{ getDadosSaida(aluno.id).retiradoPor }}</strong></small>
                </div>
                <div v-else>
                  <span class="badge bg-warning-subtle text-warning border border-warning fs-12 p-2">
                    <i class="ri-time-line align-middle me-1"></i> Aguardando Portaria
                  </span>
                </div>
              </div>
            </div>

            <!-- PESSOAS AUTORIZADAS A RETIRAR (COM DOCUMENTO) -->
            <div class="mb-3">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="fs-12 fw-bold text-dark">
                  <i class="ri-shield-user-line text-success me-1"></i> Adultos Autorizados a Retirar:
                </span>
                <span class="badge bg-light text-muted border fs-10">Exigir Documento</span>
              </div>

              <div class="d-flex flex-column gap-1">
                <div 
                  v-for="(aut, idx) in aluno.autorizadosRetirada" 
                  :key="idx" 
                  class="p-2 rounded border bg-white d-flex align-items-center justify-content-between"
                >
                  <div>
                    <strong class="fs-13 text-dark d-block">{{ aut.nome }}</strong>
                    <span class="text-muted fs-11">Parentesco: <strong>{{ aut.parentesco }}</strong> • Doc: <strong>{{ aut.documento }}</strong></span>
                  </div>

                  <!-- Botão de Liberação Rápida para esta pessoa autorizada -->
                  <button 
                    v-if="!foiLiberado(aluno.id)" 
                    type="button" 
                    @click="confirmarLiberacao(aluno, aut)" 
                    class="btn btn-xs btn-outline-success py-1 px-2"
                  >
                    <i class="ri-check-line align-middle me-1"></i> Liberar p/ {{ aut.parentesco }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Ações do Rodapé do Card -->
            <div class="d-flex align-items-center justify-content-between pt-2 border-top">
              <div class="d-flex align-items-center gap-2">
                <a :href="'https://wa.me/55' + aluno.responsaveis[0]?.telefone" target="_blank" class="btn btn-xs btn-soft-success">
                  <i class="ri-whatsapp-line align-middle me-1"></i> Chamar Responsável
                </a>
              </div>

              <div class="d-flex gap-2">
                <button 
                  v-if="foiLiberado(aluno.id)" 
                  type="button" 
                  @click="cancelarLiberacao(aluno)" 
                  class="btn btn-xs btn-outline-danger"
                  title="Estornar registro de saída em caso de erro"
                >
                  <i class="ri-close-line align-middle me-1"></i> Desfazer Liberação
                </button>
                <button 
                  v-else 
                  type="button" 
                  @click="abrirModalOutroAutorizado(aluno)" 
                  class="btn btn-xs btn-soft-primary"
                >
                  <i class="ri-user-add-line align-middle me-1"></i> Outra Pessoa / Procuração
                </button>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- MODAL: REGISTRAR OUTRA PESSOA COM AUTORIZAÇÃO EXPRESSA -->
    <div v-if="alunoModalOutro" class="modal show d-block" style="background-color: rgba(15, 23, 42, 0.65);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-warning text-dark p-3">
            <h5 class="modal-title mb-0 fs-15 fw-bold">
              <i class="ri-alert-line align-middle me-1"></i> Liberação Excepcional • {{ alunoModalOutro.nome }}
            </h5>
            <button type="button" class="btn-close" @click="alunoModalOutro = null"></button>
          </div>
          <form @submit.prevent="salvarOutroAutorizado">
            <div class="modal-body p-4">
              <div class="alert alert-warning border-0 fs-12 mb-3">
                <strong>Protocolo de Segurança:</strong> Registrar liberação para alguém fora da lista exige autorização por escrito ou ligação gravada da mãe/pai.
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Nome Completo de Quem Veio Buscar <span class="text-danger">*</span></label>
                <input type="text" v-model="formOutro.nome" class="form-control form-control-sm" required placeholder="Nome conforme documento" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Grau de Parentesco / Relação <span class="text-danger">*</span></label>
                <input type="text" v-model="formOutro.parentesco" class="form-control form-control-sm" required placeholder="Ex: Tio, Vizinha autorizada pela mãe via WhatsApp" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Documento de Identidade / RG <span class="text-danger">*</span></label>
                <input type="text" v-model="formOutro.documento" class="form-control form-control-sm" required placeholder="Número do RG ou CPF" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold">Quem autorizou na família? <span class="text-danger">*</span></label>
                <input type="text" v-model="formOutro.autorizadoPor" class="form-control form-control-sm" required placeholder="Ex: Mãe Mariana autorizou às 16h40 por telefone" />
              </div>
            </div>
            <div class="modal-footer bg-light p-3">
              <button type="button" class="btn btn-secondary btn-sm" @click="alunoModalOutro = null">Cancelar</button>
              <button type="submit" class="btn btn-success btn-sm">
                <i class="ri-check-line align-middle me-1"></i> Confirmar Liberação na Portaria
              </button>
            </div>
          </form>
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
      turmas: [],
      alunos: [],
      saidasDoDia: {},
      dataSelecionada: new Date().toISOString().slice(0, 10),
      filtroTurma: '',
      filtroStatus: 'todos',
      filtroBusca: '',
      alunoModalOutro: null,
      formOutro: {
        nome: '',
        parentesco: '',
        documento: '',
        autorizadoPor: ''
      }
    };
  },
  computed: {
    alunosFiltrados() {
      return this.alunos.filter(aluno => {
        const busca = this.filtroBusca.toLowerCase();
        const matchNome = aluno.nome.toLowerCase().includes(busca);
        const matchAut = aluno.autorizadosRetirada?.some(a => a.nome.toLowerCase().includes(busca));
        const matchTurma = !this.filtroTurma || aluno.turmaId === this.filtroTurma;
        
        const liberado = this.foiLiberado(aluno.id);
        let matchStatus = true;
        if (this.filtroStatus === 'aguardando') matchStatus = !liberado;
        if (this.filtroStatus === 'liberado') matchStatus = liberado;

        return (matchNome || matchAut) && matchTurma && matchStatus;
      });
    },
    totalLiberados() {
      return this.alunos.filter(a => this.foiLiberado(a.id)).length;
    },
    totalAguardando() {
      return this.alunos.length - this.totalLiberados;
    },
    totalInclusao() {
      return this.alunos.filter(a => a.necessidadesEspeciais && a.necessidadesEspeciais !== 'Nenhuma').length;
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
      this.saidasDoDia = EscolaStorage.getSaidasPortaria(this.dataSelecionada);
    },
    getTurmaNome(id) {
      const t = this.turmas.find(item => item.id === id);
      return t ? t.nome : 'Turma';
    },
    foiLiberado(alunoId) {
      return !!this.saidasDoDia[alunoId];
    },
    getDadosSaida(alunoId) {
      return this.saidasDoDia[alunoId] || {};
    },
    confirmarLiberacao(aluno, autorizado) {
      Swal.fire({
        title: "Confirmar Liberação",
        html: `
          <div class="text-start fs-13">
            <p class="mb-1"><strong>Criança:</strong> ${aluno.nome}</p>
            <p class="mb-1"><strong>Quem retira:</strong> ${autorizado.nome} (${autorizado.parentesco})</p>
            <p class="mb-1"><strong>Documento apresentado:</strong> ${autorizado.documento}</p>
            <hr class="my-2"/>
            <span class="text-success fw-bold">Deseja confirmar a saída da criança na portaria às 17h?</span>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0ab39c",
        cancelButtonColor: "#878a99",
        confirmButtonText: "Sim, Liberar Criança",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          EscolaStorage.registrarSaidaPortaria(this.dataSelecionada, aluno.id, {
            retiradoPor: `${autorizado.nome} (${autorizado.parentesco})`,
            documento: autorizado.documento,
            tipo: 'Lista Oficial'
          });
          this.saidasDoDia = EscolaStorage.getSaidasPortaria(this.dataSelecionada);
          Swal.fire({
            icon: "success",
            title: "Criança Liberada!",
            text: `${aluno.nome} foi liberado(a) com segurança.`,
            timer: 1600,
            showConfirmButton: false
          });
        }
      });
    },
    cancelarLiberacao(aluno) {
      Swal.fire({
        title: "Desfazer Saída?",
        text: `Deseja retornar ${aluno.nome} para o status "Aguardando na Escola"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f06548",
        cancelButtonColor: "#878a99",
        confirmButtonText: "Sim, desfazer",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          EscolaStorage.cancelarSaidaPortaria(this.dataSelecionada, aluno.id);
          this.saidasDoDia = EscolaStorage.getSaidasPortaria(this.dataSelecionada);
          Swal.fire({
            icon: "info",
            title: "Atualizado",
            text: "O aluno retornou para a lista de espera na escola.",
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    },
    abrirModalOutroAutorizado(aluno) {
      this.alunoModalOutro = aluno;
      this.formOutro = {
        nome: '',
        parentesco: '',
        documento: '',
        autorizadoPor: ''
      };
    },
    salvarOutroAutorizado() {
      EscolaStorage.registrarSaidaPortaria(this.dataSelecionada, this.alunoModalOutro.id, {
        retiradoPor: `${this.formOutro.nome} (${this.formOutro.parentesco})`,
        documento: this.formOutro.documento,
        autorizadoPor: this.formOutro.autorizadoPor,
        tipo: 'Autorização Excepcional'
      });
      this.saidasDoDia = EscolaStorage.getSaidasPortaria(this.dataSelecionada);
      const nomeAluno = this.alunoModalOutro.nome;
      this.alunoModalOutro = null;

      Swal.fire({
        icon: "success",
        title: "Liberação Registrada!",
        text: `${nomeAluno} foi liberado(a) com registro de autorização excepcional.`,
        timer: 1800,
        showConfirmButton: false
      });
    }
  }
};
</script>

<style scoped>
.bg-success-subtle-light {
  background-color: #f0fdf4 !important;
}
.btn-xs {
  font-size: 11px;
}
</style>
