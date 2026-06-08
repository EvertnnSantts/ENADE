import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { Search, Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './FaculdadesPage.css';

export default function FaculdadesPage() {
  const navigate = useNavigate();
  const [list, setList] = useState(mockData.faculdades);
  const [search, setSearch] = useState('');

  // Filtrar lista
  const filteredList = useMemo(() => {
    return list.filter(item => 
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      item.sigla.toLowerCase().includes(search.toLowerCase()) ||
      item.cidade.toLowerCase().includes(search.toLowerCase())
    );
  }, [list, search]);

  // Alternar ativo/inativo
  const handleToggleStatus = (id) => {
    const updated = list.map(item => {
      if (item.id === id) {
        const nextState = !item.ativo;
        // Refletir no mockData global
        const globalIdx = mockData.faculdades.findIndex(f => f.id === id);
        if (globalIdx !== -1) mockData.faculdades[globalIdx].ativo = nextState;
        
        toast.success(`Faculdade ${item.sigla} foi ${nextState ? 'ativada' : 'desativada'}.`);
        return { ...item, ativo: nextState };
      }
      return item;
    });
    setList(updated);
  };

  // Deletar faculdade
  const handleDelete = (id, sigla) => {
    if (window.confirm(`Tem certeza que deseja excluir a faculdade ${sigla}?`)) {
      const updated = list.filter(item => item.id !== id);
      
      // Atualizar mockData global
      const idx = mockData.faculdades.findIndex(f => f.id === id);
      if (idx !== -1) mockData.faculdades.splice(idx, 1);

      setList(updated);
      toast.success(`Faculdade ${sigla} excluída com sucesso.`);
    }
  };

  return (
    <div className="faculdades-page animate-fadeIn">
      <div className="page-actions-header">
        <div className="search-bar">
          <Input
            placeholder="Pesquisar por nome ou sigla..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="search-icon" size={18} />
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/faculdades/new')}>
          <Plus size={16} />
          Nova Faculdade
        </Button>
      </div>

      <Card className="faculdades-table-card">
        <Table
          headers={[
            { label: 'Instituição (Nome/Sigla)' },
            { label: 'Localização' },
            { label: 'Cursos Ofertados' },
            { label: 'Nota Média', align: 'center' },
            { label: 'Status', align: 'center' },
            { label: 'Ações', align: 'right' }
          ]}
          isEmpty={filteredList.length === 0}
        >
          {filteredList.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="facul-info-cell">
                  <strong>{row.sigla}</strong>
                  <span>{row.nome}</span>
                </div>
              </td>
              <td>{row.cidade} - {row.estado}</td>
              <td>
                <div className="cursos-chips-display">
                  {row.cursos.slice(0, 2).map((cId, i) => {
                    const courseObj = mockData.cursos.find(item => item.id === cId);
                    const label = courseObj ? (courseObj.codigo || courseObj.nome) : cId;
                    return <span key={i} className="curso-tag" title={courseObj ? courseObj.nome : cId}>{label}</span>;
                  })}
                  {row.cursos.length > 2 && (
                    <span className="curso-tag plus" title={row.cursos.slice(2).map(cId => mockData.cursos.find(item => item.id === cId)?.nome || cId).join(', ')}>+{row.cursos.length - 2}</span>
                  )}
                </div>
              </td>
              <td className="text-center font-semibold">{row.notaMedia.toFixed(1)}</td>
              <td className="text-center">
                <button 
                  className="status-toggle-btn"
                  onClick={() => handleToggleStatus(row.id)}
                  title={row.ativo ? 'Clique para desativar' : 'Clique para ativar'}
                >
                  {row.ativo ? (
                    <Badge variant="success">
                      <CheckCircle2 size={12} />
                      Ativa
                    </Badge>
                  ) : (
                    <Badge variant="danger">
                      <XCircle size={12} />
                      Inativa
                    </Badge>
                  )}
                </button>
              </td>
              <td className="text-right actions-cell">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate(`/admin/faculdades/${row.id}/edit`)}
                  title="Editar dados"
                >
                  <Pencil size={14} />
                </Button>
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => handleDelete(row.id, row.sigla)}
                  title="Excluir faculdade"
                >
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
