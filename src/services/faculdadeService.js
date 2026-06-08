// ============================================================================
// Faculdade Service - Serviço de gerenciamento de faculdades
// ============================================================================

import { faculdades, cursos, alunos } from '../data/mockData';

/**
 * Simula um atraso de rede
 */
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Cópia local mutável dos dados para simular CRUD
let faculdadesData = [...faculdades];

/**
 * Retorna todas as faculdades
 * @param {object} filters - Filtros opcionais (estado, ativo, busca)
 * @returns {Promise<Array>}
 */
const getFaculdades = async (filters = {}) => {
  await delay(500);

  let resultado = [...faculdadesData];

  if (filters.estado) {
    resultado = resultado.filter((f) => f.estado === filters.estado);
  }

  if (filters.ativo !== undefined) {
    resultado = resultado.filter((f) => f.ativo === filters.ativo);
  }

  if (filters.busca) {
    const termo = filters.busca.toLowerCase();
    resultado = resultado.filter(
      (f) =>
        f.nome.toLowerCase().includes(termo) ||
        f.sigla.toLowerCase().includes(termo) ||
        f.cidade.toLowerCase().includes(termo)
    );
  }

  // Enriquecer com dados adicionais
  return resultado.map((fac) => ({
    ...fac,
    cursosDetalhes: fac.cursos
      .map((cursoId) => cursos.find((c) => c.id === cursoId))
      .filter(Boolean),
    alunosCount: alunos.filter((a) => a.faculdadeId === fac.id).length,
  }));
};

/**
 * Retorna uma faculdade específica pelo ID
 * @param {string} id - ID da faculdade
 * @returns {Promise<object>}
 */
const getFaculdadeById = async (id) => {
  await delay(400);

  const faculdade = faculdadesData.find((f) => f.id === id);
  if (!faculdade) {
    throw new Error('Faculdade não encontrada.');
  }

  const cursosDetalhes = faculdade.cursos
    .map((cursoId) => cursos.find((c) => c.id === cursoId))
    .filter(Boolean);

  const alunosDaFaculdade = alunos.filter((a) => a.faculdadeId === id);

  return {
    ...faculdade,
    cursosDetalhes,
    alunos: alunosDaFaculdade,
    alunosCount: alunosDaFaculdade.length,
  };
};

/**
 * Cria uma nova faculdade
 * @param {object} data - Dados da faculdade
 * @returns {Promise<object>}
 */
const createFaculdade = async (data) => {
  await delay(800);

  const { nome, sigla, cidade, estado, cursos: cursosIds } = data;

  if (!nome || !sigla || !cidade || !estado) {
    throw new Error('Nome, sigla, cidade e estado são obrigatórios.');
  }

  // Verificar duplicidade de sigla
  const siglaExistente = faculdadesData.find(
    (f) => f.sigla.toLowerCase() === sigla.toLowerCase()
  );
  if (siglaExistente) {
    throw new Error('Já existe uma faculdade com esta sigla.');
  }

  const novaFaculdade = {
    id: `fac-${Date.now()}`,
    nome,
    sigla: sigla.toUpperCase(),
    cidade,
    estado,
    cursos: cursosIds || [],
    notaMedia: 0,
    totalAlunos: 0,
    ativo: true,
  };

  faculdadesData.push(novaFaculdade);

  return {
    ...novaFaculdade,
    message: 'Faculdade criada com sucesso!',
  };
};

/**
 * Atualiza uma faculdade existente
 * @param {string} id - ID da faculdade
 * @param {object} data - Dados atualizados
 * @returns {Promise<object>}
 */
const updateFaculdade = async (id, data) => {
  await delay(600);

  const index = faculdadesData.findIndex((f) => f.id === id);
  if (index === -1) {
    throw new Error('Faculdade não encontrada.');
  }

  // Verificar duplicidade de sigla (excluindo a própria faculdade)
  if (data.sigla) {
    const siglaExistente = faculdadesData.find(
      (f) => f.sigla.toLowerCase() === data.sigla.toLowerCase() && f.id !== id
    );
    if (siglaExistente) {
      throw new Error('Já existe outra faculdade com esta sigla.');
    }
  }

  faculdadesData[index] = {
    ...faculdadesData[index],
    ...data,
    id, // Garantir que o ID não mude
  };

  return {
    ...faculdadesData[index],
    message: 'Faculdade atualizada com sucesso!',
  };
};

/**
 * Remove uma faculdade (soft delete - marca como inativa)
 * @param {string} id - ID da faculdade
 * @returns {Promise<object>}
 */
const deleteFaculdade = async (id) => {
  await delay(600);

  const index = faculdadesData.findIndex((f) => f.id === id);
  if (index === -1) {
    throw new Error('Faculdade não encontrada.');
  }

  // Verificar se existem alunos vinculados
  const alunosVinculados = alunos.filter((a) => a.faculdadeId === id);
  if (alunosVinculados.length > 0) {
    throw new Error(
      `Não é possível remover esta faculdade. Existem ${alunosVinculados.length} aluno(s) vinculado(s).`
    );
  }

  faculdadesData[index] = {
    ...faculdadesData[index],
    ativo: false,
  };

  return {
    message: 'Faculdade desativada com sucesso!',
  };
};

/**
 * Retorna os cursos disponíveis
 * @returns {Promise<Array>}
 */
const getCursos = async () => {
  await delay(300);
  return [...cursos];
};

/**
 * Reseta os dados para o estado original (útil para testes)
 */
const resetData = () => {
  faculdadesData = [...faculdades];
};

const faculdadeService = {
  getFaculdades,
  getFaculdadeById,
  createFaculdade,
  updateFaculdade,
  deleteFaculdade,
  getCursos,
  resetData,
};

export default faculdadeService;
