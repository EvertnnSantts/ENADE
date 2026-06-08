// ============================================================================
// Formatters - Utilitários de formatação
// ============================================================================

/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa)
 * @param {string|Date} date - Data a ser formatada
 * @param {object} options - Opções adicionais de formatação
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '—';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '—';

    const defaultOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...options,
    };

    return dateObj.toLocaleDateString('pt-BR', defaultOptions);
  } catch {
    return '—';
  }
};

/**
 * Formata uma data com horário (dd/mm/aaaa às HH:MM)
 * @param {string|Date} date - Data a ser formatada
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return '—';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return '—';

    const data = dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const hora = dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${data} às ${hora}`;
  } catch {
    return '—';
  }
};

/**
 * Formata segundos no formato HH:MM:SS
 * @param {number} seconds - Tempo em segundos
 * @returns {string}
 */
export const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined || seconds < 0) return '00:00:00';

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':');
};

/**
 * Formata segundos no formato mais legível (ex: "2h 15min")
 * @param {number} seconds - Tempo em segundos
 * @returns {string}
 */
export const formatTimeReadable = (seconds) => {
  if (seconds === null || seconds === undefined || seconds < 0) return '0min';

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}min`;
  return `${Math.floor(seconds)}s`;
};

/**
 * Formata uma nota com uma casa decimal
 * @param {number} nota - Nota a ser formatada (0-100)
 * @returns {string}
 */
export const formatNota = (nota) => {
  if (nota === null || nota === undefined) return '—';
  return Number(nota).toFixed(1);
};

/**
 * Formata um valor como percentual
 * @param {number} value - Valor a ser formatado (0-100 ou 0-1)
 * @param {boolean} isDecimal - Se true, trata como 0-1, senão como 0-100
 * @returns {string}
 */
export const formatPercent = (value, isDecimal = false) => {
  if (value === null || value === undefined) return '—';
  const percent = isDecimal ? value * 100 : value;
  return `${percent.toFixed(1)}%`;
};

/**
 * Extrai as iniciais de um nome (primeira letra do primeiro e último nome)
 * @param {string} name - Nome completo
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return '??';

  const partes = name.trim().split(/\s+/).filter(Boolean);

  if (partes.length === 0) return '??';
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();

  const primeira = partes[0].charAt(0);
  const ultima = partes[partes.length - 1].charAt(0);

  return `${primeira}${ultima}`.toUpperCase();
};

/**
 * Formata um número grande com separador de milhar (pt-BR)
 * @param {number} value - Número a ser formatado
 * @returns {string}
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('pt-BR');
};

/**
 * Retorna uma descrição relativa de tempo (ex: "há 2 dias")
 * @param {string|Date} date - Data de referência
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '—';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '—';

    const now = new Date();
    const diffMs = now - dateObj;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'agora mesmo';
    if (diffMinutes < 60) return `há ${diffMinutes} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 30) return `há ${diffDays} dias`;
    if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`;
    return `há ${Math.floor(diffDays / 365)} anos`;
  } catch {
    return '—';
  }
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatTimeReadable,
  formatNota,
  formatPercent,
  getInitials,
  formatNumber,
  formatRelativeTime,
};
