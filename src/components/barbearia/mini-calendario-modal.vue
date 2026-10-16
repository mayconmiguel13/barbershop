<template>
  <BModal v-model="modalAberto" hide-header hide-footer body-class="p-0 border-0" dialog-class="modal-dialog-centered modal-calendario-dialog">
    <div class="mini-calendario-popup rounded-3 overflow-hidden shadow-lg border">
      
      <!-- CABEÇALHO COMPACTO -->
      <div class="p-2 px-3 border-bottom d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <div class="avatar-title bg-warning-subtle text-warning rounded-circle fs-13 fw-bold" style="width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center;">
            <i class="ri-calendar-event-fill"></i>
          </div>
          <div>
            <h6 class="fs-13 fw-bold text-body mb-0">{{ titulo }}</h6>
            <span class="text-muted fs-10">Escolha uma data para a agenda</span>
          </div>
        </div>
        <button type="button" @click="fechar" class="btn-modal-close" aria-label="Fechar">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <!-- BOTÕES DE ATALHO RÁPIDO COMPACTOS -->
      <div class="px-3 py-2 bg-light-subtle border-bottom d-flex flex-wrap gap-1">
        <button type="button" @click="atalhoData('hoje')" class="btn btn-micro rounded-pill"
          :class="isAtalhoAtivo('hoje') ? 'btn-dark text-warning fw-bold' : 'btn-light border'">
          Hoje
        </button>
        <button type="button" @click="atalhoData('amanha')" class="btn btn-micro rounded-pill"
          :class="isAtalhoAtivo('amanha') ? 'btn-dark text-warning fw-bold' : 'btn-light border'">
          Amanhã
        </button>
        <button type="button" @click="atalhoData('sabado')" class="btn btn-micro rounded-pill"
          :class="isAtalhoAtivo('sabado') ? 'btn-dark text-warning fw-bold' : 'btn-light border'">
          Próx. Sábado
        </button>
        <button type="button" @click="atalhoData('mais7')" class="btn btn-micro rounded-pill"
          :class="isAtalhoAtivo('mais7') ? 'btn-dark text-warning fw-bold' : 'btn-light border'">
          +7 Dias
        </button>
      </div>

      <!-- NAVEGADOR DE MÊS & ANO COMPACTO -->
      <div class="p-2 px-3">
        <div class="d-flex align-items-center justify-content-between mb-2 px-1">
          <button type="button" @click="mesAnterior" class="btn btn-sm btn-light rounded-circle nav-btn" title="Mês anterior">
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <div class="text-center">
            <strong class="fs-12 fw-bold text-body text-capitalize">{{ nomeMesAnoAtual }}</strong>
          </div>
          <button type="button" @click="proximoMes" class="btn btn-sm btn-light rounded-circle nav-btn" title="Próximo mês">
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>

        <!-- DIAS DA SEMANA -->
        <div class="calendario-grid-header mb-1 text-center">
          <span v-for="d in diasDaSemana" :key="d" class="fs-9 text-muted fw-bold text-uppercase py-1">
            {{ d }}
          </span>
        </div>

        <!-- GRADE DE DIAS DO MÊS -->
        <div class="calendario-grid-dias text-center">
          <div v-for="c in gradeDias" :key="c.dataIso"
            class="dia-celula-wrap"
            @click="selecionarDia(c)">
            <button type="button" class="btn-dia-celula"
              :class="{
                'dia-selecionado': c.dataIso === dataTemp,
                'dia-hoje': c.isHoje && c.dataIso !== dataTemp,
                'outro-mes': c.outroMes,
                'dia-passado': c.isPassado && c.dataIso !== dataTemp
              }">
              {{ c.dia }}
            </button>
          </div>
        </div>
      </div>

      <!-- RODAPÉ COMPACTO -->
      <div class="p-2 px-3 bg-light-subtle border-top d-flex align-items-center justify-content-between">
        <div>
          <span class="fs-9 text-muted text-uppercase fw-bold d-block">Selecionado</span>
          <span class="fs-11 fw-bold text-body">{{ dataFormatadaExtensa }}</span>
        </div>
        <div class="d-flex align-items-center gap-1">
          <button type="button" @click="fechar" class="btn btn-micro btn-light px-2 py-1">Cancelar</button>
          <button type="button" @click="confirmar" class="btn btn-micro btn-warning text-dark fw-bold px-3 py-1 shadow-2xs">
            <i class="ri-check-line me-1"></i> Aplicar
          </button>
        </div>
      </div>

    </div>
  </BModal>
</template>

