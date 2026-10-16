<template>
  <Layout>
    <PageHeader title="Alunos & Famílias" pageTitle="Gestão de Prontuários e Portaria (17h)" />

    <!-- Métricas Rápidas do Topo (Estilo Velzon Widgets) -->
    <BRow class="mb-4">
      <BCol xl="3" md="6">
        <BCard no-body class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0 fs-12">Total de Alunos</p>
              </div>
              <div class="flex-shrink-0">
                <span class="badge bg-success-subtle text-success fs-11">Matrículas Ativas</span>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div>
                <h4 class="fs-22 fw-semibold ff-secondary mb-1">{{ alunos.length }}</h4>
                <span class="text-muted fs-12">Educação Infantil (2 a 5 anos)</span>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-primary-subtle rounded fs-3">
                  <i class="ri-team-line text-primary"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0 fs-12">Convênio SEDUC</p>
              </div>
              <div class="flex-shrink-0">
                <span class="badge bg-info-subtle text-info fs-11">Contagem / MG</span>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div>
                <h4 class="fs-22 fw-semibold ff-secondary mb-1">{{ totalConveniados }}</h4>
                <span class="text-muted fs-12">Vagas 100% Subsidiadas</span>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-info-subtle rounded fs-3">
                  <i class="ri-government-line text-info"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0 fs-12">Saúde & Inclusão (TEA)</p>
              </div>
              <div class="flex-shrink-0">
                <span class="badge border fs-11" style="background-color: #f3e8ff; color: #7e22ce;">Inclusão Escolar</span>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div>
                <h4 class="fs-22 fw-semibold ff-secondary mb-1">
                  {{ totalInclusao }} <span class="fs-13 text-muted">Inclusão</span> • {{ totalComAlergia }} <span class="fs-13 text-muted">Alergias</span>
                </h4>
                <span class="text-muted fs-12">TEA, Monitor e Cardápio</span>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title rounded fs-3" style="background-color: #f3e8ff; color: #7e22ce;">
                  <i class="ri-puzzle-line"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <BCol xl="3" md="6">
        <BCard no-body class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0 fs-12">Horário de Saída</p>
              </div>
              <div class="flex-shrink-0">
                <span class="badge bg-primary-subtle text-primary fs-11">Portaria 17:00h</span>
              </div>
            </div>
            <div class="d-flex align-items-end justify-content-between mt-3">
              <div>
                <h4 class="fs-22 fw-semibold ff-secondary mb-1">100%</h4>
                <span class="text-muted fs-12">Pessoas Cadastradas</span>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-success-subtle rounded fs-3">
                  <i class="ri-shield-check-line text-success"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Barra de Filtros e Busca de Alunos -->
    <BCard no-body class="mb-4">
      <BCardBody class="p-3">
        <BRow class="align-items-center g-3">
          <BCol md="5">
            <div class="search-box">
              <input type="text" v-model="filtroBusca" class="form-control" placeholder="Buscar por nome do aluno ou responsável..." />
              <i class="ri-search-line search-icon"></i>
            </div>
          </BCol>
          <BCol md="4">
            <select v-model="filtroTurma" class="form-select">
              <option value="">Todas as Turmas (Maternal I ao 2º Período)</option>
              <option v-for="t in turmas" :key="t.id" :value="t.id">{{ t.nome }} ({{ t.faixaEtaria }}) - {{ t.professora }}</option>
            </select>
          </BCol>
          <BCol md="3" class="text-md-end">
            <button @click="abrirModalCadastro" class="btn btn-primary w-100 w-md-auto">
              <i class="ri-user-add-line align-middle me-1"></i> Nova Matrícula
            </button>
          </BCol>
        </BRow>
      </BCardBody>
    </BCard>

    <!-- Tabela Profissional de Alunos (Estilo Velzon Datatable) -->
    <BCard no-body>
      <BCardHeader class="align-items-center d-flex border-bottom-dashed">
        <h5 class="card-title mb-0 flex-grow-1">Prontuários e Matrículas Ativas</h5>
        <div class="flex-shrink-0">
          <span class="text-muted fs-12">Exibindo <strong>{{ alunosFiltrados.length }}</strong> de <strong>{{ alunos.length }}</strong> alunos</span>
        </div>
      </BCardHeader>
      <BCardBody>
        <div class="table-responsive table-card">
          <table class="table table-hover table-centered align-middle table-nowrap mb-0">
            <thead class="table-light text-muted">
              <tr>
                <th>Criança / Aluno(a)</th>
                <th>Turma & Turno</th>
                <th>Responsável Principal</th>
                <th>Saída Segura (Portaria 17h)</th>
                <th>Saúde & Alergias</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in alunosFiltrados" :key="aluno.id" class="cursor-pointer" @click="abrirModalDetalhes(aluno)">
                <td>
                  <div class="d-flex align-items-center">
                    <img :src="aluno.foto" class="avatar-sm rounded-circle me-3 object-fit-cover border shadow-sm" alt="Foto" />
                    <div>
                      <h5 class="fs-14 my-1 fw-semibold text-dark">{{ aluno.nome }}</h5>
                      <span class="text-muted fs-12">
                        <i class="ri-calendar-line align-middle me-1"></i> {{ calcularIdade(aluno.dataNascimento) }} • Nasc: {{ formatarData(aluno.dataNascimento) }}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-primary-subtle text-primary mb-1 d-block w-fit">{{ getTurmaNome(aluno.turmaId) }}</span>
                  <span class="text-muted fs-11">
                    <i class="ri-time-line align-middle"></i> {{ aluno.turno }}
                  </span>
                </td>
                <td @click.stop>
                  <div class="fw-medium text-dark fs-13">{{ aluno.responsaveis[0]?.nome }}</div>
                  <div class="d-flex align-items-center gap-2 mt-1">
                    <span class="text-muted fs-11">{{ aluno.responsaveis[0]?.parentesco }}</span>
                    <a :href="'https://wa.me/55' + aluno.responsaveis[0]?.telefone" target="_blank" class="badge bg-success-subtle text-success text-decoration-none">
                      <i class="ri-whatsapp-line align-middle"></i> {{ formatarTelefone(aluno.responsaveis[0]?.telefone) }}
                    </a>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-wrap gap-1">
                    <span v-for="(aut, idx) in aluno.autorizadosRetirada.slice(0, 2)" :key="idx" class="badge bg-light text-dark border">
                      <i class="ri-user-received-line text-success align-middle me-1"></i> {{ aut.nome.split(' ')[0] }} ({{ aut.parentesco }})
                    </span>
                    <span v-if="aluno.autorizadosRetirada.length > 2" class="badge bg-secondary-subtle text-secondary">
                      +{{ aluno.autorizadosRetirada.length - 2 }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <span v-if="aluno.necessidadesEspeciais && aluno.necessidadesEspeciais !== 'Nenhuma'" class="badge border" style="background-color: #f3e8ff; color: #7e22ce; border-color: #d8b4fe !important;">
                      <i class="ri-puzzle-line align-middle me-1"></i> {{ aluno.necessidadesEspeciais }}
                    </span>
                    <span v-if="aluno.alergias && aluno.alergias !== 'Nenhuma'" class="badge bg-danger-subtle text-danger">
                      <i class="ri-alert-line align-middle me-1"></i> {{ aluno.alergias }}
                    </span>
                    <span v-if="(!aluno.alergias || aluno.alergias === 'Nenhuma') && (!aluno.necessidadesEspeciais || aluno.necessidadesEspeciais === 'Nenhuma')" class="badge bg-success-subtle text-success">
                      <i class="ri-shield-check-line align-middle me-1"></i> Sem restrições
                    </span>
                  </div>
                </td>
                <td class="text-end" @click.stop>
                  <button @click="abrirModalDetalhes(aluno)" class="btn btn-sm btn-soft-primary me-1" title="Visualizar Ficha Completa">
                    <i class="ri-eye-line align-middle me-1"></i> Ver Ficha
                  </button>
                  <button @click="abrirPreviewImpressao(aluno)" class="btn btn-sm btn-soft-dark me-1" title="Imprimir Prontuário Oficial A4 Timbrado">
                    <i class="ri-printer-line align-middle me-1"></i> Imprimir
                  </button>
                  <button @click="editarAluno(aluno)" class="btn btn-sm btn-soft-secondary me-1" title="Editar Informações">
                    <i class="ri-pencil-line align-middle"></i>
                  </button>
                  <button @click="confirmarExclusao(aluno)" class="btn btn-sm btn-soft-danger" title="Excluir Aluno">
                    <i class="ri-delete-bin-line align-middle"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BCardBody>
    </BCard>

    <!-- ========================================================================================== -->
    <!-- MODAL 1: FICHA DETALHADA DO ALUNO (PRONTUÁRIO COMPLETO) -->
    <!-- ========================================================================================== -->
    <div v-if="alunoDetalhes" class="modal show d-block" style="background-color: rgba(15, 23, 42, 0.65);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <!-- Header do Modal com Identificação da Instituição -->
          <div class="modal-header bg-primary text-white p-3">
            <div class="d-flex align-items-center gap-2">
              <i class="ri-file-user-line fs-20"></i>
              <h5 class="modal-title mb-0 fs-16 text-white">Prontuário Escolar: {{ alunoDetalhes.nome }}</h5>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="alunoDetalhes = null"></button>
          </div>

          <div class="modal-body p-4" id="prontuario-imprimivel">
            <!-- CABEÇALHO OFICIAL TIMBRADO (EXIBIDO NA IMPRESSÃO E NO TOPO) -->
            <div class="timbrado-header text-center border-bottom pb-3 mb-4">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="text-start">
                  <h5 class="mb-0 fw-bold text-primary fs-16">FUNDAÇÃO SANTA FILOMENA</h5>
                  <small class="text-dark fw-semibold d-block">Centro de Educação Infantil Santa Filomena</small>
                  <span class="text-muted fs-11">CNPJ: 21.034.982/0001-44 • Contagem - MG</span>
                </div>
                <div class="text-end">
                  <span class="badge bg-primary text-white p-2 fs-11 d-block mb-1">Convênio SEDUC Contagem</span>
                  <span class="text-muted fs-11">Educação Infantil (2 a 5 anos)</span>
                </div>
              </div>
              <div class="bg-light py-1 px-3 rounded border text-center">
                <strong class="fs-13 text-dark text-uppercase">Prontuário de Matrícula & Anamnese Pedagógica Individual</strong>
              </div>
            </div>

            <!-- Cabeçalho do Aluno com Foto e Badges -->
            <div class="d-flex flex-wrap align-items-center gap-3 border-bottom pb-3 mb-4">
              <img :src="alunoDetalhes.foto" class="rounded-circle avatar-lg border shadow-sm object-fit-cover" alt="Foto" />
              <div class="flex-grow-1">
                <div class="d-flex align-items-center gap-2">
                  <h4 class="mb-0 fw-bold text-dark">{{ alunoDetalhes.nome }}</h4>
                  <span class="badge bg-success-subtle text-success">Matrícula Ativa</span>
                </div>
                <div class="d-flex flex-wrap gap-2 text-muted fs-13 mt-1">
                  <span><strong>Nascimento:</strong> {{ formatarData(alunoDetalhes.dataNascimento) }} ({{ calcularIdade(alunoDetalhes.dataNascimento) }})</span>
                  <span>•</span>
                  <span><strong>Turma:</strong> {{ getTurmaNome(alunoDetalhes.turmaId) }}</span>
                  <span>•</span>
                  <span><strong>Turno:</strong> {{ alunoDetalhes.turno }}</span>
                </div>
                <div class="mt-2">
                  <span class="badge bg-primary-subtle text-primary border border-primary-subtle">
                    <i class="ri-government-line align-middle me-1"></i> {{ alunoDetalhes.tipoVaga }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Grade de Seções Estruturadas da Ficha -->
            <BRow class="g-3">
              <!-- Seção 1: Responsáveis e Telefones de Emergência -->
              <BCol md="6">
                <div class="border rounded p-3 h-100 bg-light">
                  <h6 class="fs-13 fw-bold text-dark border-bottom pb-2 mb-3">
                    <i class="ri-parent-line text-primary me-1"></i> Família & Contatos de Emergência
                  </h6>
                  <div v-for="(resp, idx) in alunoDetalhes.responsaveis" :key="idx" class="mb-3 last-mb-0">
                    <div class="d-flex align-items-center justify-content-between">
                      <strong class="text-dark fs-13">{{ resp.nome }}</strong>
                      <span class="badge bg-light text-muted border">{{ resp.parentesco }}</span>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mt-1">
                      <span class="text-muted fs-12">{{ formatarTelefone(resp.telefone) }}</span>
                      <a :href="'https://wa.me/55' + resp.telefone" target="_blank" class="btn btn-xs btn-success py-1 px-2">
                        <i class="ri-whatsapp-line align-middle me-1"></i> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </BCol>

              <!-- Seção 2: Saúde, Alergias, Inclusão & TEA -->
              <BCol md="6">
                <div class="border rounded p-3 h-100 bg-light">
                  <div class="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                    <h6 class="fs-13 fw-bold text-dark mb-0">
                      <i class="ri-heart-pulse-line text-danger me-1"></i> Ficha de Saúde & Inclusão
                    </h6>
                    <span v-if="alunoDetalhes.necessidadesEspeciais && alunoDetalhes.necessidadesEspeciais !== 'Nenhuma'" class="badge border" style="background-color: #f3e8ff; color: #7e22ce;">
                      <i class="ri-puzzle-line align-middle"></i> Inclusão / TEA
                    </span>
                  </div>

                  <!-- Se for neuroatípico (ex: Autismo/TEA) -->
                  <div v-if="alunoDetalhes.necessidadesEspeciais && alunoDetalhes.necessidadesEspeciais !== 'Nenhuma'" class="p-2 mb-3 rounded border border-purple-subtle" style="background-color: #faf5ff;">
                    <div class="fw-semibold fs-12 text-purple mb-1">
                      <i class="ri-shield-cross-line me-1"></i> {{ alunoDetalhes.necessidadesEspeciais }}
                    </div>
                    <div class="text-muted fs-11 mb-1">
                      <strong>Laudo Médico:</strong> {{ alunoDetalhes.possuiLaudo ? 'Sim (Laudo Anexado)' : 'Em investigação' }} • 
                      <strong>Monitor SEDUC:</strong> {{ alunoDetalhes.precisaMonitor ? 'Sim (Necessário)' : 'Não' }}
                    </div>
                    <div v-if="alunoDetalhes.orientacoesInclusao" class="text-dark fs-11 mt-1 p-1 bg-white rounded border">
                      <strong>Orientações à Educadora:</strong> {{ alunoDetalhes.orientacoesInclusao }}
                    </div>
                    <div v-if="alunoDetalhes.terapeuta" class="text-muted fs-11 mt-1">
                      <strong>Terapeuta:</strong> {{ alunoDetalhes.terapeuta }}
                    </div>

                    <!-- Botão de Emergência Rápida dos Pais -->
                    <div class="mt-2 pt-2 border-top d-flex align-items-center justify-content-between">
                      <span class="fs-11 fw-semibold text-danger">
                        <i class="ri-alarm-warning-line me-1"></i> Emergência / Crise:
                      </span>
                      <a :href="'https://wa.me/55' + alunoDetalhes.responsaveis[0]?.telefone" target="_blank" class="btn btn-xs btn-danger py-1 px-2">
                        <i class="ri-whatsapp-line align-middle me-1"></i> Acionar Família
                      </a>
                    </div>
                  </div>

                  <div class="mb-2">
                    <span class="text-muted fs-12 d-block">Alergias ou Intolerâncias Alimentares:</span>
                    <strong :class="alunoDetalhes.alergias && alunoDetalhes.alergias !== 'Nenhuma' ? 'text-danger' : 'text-success'">
                      {{ alunoDetalhes.alergias || 'Nenhuma informada' }}
                    </strong>
                  </div>
                  <div class="mb-2">
                    <span class="text-muted fs-12 d-block">Medicamentos e Pomadas na Creche:</span>
                    <strong class="text-dark fs-12">{{ alunoDetalhes.medicamentos || 'Nenhum medicamento diário' }}</strong>
                  </div>
                  <div>
                    <span class="text-muted fs-12 d-block">Acompanhamento Pedagógico:</span>
                    <span class="badge bg-info-subtle text-info">Relatório BNCC da Educação Infantil</span>
                  </div>
                </div>
              </BCol>

              <!-- Seção 3: ANAMNESE PEDAGÓGICA & COMPORTAMENTO (PARA A PROFESSORA) -->
              <BCol cols="12">
                <div class="border rounded p-3 bg-light">
                  <div class="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                    <h6 class="fs-13 fw-bold text-dark mb-0">
                      <i class="ri-mental-health-line text-primary me-1"></i> Anamnese & Perfil Comportamental (Orientações à Professora)
                    </h6>
                    <span class="badge bg-primary-subtle text-primary fs-11">
                      Acolhimento & Segurança Afetiva
                    </span>
                  </div>

                  <BRow class="g-3" v-if="alunoDetalhes.anamnese">
                    <!-- Objeto de Apego -->
                    <BCol md="6">
                      <div class="p-2 border rounded bg-white">
                        <span class="text-muted fs-11 fw-semibold d-block">
                          <i class="ri-bear-smile-line text-warning me-1"></i> Objeto de Segurança / Brinquedo de Apego:
                        </span>
                        <strong class="text-dark fs-12">
                          {{ alunoDetalhes.anamnese.objetoApego || 'Nenhum objeto específico relatado' }}
                        </strong>
                      </div>
                    </BCol>

                    <!-- Socialização e Compartilhamento -->
                    <BCol md="6">
                      <div class="p-2 border rounded bg-white">
                        <span class="text-muted fs-11 fw-semibold d-block">
                          <i class="ri-team-line text-primary me-1"></i> Socialização & Compartilhar Brinquedos:
                        </span>
                        <strong class="text-dark fs-12">
                          {{ alunoDetalhes.anamnese.socializacao || 'Socializa bem com os colegas' }}
                        </strong>
                      </div>
                    </BCol>

                    <!-- Reação a Frustrações e Limites -->
                    <BCol md="6">
                      <div class="p-2 border rounded bg-white">
                        <span class="text-muted fs-11 fw-semibold d-block">
                          <i class="ri-emotion-unhappy-line text-danger me-1"></i> Reação a Limites e Birras:
                        </span>
                        <strong class="text-dark fs-12">
                          {{ alunoDetalhes.anamnese.reacaoFrustracao || 'Aceita combinados da rotina' }}
                        </strong>
                      </div>
                    </BCol>

                    <!-- Medos e Gatilhos -->
                    <BCol md="6">
                      <div class="p-2 border rounded bg-white">
                        <span class="text-muted fs-11 fw-semibold d-block">
                          <i class="ri-alarm-warning-line text-danger me-1"></i> Medos ou Gatilhos Sensoriais:
                        </span>
                        <strong class="text-dark fs-12">
                          {{ alunoDetalhes.anamnese.medosGatilhos || 'Nenhum medo expressivo relatado' }}
                        </strong>
                      </div>
                    </BCol>

                    <!-- Desfralde e Banheiro -->
                    <BCol md="4">
                      <div class="p-2 border rounded bg-white">
                        <span class="text-muted fs-11 fw-semibold d-block">
                          <i class="ri-rest-time-line text-info me-1"></i> Desfralde:
                        </span>
                        <strong class="text-dark fs-12">
                          {{ alunoDetalhes.anamnese.desfralde || 'Não informado' }}
                        </strong>
                      </div>
                    </BCol>

                    <!-- Sono e Soneca -->
                    <BCol md="4">
                      <div class="p-2 border rounded bg-white">
                        <span class="text-muted fs-11 fw-semibold d-block">
                          <i class="ri-moon-line text-warning me-1"></i> Sono / Soneca:
                        </span>
                        <strong class="text-dark fs-12">
                          {{ alunoDetalhes.anamnese.comportamentoSono || 'Descansa normalmente' }}
                        </strong>
                      </div>
                    </BCol>

                    <!-- Preferências Alimentares -->
                    <BCol md="4">
                      <div class="p-2 border rounded bg-white">
                        <span class="text-muted fs-11 fw-semibold d-block">
                          <i class="ri-restaurant-line text-success me-1"></i> Preferências / Seletividade:
                        </span>
                        <strong class="text-dark fs-12">
                          {{ alunoDetalhes.anamnese.preferenciasAlimentares || 'Come o cardápio padrão' }}
                        </strong>
                      </div>
                    </BCol>
                  </BRow>

                  <div v-else class="text-muted fs-12 p-2 bg-white rounded border">
                    Anamnese detalhada ainda não preenchida para esta criança. Edite a ficha para cadastrar o perfil pedagógico.
                  </div>
                </div>
              </BCol>

              <!-- Seção 3: Pessoas Autorizadas na Portaria (Saída 17h) - CRÍTICO -->
              <BCol cols="12">
                <div class="border rounded p-3 bg-light">
                  <div class="d-flex align-items-center justify-content-between border-bottom pb-2 mb-3">
                    <h6 class="fs-13 fw-bold text-dark mb-0">
                      <i class="ri-shield-user-line text-success me-1"></i> Autorizados a Retirar a Criança na Portaria (17:00h)
                    </h6>
                    <span class="badge bg-warning-subtle text-warning fs-11">
                      <i class="ri-lock-line align-middle"></i> Exigir Identificação
                    </span>
                  </div>
                  <BRow class="g-2">
                    <BCol md="4" v-for="(aut, idx) in alunoDetalhes.autorizadosRetirada" :key="idx">
                      <div class="p-2 border rounded bg-white shadow-sm">
                        <div class="fw-semibold text-dark fs-13">{{ aut.nome }}</div>
                        <div class="text-muted fs-11">Parentesco: <strong>{{ aut.parentesco }}</strong></div>
                        <div class="text-muted fs-11">Documento: <strong>{{ aut.documento }}</strong></div>
                      </div>
                    </BCol>
                  </BRow>
                </div>
              </BCol>

              <!-- Seção 4: Termo de Responsabilidade e Assinaturas (Oficial na Impressão) -->
              <BCol cols="12">
                <div class="border rounded p-3 bg-light mt-2">
                  <p class="fs-11 text-muted text-justify mb-3">
                    Declaro que as informações acima prestadas na anamnese e matrícula são a expressão da verdade. Autorizo a participação da criança nas atividades pedagógicas e passeios orientados da instituição, bem como os cuidados de rotina integral, alimentação balanceada e higiene prestados pela equipe do CEI Santa Filomena.
                  </p>
                  <BRow class="text-center pt-3 mt-2">
                    <BCol md="6" class="mb-3 mb-md-0">
                      <div class="border-top border-dark pt-1 w-75 mx-auto">
                        <strong class="fs-12 text-dark d-block">Assinatura do Pai / Mãe ou Responsável</strong>
                        <span class="text-muted fs-11">CPF / Documento Legal</span>
                      </div>
                    </BCol>
                    <BCol md="6">
                      <div class="border-top border-dark pt-1 w-75 mx-auto">
                        <strong class="fs-12 text-dark d-block">Diretoria / Coordenação Pedagógica</strong>
                        <span class="text-muted fs-11">CEI Santa Filomena • Contagem - MG</span>
                      </div>
                    </BCol>
                  </BRow>
                </div>
              </BCol>
            </BRow>
          </div>

          <div class="modal-footer bg-light p-3">
            <button type="button" class="btn btn-secondary" @click="alunoDetalhes = null">Fechar</button>
            <button type="button" class="btn btn-primary" @click="abrirPreviewImpressao(alunoDetalhes)">
              <i class="ri-printer-line align-middle me-1"></i> Imprimir Prontuário Oficial (A4)
            </button>
            <button type="button" class="btn btn-outline-primary" @click="editarAluno(alunoDetalhes); alunoDetalhes = null;">
              <i class="ri-pencil-line align-middle me-1"></i> Editar Dados
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================================== -->
    <!-- MODAL 2: CADASTRO / EDIÇÃO DE ALUNO ORGANIZADO POR ABAS (TABS WIZARD) -->
    <!-- ========================================================================================== -->
    <div v-if="modalCadastroAberto" class="modal show d-block" style="background-color: rgba(15, 23, 42, 0.65);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow-lg">
          <!-- Cabeçalho -->
          <div class="modal-header bg-primary text-white p-3">
            <div class="d-flex align-items-center gap-2">
              <i class="ri-user-add-line fs-20"></i>
              <h5 class="modal-title mb-0 fs-16 text-white">{{ alunoEmEdicaoId ? 'Editar Aluno' : 'Nova Matrícula Escolar' }}</h5>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="modalCadastroAberto = false"></button>
          </div>

          <!-- Navegação por Abas (Tabs) -->
          <div class="bg-light border-bottom px-3 pt-3">
            <ul class="nav nav-tabs nav-tabs-custom nav-success">
              <li class="nav-item">
                <a class="nav-link cursor-pointer" :class="{ active: abaAtiva === 'crianca' }" @click="abaAtiva = 'crianca'">
                  <i class="ri-user-3-line align-middle me-1"></i> 1. Dados da Criança
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link cursor-pointer" :class="{ active: abaAtiva === 'familia' }" @click="abaAtiva = 'familia'">
                  <i class="ri-parent-line align-middle me-1"></i> 2. Família & Pais
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link cursor-pointer" :class="{ active: abaAtiva === 'saude' }" @click="abaAtiva = 'saude'">
                  <i class="ri-heart-pulse-line align-middle me-1"></i> 3. Saúde & Cuidados
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link cursor-pointer" :class="{ active: abaAtiva === 'anamnese' }" @click="abaAtiva = 'anamnese'">
                  <i class="ri-mental-health-line align-middle me-1"></i> 4. Anamnese & Comportamento
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link cursor-pointer" :class="{ active: abaAtiva === 'portaria' }" @click="abaAtiva = 'portaria'">
                  <i class="ri-shield-user-line align-middle me-1"></i> 5. Saída & Portaria (17h)
                </a>
              </li>
            </ul>
          </div>

          <!-- Formulário com Conteúdo das Abas -->
          <form @submit.prevent="salvarAlunoForm">
            <div class="modal-body p-4">
              <!-- ABA 1: DADOS DA CRIANÇA -->
              <div v-show="abaAtiva === 'crianca'">
                <BRow class="g-3">
                  <BCol md="8">
                    <label class="form-label fw-semibold">Nome Completo da Criança <span class="text-danger">*</span></label>
                    <input type="text" v-model="form.nome" class="form-control" placeholder="Nome completo conforme certidão" required />
                  </BCol>
                  <BCol md="4">
                    <label class="form-label fw-semibold">Data de Nascimento <span class="text-danger">*</span></label>
                    <input type="date" v-model="form.dataNascimento" class="form-control" required />
                  </BCol>
                  <BCol md="6">
                    <label class="form-label fw-semibold">Turma da Educação Infantil <span class="text-danger">*</span></label>
                    <select v-model="form.turmaId" class="form-select" required>
                      <option v-for="t in turmas" :key="t.id" :value="t.id">
                        {{ t.nome }} ({{ t.faixaEtaria }}) - {{ t.professora }}
                      </option>
                    </select>
                  </BCol>
                  <BCol md="6">
                    <label class="form-label fw-semibold">Turno de Atendimento</label>
                    <input type="text" v-model="form.turno" class="form-control" readonly />
                  </BCol>
                  <BCol md="6">
                    <label class="form-label fw-semibold">Tipo de Vaga</label>
                    <select v-model="form.tipoVaga" class="form-select">
                      <option value="Conveniada (Prefeitura Contagem)">Conveniada (Prefeitura Contagem - SEDUC)</option>
                      <option value="Particular / Comunitária">Particular / Comunitária</option>
                    </select>
                  </BCol>
                  <!-- FOTO DO ALUNO COM WEBCAM OU IMPORTAÇÃO PC/CELULAR -->
                  <BCol md="12">
                    <label class="form-label fw-semibold d-block">Foto do Aluno / Documento</label>
                    <div class="p-3 border rounded bg-light d-flex flex-wrap align-items-center gap-3">
                      <!-- Preview da Foto Atual -->
                      <div class="position-relative">
                        <img 
                          :src="form.foto || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80'" 
                          class="rounded-circle avatar-lg border border-3 border-white shadow-sm object-fit-cover" 
                          alt="Foto Aluno" 
                        />
                        <button 
                          v-if="form.foto" 
                          type="button" 
                          @click="removerFoto" 
                          class="btn btn-danger btn-icon btn-sm position-absolute top-0 end-0 rounded-circle p-0" 
                          style="width: 22px; height: 22px;"
                          title="Remover foto"
                        >
                          <i class="ri-close-line fs-12"></i>
                        </button>
                      </div>

                      <!-- Botões de Ação: Upload e Webcam -->
                      <div class="flex-grow-1">
                        <div class="d-flex flex-wrap gap-2 mb-2">
                          <!-- Input de Arquivo (PC ou Celular) -->
                          <input 
                            type="file" 
                            ref="fileInput" 
                            accept="image/*" 
                            class="d-none" 
                            @change="tratarUploadArquivo" 
                          />
                          <button 
                            type="button" 
                            class="btn btn-sm btn-outline-primary" 
                            @click="$refs.fileInput.click()"
                          >
                            <i class="ri-upload-2-line align-middle me-1"></i> Importar do PC ou Celular
                          </button>

                          <!-- Botão Tirar Foto com Webcam -->
                          <button 
                            type="button" 
                            class="btn btn-sm btn-outline-success" 
                            @click="iniciarWebcam"
                          >
                            <i class="ri-camera-lens-line align-middle me-1"></i> Tirar Foto com Webcam
                          </button>
                        </div>
                        <div class="text-muted fs-11">
                          Formatos aceitos: JPG, PNG ou câmera ao vivo. Resolução ideal 3x4 ou retrato da criança.
                        </div>
                      </div>
                    </div>
                  </BCol>
                </BRow>
              </div>

              <!-- ABA 2: FAMÍLIA & RESPONSÁVEIS -->
              <div v-show="abaAtiva === 'familia'">
                <h6 class="fs-13 fw-bold text-primary mb-3">Responsável Principal (Mãe / Representante Legal)</h6>
                <BRow class="g-3 mb-4">
                  <BCol md="6">
                    <label class="form-label fw-semibold">Nome da Mãe / Responsável 1 <span class="text-danger">*</span></label>
                    <input type="text" v-model="form.maeNome" class="form-control" placeholder="Nome completo" required />
                  </BCol>
                  <BCol md="6">
                    <label class="form-label fw-semibold">Telefone / WhatsApp <span class="text-danger">*</span></label>
                    <input type="text" v-model="form.maeTelefone" class="form-control" placeholder="31998765432" required />
                  </BCol>
                </BRow>

                <h6 class="fs-13 fw-bold text-primary mb-3">Segundo Responsável (Pai / Outro Responsável)</h6>
                <BRow class="g-3 mb-4">
                  <BCol md="6">
                    <label class="form-label fw-semibold">Nome do Pai / Responsável 2</label>
                    <input type="text" v-model="form.paiNome" class="form-control" placeholder="Nome completo" />
                  </BCol>
                  <BCol md="6">
                    <label class="form-label fw-semibold">Telefone / WhatsApp</label>
                    <input type="text" v-model="form.paiTelefone" class="form-control" placeholder="31987654321" />
                  </BCol>
                </BRow>

                <BRow class="g-3">
                  <BCol cols="12">
                    <label class="form-label fw-semibold">Endereço Residencial em Contagem</label>
                    <input type="text" v-model="form.endereco" class="form-control" placeholder="Rua, número, bairro em Contagem - MG" />
                  </BCol>
                </BRow>
              </div>

              <!-- ABA 3: SAÚDE, INCLUSÃO (TEA/AUTISMO) & CUIDADOS -->
              <div v-show="abaAtiva === 'saude'">
                <!-- Alerta e Atalho de Emergência com os Pais -->
                <div class="border rounded p-3 mb-3 bg-light">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="fw-bold text-dark fs-13">
                      <i class="ri-phone-fill text-danger me-1"></i> Contato de Emergência da Família (Crises / Saúde)
                    </span>
                    <button type="button" class="btn btn-xs btn-outline-primary" @click="abaAtiva = 'familia'">
                      <i class="ri-edit-line me-1"></i> Alterar Telefones dos Pais
                    </button>
                  </div>
                  <div class="d-flex flex-wrap gap-3 fs-12 text-muted">
                    <span><strong>Mãe:</strong> {{ form.maeNome || 'Não informada' }} ({{ form.maeTelefone || 'Sem tel' }})</span>
                    <span v-if="form.paiNome">• <strong>Pai:</strong> {{ form.paiNome }} ({{ form.paiTelefone || 'Sem tel' }})</span>
                  </div>
                </div>

                <!-- Seção 1: Inclusão, Neurodivergência & TEA -->
                <div class="border rounded p-3 mb-3 border-purple-subtle" style="background-color: #faf5ff;">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <h6 class="fs-13 fw-bold text-purple mb-0">
                      <i class="ri-puzzle-line me-1"></i> Inclusão Escolar & Neurodivergência (TEA / Autismo, etc.)
                    </h6>
                    <span class="badge bg-purple-subtle text-purple border">Apoio Pedagógico</span>
                  </div>

                  <BRow class="g-3">
                    <BCol md="6">
                      <label class="form-label fw-semibold fs-12">Condição / Diagnóstico</label>
                      <select v-model="form.necessidadesEspeciais" class="form-select form-select-sm">
                        <option value="Nenhuma">Nenhuma (Criança típica)</option>
                        <option value="TEA (Transtorno do Espectro Autista - Nível 1)">TEA (Autismo - Nível 1 de Suporte)</option>
                        <option value="TEA (Transtorno do Espectro Autista - Nível 2)">TEA (Autismo - Nível 2 de Suporte)</option>
                        <option value="TEA (Transtorno do Espectro Autista - Nível 3)">TEA (Autismo - Nível 3 de Suporte)</option>
                        <option value="TDAH (Transtorno de Déficit de Atenção)">TDAH</option>
                        <option value="Síndrome de Down">Síndrome de Down</option>
                        <option value="Outra necessidade educacional especial">Outra condição</option>
                      </select>
                    </BCol>

                    <BCol md="3">
                      <label class="form-label fw-semibold fs-12">Possui Laudo Médico?</label>
                      <select v-model="form.possuiLaudo" class="form-select form-select-sm">
                        <option :value="false">Não / Investigação</option>
                        <option :value="true">Sim (Laudo Anexado)</option>
                      </select>
                    </BCol>

                    <BCol md="3">
                      <label class="form-label fw-semibold fs-12">Monitor SEDUC?</label>
                      <select v-model="form.precisaMonitor" class="form-select form-select-sm">
                        <option :value="false">Não necessário</option>
                        <option :value="true">Sim (Requer Apoio)</option>
                      </select>
                    </BCol>

                    <BCol md="12" v-if="form.necessidadesEspeciais !== 'Nenhuma'">
                      <label class="form-label fw-semibold fs-12">Orientações de Acolhimento & Gatilhos Sensoriais à Educadora</label>
                      <textarea v-model="form.orientacoesInclusao" rows="2" class="form-control form-control-sm" placeholder="Ex: Sensível a barulho de apito, prefere rotina visual, acolhimento com brinquedo de transição..."></textarea>
                    </BCol>

                    <BCol md="12" v-if="form.necessidadesEspeciais !== 'Nenhuma'">
                      <label class="form-label fw-semibold fs-12">Terapeuta / Médico Acompanhante (Opcional)</label>
                      <input type="text" v-model="form.terapeuta" class="form-control form-control-sm" placeholder="Ex: Dra. Juliana (Terapeuta Ocupacional / Fono) - 31 99999-8888" />
                    </BCol>
                  </BRow>
                </div>

                <!-- Seção 2: Alergias e Medicamentos -->
                <BRow class="g-3">
                  <BCol md="12">
                    <label class="form-label fw-semibold">Alergias ou Intolerâncias Alimentares</label>
                    <input type="text" v-model="form.alergias" class="form-control" placeholder="Ex: Intolerância a lactose, glúten, alergia a picada de abelha, nenhuma..." />
                  </BCol>
                  <BCol md="12">
                    <label class="form-label fw-semibold">Medicamentos ou Cuidados Diários na Creche</label>
                    <textarea v-model="form.medicamentos" rows="2" class="form-control" placeholder="Ex: Uso de pomada em cada troca de fralda, remédio com receita às 14h..."></textarea>
                  </BCol>
                </BRow>
              </div>

              <!-- ABA 4: ANAMNESE PEDAGÓGICA & COMPORTAMENTAL (HISTÓRICO DA CRIANÇA) -->
              <div v-show="abaAtiva === 'anamnese'">
                <div class="alert alert-info border-0 mb-3 fs-13">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <i class="ri-book-read-line fs-18"></i>
                    <strong>Anamnese Pedagógica para as Professoras e Educadoras</strong>
                  </div>
                  <p class="mb-0 fs-12">
                    Estas informações são fundamentais para que as tias da sala acolham a criança com segurança afetiva, respeitando suas particularidades, medos, objetos de segurança e rotina.
                  </p>
                </div>

                <BRow class="g-3">
                  <!-- Objeto de Transição / Apego -->
                  <BCol md="6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark fs-12 mb-1">
                        <i class="ri-bear-smile-line text-warning me-1"></i> Objeto de Segurança / Brinquedo de Apego
                      </label>
                      <input 
                        type="text" 
                        v-model="form.anamnese.objetoApego" 
                        class="form-control form-control-sm" 
                        placeholder="Ex: Naninha azul, fraldinha de pano, mordedor, ursinho..." 
                      />
                      <span class="text-muted fs-11 d-block mt-1">Brinquedo ou pano com o qual a criança se acalma ou dorme.</span>
                    </div>
                  </BCol>

                  <!-- Socialização e Compartilhamento -->
                  <BCol md="6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark fs-12 mb-1">
                        <i class="ri-team-line text-primary me-1"></i> Socialização & Brincadeiras
                      </label>
                      <input 
                        type="text" 
                        v-model="form.anamnese.socializacao" 
                        class="form-control form-control-sm" 
                        placeholder="Ex: Divide bem os brinquedos, não gosta de emprestar, prefere brincar sozinha..." 
                      />
                      <span class="text-muted fs-11 d-block mt-1">Como a criança se relaciona com outras da mesma faixa etária.</span>
                    </div>
                  </BCol>

                  <!-- Reação à Frustração / Crises -->
                  <BCol md="6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark fs-12 mb-1">
                        <i class="ri-emotion-unhappy-line text-danger me-1"></i> Reação a Limites e Frustração (Birras / Crises)
                      </label>
                      <textarea 
                        v-model="form.anamnese.reacaoFrustracao" 
                        rows="2" 
                        class="form-control form-control-sm" 
                        placeholder="Ex: Chora forte, atira brinquedos, morde quando contrariada; acalma-se com colo e diálogo calmo..."
                      ></textarea>
                      <span class="text-muted fs-11 d-block mt-1">Estratégias que a família usa em casa quando a criança chora.</span>
                    </div>
                  </BCol>

                  <!-- Medos e Gatilhos Sensoriais -->
                  <BCol md="6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark fs-12 mb-1">
                        <i class="ri-alarm-warning-line text-danger me-1"></i> Medos, Fobias ou Sons Desagradáveis
                      </label>
                      <textarea 
                        v-model="form.anamnese.medosGatilhos" 
                        rows="2" 
                        class="form-control form-control-sm" 
                        placeholder="Ex: Medo de apito, trovão, bexiga estourando, fantasias/palhaços, escuro..."
                      ></textarea>
                      <span class="text-muted fs-11 d-block mt-1">Evita sustos e crises de pânico na creche.</span>
                    </div>
                  </BCol>

                  <!-- Desfralde e Banheiro -->
                  <BCol md="6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark fs-12 mb-1">
                        <i class="ri-rest-time-line text-info me-1"></i> Hábitos de Desfralde & Higiene
                      </label>
                      <input 
                        type="text" 
                        v-model="form.anamnese.desfralde" 
                        class="form-control form-control-sm" 
                        placeholder="Ex: Fralda 100%, em processo (precisa de lembrete a cada 1h), desfraldado total..." 
                      />
                      <span class="text-muted fs-11 d-block mt-1">Como a criança comunica a vontade de ir ao banheiro.</span>
                    </div>
                  </BCol>

                  <!-- Sono e Soneca (13h) -->
                  <BCol md="6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark fs-12 mb-1">
                        <i class="ri-moon-line text-warning me-1"></i> Hábitos de Sono & Soneca na Creche
                      </label>
                      <input 
                        type="text" 
                        v-model="form.anamnese.comportamentoSono" 
                        class="form-control form-control-sm" 
                        placeholder="Ex: Dorme fácil com carinho, não gosta de cobrir, acorda assustada..." 
                      />
                      <span class="text-muted fs-11 d-block mt-1">Rotina de sono da tarde nos colchonetes coletivos.</span>
                    </div>
                  </BCol>

                  <!-- Preferências Alimentares / Seletividade -->
                  <BCol md="6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark fs-12 mb-1">
                        <i class="ri-restaurant-line text-success me-1"></i> Preferências e Seletividade Alimentar
                      </label>
                      <input 
                        type="text" 
                        v-model="form.anamnese.preferenciasAlimentares" 
                        class="form-control form-control-sm" 
                        placeholder="Ex: Come bem verduras, recusa carne em pedaços grandes, gosta de mamadeira..." 
                      />
                      <span class="text-muted fs-11 d-block mt-1">Alimentos que a criança mais aceita ou recusa no almoço e jantar.</span>
                    </div>
                  </BCol>

                  <!-- Histórico de Adaptação Escolar -->
                  <BCol md="6">
                    <div class="p-3 border rounded bg-light h-100">
                      <label class="form-label fw-bold text-dark fs-12 mb-1">
                        <i class="ri-heart-line text-primary me-1"></i> Histórico de Adaptação Escolar
                      </label>
                      <input 
                        type="text" 
                        v-model="form.anamnese.historicoAdaptacao" 
                        class="form-control form-control-sm" 
                        placeholder="Ex: Primeira vez longe da mãe, chora na despedida do portão, adaptação tranquila..." 
                      />
                      <span class="text-muted fs-11 d-block mt-1">Orientação para a equipe de recepção das 07:00h.</span>
                    </div>
                  </BCol>
                </BRow>
              </div>

              <!-- ABA 5: SAÍDA & PORTARIA (17H) -->
              <div v-show="abaAtiva === 'portaria'">
                <div class="alert alert-info border-0 mb-3 fs-13">
                  <i class="ri-shield-check-line align-middle me-1"></i> Por segurança, apenas pessoas listadas aqui poderão retirar a criança às 17h.
                </div>
                <div class="mb-3">
                  <label class="form-label fw-semibold">Pessoas Autorizadas na Saída</label>
                  <div v-for="(aut, idx) in form.autorizados" :key="idx" class="d-flex gap-2 align-items-center mb-2">
                    <input type="text" v-model="aut.nome" class="form-control form-control-sm" placeholder="Nome completo" />
                    <input type="text" v-model="aut.parentesco" class="form-control form-control-sm" placeholder="Parentesco (ex: Pai, Avó, Tio)" />
                    <input type="text" v-model="aut.documento" class="form-control form-control-sm" placeholder="Documento / RG" />
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removerAutorizado(idx)" :disabled="form.autorizados.length === 1">
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </div>
                  <button type="button" class="btn btn-sm btn-soft-primary mt-1" @click="adicionarAutorizado">
                    <i class="ri-add-line align-middle me-1"></i> Adicionar Mais Uma Pessoa Autorizada
                  </button>
                </div>
              </div>
            </div>

            <!-- Rodapé com Navegação das Abas e Salvar -->
            <div class="modal-footer bg-light p-3 d-flex justify-content-between">
              <div>
                <button v-if="abaAtiva !== 'crianca'" type="button" class="btn btn-outline-secondary" @click="voltarAba">
                  <i class="ri-arrow-left-line me-1"></i> Anterior
                </button>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary" @click="modalCadastroAberto = false">Cancelar</button>
                <button v-if="abaAtiva !== 'portaria'" type="button" class="btn btn-primary" @click="avancarAba">
                  Próximo <i class="ri-arrow-right-line ms-1"></i>
                </button>
                <button v-else type="submit" class="btn btn-success">
                  <i class="ri-check-line align-middle me-1"></i> Salvar Matrícula
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- ========================================================================================== -->
    <!-- MODAL 3: CAPTURA DE FOTO POR WEBCAM AO VIVO -->
    <!-- ========================================================================================== -->
    <div v-if="modalWebcamAberto" class="modal show d-block" style="background-color: rgba(15, 23, 42, 0.75); z-index: 1065;" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-dark text-white p-3">
            <div class="d-flex align-items-center gap-2">
              <i class="ri-camera-lens-line fs-20 text-success"></i>
              <h5 class="modal-title mb-0 fs-16 text-white">Fotografar Aluno com a Câmera</h5>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="fecharWebcam"></button>
          </div>

          <div class="modal-body p-4 text-center">
            <!-- Erro de permissão se houver -->
            <div v-if="erroWebcam" class="alert alert-danger fs-13 mb-3 text-start">
              <i class="ri-error-warning-line me-1"></i> {{ erroWebcam }}
            </div>

            <!-- Visualizador do Vídeo ou Foto Tirada -->
            <div class="position-relative d-inline-block rounded-3 overflow-hidden shadow-sm bg-black border" style="width: 320px; height: 320px;">
              <video 
                v-show="!fotoCapturadaPreview" 
                ref="videoWebcam" 
                autoplay 
                playsinline 
                muted
                style="width: 100%; height: 100%; object-fit: cover;"
              ></video>

              <!-- Preview congelado da foto tirada -->
              <img 
                v-if="fotoCapturadaPreview" 
                :src="fotoCapturadaPreview" 
                style="width: 100%; height: 100%; object-fit: cover;" 
                alt="Foto Capturada" 
              />

              <!-- Guia visual circular para enquadrar o rostinho da criança -->
              <div 
                v-if="!fotoCapturadaPreview && !erroWebcam"
                class="position-absolute top-50 start-50 translate-middle rounded-circle border border-2 border-white opacity-50 pointer-events-none" 
                style="width: 220px; height: 220px; pointer-events: none;"
              ></div>
            </div>

            <p class="text-muted fs-12 mt-2 mb-0">
              {{ fotoCapturadaPreview ? 'Foto capturada! Deseja utilizá-la ou tirar outra?' : 'Enquadre o rosto da criança no centro e clique no botão verde abaixo.' }}
            </p>

            <!-- Canvas invisível para desenhar o frame do vídeo -->
            <canvas ref="canvasWebcam" style="display: none;"></canvas>
          </div>

          <div class="modal-footer bg-light p-3 d-flex justify-content-between">
            <button type="button" class="btn btn-secondary" @click="fecharWebcam">Cancelar</button>

            <div class="d-flex gap-2">
              <button 
                v-if="fotoCapturadaPreview" 
                type="button" 
                class="btn btn-outline-warning" 
                @click="tentarNovamenteWebcam"
              >
                <i class="ri-refresh-line me-1"></i> Tirar Outra
              </button>

              <button 
                v-if="!fotoCapturadaPreview" 
                type="button" 
                class="btn btn-success" 
                @click="capturarFotoFrame" 
                :disabled="!!erroWebcam"
              >
                <i class="ri-camera-3-line me-1"></i> Capturar Foto
              </button>

              <button 
                v-if="fotoCapturadaPreview" 
                type="button" 
                class="btn btn-primary" 
                @click="confirmarFotoWebcam"
              >
                <i class="ri-check-line me-1"></i> Usar Esta Foto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================================== -->
    <!-- MODAL DE PRÉVIA & IMPRESSÃO: DOSSIÊ ESCOLAR OFICIAL TIMBRADO (FOLHA A4) -->
    <!-- ========================================================================================== -->
    <div v-if="modalImpressaoAberto && alunoParaImpressao" class="modal show d-block no-print-bg" style="background-color: rgba(15, 23, 42, 0.82); z-index: 1060;" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
          <!-- Topo da Prévia -->
          <div class="modal-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <i class="ri-printer-cloud-line text-info fs-20"></i>
              <div>
                <h5 class="modal-title mb-0 fs-16 text-white fw-bold">
                  Dossiê Escolar Oficial • Impressão em Folha A4 Timbrada
                </h5>
                <span class="text-white-50 fs-11">
                  {{ alunoParaImpressao.nome }} • {{ getTurmaNome(alunoParaImpressao.turmaId) }} • SEDUC Contagem
                </span>
              </div>
            </div>

            <div class="d-flex align-items-center gap-2">
              <button type="button" class="btn btn-primary btn-sm text-white fw-bold shadow-sm" @click="dispararImpressao">
                <i class="ri-printer-line me-1"></i> Imprimir Folha A4 Oficial
              </button>
              <button type="button" class="btn-close btn-close-white" @click="modalImpressaoAberto = false"></button>
            </div>
          </div>

          <!-- Corpo com a Folha A4 Realista -->
          <div class="modal-body p-3 p-md-4 bg-secondary bg-opacity-10 d-flex justify-content-center">
            <div class="folha-a4-preview shadow-lg">
              <!-- Conteúdo Oficial Idêntico para Tela e Papel -->
              <div id="dossie-imprimivel-oficial" class="dossie-print-sheet">
                <!-- CABEÇALHO GOVERNAMENTAL & INSTITUCIONAL -->
                <div class="print-header-grid">
                  <div class="print-brasao">
                    <div class="emblema-circulo">CEI</div>
                  </div>
                  <div class="print-instituicao-text">
                    <div class="gov-estado">ESTADO DE MINAS GERAIS • PREFEITURA MUNICIPAL DE CONTAGEM</div>
                    <div class="gov-secretaria">SECRETARIA MUNICIPAL DE EDUCAÇÃO - SEDUC • TERMO DE COLABORAÇÃO</div>
                    <div class="inst-nome">FUNDAÇÃO SANTA FILOMENA</div>
                    <div class="inst-sub">CENTRO DE EDUCAÇÃO INFANTIL SANTA FILOMENA</div>
                    <div class="inst-dados">CNPJ: 21.034.982/0001-44 • Educação Infantil • Turno Integral (07:00h às 17:00h)</div>
                    <div class="inst-end">Rua das Flores, 120 - Contagem / MG • Telefone: (31) 3390-1234 • CEP: 32000-000</div>
                  </div>
                  <div class="print-registro-box">
                    <div class="reg-label">REGISTRO ESCOLAR</div>
                    <div class="reg-val">MAT-2026/00{{ alunoParaImpressao.id.replace('aluno-', '') }}</div>
                    <div class="reg-sub">Ano Letivo 2026</div>
                    <div class="reg-sub">Emissão: {{ dataHojeFormatada }}</div>
                  </div>
                </div>

                <div class="doc-title-bar">
                  DOSSIÊ DO EDUCANDO & PRONTUÁRIO DE ANAMNESE PEDAGÓGICA INDIVIDUAL
                </div>

                <!-- QUADRO 1: IDENTIFICAÇÃO DO ALUNO COM FOTO 3x4 -->
                <div class="secao-box">
                  <div class="secao-titulo">I. IDENTIFICAÇÃO DO(A) ALUNO(A)</div>
                  <div class="d-flex align-items-start gap-3 p-2">
                    <div class="flex-grow-1">
                      <table class="tabela-dados-print">
                        <tbody>
                          <tr>
                            <td class="td-label" style="width: 20%;">Nome Completo:</td>
                            <td class="td-valor fw-bold fs-13" colspan="3">{{ alunoParaImpressao.nome }}</td>
                          </tr>
                          <tr>
                            <td class="td-label">Data de Nasc.:</td>
                            <td class="td-valor">{{ formatarData(alunoParaImpressao.dataNascimento) }} ({{ calcularIdade(alunoParaImpressao.dataNascimento) }})</td>
                            <td class="td-label" style="width: 20%;">Turma Escolar:</td>
                            <td class="td-valor fw-bold">{{ getTurmaNome(alunoParaImpressao.turmaId) }}</td>
                          </tr>
                          <tr>
                            <td class="td-label">Turno:</td>
                            <td class="td-valor">Turno Integral (07:00 às 17:00)</td>
                            <td class="td-label">Tipo de Matrícula:</td>
                            <td class="td-valor">{{ alunoParaImpressao.tipoVaga }}</td>
                          </tr>
                          <tr>
                            <td class="td-label">Professora Regente:</td>
                            <td class="td-valor">{{ getTurmaProfessora(alunoParaImpressao.turmaId) }}</td>
                            <td class="td-label">Status Matrícula:</td>
                            <td class="td-valor fw-bold text-uppercase">Ativa / Regular</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="moldura-foto-3x4">
                      <img v-if="alunoParaImpressao.foto" :src="alunoParaImpressao.foto" class="foto-3x4-img" alt="Foto 3x4" />
                      <div v-else class="foto-3x4-placeholder">FOTO 3x4</div>
                      <div class="foto-carimbo">MATRÍCULA 2026</div>
                    </div>
                  </div>
                </div>

                <!-- QUADRO 2: NÚCLEO FAMILIAR E CONTATOS -->
                <div class="secao-box">
                  <div class="secao-titulo">II. FILIAÇÃO, GUARDA LEGAL & CONTATOS DE EMERGÊNCIA</div>
                  <table class="tabela-dados-print">
                    <thead>
                      <tr class="tr-cabecalho">
                        <th style="width: 45%;">Nome do Responsável</th>
                        <th style="width: 25%;">Parentesco</th>
                        <th style="width: 30%;">Telefone de Contato</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(resp, idx) in alunoParaImpressao.responsaveis" :key="idx">
                        <td class="td-valor fw-bold">{{ resp.nome }}</td>
                        <td class="td-valor">{{ resp.parentesco }}</td>
                        <td class="td-valor">{{ formatarTelefone(resp.telefone) }}</td>
                      </tr>
                      <tr>
                        <td class="td-label">Endereço Residencial:</td>
                        <td class="td-valor" colspan="2">{{ alunoParaImpressao.endereco || 'Bairro São Gonçalo, Contagem - MG' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- QUADRO 3: SAÚDE, CARDÁPIO, ALERGIAS E INCLUSÃO (TEA) -->
                <div class="secao-box">
                  <div class="secao-titulo">III. QUADRO CLÍNICO, ALERGIAS & ATENDIMENTO EDUCACIONAL ESPECIALIZADO (TEA/INCLUSÃO)</div>
                  <table class="tabela-dados-print">
                    <tbody>
                      <tr>
                        <td class="td-label" style="width: 28%;">Alergias / Intolerâncias:</td>
                        <td class="td-valor" :class="alunoParaImpressao.alergias && alunoParaImpressao.alergias !== 'Nenhuma' ? 'alerta-alergia' : ''" colspan="3">
                          <strong>{{ alunoParaImpressao.alergias || 'Nenhuma alergia ou restrição alimentar relatada pelos pais.' }}</strong>
                          <span v-if="alunoParaImpressao.alergias && alunoParaImpressao.alergias !== 'Nenhuma'" class="ms-2 fs-10 text-danger fw-bold">[COMUNICAR COZINHA E LACTÁRIO]</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="td-label">Medicamentos na Escola:</td>
                        <td class="td-valor" colspan="3">{{ alunoParaImpressao.medicamentos || 'Nenhum medicamento diário.' }}</td>
                      </tr>
                      <tr>
                        <td class="td-label">Condição de Inclusão / TEA:</td>
                        <td class="td-valor fw-bold">{{ alunoParaImpressao.necessidadesEspeciais || 'Nenhuma' }}</td>
                        <td class="td-label" style="width: 25%;">Possui Laudo Médico:</td>
                        <td class="td-valor">{{ alunoParaImpressao.possuiLaudo ? 'Sim (Laudo Anexado na Pasta Escolar)' : 'Em investigação' }}</td>
                      </tr>
                      <tr>
                        <td class="td-label">Apoio Monitor SEDUC:</td>
                        <td class="td-valor">{{ alunoParaImpressao.precisaMonitor ? 'Sim (Monitor Especializado Solicitado)' : 'Não se aplica' }}</td>
                        <td class="td-label">Terapeuta / Clínica:</td>
                        <td class="td-valor">{{ alunoParaImpressao.terapeuta || 'Não informado' }}</td>
                      </tr>
                      <tr v-if="alunoParaImpressao.orientacoesInclusao">
                        <td class="td-label">Orientações à Docência:</td>
                        <td class="td-valor" colspan="3">{{ alunoParaImpressao.orientacoesInclusao }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- QUADRO 4: ANAMNESE PEDAGÓGICA & COMPORTAMENTO (BNCC) -->
                <div class="secao-box">
                  <div class="secao-titulo">IV. ANAMNESE PEDAGÓGICA, AFETIVA & COMPORTAMENTAL (ORIENTAÇÕES PARA A PROFESSORA)</div>
                  <table class="tabela-dados-print" v-if="alunoParaImpressao.anamnese">
                    <tbody>
                      <tr>
                        <td class="td-label" style="width: 32%;">Brinquedo / Objeto de Apego:</td>
                        <td class="td-valor" colspan="3"><strong>{{ alunoParaImpressao.anamnese.objetoApego || 'Não relatado' }}</strong> (Objeto de segurança e acolhimento nas transições)</td>
                      </tr>
                      <tr>
                        <td class="td-label">Socialização & Brinquedos:</td>
                        <td class="td-valor" colspan="3">{{ alunoParaImpressao.anamnese.socializacao || 'Socializa bem com os colegas de turma' }}</td>
                      </tr>
                      <tr>
                        <td class="td-label">Reação a Frustrações/Limites:</td>
                        <td class="td-valor" colspan="3">{{ alunoParaImpressao.anamnese.reacaoFrustracao || 'Aceita combinados da rotina' }}</td>
                      </tr>
                      <tr>
                        <td class="td-label">Medos e Gatilhos Sensoriais:</td>
                        <td class="td-valor" colspan="3">{{ alunoParaImpressao.anamnese.medosGatilhos || 'Nenhum medo expressivo relatado' }}</td>
                      </tr>
                      <tr>
                        <td class="td-label">Desfralde e Banheiro:</td>
                        <td class="td-valor">{{ alunoParaImpressao.anamnese.desfralde || 'Não informado' }}</td>
                        <td class="td-label" style="width: 25%;">Rotina de Sono / Soneca:</td>
                        <td class="td-valor">{{ alunoParaImpressao.anamnese.comportamentoSono || 'Descansa normalmente' }}</td>
                      </tr>
                      <tr>
                        <td class="td-label">Seletividade Alimentar:</td>
                        <td class="td-valor" colspan="3">{{ alunoParaImpressao.anamnese.preferenciasAlimentares || 'Consome o cardápio padrão' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- QUADRO 5: AUTORIZADOS NA PORTARIA 17:00H -->
                <div class="secao-box">
                  <div class="secao-titulo">V. REGISTRO DE PESSOAS AUTORIZADAS PARA SAÍDA NA PORTARIA (17:00H)</div>
                  <table class="tabela-dados-print">
                    <thead>
                      <tr class="tr-cabecalho">
                        <th style="width: 50%;">Nome Completo do Autorizado</th>
                        <th style="width: 25%;">Grau de Parentesco</th>
                        <th style="width: 25%;">Documento (RG / CPF)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(aut, idx) in alunoParaImpressao.autorizadosRetirada" :key="idx">
                        <td class="td-valor fw-bold">{{ aut.nome }}</td>
                        <td class="td-valor">{{ aut.parentesco }}</td>
                        <td class="td-valor">{{ aut.documento || 'Apresentar na Portaria' }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="aviso-portaria-print">
                    ⚠️ <strong>ATENÇÃO PORTARIA:</strong> A saída de crianças da Educação Infantil só é permitida a maiores de 18 anos devidamente cadastrados nesta ficha e portando documento oficial de identificação com foto. Em nenhuma hipótese a criança será liberada a terceiros não listados sem autorização formal e expressa dos responsáveis legais.
                  </div>
                </div>

                <!-- QUADRO 6: TERMO DE RESPONSABILIDADE & ASSINATURAS -->
                <div class="secao-box secao-assinaturas">
                  <div class="secao-titulo">VI. TERMO DE RESPONSABILIDADE & VALIDAÇÃO INSTITUCIONAL</div>
                  <div class="termo-texto">
                    Declaro, para os devidos fins de direito junto à Secretaria Municipal de Educação (SEDUC/Contagem) e Fundação Santa Filomena, que todas as informações prestadas neste prontuário e na anamnese escolar são verdadeiras. Autorizo a participação do(a) educando(a) nas atividades pedagógicas da BNCC, rotinas de alimentação, cuidados higiênicos e socorro de urgência quando necessário.
                  </div>
                  <div class="data-cidade text-end my-2">
                    Contagem - MG, {{ dataExtenso }}
                  </div>
                  <div class="linhas-assinatura">
                    <div class="assinatura-bloco">
                      <div class="linha-traco"></div>
                      <div class="ass-cargo">Assinatura do Responsável Legal</div>
                      <div class="ass-doc">Nome: {{ alunoParaImpressao.responsaveis[0]?.nome }}</div>
                    </div>
                    <div class="assinatura-bloco">
                      <div class="linha-traco"></div>
                      <div class="ass-cargo">Professora Regente da Turma</div>
                      <div class="ass-doc">{{ getTurmaProfessora(alunoParaImpressao.turmaId) }}</div>
                    </div>
                    <div class="assinatura-bloco">
                      <div class="linha-traco"></div>
                      <div class="ass-cargo">Coordenação Pedagógica / Direção</div>
                      <div class="ass-doc">CEI Santa Filomena • SEDUC Contagem</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer bg-light p-3 d-flex justify-content-between">
            <button type="button" class="btn btn-secondary" @click="modalImpressaoAberto = false">Fechar Prévia</button>
            <button type="button" class="btn btn-primary" @click="dispararImpressao">
              <i class="ri-printer-line align-middle me-1"></i> Imprimir Folha A4 Oficial
            </button>
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
      turmas: [],
      alunos: [],
      filtroBusca: '',
      filtroTurma: '',
      alunoDetalhes: null,
      alunoParaImpressao: null,
      modalImpressaoAberto: false,
      modalCadastroAberto: false,
      alunoEmEdicaoId: null,
      abaAtiva: 'crianca',
      // Estado para Webcam e Captura de Fotos
      modalWebcamAberto: false,
      erroWebcam: null,
      fotoCapturadaPreview: null,
      streamWebcam: null,
      form: {
        nome: '',
        dataNascimento: '',
        turmaId: 'mat1',
        turno: 'Integral (07h às 17h)',
        tipoVaga: 'Conveniada (Prefeitura Contagem)',
        foto: '',
        maeNome: '',
        maeTelefone: '',
        paiNome: '',
        paiTelefone: '',
        endereco: '',
        alergias: '',
        medicamentos: '',
        necessidadesEspeciais: 'Nenhuma',
        possuiLaudo: false,
        precisaMonitor: false,
        orientacoesInclusao: '',
        terapeuta: '',
        anamnese: {
          objetoApego: '',
          socializacao: '',
          reacaoFrustracao: '',
          medosGatilhos: '',
          desfralde: '',
          comportamentoSono: '',
          preferenciasAlimentares: '',
          historicoAdaptacao: ''
        },
        autorizados: [
          { nome: '', parentesco: 'Mãe', documento: '' }
        ]
      }
    };
  },
  computed: {
    dataHojeFormatada() {
      return new Date().toLocaleDateString('pt-BR');
    },
    dataExtenso() {
      const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      const d = new Date();
      return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
    },
    alunosFiltrados() {
      return this.alunos.filter(a => {
        const busca = this.filtroBusca.toLowerCase();
        const matchNome = a.nome.toLowerCase().includes(busca);
        const matchResp = a.responsaveis?.some(r => r.nome.toLowerCase().includes(busca));
        const matchTurma = !this.filtroTurma || a.turmaId === this.filtroTurma;
        return (matchNome || matchResp) && matchTurma;
      });
    },
    totalConveniados() {
      return this.alunos.filter(a => a.tipoVaga && a.tipoVaga.includes('Conveniada')).length;
    },
    totalComAlergia() {
      return this.alunos.filter(a => a.alergias && a.alergias !== 'Nenhuma').length;
    },
    totalInclusao() {
      return this.alunos.filter(a => a.necessidadesEspeciais && a.necessidadesEspeciais !== 'Nenhuma').length;
    }
  },
  mounted() {
    EscolaStorage.init();
    this.turmas = EscolaStorage.getTurmas();
    this.alunos = EscolaStorage.getAlunos();
  },
  methods: {
    getTurmaNome(turmaId) {
      const t = this.turmas.find(item => item.id === turmaId);
      return t ? t.nome : 'Turma';
    },
    calcularIdade(dataNasc) {
      if (!dataNasc) return '';
      const hoje = new Date();
      const nasc = new Date(dataNasc);
      let anos = hoje.getFullYear() - nasc.getFullYear();
      let meses = hoje.getMonth() - nasc.getMonth();
      if (meses < 0 || (meses === 0 && hoje.getDate() < nasc.getDate())) {
        anos--;
        meses += 12;
      }
      return `${anos} anos e ${meses} meses`;
    },
    formatarData(dt) {
      if (!dt) return '';
      const partes = dt.split('-');
      if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
      return dt;
    },
    formatarTelefone(tel) {
      if (!tel) return '';
      const limpo = tel.replace(/\D/g, '');
      if (limpo.length === 11) {
        return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
      }
      return tel;
    },
    abrirModalDetalhes(aluno) {
      this.alunoDetalhes = aluno;
    },
    abrirModalCadastro() {
      this.alunoEmEdicaoId = null;
      this.abaAtiva = 'crianca';
      this.form = {
        nome: '',
        dataNascimento: '',
        turmaId: this.turmas[0]?.id || 'mat1',
        turno: 'Integral (07h às 17h)',
        tipoVaga: 'Conveniada (Prefeitura Contagem)',
        foto: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
        maeNome: '',
        maeTelefone: '',
        paiNome: '',
        paiTelefone: '',
        endereco: 'Contagem - MG',
        alergias: 'Nenhuma',
        medicamentos: '',
        necessidadesEspeciais: 'Nenhuma',
        possuiLaudo: false,
        precisaMonitor: false,
        orientacoesInclusao: '',
        terapeuta: '',
        anamnese: {
          objetoApego: '',
          socializacao: '',
          reacaoFrustracao: '',
          medosGatilhos: '',
          desfralde: '',
          comportamentoSono: '',
          preferenciasAlimentares: '',
          historicoAdaptacao: ''
        },
        autorizados: [
          { nome: '', parentesco: 'Mãe', documento: '' },
          { nome: '', parentesco: 'Pai', documento: '' }
        ]
      };
      this.modalCadastroAberto = true;
    },
    editarAluno(aluno) {
      this.alunoEmEdicaoId = aluno.id;
      this.abaAtiva = 'crianca';
      const mae = aluno.responsaveis?.[0] || {};
      const pai = aluno.responsaveis?.[1] || {};
      const anam = aluno.anamnese || {};
      this.form = {
        nome: aluno.nome,
        dataNascimento: aluno.dataNascimento,
        turmaId: aluno.turmaId,
        turno: aluno.turno || 'Integral (07h às 17h)',
        tipoVaga: aluno.tipoVaga || 'Conveniada (Prefeitura Contagem)',
        foto: aluno.foto,
        maeNome: mae.nome || '',
        maeTelefone: mae.telefone || '',
        paiNome: pai.nome || '',
        paiTelefone: pai.telefone || '',
        endereco: aluno.endereco || 'Contagem - MG',
        alergias: aluno.alergias || 'Nenhuma',
        medicamentos: aluno.medicamentos || '',
        necessidadesEspeciais: aluno.necessidadesEspeciais || 'Nenhuma',
        possuiLaudo: aluno.possuiLaudo || false,
        precisaMonitor: aluno.precisaMonitor || false,
        orientacoesInclusao: aluno.orientacoesInclusao || '',
        terapeuta: aluno.terapeuta || '',
        anamnese: {
          objetoApego: anam.objetoApego || '',
          socializacao: anam.socializacao || '',
          reacaoFrustracao: anam.reacaoFrustracao || '',
          medosGatilhos: anam.medosGatilhos || '',
          desfralde: anam.desfralde || '',
          comportamentoSono: anam.comportamentoSono || '',
          preferenciasAlimentares: anam.preferenciasAlimentares || '',
          historicoAdaptacao: anam.historicoAdaptacao || ''
        },
        autorizados: aluno.autorizadosRetirada && aluno.autorizadosRetirada.length 
          ? JSON.parse(JSON.stringify(aluno.autorizadosRetirada))
          : [{ nome: '', parentesco: 'Mãe', documento: '' }]
      };
      this.modalCadastroAberto = true;
    },
    adicionarAutorizado() {
      this.form.autorizados.push({ nome: '', parentesco: 'Responsável', documento: '' });
    },
    removerAutorizado(index) {
      this.form.autorizados.splice(index, 1);
    },
    avancarAba() {
      if (this.abaAtiva === 'crianca') this.abaAtiva = 'familia';
      else if (this.abaAtiva === 'familia') this.abaAtiva = 'saude';
      else if (this.abaAtiva === 'saude') this.abaAtiva = 'anamnese';
      else if (this.abaAtiva === 'anamnese') this.abaAtiva = 'portaria';
    },
    voltarAba() {
      if (this.abaAtiva === 'portaria') this.abaAtiva = 'anamnese';
      else if (this.abaAtiva === 'anamnese') this.abaAtiva = 'saude';
      else if (this.abaAtiva === 'saude') this.abaAtiva = 'familia';
      else if (this.abaAtiva === 'familia') this.abaAtiva = 'crianca';
    },
    salvarAlunoForm() {
      const responsaveisLista = [];
      if (this.form.maeNome) {
        responsaveisLista.push({
          nome: this.form.maeNome,
          telefone: this.form.maeTelefone,
          parentesco: 'Mãe'
        });
      }
      if (this.form.paiNome) {
        responsaveisLista.push({
          nome: this.form.paiNome,
          telefone: this.form.paiTelefone,
          parentesco: 'Pai'
        });
      }

      const autorizadosValidos = this.form.autorizados.filter(a => a.nome.trim() !== '');

      const dadosAluno = {
        id: this.alunoEmEdicaoId || ('aluno-' + Date.now()),
        nome: this.form.nome,
        dataNascimento: this.form.dataNascimento,
        turmaId: this.form.turmaId,
        turno: this.form.turno,
        tipoVaga: this.form.tipoVaga,
        foto: this.form.foto || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
        endereco: this.form.endereco,
        alergias: this.form.alergias || 'Nenhuma',
        medicamentos: this.form.medicamentos || 'Nenhum',
        necessidadesEspeciais: this.form.necessidadesEspeciais || 'Nenhuma',
        possuiLaudo: this.form.possuiLaudo || false,
        precisaMonitor: this.form.precisaMonitor || false,
        orientacoesInclusao: this.form.orientacoesInclusao || '',
        terapeuta: this.form.terapeuta || '',
        anamnese: this.form.anamnese,
        responsaveis: responsaveisLista,
        autorizadosRetirada: autorizadosValidos.length ? autorizadosValidos : [
          { nome: this.form.maeNome, parentesco: 'Mãe', documento: 'Documento informado' }
        ]
      };

      EscolaStorage.salvarAluno(dadosAluno);
      this.alunos = EscolaStorage.getAlunos();
      this.modalCadastroAberto = false;

      Swal.fire({
        icon: "success",
        title: this.alunoEmEdicaoId ? "Aluno Atualizado!" : "Matrícula Realizada!",
        text: `Os dados de ${dadosAluno.nome} foram salvos com sucesso.`,
        timer: 2000,
        showConfirmButton: false
      });
    },
    confirmarExclusao(aluno) {
      Swal.fire({
        title: "Tem certeza?",
        text: `Deseja realmente excluir a matrícula de ${aluno.nome}? Esta ação removerá a ficha escolar.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f06548",
        cancelButtonColor: "#878a99",
        confirmButtonText: "Sim, excluir matrícula",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          EscolaStorage.excluirAluno(aluno.id);
          this.alunos = EscolaStorage.getAlunos();
          Swal.fire({
            icon: "success",
            title: "Excluído!",
            text: "O aluno foi removido do cadastro escolar.",
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    },
    imprimirFicha() {
      if (this.alunoDetalhes) {
        this.abrirPreviewImpressao(this.alunoDetalhes);
      } else {
        window.print();
      }
    },
    abrirPreviewImpressao(aluno) {
      this.alunoParaImpressao = aluno;
      this.modalImpressaoAberto = true;
    },
    dispararImpressao() {
      window.print();
    },
    getTurmaProfessora(turmaId) {
      const t = this.turmas.find(item => item.id === turmaId);
      return t ? `${t.professora} (${t.nome})` : 'Professora Regente';
    },
    // ==========================================
    // MÉTODOS DE FOTO: UPLOAD PC/CELULAR E WEBCAM
    // ==========================================
    tratarUploadArquivo(event) {
      const arquivo = event.target.files?.[0];
      if (!arquivo) return;

      // Validação de tipo de arquivo
      if (!arquivo.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG).');
        return;
      }

      const leitor = new FileReader();
      leitor.onload = (e) => {
        // Redimensionar para tamanho ideal otimizado (300x300 base64) para não pesar o storage
        this.otimizarImagemBase64(e.target.result, 300, 300, (imagemOtimizada) => {
          this.form.foto = imagemOtimizada;
        });
      };
      leitor.readAsDataURL(arquivo);
    },
    removerFoto() {
      this.form.foto = '';
    },
    async iniciarWebcam() {
      this.erroWebcam = null;
      this.fotoCapturadaPreview = null;
      this.modalWebcamAberto = true;

      try {
        // Solicita acesso à câmera (preferencialmente frontal em celulares ou padrão de webcam)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 640 }
          },
          audio: false
        });

        this.streamWebcam = stream;
        this.$nextTick(() => {
          if (this.$refs.videoWebcam) {
            this.$refs.videoWebcam.srcObject = stream;
          }
        });
      } catch (err) {
        console.error('Erro ao acessar webcam:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          this.erroWebcam = 'Permissão de acesso à câmera negada. Conceda permissão no seu navegador para tirar a foto.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          this.erroWebcam = 'Nenhuma câmera ou webcam foi detectada no dispositivo.';
        } else {
          this.erroWebcam = 'Não foi possível conectar à câmera: ' + err.message;
        }
      }
    },
    capturarFotoFrame() {
      const video = this.$refs.videoWebcam;
      const canvas = this.$refs.canvasWebcam;
      if (!video || !canvas) return;

      const size = Math.min(video.videoWidth, video.videoHeight) || 300;
      canvas.width = 300;
      canvas.height = 300;

      const ctx = canvas.getContext('2d');
      // Corta o centro para enquadramento 1:1 quadrado
      const startX = (video.videoWidth - size) / 2 || 0;
      const startY = (video.videoHeight - size) / 2 || 0;
      ctx.drawImage(video, startX, startY, size, size, 0, 0, 300, 300);

      this.fotoCapturadaPreview = canvas.toDataURL('image/jpeg', 0.88);
    },
    tentarNovamenteWebcam() {
      this.fotoCapturadaPreview = null;
    },
    confirmarFotoWebcam() {
      if (this.fotoCapturadaPreview) {
        this.form.foto = this.fotoCapturadaPreview;
      }
      this.fecharWebcam();
    },
    fecharWebcam() {
      if (this.streamWebcam) {
        this.streamWebcam.getTracks().forEach(track => track.stop());
        this.streamWebcam = null;
      }
      this.fotoCapturadaPreview = null;
      this.erroWebcam = null;
      this.modalWebcamAberto = false;
    },
    otimizarImagemBase64(dataUrl, maxWidth, maxHeight, callback) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Recorte ou escala proporcional
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = dataUrl;
    }
  },
  beforeUnmount() {
    this.fecharWebcam();
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.w-fit {
  width: fit-content;
}
.last-mb-0:last-child {
  margin-bottom: 0 !important;
}

/* ==========================================================
   PRÉVIA NA TELA (MOCKUP REALISTA DA FOLHA A4 TIMBRADA)
   ========================================================== */
.folha-a4-preview {
  background: #ffffff;
  width: 100%;
  max-width: 210mm;
  min-height: 297mm;
  padding: 12mm 15mm;
  margin: 0 auto;
  border-radius: 4px;
  box-sizing: border-box;
  color: #000000;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  border: 1px solid #cbd5e1;
}

/* ==========================================================
   ESTILOS DE ELEMENTOS DO DOSSIÊ (COMPARTILHADOS EM TELA E PAPEL)
   ========================================================== */
.dossie-print-sheet {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #000000;
  line-height: 1.25;
}

.print-header-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #0f172a;
  padding-bottom: 6px;
  margin-bottom: 6px;
}

.print-brasao {
  width: 50px;
  text-align: center;
}

.emblema-circulo {
  width: 44px;
  height: 44px;
  border: 2px solid #1e3a8a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 13pt;
  color: #1e3a8a;
  margin: 0 auto;
}

.print-instituicao-text {
  flex-grow: 1;
  text-align: center;
  padding: 0 10px;
}

.gov-estado {
  font-size: 8pt;
  font-weight: bold;
  color: #475569;
  letter-spacing: 0.5px;
}

.gov-secretaria {
  font-size: 8pt;
  font-weight: 600;
  color: #475569;
}

.inst-nome {
  font-size: 13pt;
  font-weight: 900;
  color: #1e3a8a;
  line-height: 1.1;
  margin-top: 1px;
}

.inst-sub {
  font-size: 8.5pt;
  font-weight: bold;
  color: #0f172a;
}

.inst-dados, .inst-end {
  font-size: 7.5pt;
  color: #64748b;
}

.print-registro-box {
  border: 1px solid #1e3a8a;
  border-radius: 4px;
  padding: 4px 6px;
  text-align: center;
  min-width: 125px;
  background-color: #f8fafc;
}

.reg-label {
  font-size: 6.5pt;
  font-weight: bold;
  color: #475569;
}

.reg-val {
  font-size: 10pt;
  font-weight: 900;
  color: #1e3a8a;
}

.reg-sub {
  font-size: 6.5pt;
  color: #64748b;
}

.doc-title-bar {
  background-color: #1e3a8a;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
  font-size: 9.5pt;
  letter-spacing: 0.5px;
  padding: 3px 0;
  margin-bottom: 8px;
}

.secao-box {
  border: 1px solid #334155;
  margin-bottom: 7px;
  background: #ffffff;
}

.secao-titulo {
  background-color: #f1f5f9;
  border-bottom: 1px solid #334155;
  font-weight: bold;
  font-size: 8.5pt;
  padding: 3px 6px;
  text-transform: uppercase;
  color: #0f172a;
}

.tabela-dados-print {
  width: 100%;
  border-collapse: collapse;
}

.tabela-dados-print td, 
.tabela-dados-print th {
  border: 1px solid #cbd5e1;
  padding: 3px 6px;
  font-size: 8.5pt;
  vertical-align: middle;
}

.td-label {
  background-color: #f8fafc;
  font-weight: 600;
  color: #334155;
}

.tr-cabecalho th {
  background-color: #f1f5f9;
  font-weight: bold;
  font-size: 8pt;
  text-align: left;
}

.alerta-alergia {
  background-color: #fee2e2;
  color: #991b1b;
  font-weight: bold;
}

.moldura-foto-3x4 {
  width: 30mm;
  height: 38mm;
  border: 1px solid #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.foto-3x4-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-3x4-placeholder {
  font-size: 8pt;
  font-weight: bold;
  color: #94a3b8;
}

.foto-carimbo {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.85);
  color: #ffffff;
  font-size: 6.5pt;
  text-align: center;
  padding: 1px 0;
  font-weight: bold;
}

.aviso-portaria-print {
  padding: 4px 6px;
  font-size: 7.5pt;
  background-color: #fffbeb;
  border-top: 1px dashed #f59e0b;
  color: #92400e;
  line-height: 1.25;
}

.secao-assinaturas {
  margin-top: 8px;
}

.termo-texto {
  font-size: 7.5pt;
  text-align: justify;
  line-height: 1.3;
  padding: 4px 6px;
  color: #334155;
}

.data-cidade {
  font-size: 8pt;
  font-weight: 500;
  padding: 1px 6px;
}

.linhas-assinatura {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 6px 6px 6px;
}

.assinatura-bloco {
  flex: 1;
  text-align: center;
}

.linha-traco {
  border-top: 1px solid #000000;
  width: 85%;
  margin: 0 auto 3px auto;
}

.ass-cargo {
  font-size: 7.5pt;
  font-weight: bold;
  color: #000000;
}

.ass-doc {
  font-size: 7pt;
  color: #475569;
}

/* ==========================================================
   ESTILOS DE IMPRESSÃO OFICIAL (APENAS NA IMPRESSORA OU PDF)
   ========================================================== */
@media print {
  /* Oculta tudo que não faz parte do dossiê */
  body * {
    visibility: hidden !important;
  }

  /* Exibe exclusivamente a folha do dossiê */
  #dossie-imprimivel-oficial,
  #dossie-imprimivel-oficial * {
    visibility: visible !important;
  }

  #dossie-imprimivel-oficial {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    background: #ffffff !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .folha-a4-preview {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
  }

  .modal,
  .modal-dialog,
  .modal-content,
  .modal-body {
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }

  .modal-header,
  .modal-footer,
  .btn,
  .btn-close {
    display: none !important;
  }

  @page {
    size: A4 portrait;
    margin: 8mm 10mm 8mm 10mm;
  }

  .secao-box {
    page-break-inside: avoid !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .secao-titulo,
  .td-label,
  .tr-cabecalho th,
  .doc-title-bar,
  .print-registro-box,
  .alerta-alergia,
  .aviso-portaria-print {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
