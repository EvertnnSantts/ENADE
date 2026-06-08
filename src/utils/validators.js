// ============================================================================
// Validators - Utilitários de validação
// ============================================================================

/**
 * Valida um CPF completo usando o algoritmo oficial de verificação
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {boolean}
 */
export const validateCPF = (cpf) => {
  if (!cpf) return false;

  // Remover caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Deve ter exatamente 11 dígitos
  if (cpfLimpo.length !== 11) return false;

  // Rejeitar CPFs com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  // Validar primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) return false;

  // Validar segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) return false;

  return true;
};

/**
 * Valida um endereço de email
 * @param {string} email - Email a ser validado
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
};

/**
 * Valida um Registro Acadêmico (RA)
 * Formato esperado: mínimo 6 dígitos numéricos
 * @param {string} ra - RA a ser validado
 * @returns {boolean}
 */
export const validateRA = (ra) => {
  if (!ra) return false;
  const raLimpo = ra.replace(/\D/g, '');
  return raLimpo.length >= 6 && raLimpo.length <= 12;
};

/**
 * Formata um CPF para o padrão 000.000.000-00
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {string}
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return cpf;
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Máscara de CPF para input — aplica formatação conforme o usuário digita
 * @param {string} value - Valor atual do input
 * @returns {string}
 */
export const maskCPF = (value) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

/**
 * Valida se uma senha atende aos requisitos mínimos
 * @param {string} password - Senha a ser validada
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    return { valid: false, errors: ['A senha é obrigatória.'] };
  }

  if (password.length < 6) {
    errors.push('A senha deve ter pelo menos 6 caracteres.');
  }

  if (password.length > 128) {
    errors.push('A senha deve ter no máximo 128 caracteres.');
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra.');
  }

  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Valida um nome completo (pelo menos dois nomes)
 * @param {string} nome - Nome a ser validado
 * @returns {boolean}
 */
export const validateNome = (nome) => {
  if (!nome) return false;
  const partes = nome.trim().split(/\s+/);
  return partes.length >= 2 && partes.every((p) => p.length >= 2);
};

export default {
  validateCPF,
  validateEmail,
  validateRA,
  formatCPF,
  maskCPF,
  validatePassword,
  validateNome,
};