<script>
export default {
  name: "MiniCalendarioModal",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String,
      default: ''
    },
    titulo: {
      type: String,
      default: 'Escolher Data'
    }
  },
  emits: ['update:visible', 'update:modelValue', 'confirmar'],
  data() {
    return {
      mesVisualizado: new Date().getMonth(),
      anoVisualizado: new Date().getFullYear(),
      dataTemp: this.modelValue || new Date().toISOString().split('T')[0],
      diasDaSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      nomesMeses: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ]
    };
  },
  computed: {
    modalAberto: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    },
    nomeMesAnoAtual() {
      return `${this.nomesMeses[this.mesVisualizado]} de ${this.anoVisualizado}`;
    },
    dataFormatadaExtensa() {
      if (!this.dataTemp) return 'Nenhuma data';
      const [ano, mes, dia] = this.dataTemp.split('-').map(Number);
      const d = new Date(ano, mes - 1, dia);
      return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    },
    gradeDias() {
      const dias = [];
      const ano = this.anoVisualizado;
      const mes = this.mesVisualizado;

      // Primeiro dia do mês e total de dias do mês
      const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
      const totalDiasMes = new Date(ano, mes + 1, 0).getDate();

      // Dias do mês anterior para preencher a primeira semana
      const totalDiasMesAnterior = new Date(ano, mes, 0).getDate();
      for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
        const diaNum = totalDiasMesAnterior - i;
        const dMesAnt = mes === 0 ? 11 : mes - 1;
        const dAnoAnt = mes === 0 ? ano - 1 : ano;
        const iso = `${dAnoAnt}-${String(dMesAnt + 1).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
        dias.push({
          dia: diaNum,
          mes: dMesAnt,
          ano: dAnoAnt,
          dataIso: iso,
          outroMes: true,
          isHoje: this.verificarSeHoje(iso),
          isPassado: this.verificarSePassado(iso)
        });
      }

      // Dias do mês atual
      for (let diaNum = 1; diaNum <= totalDiasMes; diaNum++) {
        const iso = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
        dias.push({
          dia: diaNum,
          mes,
          ano,
          dataIso: iso,
          outroMes: false,
          isHoje: this.verificarSeHoje(iso),
          isPassado: this.verificarSePassado(iso)
        });
      }

      // Preencher o restante até completar 35 ou 42 células
      const diasRestantes = (7 - (dias.length % 7)) % 7;
      for (let diaNum = 1; diaNum <= diasRestantes; diaNum++) {
        const dMesProx = mes === 11 ? 0 : mes + 1;
        const dAnoProx = mes === 11 ? ano + 1 : ano;
        const iso = `${dAnoProx}-${String(dMesProx + 1).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
        dias.push({
          dia: diaNum,
          mes: dMesProx,
          ano: dAnoProx,
          dataIso: iso,
          outroMes: true,
          isHoje: this.verificarSeHoje(iso),
          isPassado: false
        });
      }

      return dias;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.sincronizarComModel();
      }
    },
    modelValue() {
      this.sincronizarComModel();
    }
  },
  mounted() {
    this.sincronizarComModel();
  },
  methods: {
    sincronizarComModel() {
      this.dataTemp = this.modelValue || new Date().toISOString().split('T')[0];
      if (this.dataTemp) {
        const [ano, mes] = this.dataTemp.split('-').map(Number);
        this.anoVisualizado = ano;
        this.mesVisualizado = mes - 1;
      }
    },
    verificarSeHoje(iso) {
      const hojeIso = new Date().toISOString().split('T')[0];
      return iso === hojeIso;
    },
    verificarSePassado(iso) {
      const hojeIso = new Date().toISOString().split('T')[0];
      return iso < hojeIso;
    },
    isAtalhoAtivo(tipo) {
      const hoje = new Date();
      if (tipo === 'hoje') {
        return this.dataTemp === hoje.toISOString().split('T')[0];
      }
      if (tipo === 'amanha') {
        const d = new Date(hoje);
        d.setDate(d.getDate() + 1);
        return this.dataTemp === d.toISOString().split('T')[0];
      }
      if (tipo === 'mais7') {
        const d = new Date(hoje);
        d.setDate(d.getDate() + 7);
        return this.dataTemp === d.toISOString().split('T')[0];
      }
      return false;
    },
    mesAnterior() {
      if (this.mesVisualizado === 0) {
        this.mesVisualizado = 11;
        this.anoVisualizado -= 1;
      } else {
        this.mesVisualizado -= 1;
      }
    },
    proximoMes() {
      if (this.mesVisualizado === 11) {
        this.mesVisualizado = 0;
        this.anoVisualizado += 1;
      } else {
        this.mesVisualizado += 1;
      }
    },
    selecionarDia(celula) {
      this.dataTemp = celula.dataIso;
      if (celula.outroMes) {
        this.mesVisualizado = celula.mes;
        this.anoVisualizado = celula.ano;
      }
    },
    atalhoData(tipo) {
      const d = new Date();
      if (tipo === 'amanha') {
        d.setDate(d.getDate() + 1);
      } else if (tipo === 'sabado') {
        const diaSemana = d.getDay();
        const diasAteSabado = (6 - diaSemana + 7) % 7 || 7;
        d.setDate(d.getDate() + diasAteSabado);
      } else if (tipo === 'mais7') {
        d.setDate(d.getDate() + 7);
      }
      const iso = d.toISOString().split('T')[0];
      this.dataTemp = iso;
      this.mesVisualizado = d.getMonth();
      this.anoVisualizado = d.getFullYear();
    },
    confirmar() {
      this.$emit('update:modelValue', this.dataTemp);
      this.$emit('confirmar', this.dataTemp);
      this.fechar();
    },
    fechar() {
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style scoped>
:deep(.modal-calendario-dialog) {
  max-width: 290px !important;
  margin: 1.5rem auto;
}

.mini-calendario-popup {
  border-radius: 12px;
}

.calendario-grid-header,
.calendario-grid-dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.dia-celula-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1px;
}

.btn-dia-celula {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid transparent;
  background: transparent;
  font-size: 11px;
  font-weight: 500;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}

.btn-dia-celula:hover {
  background-color: #fef3c7;
  color: #92400e;
}

.btn-dia-celula.dia-selecionado {
  background-color: #0f172a !important;
  color: #fbbf24 !important;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.25);
  border-color: #0f172a !important;
}

.btn-dia-celula.dia-hoje {
  border-color: #f59e0b !important;
  color: #d97706 !important;
  font-weight: 700;
}

.btn-dia-celula.outro-mes {
  color: #cbd5e1 !important;
  opacity: 0.6;
}

.btn-dia-celula.dia-passado {
  color: #94a3b8;
}

.nav-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid #e2e8f0;
  font-size: 12px;
}

.btn-modal-close {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
  padding: 0;
}
.btn-modal-close:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.btn-micro {
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
}
</style>
