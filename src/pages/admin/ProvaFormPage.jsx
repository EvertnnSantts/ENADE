import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProvaFormPage.css';

export default function ProvaFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Estados dos inputs
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [area, setArea] = useState('');
  const [ano, setAno] = useState('');
  const [totalQuestoes, setTotalQuestoes] = useState('');
  const [tempoLimite, setTempoLimite] = useState('');
  const [status, setStatus] = useState('rascunho');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Carregar dados se for edição
  useEffect(() => {
    if (isEdit) {
      const exam = mockData.provas.find(p => p.id === id);
      if (exam) {
        setTitulo(exam.titulo);
        setDescricao(exam.descricao);
        setArea(exam.area);
        setAno(String(exam.ano));
        setTotalQuestoes(String(exam.totalQuestoes));
        setTempoLimite(String(exam.tempoLimite));
        setStatus(exam.status);
      } else {
        toast.error('Prova não encontrada.');
        navigate('/admin/provas');
      }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const tempErrors = {};
    if (!titulo.trim()) tempErrors.titulo = 'Título da prova é obrigatório';
    if (!descricao.trim()) tempErrors.descricao = 'Descrição da prova é obrigatória';
    if (!area) tempErrors.area = 'Selecione a área do conhecimento (curso)';
    
    const parsedAno = parseInt(ano);
    if (!ano) {
      tempErrors.ano = 'Ano é obrigatório';
    } else if (isNaN(parsedAno) || parsedAno < 2000 || parsedAno > 2100) {
      tempErrors.ano = 'Insira um ano válido';
    }

    const parsedQtd = parseInt(totalQuestoes);
    if (!totalQuestoes) {
      tempErrors.totalQuestoes = 'Quantidade de questões é obrigatória';
    } else if (isNaN(parsedQtd) || parsedQtd <= 0) {
      tempErrors.totalQuestoes = 'Insira uma quantidade maior que zero';
    }

    const parsedTempo = parseInt(tempoLimite);
    if (!tempoLimite) {
      tempErrors.tempoLimite = 'Tempo limite é obrigatório';
    } else if (isNaN(parsedTempo) || parsedTempo <= 0) {
      tempErrors.tempoLimite = 'Insira um tempo válido (em minutos)';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Por favor, preencha corretamente o formulário.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (isEdit) {
        // Atualizar prova
        const idx = mockData.provas.findIndex(p => p.id === id);
        if (idx !== -1) {
          mockData.provas[idx] = {
            ...mockData.provas[idx],
            titulo,
            descricao,
            area,
            ano: parseInt(ano),
            totalQuestoes: parseInt(totalQuestoes),
            tempoLimite: parseInt(tempoLimite),
            status,
            atualizadoEm: new Date().toISOString()
          };
        }
        toast.success('Simulado atualizado com sucesso!');
      } else {
        // Cadastrar nova prova
        const newExam = {
          id: `prova-${Date.now()}`,
          titulo,
          descricao,
          area,
          ano: parseInt(ano),
          totalQuestoes: parseInt(totalQuestoes),
          tempoLimite: parseInt(tempoLimite),
          status,
          dataAplicacao: status === 'publicada' ? new Date().toISOString() : null,
          criadoEm: new Date().toISOString(),
          atualizadoEm: new Date().toISOString()
        };
        mockData.provas.push(newExam);
        toast.success('Simulado cadastrado com sucesso! Agora adicione as questões.');
      }
      setLoading(false);
      navigate('/admin/provas');
    }, 800);
  };

  // Mapeamento de áreas baseadas nos cursos cadastrados
  const areaOptions = mockData.cursos.map(c => ({
    value: c.nome,
    label: c.nome
  }));

  const statusOptions = [
    { value: 'rascunho', label: 'Rascunho' },
    { value: 'publicada', label: 'Publicada / Ativa' }
  ];

  return (
    <div className="prova-form-page animate-fadeIn">
      {/* Voltar */}
      <div className="form-header-back">
        <button className="back-btn" onClick={() => navigate('/admin/provas')}>
          <ArrowLeft size={16} />
          <span>Voltar para a Lista</span>
        </button>
      </div>

      <Card className="form-card" title={isEdit ? 'Editar Simulado' : 'Criar Novo Simulado'}>
        <div className="form-card-intro">
          <h3>{isEdit ? 'Editar Simulado ENADE' : 'Criar Novo Simulado ENADE'}</h3>
          <p>Configure os parâmetros principais da prova. Após criar, você poderá cadastrar cada uma das questões.</p>
        </div>

        <form onSubmit={handleSubmit} className="prova-form">
          <div className="form-row">
            <Input
              label="Título do Simulado"
              placeholder="Ex: ENADE 2025 - Ciência da Computação"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              error={errors.titulo}
              required
            />
          </div>

          <div className="form-row">
            <div className="textarea-container">
              <label className="textarea-label">Descrição / Instruções do Exame</label>
              <textarea
                placeholder="Insira as instruções gerais ou descrição da prova para os alunos..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className={`form-textarea ${errors.descricao ? 'error' : ''}`}
                required
                rows={4}
              />
              {errors.descricao && <span className="textarea-error-msg">{errors.descricao}</span>}
            </div>
          </div>

          <div className="form-row-2col">
            <Select
              label="Área do Conhecimento (Curso)"
              placeholder="Selecione a área"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              options={areaOptions}
              error={errors.area}
              required
            />
            <Select
              label="Status Inicial"
              placeholder="Selecione o status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
              required
            />
          </div>

          <div className="form-row-3col">
            <Input
              label="Ano de Referência"
              placeholder="Ex: 2025"
              type="number"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              error={errors.ano}
              required
            />
            <Input
              label="Total de Questões"
              placeholder="Ex: 35"
              type="number"
              value={totalQuestoes}
              onChange={(e) => setTotalQuestoes(e.target.value)}
              error={errors.totalQuestoes}
              required
            />
            <Input
              label="Tempo Limite (Minutos)"
              placeholder="Ex: 240"
              type="number"
              value={tempoLimite}
              onChange={(e) => setTempoLimite(e.target.value)}
              error={errors.tempoLimite}
              required
            />
          </div>

          <div className="form-actions-row">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/provas')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              loading={loading}
            >
              <Save size={16} />
              {isEdit ? 'Salvar Alterações' : 'Criar Simulado'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
