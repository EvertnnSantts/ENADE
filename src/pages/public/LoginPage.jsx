import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Eye, EyeOff, User, GraduationCap, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import './LoginPage.css';

// Importamos mockData diretamente
import * as mockData from '../../data/mockData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('student'); // 'student' ou 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Campos do formulário
  const [identifier, setIdentifier] = useState(''); // RA, CPF ou E-mail
  const [password, setPassword] = useState('');

  // Mensagens de erro simples
  const [errors, setErrors] = useState({});

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIdentifier('');
    setPassword('');
    setErrors({});
  };

  const validate = () => {
    const tempErrors = {};
    if (!identifier.trim()) {
      tempErrors.identifier = activeTab === 'student' 
        ? 'RA ou CPF é obrigatório' 
        : 'E-mail é obrigatório';
    }
    if (!password) {
      tempErrors.password = 'Senha é obrigatória';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // Pequena simulação de delay de rede
    setTimeout(() => {
      let foundUser = null;

      if (activeTab === 'student') {
        // Aluno: busca por RA ou CPF limpo
        const cleanId = identifier.replace(/\D/g, ''); // Remove máscara
        foundUser = mockData.alunos.find(
          a => a.ra === identifier || a.cpf.replace(/\D/g, '') === cleanId
        );
      } else {
        // Admin: busca por e-mail
        foundUser = mockData.admins.find(
          a => a.email.toLowerCase() === identifier.toLowerCase().trim()
        );
      }

      setLoading(false);

      if (foundUser) {
        // Login sucesso (qualquer senha é aceita para demonstração)
        login(foundUser);
        toast.success(`Bem-vindo, ${foundUser.nome}!`);
        
        if (foundUser.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        // Credenciais inválidas
        toast.error('Usuário não encontrado. Verifique os dados inseridos.');
        setErrors({
          identifier: activeTab === 'student' 
            ? 'RA ou CPF não cadastrado' 
            : 'E-mail não cadastrado'
        });
      }
    }, 800);
  };

  return (
    <div className="login-page container">
      <div className="login-grid">
        {/* Lado Esquerdo - Info/Branding */}
        <div className="login-info-panel hide-mobile">
          <div className="info-brand">
            <GraduationCap size={40} />
            <h2>ENADE</h2>
          </div>
          <div className="info-slogan">
            <h3>Preparação oficial com foco no seu desempenho</h3>
            <p>
              Pratique simulados cronometrados, acompanhe sua evolução e analise o ranking nacional das universidades.
            </p>
          </div>
          <div className="info-footer">
            <p>Simulador Nacional de Graduação Superior</p>
          </div>
        </div>

        {/* Lado Direito - Form de Login */}
        <div className="login-form-panel">
          <Card className="login-card glass-heavy animate-fadeIn" variant="glass">
            <div className="login-card-header">
              <h3>Entrar no Sistema</h3>
              <p>Escolha sua modalidade e insira suas credenciais</p>
            </div>

            {/* Abas Aluno / Admin */}
            <div className="login-tabs">
              <button 
                type="button"
                className={`login-tab ${activeTab === 'student' ? 'active' : ''}`}
                onClick={() => handleTabChange('student')}
              >
                Sou Aluno
              </button>
              <button 
                type="button"
                className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => handleTabChange('admin')}
              >
                Sou Instituição / Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Input
                label={activeTab === 'student' ? 'RA ou CPF (apenas números)' : 'E-mail Institucional'}
                placeholder={activeTab === 'student' ? 'Ex: 123456 ou 12345678909' : 'nome@instituicao.org.br'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                error={errors.identifier}
                required
              />

              <div className="password-input-wrapper">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="Senha de Acesso"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="login-action-row">
                <div className="forgot-password">
                  <a href="#">Esqueceu a senha?</a>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                loading={loading}
              >
                Entrar na Plataforma
              </Button>
            </form>

            <div className="login-card-footer">
              {activeTab === 'student' ? (
                <p>
                  Não tem conta de estudante? <Link to="/register">Cadastre-se aqui</Link>
                </p>
              ) : (
                <p className="admin-hint">
                  <ShieldAlert size={14} />
                  Contas institucionais são pré-cadastradas pela central do ENADE.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
