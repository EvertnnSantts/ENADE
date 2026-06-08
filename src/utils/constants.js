// ============================================================================
// Constants - Constantes da aplicação
// ============================================================================

/**
 * Papéis de usuário
 */
export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

/**
 * Status de provas
 */
export const EXAM_STATUS = {
  DRAFT: 'rascunho',
  PUBLISHED: 'publicada',
  ARCHIVED: 'arquivada',
};

/**
 * Rótulos para status de provas
 */
export const EXAM_STATUS_LABELS = {
  [EXAM_STATUS.DRAFT]: 'Rascunho',
  [EXAM_STATUS.PUBLISHED]: 'Publicada',
  [EXAM_STATUS.ARCHIVED]: 'Arquivada',
};

/**
 * Tipos de questão
 */
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multipla_escolha',
  ESSAY: 'discursiva',
};

/**
 * Rótulos para tipos de questão
 */
export const QUESTION_TYPES_LABELS = {
  [QUESTION_TYPES.MULTIPLE_CHOICE]: 'Múltipla Escolha',
  [QUESTION_TYPES.ESSAY]: 'Discursiva',
};

/**
 * Níveis de dificuldade
 */
export const DIFFICULTY = {
  EASY: 'facil',
  MEDIUM: 'medio',
  HARD: 'dificil',
};

/**
 * Rótulos para níveis de dificuldade
 */
export const DIFFICULTY_LABELS = {
  [DIFFICULTY.EASY]: 'Fácil',
  [DIFFICULTY.MEDIUM]: 'Médio',
  [DIFFICULTY.HARD]: 'Difícil',
};

/**
 * Cores para níveis de dificuldade
 */
export const DIFFICULTY_COLORS = {
  [DIFFICULTY.EASY]: '#10b981',
  [DIFFICULTY.MEDIUM]: '#f59e0b',
  [DIFFICULTY.HARD]: '#ef4444',
};

/**
 * Categorias de questão
 */
export const CATEGORIES = {
  GENERAL: 'formacao_geral',
  SPECIFIC: 'componente_especifico',
};

/**
 * Rótulos para categorias
 */
export const CATEGORIES_LABELS = {
  [CATEGORIES.GENERAL]: 'Formação Geral',
  [CATEGORIES.SPECIFIC]: 'Componente Específico',
};

/**
 * Rotas da aplicação
 */
export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/cadastro',

  // Estudante
  DASHBOARD: '/dashboard',
  EXAMS: '/provas',
  EXAM_DETAIL: '/provas/:id',
  EXAM_TAKE: '/provas/:id/realizar',
  EXAM_RESULT: '/provas/:id/resultado',
  MY_RESULTS: '/meus-resultados',
  PROFILE: '/perfil',
  RANKING: '/ranking',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_EXAMS: '/admin/provas',
  ADMIN_EXAM_CREATE: '/admin/provas/nova',
  ADMIN_EXAM_EDIT: '/admin/provas/:id/editar',
  ADMIN_FACULDADES: '/admin/faculdades',
  ADMIN_FACULDADE_CREATE: '/admin/faculdades/nova',
  ADMIN_FACULDADE_EDIT: '/admin/faculdades/:id/editar',
  ADMIN_STUDENTS: '/admin/alunos',
  ADMIN_RESULTS: '/admin/resultados',
  ADMIN_RANKING: '/admin/ranking',
  ADMIN_SETTINGS: '/admin/configuracoes',
};

/**
 * Configurações de paginação
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
};

/**
 * Tempo limite de sessão (em milissegundos) - 24 horas
 */
export const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

/**
 * Chaves usadas no localStorage
 */
export const STORAGE_KEYS = {
  TOKEN: 'enade_token',
  USER: 'enade_user',
  THEME: 'enade_theme',
  SIDEBAR_COLLAPSED: 'enade_sidebar_collapsed',
};

/**
 * Mensagens comuns reutilizáveis
 */
export const MESSAGES = {
  ERROR_GENERIC: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
  ERROR_NETWORK: 'Erro de conexão. Verifique sua internet.',
  ERROR_UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  ERROR_FORBIDDEN: 'Você não tem permissão para acessar este recurso.',
  ERROR_NOT_FOUND: 'Recurso não encontrado.',
  SUCCESS_SAVE: 'Dados salvos com sucesso!',
  SUCCESS_DELETE: 'Item removido com sucesso!',
  SUCCESS_UPDATE: 'Dados atualizados com sucesso!',
  CONFIRM_DELETE: 'Tem certeza que deseja remover este item? Esta ação não pode ser desfeita.',
};

export default {
  ROLES,
  EXAM_STATUS,
  EXAM_STATUS_LABELS,
  QUESTION_TYPES,
  QUESTION_TYPES_LABELS,
  DIFFICULTY,
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  CATEGORIES,
  CATEGORIES_LABELS,
  ROUTES,
  PAGINATION,
  SESSION_TIMEOUT,
  STORAGE_KEYS,
  MESSAGES,
};
