import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Check, X, Trophy, RefreshCw, LayoutDashboard, Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDate, formatNota, formatTime } from '../../utils/formatters';
import './ExamResultPage.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ExamResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Obter o resultado mais recente para esta prova
  const result = useMemo(() => {
    // Primeiro tentar carregar do localStorage
    const local = localStorage.getItem(`result_${id}`);
    if (local) return JSON.parse(local);

    // Senão, pegar do mockData
    const results = mockData.resultados.filter(r => r.provaId === id);
    return results.length > 0 ? results[results.length - 1] : null;
  }, [id]);

  const exam = useMemo(() => {
    return mockData.provas.find(p => p.id === id) || mockData.provas[0];
  }, [id]);

  const questions = useMemo(() => {
    return mockData.questoes.filter(q => q.provaId === exam.id);
  }, [exam]);

  // Se não encontrar resultado
  if (!result) {
    return (
      <div className="result-not-found text-center">
        <AlertCircle size={48} className="text-warning" />
        <h3>Nenhum resultado encontrado</h3>
        <p>Você ainda não realizou este simulado.</p>
        <Button onClick={() => navigate('/student/exams')}>Ir para Provas</Button>
      </div>
    );
  }

  // Gráfico Doughnut: Acertos vs Erros
  const doughnutData = {
    labels: ['Acertos', 'Erros'],
    datasets: [
      {
        data: [result.acertos, result.erros],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'Inter' } }
      }
    }
  };

  return (
    <div className="exam-result-page animate-fadeIn">
      {/* Resumo superior do resultado */}
      <div className="result-header-card glass">
        <div className="result-header-info">
          <Badge variant="success">Simulado Concluído</Badge>
          <h2>{exam.titulo}</h2>
          <div className="result-meta-row">
            <span className="meta"><Calendar size={14} /> {formatDate(result.realizadaEm)}</span>
            <span className="meta"><Clock size={14} /> Tempo: {formatTime(result.tempoGasto)}</span>
          </div>
        </div>

        {/* Círculo de Nota */}
        <div className="result-score-circle">
          <div className="score-inner">
            <span className="score-num">{formatNota(result.nota)}</span>
            <span className="score-label">Nota Final</span>
          </div>
        </div>
      </div>

      {/* Grid de Estatísticas */}
      <div className="result-stats-grid">
        {/* Gráfico circular */}
        <Card className="result-stat-card chart-doughnut-card" title="Aproveitamento Geral">
          <div className="doughnut-wrapper">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </Card>

        {/* Resumo em cards */}
        <div className="result-boxes-col">
          <Card className="summary-box-card">
            <div className="summary-box text-success">
              <Check size={28} />
              <div>
                <h4>{result.acertos}</h4>
                <p>Questões Acertadas</p>
              </div>
            </div>
          </Card>
          <Card className="summary-box-card">
            <div className="summary-box text-danger">
              <X size={28} />
              <div>
                <h4>{result.erros}</h4>
                <p>Questões Erradas</p>
              </div>
            </div>
          </Card>
          <Card className="summary-box-card bg-gradient-blue">
            <div className="summary-box text-primary">
              <Trophy size={28} />
              <div>
                <h4>{result.nota >= 70 ? 'Aprovado' : 'Regular'}</h4>
                <p>Status de Desempenho</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Gabarito Detalhado */}
      <Card className="gabarito-card" title="Gabarito Detalhado">
        <div className="gabarito-header">
          <h4>Correção Questão por Questão</h4>
          <p>Veja as respostas enviadas e o gabarito oficial.</p>
        </div>

        <div className="gabarito-list">
          {questions.map((q, idx) => {
            const studentResp = result.respostas.find(r => r.questaoId === q.id);
            const isCorrect = studentResp?.correta;
            const isMultipleChoice = q.tipo === 'multipla_escolha';
            
            // Achar letra correta
            const correctOption = isMultipleChoice 
              ? q.alternativas.find(alt => alt.correta)?.letra
              : '';

            return (
              <div key={q.id} className={`gabarito-item ${isCorrect ? 'correct' : 'wrong'}`}>
                <div className="gabarito-item-header">
                  <span className="gabarito-number">Questão {idx + 1}</span>
                  <div className="gabarito-badges">
                    <Badge variant={isCorrect ? 'success' : 'danger'}>
                      {isCorrect ? 'Acertou' : 'Errou'}
                    </Badge>
                    <Badge variant="neutral">
                      {q.tipo === 'multipla_escolha' ? 'Múltipla Escolha' : 'Discursiva'}
                    </Badge>
                  </div>
                </div>

                <div className="gabarito-enunciado">
                  <p>{q.enunciado}</p>
                </div>

                {isMultipleChoice ? (
                  <div className="gabarito-options-display">
                    {q.alternativas.map((alt, aIdx) => {
                      const isStudentAns = studentResp?.respostaAluno === alt.letra;
                      const isCorrectAns = alt.correta;
                      
                      let optClass = 'gabarito-opt-row';
                      if (isCorrectAns) optClass += ' correct-opt';
                      else if (isStudentAns) optClass += ' wrong-opt';

                      return (
                        <div key={aIdx} className={optClass}>
                          <span className="opt-letter">{alt.letra}</span>
                          <span className="opt-text">{alt.texto}</span>
                          {isCorrectAns && <Check size={16} className="opt-indicator text-success" />}
                          {!isCorrectAns && isStudentAns && <X size={16} className="opt-indicator text-danger" />}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="gabarito-essay-display">
                    <div className="essay-sub-block">
                      <strong>Sua Resposta:</strong>
                      <p className="essay-response-text">{studentResp?.respostaAluno || 'Sem resposta.'}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Ações */}
      <div className="result-actions-footer">
        <Button variant="outline" onClick={() => navigate('/student/dashboard')}>
          <LayoutDashboard size={16} />
          Voltar para o Dashboard
        </Button>
        <Button variant="primary" onClick={() => navigate(`/student/exams/${exam.id}`)}>
          <RefreshCw size={16} />
          Refazer Simulado
        </Button>
      </div>
    </div>
  );
}
