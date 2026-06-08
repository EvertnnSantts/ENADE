// ============================================================================
// API Base - Configuração base para chamadas HTTP
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Classe de erro personalizada para respostas da API
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Obtém os headers padrão para requisições, incluindo token de autenticação
 */
const getHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  const token = localStorage.getItem('enade_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Processa a resposta da API e lida com erros
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // Resposta sem corpo JSON
    }

    const message = errorData?.message || errorData?.erro || `Erro na requisição: ${response.status}`;
    throw new ApiError(message, response.status, errorData);
  }

  // Resposta sem conteúdo (204 No Content)
  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};

/**
 * Realiza uma requisição GET
 * @param {string} endpoint - Caminho do endpoint (ex: '/provas')
 * @param {object} params - Query parameters opcionais
 * @returns {Promise<any>}
 */
const get = async (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  });

  return handleResponse(response);
};

/**
 * Realiza uma requisição POST
 * @param {string} endpoint - Caminho do endpoint
 * @param {object} data - Corpo da requisição
 * @returns {Promise<any>}
 */
const post = async (endpoint, data = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

/**
 * Realiza uma requisição PUT
 * @param {string} endpoint - Caminho do endpoint
 * @param {object} data - Corpo da requisição
 * @returns {Promise<any>}
 */
const put = async (endpoint, data = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

/**
 * Realiza uma requisição DELETE
 * @param {string} endpoint - Caminho do endpoint
 * @returns {Promise<any>}
 */
const del = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  return handleResponse(response);
};

/**
 * Realiza uma requisição PATCH
 * @param {string} endpoint - Caminho do endpoint
 * @param {object} data - Corpo da requisição
 * @returns {Promise<any>}
 */
const patch = async (endpoint, data = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

const api = {
  get,
  post,
  put,
  delete: del,
  patch,
  API_BASE_URL,
  ApiError,
};

export { API_BASE_URL, ApiError };
export default api;
