// ============================================================================
// Ranking Service - Serviço de ranking de faculdades
// ============================================================================

import { faculdades, alunos, resultados, provas } from '../data/mockData';

/**
 * Simula um atraso de rede
 */
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calcula o ranking geral das faculdades com base nas notas médias dos alunos
 * @param {object} filters - Filtros opcionais (ano, provaId)
 * @returns {Promise<Array>}
 */
const getRanking = async (filters = {}) => {
  await delay(700);

  let resultadosFiltrados = [...resultados];

  if (filters.ano) {
    const provasDoAno = provas
      .filter((p) => p.ano === Number(filters.ano))
      .map((p) => p.id);
    resultadosFiltrados = resultadosFiltrados.filter((r) =>
      provasDoAno.includes(r.provaId)
    );
  }

  if (filters.provaId) {
    resultadosFiltrados = resultadosFiltrados.filter(
      (r) => r.provaId === filters.provaId
    );
  }

  const ranking = faculdades
    .filter((f) => f.ativo)
    .map((faculdade) => {
      // Encontrar alunos desta faculdade
      const alunosDaFaculdade = alunos
        .filter((a) => a.faculdadeId === faculdade.id)
        .map((a) => a.id);

      // Encontrar resultados destes alunos
      const resultadosDaFaculdade = resultadosFiltrados.filter((r) =>
        alunosDaFaculdade.includes(r.alunoId)
      );

      if (resultadosDaFaculdade.length === 0) {
        return null;
      }

      const notas = resultadosDaFaculdade.map((r) => r.nota);
      const somaNotas = notas.reduce((acc, n) => acc + n, 0);
      const mediaNotas = Math.round((somaNotas / notas.length) * 10) / 10;
      const maiorNota = Math.max(...notas);
      const menorNota = Math.min(...notas);

      return {
        faculdadeId: faculdade.id,
        faculdade: faculdade.nome,
        sigla: faculdade.sigla,
        cidade: faculdade.cidade,
        estado: faculdade.estado,
        mediaNotas,
        maiorNota,
        menorNota,
        totalParticipantes: resultadosDaFaculdade.length,
        totalAlunos: faculdade.totalAlunos,
        notaMedia: faculdade.notaMedia,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.mediaNotas - a.mediaNotas)
    .map((item, index) => ({
      ...item,
      posicao: index + 1,
      variacao: 0, // Placeholder para variação de posição
    }));

  return ranking;
};

/**
 * Calcula o ranking filtrado por curso
 * @param {string} curso - Nome do curso para filtrar
 * @param {object} filters - Filtros adicionais (ano)
 * @returns {Promise<Array>}
 */
const getRankingByCurso = async (curso, filters = {}) => {
  await delay(700);

  let resultadosFiltrados = [...resultados];

  if (filters.ano) {
    const provasDoAno = provas
      .filter((p) => p.ano === Number(filters.ano))
      .map((p) => p.id);
    resultadosFiltrados = resultadosFiltrados.filter((r) =>
      provasDoAno.includes(r.provaId)
    );
  }

  // Filtrar alunos do curso específico
  const alunosDoCurso = alunos.filter(
    (a) => a.curso.toLowerCase() === curso.toLowerCase()
  );

  const ranking = faculdades
    .filter((f) => f.ativo)
    .map((faculdade) => {
      // Alunos do curso nesta faculdade
      const alunosDaFaculdade = alunosDoCurso
        .filter((a) => a.faculdadeId === faculdade.id)
        .map((a) => a.id);

      if (alunosDaFaculdade.length === 0) return null;

      // Resultados dos alunos do curso nesta faculdade
      const resultadosDaFaculdade = resultadosFiltrados.filter((r) =>
        alunosDaFaculdade.includes(r.alunoId)
      );

      if (resultadosDaFaculdade.length === 0) return null;

      const notas = resultadosDaFaculdade.map((r) => r.nota);
      const somaNotas = notas.reduce((acc, n) => acc + n, 0);
      const mediaNotas = Math.round((somaNotas / notas.length) * 10) / 10;

      return {
        faculdadeId: faculdade.id,
        faculdade: faculdade.nome,
        sigla: faculdade.sigla,
        cidade: faculdade.cidade,
        estado: faculdade.estado,
        curso,
        mediaNotas,
        maiorNota: Math.max(...notas),
        menorNota: Math.min(...notas),
        totalParticipantes: resultadosDaFaculdade.length,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.mediaNotas - a.mediaNotas)
    .map((item, index) => ({
      ...item,
      posicao: index + 1,
    }));

  return ranking;
};

/**
 * Retorna os anos disponíveis para consulta de ranking
 * @returns {Promise<Array<number>>}
 */
const getAnosDisponiveis = async () => {
  await delay(200);
  const anos = [...new Set(provas.map((p) => p.ano))].sort((a, b) => b - a);
  return anos;
};

/**
 * Retorna os cursos disponíveis para filtro de ranking
 * @returns {Promise<Array<string>>}
 */
const getCursosDisponiveis = async () => {
  await delay(200);
  const cursosUnicos = [...new Set(alunos.map((a) => a.curso))].sort();
  return cursosUnicos;
};

const rankingService = {
  getRanking,
  getRankingByCurso,
  getAnosDisponiveis,
  getCursosDisponiveis,
};

export default rankingService;
