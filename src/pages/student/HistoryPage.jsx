import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { formatDate, formatNota, formatTime } from '../../utils/formatters';
import { Calendar, FileText, CheckCircle, Search } from 'lucide-react';
import './HistoryPage.css';

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [areaFilter, setAreaFilter] = useState('');

  // Filtrar histórico do estudante logado
  const history = useMemo(() => {
    const studentResults = mockData.resultados.filter(r => r.alunoId === user?.id || r.alunoId === 'student-1');
    return studentResults
      .map(r => {
        const prova = mockData.provas.find(p => p.id === r.provaId);
        return {
          ...r,
          provaTitulo: prova ? prova.titulo : 'Simulado Geral',
          provaArea: prova ? prova.area : 'Geral',
          provaAno: prova ? prova.ano : 2024
        };
      })
      .filter(item => (areaFilter ? item.provaArea === areaFilter : true))
      .sort((a, b) => new Date(b.realizadaEm) - new Date(a.realizadaEm)); // Ordenação decrescente
  }, [user, areaFilter]);

  // Lista de áreas para filtros
  const areas = useMemo(() => {
    const allAreas = mockData.provas.map(p => p.area);
    return [...new Set(allAreas)].map(a => ({ value: a, label: a }));
  }, []);

  return (
    <div className="history-page animate-fadeIn">
      {/* Filtros de Histórico */}
      <div className="history-filters-bar glass">
        <div className="filters-label">
          <Calendar size={18} />
          <h4>Histórico de Atividades</h4>
        </div>
        <div className="filters-selectors">
          <Select 
            placeholder="Filtrar por Área do Conhecimento"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            options={areas}
          />
          {areaFilter && (
            <button className="clear-filters" onClick={() => setAreaFilter('')}>
              Limpar Filtro
            </button>
          )}
        </div>
      </div>

      {/* Tabela do Histórico */}
      <Card className="history-card">
        <Table
          headers={[
            { label: 'Prova / Simulado' },
            { label: 'Área' },
            { label: 'Ano da Prova', align: 'center' },
            { label: 'Data de Realização', align: 'center' },
            { label: 'Acertos / Erros', align: 'center' },
            { label: 'Nota Obtida', align: 'center' },
            { label: 'Ação', align: 'right' }
          ]}
          isEmpty={history.length === 0}
          emptyMessage="Nenhuma tentativa de simulado foi registrada com os filtros aplicados."
        >
          {history.map((row) => (
            <tr key={row.id}>
              <td>
                <span className="exam-title-row">{row.provaTitulo}</span>
              </td>
              <td>{row.provaArea}</td>
              <td className="text-center">{row.provaAno}</td>
              <td className="text-center">{formatDate(row.realizadaEm)}</td>
              <td className="text-center">
                <span className="text-success">{row.acertos}</span>
                <span className="text-muted"> / </span>
                <span className="text-danger">{row.erros}</span>
              </td>
              <td className="text-center">
                <span className={`nota-badge ${row.nota >= 70 ? 'high' : row.nota >= 50 ? 'medium' : 'low'}`}>
                  {formatNota(row.nota)}
                </span>
              </td>
              <td className="text-right">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate(`/student/exams/${row.provaId}/result`)}
                >
                  Ver Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
