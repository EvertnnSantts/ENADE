import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import * as mockData from '../../data/mockData';
import { formatDate, formatNota } from '../../utils/formatters';
import { FileText, Trophy, Activity, CheckSquare, Award, Clock } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './DashboardPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filtrar resultados do aluno atual
  const alunoResultados = useMemo(() => {
    return mockData.resultados.filter(r => r.alunoId === user?.id || r.alunoId === 'student-1');
  }, [user]);

  // Cálculos de Estatísticas
  const stats = useMemo(() => {
    const total = alunoResultados.length;
    if (total === 0) {
      return { total: 0, media: 0, melhor: 0, ranking: 'N/A' };
    }
    const notas = alunoResultados.map(r => r.nota);
    const media = notas.reduce((acc, curr) => acc + curr, 0) / total;
    const melhor = Math.max(...notas);

    // Calcular ranking aproximado
    const faculdade = mockData.faculdades.find(f => f.id === user?.faculdadeId || f.id === 'faculdade-1');
    const rankingPos = mockData.faculdades
      .sort((a, b) => b.notaMedia - a.notaMedia)
      .findIndex(f => f.id === faculdade?.id) + 1;

    return {
      total,
      media,
      melhor,
      ranking: rankingPos ? `${rankingPos}º Lugar` : 'N/A'
    };
  }, [alunoResultados, user]);

  // Configuração do gráfico de desempenho
  const chartData = useMemo(() => {
    // Ordenar resultados pela data para mostrar a linha de evolução
    const sortedRes = [...alunoResultados].sort((a, b) => new Date(a.realizadaEm) - new Date(b.realizadaEm));
    
    return {
      labels: sortedRes.map((_, idx) => `Simulado ${idx + 1}`),
      datasets: [
        {
          fill: true,
          label: 'Nota Obtida',
          data: sortedRes.map(r => r.nota),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6',
          pointHoverRadius: 6,
        }
      ]
    };
  }, [alunoResultados]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
      }
    }
  };

  // Obter detalhes da prova para o histórico recente
  const recentes = useMemo(() => {
    return alunoResultados
      .slice(-4)
      .map(r => {
        const prova = mockData.provas.find(p => p.id === r.provaId);
        return {
          ...r,
          provaTitulo: prova ? prova.titulo : 'Simulado Geral',
          provaArea: prova ? prova.area : 'Geral'
        };
      })
      .reverse(); // Mais recente primeiro
  }, [alunoResultados]);

  // Faculdade do usuário
  const userFaculdade = useMemo(() => {
    return mockData.faculdades.find(f => f.id === user?.faculdadeId) || mockData.faculdades[0];
  }, [user]);

  return (
    <div className="student-dashboard">
      {/* Boas vindas */}
      <div className="dashboard-welcome">
        <h2>Olá, {user?.nome?.split(' ')[0] || 'Estudante'}!</h2>
        <p>Você está matriculado em {user?.curso || 'Graduação'} na {userFaculdade?.sigla || 'Instituição'}.</p>
      </div>

      {/* Grid de Estatísticas */}
      <div className="stats-grid-row">
        <StatsCard 
          title="Provas Realizadas" 
          value={stats.total} 
          icon={FileText} 
          description="Simulados concluídos"
        />
        <StatsCard 
          title="Nota Média" 
          value={formatNota(stats.media)} 
          icon={Activity} 
          description="Média geral de acertos"
        />
        <StatsCard 
          title="Melhor Nota" 
          value={formatNota(stats.melhor)} 
          icon={Award} 
          description="Sua maior pontuação"
        />
        <StatsCard 
          title="Posição da Faculdade" 
          value={stats.ranking} 
          icon={Trophy} 
          description={`${userFaculdade?.sigla} no ranking geral`}
        />
      </div>

      {/* Grid Central */}
      <div className="dashboard-main-grid">
        {/* Gráfico de Evolução */}
        <Card className="chart-card" title="Evolução de Desempenho">
          <div className="chart-header">
            <h4>Evolução de Notas</h4>
            <p>Seu progresso nos simulados ao longo do tempo</p>
          </div>
          <div className="chart-wrapper">
            {alunoResultados.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="empty-chart-state">
                <Clock size={48} />
                <p>Nenhuma prova realizada ainda. Faça seu primeiro simulado!</p>
                <Link to="/student/exams" className="btn btn-primary">Iniciar Simulado</Link>
              </div>
            )}
          </div>
        </Card>

        {/* Links de Ações Rápidas */}
        <Card className="quick-actions-card">
          <div className="quick-actions-header">
            <h4>Ações Rápidas</h4>
          </div>
          <div className="quick-actions-list">
            <button className="action-button-item" onClick={() => navigate('/student/exams')}>
              <div className="action-icon-box bg-blue">
                <CheckSquare size={20} />
              </div>
              <div className="action-info">
                <h5>Realizar Simulados</h5>
                <p>Responda provas do ENADE anteriores</p>
              </div>
            </button>

            <button className="action-button-item" onClick={() => navigate('/student/ranking')}>
              <div className="action-icon-box bg-orange">
                <Trophy size={20} />
              </div>
              <div className="action-info">
                <h5>Ranking de Faculdades</h5>
                <p>Compare o desempenho das faculdades</p>
              </div>
            </button>

            <button className="action-button-item" onClick={() => navigate('/student/history')}>
              <div className="action-icon-box bg-green">
                <FileText size={20} />
              </div>
              <div className="action-info">
                <h5>Meu Histórico</h5>
                <p>Acesse gabaritos e notas anteriores</p>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* Histórico Recente */}
      <Card className="recent-exams-card" title="Atividades Recentes">
        <div className="card-header-with-action">
          <h4 className="card-title">Simulados Realizados Recentemente</h4>
          <Link to="/student/history" className="view-all-link">Ver histórico completo</Link>
        </div>

        <Table 
          headers={[
            { label: 'Simulado/Prova' },
            { label: 'Área' },
            { label: 'Data Realização', align: 'center' },
            { label: 'Acertos / Erros', align: 'center' },
            { label: 'Nota Final', align: 'center' },
            { label: 'Ações', align: 'right' }
          ]}
          isEmpty={recentes.length === 0}
          emptyMessage="Você ainda não concluiu nenhum simulado."
        >
          {recentes.map((item, idx) => (
            <tr key={idx}>
              <td>
                <span className="exam-title-cell">{item.provaTitulo}</span>
              </td>
              <td>{item.provaArea}</td>
              <td className="text-center">{formatDate(item.realizadaEm)}</td>
              <td className="text-center">
                <span className="text-success">{item.acertos}</span>
                <span className="text-muted"> / </span>
                <span className="text-danger">{item.erros}</span>
              </td>
              <td className="text-center">
                <span className={`nota-badge ${item.nota >= 70 ? 'high' : item.nota >= 50 ? 'medium' : 'low'}`}>
                  {formatNota(item.nota)}
                </span>
              </td>
              <td className="text-right">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate(`/student/exams/${item.provaId}/result`)}
                >
                  Gabarito
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
