import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { FileText, Clock, HelpCircle, BookOpen, Search } from 'lucide-react';
import './ExamListPage.css';

export default function ExamListPage() {
  const navigate = useNavigate();
  const [areaFilter, setAreaFilter] = useState('');
  const [anoFilter, setAnoFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar apenas provas marcadas como 'publicada'
  const filteredExams = useMemo(() => {
    return mockData.provas.filter(prova => {
      const isPublished = prova.status === 'publicada';
      const matchesArea = areaFilter ? prova.area === areaFilter : true;
      const matchesAno = anoFilter ? String(prova.ano) === anoFilter : true;
      const matchesSearch = searchTerm 
        ? prova.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return isPublished && matchesArea && matchesAno && matchesSearch;
    });
  }, [areaFilter, anoFilter, searchTerm]);

  // Lista de áreas únicas e anos únicos para os dropdowns de filtro
  const areas = useMemo(() => {
    const allAreas = mockData.provas.filter(p => p.status === 'publicada').map(p => p.area);
    return [...new Set(allAreas)].map(a => ({ value: a, label: a }));
  }, []);

  const anos = useMemo(() => {
    const allAnos = mockData.provas.filter(p => p.status === 'publicada').map(p => String(p.ano));
    return [...new Set(allAnos)].sort((a, b) => b - a).map(a => ({ value: a, label: a }));
  }, []);

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'completa': return <Badge variant="primary">Completa (40 Q)</Badge>;
      case 'formacao_geral': return <Badge variant="info">Formação Geral</Badge>;
      case 'componente_especifico': return <Badge variant="warning">Componente Específico</Badge>;
      default: return <Badge variant="neutral">Simulado</Badge>;
    }
  };

  return (
    <div className="exam-list-page animate-fadeIn">
      {/* Header explicativo */}
      <div className="exam-list-intro">
        <h3>Simulados ENADE Disponíveis</h3>
        <p>Escolha um simulado abaixo para testar seus conhecimentos nas condições reais do exame oficial.</p>
      </div>

      {/* Barra de Filtros */}
      <div className="exam-filters-bar glass">
        <div className="search-input-wrapper">
          <Input 
            placeholder="Pesquisar simulado pelo título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="search-icon" size={18} />
        </div>
        <div className="filters-dropdowns">
          <Select 
            placeholder="Filtrar por Área"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            options={areas}
          />
          <Select 
            placeholder="Filtrar por Ano"
            value={anoFilter}
            onChange={(e) => setAnoFilter(e.target.value)}
            options={anos}
          />
          {(areaFilter || anoFilter || searchTerm) && (
            <button 
              className="clear-filters-btn" 
              onClick={() => { setAreaFilter(''); setAnoFilter(''); setSearchTerm(''); }}
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid de Cards de Provas */}
      {filteredExams.length > 0 ? (
        <div className="exams-grid">
          {filteredExams.map((prova) => (
            <Card key={prova.id} className="exam-card hover-lift" variant="default">
              <div className="exam-card-header">
                {getTipoBadge(prova.tipo)}
                <span className="exam-year">{prova.ano}</span>
              </div>
              
              <div className="exam-card-body">
                <h4 className="exam-title">{prova.titulo}</h4>
                <div className="exam-details-meta">
                  <div className="meta-item">
                    <BookOpen size={16} />
                    <span>{prova.area}</span>
                  </div>
                  <div className="meta-item">
                    <HelpCircle size={16} />
                    <span>{prova.totalQuestoes} Questões</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{prova.tempoLimite} Minutos</span>
                  </div>
                </div>
              </div>

              <div className="exam-card-footer">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => navigate(`/student/exams/${prova.id}`)}
                >
                  Iniciar Simulado
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="empty-exams-state glass text-center">
          <FileText size={48} className="empty-icon" />
          <h4>Nenhum simulado encontrado</h4>
          <p>Não há simulados cadastrados ou ativos que correspondam aos filtros selecionados.</p>
          {(areaFilter || anoFilter || searchTerm) && (
            <Button 
              variant="outline" 
              onClick={() => { setAreaFilter(''); setAnoFilter(''); setSearchTerm(''); }}
            >
              Resetar Filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
