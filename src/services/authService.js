// ============================================================================
// Auth Service - Serviço de autenticação
// ============================================================================

import { alunos, admins } from '../data/mockData';

const TOKEN_KEY = 'enade_token';
const USER_KEY = 'enade_user';

/**
 * Simula um atraso de rede para tornar a experiência mais realista
 */
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gera um token JWT falso para simulação
 */
const generateFakeToken = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 horas
    })
  );
  const signature = btoa(`fake_signature_${userId}_${Date.now()}`);
  return `${header}.${payload}.${signature}`;
};

/**
 * Normaliza CPF removendo formatação (pontos e traço)
 */
const normalizeCPF = (cpf) => cpf.replace(/\D/g, '');

/**
 * Realiza login com RA, CPF ou email
 * @param {string} identifier - RA, CPF ou email do usuário
 * @param {string} password - Senha do usuário (aceita qualquer senha no mock)
 * @returns {Promise<{ user: object, token: string }>}
 */
const login = async (identifier, password) => {
  await delay(800);

  if (!identifier || !password) {
    throw new Error('Identificador e senha são obrigatórios.');
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();
  const identifierDigits = identifier.replace(/\D/g, '');

  // Buscar nos alunos
  let user = alunos.find((aluno) => {
    // Busca por email
    if (aluno.email.toLowerCase() === normalizedIdentifier) return true;
    // Busca por RA
    if (aluno.ra === normalizedIdentifier || aluno.ra === identifierDigits) return true;
    // Busca por CPF (com ou sem formatação)
    if (normalizeCPF(aluno.cpf) === identifierDigits) return true;
    return false;
  });

  // Se não encontrou nos alunos, buscar nos admins
  if (!user) {
    user = admins.find((admin) => admin.email.toLowerCase() === normalizedIdentifier);
  }

  if (!user) {
    throw new Error('Usuário não encontrado. Verifique suas credenciais.');
  }

  const token = generateFakeToken(user.id);

  // Salvar no localStorage
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return {
    user: { ...user },
    token,
  };
};

/**
 * Registra um novo usuário
 * @param {object} userData - Dados do novo usuário
 * @returns {Promise<{ user: object, token: string }>}
 */
const register = async (userData) => {
  await delay(1000);

  const { nome, email, ra, cpf, faculdadeId, curso, semestre } = userData;

  // Validações básicas
  if (!nome || !email || !ra || !cpf) {
    throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
  }

  // Verificar duplicidade de email
  const emailExistente = alunos.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (emailExistente) {
    throw new Error('Este email já está cadastrado.');
  }

  // Verificar duplicidade de RA
  const raExistente = alunos.find((a) => a.ra === ra);
  if (raExistente) {
    throw new Error('Este RA já está cadastrado.');
  }

  // Verificar duplicidade de CPF
  const cpfExistente = alunos.find((a) => normalizeCPF(a.cpf) === normalizeCPF(cpf));
  if (cpfExistente) {
    throw new Error('Este CPF já está cadastrado.');
  }

  const newUser = {
    id: `aluno-${Date.now()}`,
    nome,
    email,
    ra,
    cpf,
    faculdadeId: faculdadeId || null,
    curso: curso || null,
    semestre: semestre || 1,
    role: 'student',
    avatar: null,
  };

  const token = generateFakeToken(newUser.id);

  // Salvar no localStorage
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));

  return {
    user: { ...newUser },
    token,
    message: 'Cadastro realizado com sucesso!',
  };
};

/**
 * Retorna o usuário atualmente autenticado a partir do localStorage
 * @returns {object|null}
 */
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    // Verificar se o token ainda é válido (simulação)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        // Token expirado
        logout();
        return null;
      }
    } catch {
      // Token malformado
      logout();
      return null;
    }

    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Retorna o token de autenticação atual
 * @returns {string|null}
 */
const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean}
 */
const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

/**
 * Verifica se o usuário atual é administrador
 * @returns {boolean}
 */
const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

/**
 * Realiza logout limpando os dados do localStorage
 */
const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Atualiza os dados do usuário no localStorage
 * @param {object} updatedData - Dados atualizados do usuário
 */
const updateCurrentUser = (updatedData) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const updatedUser = { ...currentUser, ...updatedData };
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  return updatedUser;
};

const authService = {
  login,
  register,
  getCurrentUser,
  getToken,
  isAuthenticated,
  isAdmin,
  logout,
  updateCurrentUser,
};

export default authService;
