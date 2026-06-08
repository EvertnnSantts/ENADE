import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getInitials } from '../../utils/formatters';
import { User, Mail, Shield, Building, GraduationCap, Lock, Award, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Estados para troca de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const userFaculdade = mockData.faculdades.find(f => f.id === user?.faculdadeId) || mockData.faculdades[0];

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const tempErrors = {};

    if (!currentPassword) tempErrors.currentPassword = 'Senha atual é obrigatória';
    if (!newPassword) {
      tempErrors.newPassword = 'Nova senha é obrigatória';
    } else if (newPassword.length < 6) {
      tempErrors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (newPassword !== confirmPassword) {
      tempErrors.confirmPassword = 'As senhas não conferem';
    }

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success('Senha atualizada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  return (
    <div className="profile-page animate-fadeIn">
      <div className="profile-grid">
        {/* Painel Esquerdo - Avatar & Info Geral */}
        <div className="profile-sidebar-panel">
          <Card className="profile-header-card text-center">
            <div className="profile-avatar-large">
              {user ? getInitials(user.nome) : 'U'}
            </div>
            <h3 className="profile-name">{user?.nome || 'Estudante'}</h3>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-badge-role">
              Alunos ENADE
            </div>
          </Card>

          <Card className="profile-summary-stats">
            <h4 className="card-title">Resumo de Atividades</h4>
            <div className="summary-stat-item">
              <FileText size={18} />
              <span>Simulados Realizados:</span>
              <strong>{mockData.resultados.filter(r => r.alunoId === user?.id || r.alunoId === 'student-1').length}</strong>
            </div>
            <div className="summary-stat-item">
              <Award size={18} />
              <span>Semestre Atual:</span>
              <strong>{user?.semestre || '8'}º Semestre</strong>
            </div>
          </Card>
        </div>

        {/* Painel Direito - Detalhes Cadastrais & Alteração de Senha */}
        <div className="profile-content-panel">
          <Card className="profile-details-card" title="Dados Cadastrais">
            <div className="details-header">
              <h4>Informações Acadêmicas</h4>
              <p>Estes dados são fornecidos pela instituição e integrados ao ENADE.</p>
            </div>
            
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Nome Completo</span>
                <span className="value">{user?.nome}</span>
              </div>
              <div className="detail-item">
                <span className="label">Registro Acadêmico (RA)</span>
                <span className="value">{user?.ra}</span>
              </div>
              <div className="detail-item">
                <span className="label">CPF</span>
                <span className="value">***.***.{user?.cpf ? user.cpf.split('-')[1] || 'XXX-XX' : 'XXX-XX'}</span>
              </div>
              <div className="detail-item">
                <span className="label">E-mail Cadastrado</span>
                <span className="value">{user?.email}</span>
              </div>
              <div className="detail-item col-span-2">
                <span className="label">Instituição de Ensino</span>
                <span className="value">{userFaculdade ? `${userFaculdade.sigla} - ${userFaculdade.nome}` : 'N/A'}</span>
              </div>
              <div className="detail-item col-span-2">
                <span className="label">Curso de Graduação</span>
                <span className="value">{user?.curso}</span>
              </div>
            </div>
          </Card>

          <Card className="profile-password-card">
            <div className="password-header">
              <Lock size={18} className="text-primary" />
              <h4>Alterar Senha de Acesso</h4>
            </div>

            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-row">
                <Input
                  type="password"
                  label="Senha Atual"
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={errors.currentPassword}
                  required
                />
              </div>

              <div className="form-row-2col">
                <Input
                  type="password"
                  label="Nova Senha"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={errors.newPassword}
                  required
                />
                <Input
                  type="password"
                  label="Confirmar Nova Senha"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  required
                />
              </div>

              <div className="form-actions-row">
                <Button 
                  type="submit" 
                  variant="primary"
                  loading={loading}
                >
                  Atualizar Senha
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
