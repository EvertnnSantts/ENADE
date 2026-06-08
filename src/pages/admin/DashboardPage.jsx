import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StatsCard from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import * as mockData from '../../data/mockData';
import { formatDate, formatNota } from '../../utils/formatters';
import { Building, Users, FileText, Activity, ShieldAlert, PlusCircle, Trophy } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import './DashboardPage.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DashboardPage() {
  const navigate = useNavigate();

  // Estatísticas de Admin
  const stats = useMemo(() => {
    const totalFaculdades = mockData.faculdades.length;
    const totalAlunos = mockData.alunos.length;
    const totalProvas = mockData.provas.length;
    
    const notas = mockData.resultados.map(r => r.nota);
    const mediaGeral = notas.length > 0
      ? notas.reduce((acc, curr) => acc + curr, 0) / notas.length
      : 0;

    return {
      faculdades: totalFaculdades,
      alunos: totalAlunos,
      provas: totalProvas,
      media: mediaGeral
    };
  }, []);

  // Dados para distribuição de notas (Gráfico de Barras)
  const chartData = useMemo(() => {
    const ranges = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    };

    mockData.resultados.forEach(r => {
      if (r.nota <= 20) ranges['0-20']++;
      else if (r.nota <= 40) ranges['21-40']++;
      else if (r.nota <= 60) ranges['41-60']++;
      else if (r.nota <= 80) ranges['61-80']++;
      else ranges['81-100']++;
    });

    return {
      labels: Object.keys(ranges),
      datasets: [
        {
          label: 'Total de Alunos',
          data: Object.values(ranges),
          backgroundColor: 'rgba(6, 182, 212, 0.4)',
          borderColor: '#06b6d4',
          borderWidth: 2,
          borderRadius: 4
        }
      ]
    };
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  // Últimos 5 simulados realizados no sistema
  const recentes = useMemo(() => {
    return [...mockData.resultados]
      .sort((a, b) => new Date(b.realizadaEm) - new Date(a.realizadaEm))
      .slice(0, 5)
      .map(r => {
        const aluno = mockData.alunos.find(a => a.id === r.alunoId) || { nome: 'Aluno Convidado', curso: 'Computação' };
        const prova = mockData.provas.find(p => p.id === r.provaId) || { titulo: 'Simulado Geral' };
        return {
          ...r,
          alunoNome: aluno.nome,
          alunoCurso: aluno.curso,
          provaTitulo: prova.titulo
        };
      });
  }, []);

  return (
    <div className="admin-dashboard animate-fadeIn">
      {/* Grid de Estatísticas */}
      <div className="admin-stats-row">
        <StatsCard 
          title="Faculdades Cadastradas" 
          value={stats.faculdades} 
          icon={Building} 
          description="Instituições de Ensino"
          variant="glass"
        />
        <StatsCard 
          title="Alunos Registrados" 
          value={stats.alunos} 
          icon={Users} 
          description="Estudantes cadastrados"
          variant="glass"
        />
        <StatsCard 
          title="Provas Criadas" 
          value={stats.provas} 
          icon={FileText} 
          description="Simulados e Exames"
          variant="glass"
        />
        <StatsCard 
          title="Desempenho Médio" 
          value={formatNota(stats.media)} 
          icon={Activity} 
          description="Média nacional de acertos"
          variant="glass"
        />
      </div>

      {/* Grid Central */}
      <div className="admin-dashboard-grid">
        {/* Gráfico de Barras */}
        <Card className="admin-chart-card" title="Distribuição de Notas Nacionais">
          <div className="chart-header">
            <h4>Distribuição de Notas</h4>
            <p>Quantidade de alunos por faixas de notas (0 a 100)</p>
          </div>
          <div className="chart-wrapper">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Card>

        {/* Bloco de Ações Rápidas */}
        <Card className="admin-actions-card">
          <div className="admin-actions-header">
            <h4>Painel de Controle</h4>
          </div>
          <div className="admin-actions-list">
            <button className="admin-action-item" onClick={() => navigate('/admin/faculdades/new')}>
              <div className="action-icon bg-cyan">
                <PlusCircle size={20} />
              </div>
              <div className="action-info">
                <h5>Nova Faculdade</h5>
                <p>Cadastre uma nova universidade no sistema</p>
              </div>
            </button>

            <button className="admin-action-item" onClick={() => navigate('/admin/provas/new')}>
              <div className="action-icon bg-blue">
                <PlusCircle size={20} />
              </div>
              <div className="action-info">
                <h5>Cadastrar Prova</h5>
                <p>Crie simulados e insira questões</p>
              </div>
            </button>

            <button className="admin-action-item" onClick={() => navigate('/admin/ranking')}>
              <div className="action-icon bg-orange">
                <Trophy size={20} />
              </div>
              <div className="action-info">
                <h5>Relatório de Ranking</h5>
                <p>Veja as pontuações médias nacionais</p>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* Atividades Recentes dos Alunos */}
      <Card className="admin-recent-card" title="Atividades Recentes">
        <div className="recent-header">
          <h4>Últimas Provas Enviadas</h4>
          <p>Acompanhamento em tempo real dos envios dos estudantes</p>
        </div>

        <Table
          headers={[
            { label: 'Aluno' },
            { label: 'Curso' },
            { label: 'Prova Realizada' },
            { label: 'Data de Envio', align: 'center' },
            { label: 'Nota', align: 'center' }
          ]}
          isEmpty={recentes.length === 0}
        >
          {recentes.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="student-cell">
                  <strong>{row.alunoNome}</strong>
                </div>
              </td>
              <td>{row.alunoCurso}</td>
              <td>{row.provaTitulo}</td>
              <td className="text-center">{formatDate(row.realizadaEm)}</td>
              <td className="text-center">
                <span className={`nota-badge ${row.nota >= 70 ? 'high' : row.nota >= 50 ? 'medium' : 'low'}`}>
                  {formatNota(row.nota)}
                </span>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
