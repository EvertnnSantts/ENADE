import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as mockData from '../../data/mockData';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import QuestionCard from '../../components/exam/QuestionCard';
import ExamTimer from '../../components/exam/ExamTimer';
import ExamProgress from '../../components/exam/ExamProgress';
import { FileText, ChevronLeft, ChevronRight, AlertTriangle, Flag, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import './ExamTakePage.css';

export default function ExamTakePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados principais
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState('intro'); // 'intro' | 'taking' | 'review'

  // Respostas e marcas do aluno
  const [answers, setAnswers] = useState({}); // { 0: 'A', 1: 'Resposta discursiva...' }
  const [flags, setFlags] = useState([]); // indices de questoes marcadas
  const [currentIdx, setCurrentIdx] = useState(0);

  // Carregar dados
  useEffect(() => {
    const foundExam = mockData.provas.find(p => p.id === id);
    if (!foundExam) {
      toast.error('Prova não encontrada.');
      navigate('/student/exams');
      return;
    }

    // Filtrar questões dessa prova
    const examQuestions = mockData.questoes.filter(q => q.provaId === id);

    setExam(foundExam);
    setQuestions(examQuestions);
    setLoading(false);
  }, [id, navigate]);

  const handleStartExam = () => {
    setStage('taking');
    toast.success('Simulado iniciado! Boa sorte.');
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStage('review');
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleAnswerChange = (val) => {
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: val
    }));
  };

  const handleToggleFlag = () => {
    setFlags(prev => {
      if (prev.includes(currentIdx)) {
        return prev.filter(i => i !== currentIdx);
      } else {
        return [...prev, currentIdx];
      }
    });
  };

  // Submissão
  const handleSubmitExam = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      let score = 0;
      let correctCount = 0;
      let wrongCount = 0;
      const detailedAnswers = [];

      questions.forEach((q, idx) => {
        const studentAns = answers[idx];
        let isCorrect = false;

        if (q.tipo === 'multipla_escolha') {
          const correctOption = q.alternativas.find(alt => alt.correta);
          isCorrect = studentAns === correctOption?.letra;
          if (isCorrect) {
            score += q.pontos;
            correctCount++;
          } else {
            wrongCount++;
          }
        } else {
          // Questões discursivas - autoavaliação aleatória inteligente (entre 60% e 100% dos pontos da questão)
          const multiplier = studentAns ? (0.6 + Math.random() * 0.4) : 0;
          const pointsEarned = Math.round(q.pontos * multiplier);
          score += pointsEarned;
          isCorrect = pointsEarned >= (q.pontos * 0.7); // Considera acerto se nota >= 70%
          if (isCorrect) correctCount++;
          else wrongCount++;
        }

        detailedAnswers.push({
          questaoId: q.id,
          respostaAluno: studentAns || '',
          correta: isCorrect
        });
      });

      // Nota total convertida para escala de 0 a 100
      const totalPoints = questions.reduce((acc, curr) => acc + curr.pontos, 0);
      const finalGrade = Math.round((score / totalPoints) * 100);

      const newResult = {
        id: crypto.randomUUID(),
        alunoId: user?.id || 'student-1',
        provaId: exam.id,
        nota: finalGrade,
        acertos: correctCount,
        erros: wrongCount,
        tempoGasto: 1200, // mock de 20 minutos
        respostas: detailedAnswers,
        realizadaEm: new Date().toISOString()
      };

      // Salvar no mockData temporário
      mockData.resultados.push(newResult);

      // Salvar no localStorage também para persistência
      localStorage.setItem(`result_${exam.id}`, JSON.stringify(newResult));

      setLoading(false);
      toast.success('Simulado submetido com sucesso!');
      navigate(`/student/exams/${exam.id}/result`);
    }, 1200);
  }, [questions, answers, exam, navigate, user]);

  if (loading) return <Loader fullPage />;

  return (
    <div className="exam-take-page">
      {/* 1. ETAPA DE INTRODUÇÃO */}
      {stage === 'intro' && (
        <Card className="exam-intro-card animate-slideUp">
          <div className="exam-intro-header text-center">
            <div className="exam-icon-large">
              <FileText size={40} />
            </div>
            <h2>{exam.titulo}</h2>
            <p className="exam-area-text">{exam.area}</p>
          </div>

          <div className="exam-info-grid">
            <div className="info-block">
              <span>Questões</span>
              <h4>{exam.totalQuestoes} itens</h4>
            </div>
            <div className="info-block">
              <span>Tempo Limite</span>
              <h4>{exam.tempoLimite} minutos</h4>
            </div>
            <div className="info-block">
              <span>Tipo</span>
              <h4>{exam.tipo === 'completa' ? 'Simulado Oficial' : 'Parcial'}</h4>
            </div>
          </div>

          <div className="exam-instructions">
            <h5>Instruções Importantes:</h5>
            <ul>
              <li><strong>Cronômetro:</strong> O tempo começará a contar assim que você clicar em "Iniciar Prova".</li>
              <li><strong>Envio Automático:</strong> Se o tempo expirar, suas respostas marcadas até o momento serão submetidas automaticamente.</li>
              <li><strong>Navegação:</strong> Você pode navegar livremente pelas questões e marcar itens para revisão.</li>
              <li><strong>Discursivas:</strong> Digite as respostas na caixa indicada. Elas serão corrigidas ao final.</li>
            </ul>
          </div>

          <div className="exam-intro-actions">
            <Button variant="outline" onClick={() => navigate('/student/exams')}>Voltar para a Lista</Button>
            <Button variant="primary" onClick={handleStartExam}>Iniciar Prova</Button>
          </div>
        </Card>
      )}

      {/* 2. ETAPA DE REALIZAÇÃO */}
      {stage === 'taking' && (
        <div className="exam-taking-layout">
          <div className="exam-content-side">
            {/* Header de realização */}
            <div className="exam-taking-header glass">
              <div className="exam-taking-info">
                <h3>{exam.titulo}</h3>
                <span className="question-indicator">
                  Questão {currentIdx + 1} de {questions.length}
                </span>
              </div>
              <div className="exam-taking-controls">
                <Button 
                  size="sm" 
                  variant={flags.includes(currentIdx) ? 'warning' : 'outline'} 
                  onClick={handleToggleFlag}
                >
                  <Flag size={14} fill={flags.includes(currentIdx) ? 'currentColor' : 'none'} />
                  {flags.includes(currentIdx) ? 'Marcada' : 'Revisar depois'}
                </Button>
                <ExamTimer durationMinutes={exam.tempoLimite} onTimeUp={handleSubmitExam} />
              </div>
            </div>

            {/* Componente do Card de Questão */}
            {questions[currentIdx] && (
              <QuestionCard
                question={questions[currentIdx]}
                questionIndex={currentIdx}
                selectedAnswer={questions[currentIdx].tipo === 'multipla_escolha' ? answers[currentIdx] : undefined}
                essayAnswer={questions[currentIdx].tipo === 'discursiva' ? answers[currentIdx] : undefined}
                onChangeAnswer={handleAnswerChange}
              />
            )}

            {/* Rodapé de navegação */}
            <div className="exam-taking-footer">
              <Button 
                variant="outline" 
                onClick={handlePrev}
                disabled={currentIdx === 0}
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>

              <Button variant="primary" onClick={handleNext}>
                {currentIdx === questions.length - 1 ? 'Revisar Envio' : 'Próxima'}
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          {/* Lateral de navegação de progresso */}
          <div className="exam-sidebar-side">
            <ExamProgress
              total={questions.length}
              current={currentIdx}
              answers={answers}
              flags={flags}
              onNavigate={setCurrentIdx}
            />
            <Button 
              variant="outline" 
              className="force-review-btn" 
              fullWidth 
              onClick={() => setStage('review')}
            >
              Revisar e Concluir
            </Button>
          </div>
        </div>
      )}

      {/* 3. ETAPA DE REVISÃO E ENVIO */}
      {stage === 'review' && (
        <Card className="exam-review-card animate-slideUp">
          <div className="review-header text-center">
            <div className="exam-icon-large text-warning">
              <AlertTriangle size={40} />
            </div>
            <h2>Revisão do Simulado</h2>
            <p>Verifique o status de todas as questões antes de submeter.</p>
          </div>

          <div className="review-stats">
            <div className="rev-stat-box">
              <span className="number text-success">
                {Object.keys(answers).filter(k => answers[k]).length}
              </span>
              <span className="label">Respondidas</span>
            </div>
            <div className="rev-stat-box">
              <span className="number text-warning">{flags.length}</span>
              <span className="label">Marcadas para Revisão</span>
            </div>
            <div className="rev-stat-box">
              <span className="number text-danger">
                {questions.length - Object.keys(answers).filter(k => answers[k]).length}
              </span>
              <span className="label">Sem Resposta</span>
            </div>
          </div>

          <div className="review-question-list">
            <h4>Visão Geral das Questões</h4>
            <div className="review-question-grid">
              {questions.map((q, idx) => {
                const isAnswered = answers[idx] !== undefined && answers[idx] !== '';
                const isFlagged = flags.includes(idx);
                return (
                  <button
                    key={idx}
                    className={`review-grid-btn ${isFlagged ? 'flagged' : isAnswered ? 'answered' : 'empty'}`}
                    onClick={() => { setStage('taking'); setCurrentIdx(idx); }}
                  >
                    Questão {idx + 1}
                    <span className="badge-status">
                      {isFlagged ? 'Revisar' : isAnswered ? 'Respondida' : 'Pendente'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="review-actions">
            <Button variant="outline" onClick={() => setStage('taking')}>Voltar para a Prova</Button>
            <Button variant="success" onClick={handleSubmitExam}>
              <CheckSquare size={16} />
              Enviar Simulado
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
