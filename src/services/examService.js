// ============================================================================
// Exam Service - Serviço de provas e avaliações
// ============================================================================

import { provas, questoes, resultados } from '../data/mockData';

/**
 * Simula um atraso de rede
 */
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retorna todas as provas disponíveis
 * @param {object} filters - Filtros opcionais (ano, area, status)
 * @returns {Promise<Array>}
 */
const getExams = async (filters = {}) => {
  await delay(600);

  let resultado = [...provas];

  if (filters.ano) {
    resultado = resultado.filter((p) => p.ano === Number(filters.ano));
  }

  if (filters.area) {
    resultado = resultado.filter((p) =>
      p.area.toLowerCase().includes(filters.area.toLowerCase())
    );
  }

  if (filters.status) {
    resultado = resultado.filter((p) => p.status === filters.status);
  }

  return resultado;
};

/**
 * Retorna uma prova específica pelo ID com suas questões
 * @param {string} id - ID da prova
 * @returns {Promise<object>}
 */
const getExamById = async (id) => {
  await delay(400);

  const prova = provas.find((p) => p.id === id);
  if (!prova) {
    throw new Error('Prova não encontrada.');
  }

  const questoesDaProva = questoes
    .filter((q) => q.provaId === id)
    .sort((a, b) => a.numero - b.numero);

  return {
    ...prova,
    questoes: questoesDaProva,
  };
};

/**
 * Submete as respostas de uma prova e calcula a pontuação
 * @param {string} examId - ID da prova
 * @param {object} answers - Objeto com as respostas { questaoId: resposta }
 * @param {number} tempoGasto - Tempo gasto em segundos
 * @returns {Promise<object>}
 */
const submitExam = async (examId, answers, tempoGasto = 0) => {
  await delay(1200);

  const prova = provas.find((p) => p.id === examId);
  if (!prova) {
    throw new Error('Prova não encontrada.');
  }

  const questoesDaProva = questoes.filter((q) => q.provaId === examId);

  let acertos = 0;
  let erros = 0;
  let emBranco = 0;
  let pontosObtidos = 0;
  let pontosTotais = 0;

  const detalhes = questoesDaProva.map((questao) => {
    pontosTotais += questao.pontos;
    const resposta = answers[questao.id];

    if (questao.tipo === 'multipla_escolha') {
      if (!resposta) {
        emBranco++;
        return { questaoId: questao.id, status: 'em_branco', pontosObtidos: 0 };
      }

      const alternativaCorreta = questao.alternativas.find((a) => a.correta);
      if (resposta === alternativaCorreta?.letra) {
        acertos++;
        pontosObtidos += questao.pontos;
        return { questaoId: questao.id, status: 'correta', pontosObtidos: questao.pontos };
      } else {
        erros++;
        return { questaoId: questao.id, status: 'incorreta', pontosObtidos: 0 };
      }
    }

    // Questões discursivas — pontuação parcial simulada
    if (questao.tipo === 'discursiva') {
      if (!resposta || resposta.trim().length === 0) {
        emBranco++;
        return { questaoId: questao.id, status: 'em_branco', pontosObtidos: 0 };
      }

      // Simular pontuação com base no tamanho da resposta
      const palavras = resposta.trim().split(/\s+/).length;
      let percentual = Math.min(palavras / 150, 1); // 150 palavras = pontuação máxima
      percentual = Math.max(percentual, 0.3); // Mínimo 30% se respondeu algo
      const pontos = Math.round(questao.pontos * percentual * 10) / 10;

      pontosObtidos += pontos;
      acertos++; // Conta como respondida
      return { questaoId: questao.id, status: 'avaliada', pontosObtidos: pontos };
    }

    return { questaoId: questao.id, status: 'desconhecido', pontosObtidos: 0 };
  });

  const nota = pontosTotais > 0 ? Math.round((pontosObtidos / pontosTotais) * 1000) / 10 : 0;

  const resultado = {
    id: `res-${Date.now()}`,
    alunoId: null, // Será preenchido pelo contexto de autenticação
    provaId: examId,
    nota,
    acertos,
    erros,
    emBranco,
    tempoGasto,
    pontosObtidos,
    pontosTotais,
    detalhes,
    realizadaEm: new Date().toISOString(),
  };

  return resultado;
};

/**
 * Retorna os resultados de um estudante específico
 * @param {string} studentId - ID do estudante
 * @returns {Promise<Array>}
 */
const getResults = async (studentId) => {
  await delay(500);

  const resultadosDoAluno = resultados
    .filter((r) => r.alunoId === studentId)
    .map((resultado) => {
      const prova = provas.find((p) => p.id === resultado.provaId);
      return {
        ...resultado,
        prova: prova
          ? { titulo: prova.titulo, area: prova.area, ano: prova.ano }
          : null,
      };
    })
    .sort((a, b) => new Date(b.realizadaEm) - new Date(a.realizadaEm));

  return resultadosDoAluno;
};

/**
 * Retorna todos os resultados (para administradores)
 * @param {object} filters - Filtros opcionais
 * @returns {Promise<Array>}
 */
const getAllResults = async (filters = {}) => {
  await delay(600);

  let resultado = [...resultados];

  if (filters.provaId) {
    resultado = resultado.filter((r) => r.provaId === filters.provaId);
  }

  if (filters.alunoId) {
    resultado = resultado.filter((r) => r.alunoId === filters.alunoId);
  }

  return resultado.map((r) => {
    const prova = provas.find((p) => p.id === r.provaId);
    return {
      ...r,
      prova: prova ? { titulo: prova.titulo, area: prova.area, ano: prova.ano } : null,
    };
  });
};

/**
 * Retorna estatísticas gerais de uma prova
 * @param {string} examId - ID da prova
 * @returns {Promise<object>}
 */
const getExamStats = async (examId) => {
  await delay(400);

  const resultadosDaProva = resultados.filter((r) => r.provaId === examId);

  if (resultadosDaProva.length === 0) {
    return {
      totalParticipantes: 0,
      mediaGeral: 0,
      maiorNota: 0,
      menorNota: 0,
      medianaNotas: 0,
      taxaAprovacao: 0,
    };
  }

  const notas = resultadosDaProva.map((r) => r.nota).sort((a, b) => a - b);
  const soma = notas.reduce((acc, n) => acc + n, 0);

  return {
    totalParticipantes: resultadosDaProva.length,
    mediaGeral: Math.round((soma / notas.length) * 10) / 10,
    maiorNota: notas[notas.length - 1],
    menorNota: notas[0],
    medianaNotas: notas[Math.floor(notas.length / 2)],
    taxaAprovacao: Math.round((notas.filter((n) => n >= 60).length / notas.length) * 1000) / 10,
  };
};

const examService = {
  getExams,
  getExamById,
  submitExam,
  getResults,
  getAllResults,
  getExamStats,
};

export default examService;
