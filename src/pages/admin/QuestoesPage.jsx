import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { ArrowLeft, Plus, Pencil, Trash2, HelpCircle, CheckCircle, List } from 'lucide-react';
import toast from 'react-hot-toast';
import './QuestoesPage.css';

export default function QuestoesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar prova e suas questões
  useEffect(() => {
    const foundExam = mockData.provas.find(p => p.id === id);
    if (!foundExam) {
      toast.error('Prova não encontrada.');
      navigate('/admin/provas');
      return;
    }

    const examQuestions = mockData.questoes
      .filter(q => q.provaId === id)
      .sort((a, b) => a.numero - b.numero);

    setExam(foundExam);
    setQuestions(examQuestions);
    setLoading(false);
  }, [id, navigate]);

  // Excluir questão
  const handleDeleteQuestion = (qId, num) => {
    if (window.confirm(`Tem certeza que deseja excluir a Questão nº ${num}?`)) {
      // Remover do mockData global
      const idx = mockData.questoes.findIndex(q => q.id === qId);
      if (idx !== -1) {
        mockData.questoes.splice(idx, 1);
      }

      // Atualizar lista local
      const updated = questions.filter(q => q.id !== qId);
      
      // Reordenar os números das questões restantes se desejado, mas vamos apenas manter a ordem existente
      setQuestions(updated);
      toast.success(`Questão nº ${num} excluída com sucesso!`);
    }
  };

  const getDificuldadeBadge = (dificuldade) => {
    switch (dificuldade) {
      case 'facil':
        return <Badge variant="success">Fácil</Badge>;
      case 'medio':
        return <Badge variant="warning">Médio</Badge>;
      case 'dificil':
        return <Badge variant="danger">Difícil</Badge>;
      default:
        return <Badge variant="neutral">{dificuldade}</Badge>;
    }
  };

  const getCategoriaLabel = (categoria) => {
    switch (categoria) {
      case 'formacao_geral':
        return 'Formação Geral';
      case 'componente_especifico':
        return 'Componente Específico';
      default:
        return categoria;
    }
  };

  if (loading) {
    return <div className="text-center pad-lg">Carregando...</div>;
  }

  return (
    <div className="questoes-page animate-fadeIn">
      {/* Header com ações */}
      <div className="questoes-header-row">
        <button className="back-btn" onClick={() => navigate('/admin/provas')}>
          <ArrowLeft size={16} />
          <span>Voltar para Provas</span>
        </button>

        <div className="action-buttons">
          <Button variant="primary" onClick={() => navigate(`/admin/provas/${id}/questoes/new`)}>
            <Plus size={16} />
            Nova Questão
          </Button>
        </div>
      </div>

      {/* Info do simulado */}
      <Card className="exam-summary-card glass">
        <div className="exam-summary-content">
          <div className="summary-left">
            <span className="exam-badge">{exam.ano}</span>
            <h3>{exam.titulo}</h3>
            <p>{exam.area} • {exam.tempoLimite} minutos • {questions.length} / {exam.totalQuestoes} questões cadastradas</p>
          </div>
          <div className="summary-right">
            <Badge variant={exam.status === 'publicada' ? 'success' : 'warning'}>
              {exam.status === 'publicada' ? 'Publicada' : 'Rascunho'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Listagem de Questões */}
      <div className="questions-container-list">
        {questions.length === 0 ? (
          <div className="empty-questions-state glass text-center">
            <HelpCircle size={48} className="text-muted" />
            <h4>Nenhuma questão cadastrada</h4>
            <p>Este simulado ainda não possui questões. Clique em "Nova Questão" para começar a preencher o simulado.</p>
            <Button variant="primary" onClick={() => navigate(`/admin/provas/${id}/questoes/new`)}>
              <Plus size={16} />
              Adicionar Primeira Questão
            </Button>
          </div>
        ) : (
          <div className="questions-grid-layout">
            {questions.map((q, idx) => (
              <Card key={q.id} className="question-admin-card hover-lift">
                <div className="q-card-header">
                  <div className="q-number-title">
                    <h4>Questão {q.numero}</h4>
                    <div className="q-badges">
                      <Badge variant="neutral">
                        {q.tipo === 'multipla_escolha' ? 'Múltipla Escolha' : 'Discursiva'}
                      </Badge>
                      {getDificuldadeBadge(q.dificuldade)}
                      <span className="q-meta-info-text">{getCategoriaLabel(q.categoria)}</span>
                      <span className="q-points-badge">{q.pontos} Pts</span>
                    </div>
                  </div>

                  <div className="q-actions">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(`/admin/provas/${id}/questoes/${q.id}/edit`)}
                      title="Editar Questão"
                    >
                      <Pencil size={14} />
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      onClick={() => handleDeleteQuestion(q.id, q.numero)}
                      title="Excluir Questão"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                <div className="q-card-body">
                  <div className="q-enunciado">
                    <p>{q.enunciado}</p>
                  </div>

                  {q.tipo === 'multipla_escolha' && q.alternativas && (
                    <div className="q-alternativas-list">
                      {q.alternativas.map((alt, aIdx) => (
                        <div 
                          key={aIdx} 
                          className={`q-alt-item ${alt.correta ? 'correct' : ''}`}
                        >
                          <span className="alt-letter">{alt.letra}</span>
                          <p className="alt-text">{alt.texto}</p>
                          {alt.correta && (
                            <CheckCircle size={16} className="correct-icon text-success" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.tipo === 'discursiva' && (
                    <div className="q-discursiva-info">
                      <div className="info-box-discursiva">
                        <List size={14} />
                        <span>Questão discursiva (resposta descritiva enviada pelo aluno).</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
