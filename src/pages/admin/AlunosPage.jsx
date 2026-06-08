import React, { useState, useMemo } from 'react';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Search, Users, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import './AlunosPage.css';

export default function AlunosPage() {
  const [search, setSearch] = useState('');
  const [faculdadeFilter, setFaculdadeFilter] = useState('');
  const [cursoFilter, setCursoFilter] = useState('');

  // Mapear faculdades para o filtro
  const faculdades = useMemo(() => {
    return mockData.faculdades.map(f => ({ value: f.id, label: f.sigla }));
  }, []);

  // Mapear cursos para o filtro
  const cursos = useMemo(() => {
    return mockData.cursos.map(c => ({ value: c.nome, label: c.nome }));
  }, []);

  // Filtrar lista de alunos
  const filteredAlunos = useMemo(() => {
    return mockData.alunos.map(aluno => {
      // Obter faculdade do aluno
      const facul = mockData.faculdades.find(f => f.id === aluno.faculdadeId);
      
      // Contar provas realizadas por este aluno
      const totalProvas = mockData.resultados.filter(r => r.alunoId === aluno.id).length;

      return {
        ...aluno,
        faculdadeSigla: facul ? facul.sigla : 'Outra',
        provasRealizadas: totalProvas
      };
    })
    .filter(aluno => {
      const matchesSearch = 
        aluno.nome.toLowerCase().includes(search.toLowerCase()) ||
        aluno.ra.includes(search) ||
        aluno.cpf.includes(search);
      const matchesFacul = faculdadeFilter ? aluno.faculdadeId === faculdadeFilter : true;
      const matchesCurso = cursoFilter ? aluno.curso === cursoFilter : true;

      return matchesSearch && matchesFacul && matchesCurso;
    });
  }, [search, faculdadeFilter, cursoFilter]);

  const handleExport = () => {
    toast.success('Lista de alunos exportada para CSV com sucesso!');
  };

  return (
    <div className="alunos-page animate-fadeIn">
      {/* Barra de Filtros */}
      <div className="alunos-filters-bar glass">
        <div className="search-bar">
          <Input
            placeholder="Buscar por nome, RA ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="search-icon" size={18} />
        </div>
        
        <div className="filters-selectors">
          <Select
            placeholder="Faculdade"
            value={faculdadeFilter}
            onChange={(e) => setFaculdadeFilter(e.target.value)}
            options={faculdades}
          />
          <Select
            placeholder="Curso"
            value={cursoFilter}
            onChange={(e) => setCursoFilter(e.target.value)}
            options={cursos}
          />
          <Button variant="outline" onClick={handleExport} title="Exportar dados">
            <Download size={16} />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Grid com a Tabela */}
      <Card className="alunos-table-card">
        <div className="alunos-table-header">
          <div className="title">
            <Users size={18} />
            <span>Total de Estudantes: {filteredAlunos.length}</span>
          </div>
        </div>

        <Table
          headers={[
            { label: 'Nome Completo' },
            { label: 'RA / Registro', align: 'center' },
            { label: 'Faculdade', align: 'center' },
            { label: 'Curso' },
            { label: 'Semestre', align: 'center' },
            { label: 'Provas Feitas', align: 'center' }
          ]}
          isEmpty={filteredAlunos.length === 0}
        >
          {filteredAlunos.map((row) => (
            <tr key={row.id}>
              <td>
                <div className="student-info-cell">
                  <strong>{row.nome}</strong>
                  <span>{row.email}</span>
                </div>
              </td>
              <td className="text-center">{row.ra}</td>
              <td className="text-center font-bold text-primary">{row.faculdadeSigla}</td>
              <td>{row.curso}</td>
              <td className="text-center">{row.semestre}º</td>
              <td className="text-center font-semibold">{row.provasRealizadas}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
