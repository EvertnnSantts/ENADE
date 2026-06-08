import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import * as mockData from '../../data/mockData';
import { validateCPF, validateEmail, validateRA, formatCPF } from '../../utils/validators';
import { GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ra, setRa] = useState('');
  const [cpf, setCpf] = useState('');
  const [faculdadeId, setFaculdadeId] = useState('');
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Cursos disponíveis com base na faculdade selecionada
  const [cursosDisponiveis, setCursosDisponiveis] = useState([]);
  const [errors, setErrors] = useState({});

  // Atualizar cursos disponíveis ao mudar a faculdade
  useEffect(() => {
    if (faculdadeId) {
      const facul = mockData.faculdades.find(f => f.id === faculdadeId);
      if (facul) {
        // Resolve os IDs de cursos para os seus respectivos nomes
        const resolved = (facul.cursos || []).map(cId => {
          const c = mockData.cursos.find(item => item.id === cId);
          return c ? c.nome : cId;
        });
        setCursosDisponiveis(resolved);
      } else {
        setCursosDisponiveis([]);
      }
    } else {
      setCursosDisponiveis([]);
    }
    setCurso(''); // Reset do curso
  }, [faculdadeId]);

  // Aplicar máscara de CPF enquanto digita
  const handleCpfChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '').substring(0, 11);
    setCpf(formatCPF(cleanValue));
  };

  const validate = () => {
    const tempErrors = {};
    if (!nome.trim()) tempErrors.nome = 'Nome completo é obrigatório';
    
    if (!email.trim()) {
      tempErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(email)) {
      tempErrors.email = 'E-mail inválido';
    }

    if (!ra.trim()) {
      tempErrors.ra = 'Registro Acadêmico (RA) é obrigatório';
    } else if (!validateRA(ra)) {
      tempErrors.ra = 'RA inválido (mínimo 4 caracteres alfanuméricos)';
    }

    if (!cpf.trim()) {
      tempErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(cpf)) {
      tempErrors.cpf = 'CPF inválido';
    }

    if (!faculdadeId) tempErrors.faculdadeId = 'Selecione sua faculdade/universidade';
    if (!curso) tempErrors.curso = 'Selecione seu curso';
    if (!semestre) tempErrors.semestre = 'Selecione seu semestre';
    
    if (!senha) {
      tempErrors.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      tempErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (senha !== confirmarSenha) {
      tempErrors.confirmarSenha = 'As senhas não conferem';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Preencha corretamente todos os campos do formulário.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Registrar estudante
      const selectedFacul = mockData.faculdades.find(f => f.id === faculdadeId);
      
      const newStudent = {
        nome,
        email,
        ra,
        cpf,
        faculdadeId,
        faculdadeNome: selectedFacul ? selectedFacul.nome : '',
        curso,
        semestre: parseInt(semestre),
        role: 'student'
      };

      // Adicionar aos alunos mockados localmente
      mockData.alunos.push(newStudent);

      // Efetuar login no context
      register(newStudent);
      setLoading(false);
      toast.success('Cadastro concluído com sucesso!');
      navigate('/student/dashboard');
    }, 1000);
  };

  // Mapeamento de faculdades para o dropdown
  const faculdadeOptions = mockData.faculdades
    .filter(f => f.ativo)
    .map(f => ({ value: f.id, label: `${f.sigla} - ${f.nome}` }));

  // Mapeamento de semestres para o dropdown
  const semestreOptions = Array.from({ length: 10 }).map((_, i) => ({
    value: String(i + 1),
    label: `${i + 1}º Semestre`
  }));

  // Mapeamento de cursos filtrados
  const cursoOptions = cursosDisponiveis.map(c => ({ value: c, label: c }));

  return (
    <div className="register-page container">
      <div className="register-grid">
        {/* Lado Esquerdo - Info */}
        <div className="register-info-panel hide-mobile">
          <div className="info-brand">
            <GraduationCap size={40} />
            <h2>ENADE</h2>
          </div>
          <div className="info-text-block">
            <h3>Crie seu perfil e comece hoje mesmo</h3>
            <p>
              Ao se cadastrar, você ganha acesso completo a simulados oficiais do ENADE de anos anteriores e questões autorais focadas no seu curso.
            </p>
          </div>
          <ul className="info-list">
            <li>✓ Acesso 100% gratuito</li>
            <li>✓ Simulados com timer real</li>
            <li>✓ Gráficos de evolução individual</li>
            <li>✓ Histórico de desempenho exportável</li>
          </ul>
        </div>

        {/* Lado Direito - Form de Cadastro */}
        <div className="register-form-panel">
          <Card className="register-card glass-heavy animate-fadeIn" variant="glass">
            <div className="register-card-header">
              <h3>Cadastro de Aluno</h3>
              <p>Insira seus dados para criar o seu registro acadêmico</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <Input
                  label="Nome Completo"
                  placeholder="Ex: João Silva Santos"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  error={errors.nome}
                  required
                />
              </div>

              <div className="form-row-2col">
                <Input
                  label="E-mail Pessoal ou Acadêmico"
                  type="email"
                  placeholder="joao.silva@faculdade.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  required
                />
                <Input
                  label="Registro Acadêmico (RA)"
                  placeholder="Ex: 582490"
                  value={ra}
                  onChange={(e) => setRa(e.target.value)}
                  error={errors.ra}
                  required
                />
              </div>

              <div className="form-row-2col">
                <Input
                  label="CPF"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  error={errors.cpf}
                  required
                />
                <Select
                  label="Semestre"
                  placeholder="Selecione o semestre"
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  options={semestreOptions}
                  error={errors.semestre}
                  required
                />
              </div>

              <div className="form-row-2col">
                <Select
                  label="Faculdade / Universidade"
                  placeholder="Selecione a instituição"
                  value={faculdadeId}
                  onChange={(e) => setFaculdadeId(e.target.value)}
                  options={faculdadeOptions}
                  error={errors.faculdadeId}
                  required
                />
                <Select
                  label="Curso de Graduação"
                  placeholder={faculdadeId ? "Selecione o curso" : "Selecione a instituição primeiro"}
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  options={cursoOptions}
                  error={errors.curso}
                  disabled={!faculdadeId}
                  required
                />
              </div>

              <div className="form-row-2col">
                <Input
                  label="Senha"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  error={errors.senha}
                  required
                />
                <Input
                  label="Confirmar Senha"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  error={errors.confirmarSenha}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                className="register-submit-btn"
              >
                Concluir Cadastro
              </Button>
            </form>

            <div className="register-card-footer">
              <p>
                Já tem uma conta cadastrada? <Link to="/login">Acesse sua conta</Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
