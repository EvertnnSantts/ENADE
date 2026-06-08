import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { Plus, Pencil, Trash2, ListChecks, Calendar, Clock, BookOpen, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProvasPage.css';

export default function ProvasPage() {
  const navigate = useNavigate();
  const [list, setList] = useState(mockData.provas);
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Áreas únicas para filtros
  const areas = useMemo(() => {
    const allAreas = mockData.provas.map(p => p.area);
    return [...new Set(allAreas)].map(a => ({ value: a, label: a }));
  }, []);

  const statusOptions = [
    { value: 'publicada', label: 'Publicada' },
    { value: 'rascunho', label: 'Rascunho' }
  ];

  // Filtrar lista de provas
  const filteredList = useMemo(() => {
    return list.filter(item => {
      const matchesSearch = item.titulo.toLowerCase().includes(search.toLowerCase());
      const matchesArea = areaFilter ? item.area === areaFilter : true;
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [list, search, areaFilter, statusFilter]);

  // Excluir prova
  const handleDelete = (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja excluir o simulado "${titulo}"?`)) {
      const updated = list.filter(item => item.id !== id);
      
      // Remover do mockData global
      const idx = mockData.provas.findIndex(p => p.id === id);
      if (idx !== -1) mockData.provas.splice(idx, 1);

      // Também remover questões associadas
      const questaoIdsToRemove = mockData.questoes
        .filter(q => q.provaId === id)
        .map(q => q.id);
      
      questaoIdsToRemove.forEach(qId => {
        const qIdx = mockData.questoes.findIndex(q => q.id === qId);
        if (qIdx !== -1) mockData.questoes.splice(qIdx, 1);
      });

      setList(updated);
      toast.success('Simulado excluído com sucesso.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'publicada':
        return <Badge variant="success">Publicada</Badge>;
      case 'rascunho':
        return <Badge variant="warning">Rascunho</Badge>;
      default:
        return <Badge variant="neutral">Inativo</Badge>;
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'completa': return 'Completa';
      case 'formacao_geral': return 'Formação Geral';
      case 'componente_especifico': return 'Componente Específico';
      default: return 'Geral';
    }
  };

  return (
    <div className="provas-page animate-fadeIn">
      {/* Barra de Filtros e Ações */}
      <div className="page-actions-header">
        <div className="filters-wrapper">
          <div className="search-bar">
            <Input
              placeholder="Buscar simulado pelo título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="search-icon" size={18} />
          </div>
          <div className="select-filters">
            <Select
              placeholder="Filtrar por Área"
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              options={areas}
            />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            {(areaFilter || statusFilter || search) && (
              <button 
                className="clear-filters-btn" 
                onClick={() => { setAreaFilter(''); setStatusFilter(''); setSearch(''); }}
              >
                Limpar
              </button>
            )}
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/provas/new')}>
          <Plus size={16} />
          Novo Simulado
        </Button>
      </div>

      {/* Tabela de Provas */}
      <Card className="provas-table-card">
        <Table
          headers={[
            { label: 'Título do Simulado' },
            { label: 'Área do Conhecimento' },
            { label: 'Tipo', align: 'center' },
            { label: 'Ano', align: 'center' },
            { label: 'Qtd. Questões', align: 'center' },
            { label: 'Tempo Limite', align: 'center' },
            { label: 'Status', align: 'center' },
            { label: 'Ações', align: 'right', width: '220px' }
          ]}
          isEmpty={filteredList.length === 0}
        >
          {filteredList.map((row) => {
            // Contar total de questões reais cadastradas para essa prova
            const totalQuestoesReais = mockData.questoes.filter(q => q.provaId === row.id).length;

            return (
              <tr key={row.id}>
                <td>
                  <div className="exam-info-cell">
                    <strong>{row.titulo}</strong>
                  </div>
                </td>
                <td>
                  <div className="exam-meta-cell">
                    <BookOpen size={12} />
                    <span>{row.area}</span>
                  </div>
                </td>
                <td className="text-center">{getTipoLabel(row.tipo)}</td>
                <td className="text-center">
                  <div className="exam-meta-cell center">
                    <Calendar size={12} />
                    <span>{row.ano}</span>
                  </div>
                </td>
                <td className="text-center font-semibold">{totalQuestoesReais} / {row.totalQuestoes}</td>
                <td className="text-center">
                  <div className="exam-meta-cell center">
                    <Clock size={12} />
                    <span>{row.tempoLimite} Min</span>
                  </div>
                </td>
                <td className="text-center">{getStatusBadge(row.status)}</td>
                <td className="text-right actions-cell">
                  <Button 
                    size="sm" 
                    variant="primary" 
                    onClick={() => navigate(`/admin/provas/${row.id}/questoes`)}
                    title="Gerenciar Questões"
                  >
                    <ListChecks size={14} />
                    Questões
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate(`/admin/provas/${row.id}/edit`)}
                    title="Editar Simulado"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    onClick={() => handleDelete(row.id, row.titulo)}
                    title="Excluir Simulado"
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
