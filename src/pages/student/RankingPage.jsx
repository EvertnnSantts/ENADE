import React, { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { Trophy, Star, Building, Search } from 'lucide-react';
import { formatNota } from '../../utils/formatters';
import './RankingPage.css';

export default function RankingPage() {
  const { user } = useAuth();
  const [cursoFilter, setCursoFilter] = useState('');

  // Obter lista de cursos disponíveis para filtros
  const cursos = useMemo(() => {
    return mockData.cursos.map(c => ({ value: c.nome, label: c.nome }));
  }, []);

  // Calcular ranking das faculdades (média de 0 a 5)
  // Cálculo: Nota do simulado (0 a 100) / 20 = Nota do ENADE (0 a 5)
  const ranking = useMemo(() => {
    return mockData.faculdades.map(facul => {
      // Se houver filtro de curso, verificar se a faculdade oferece esse curso
      if (cursoFilter) {
        const targetCourse = mockData.cursos.find(c => c.nome === cursoFilter);
        if (!targetCourse || !facul.cursos.includes(targetCourse.id)) {
          return null; // Faculdade não oferece o curso
        }
      }

      // Filtrar alunos desta faculdade
      let alunosFacul = mockData.alunos.filter(a => a.faculdadeId === facul.id);
      
      // Se houver filtro de curso, filtrar alunos desse curso
      if (cursoFilter) {
        alunosFacul = alunosFacul.filter(a => a.curso === cursoFilter);
      }

      const alunosIds = alunosFacul.map(a => a.id);

      // Resultados desses alunos
      const resultadosFacul = mockData.resultados.filter(r => 
        alunosIds.includes(r.alunoId) || 
        // Mock fallback para student-1 se estiver na faculdade-1
        (facul.id === 'faculdade-1' && r.alunoId === 'student-1')
      );

      let notaEnade = facul.notaMedia; // fallback estático

      if (resultadosFacul.length > 0) {
        const notasSimulados = resultadosFacul.map(r => r.nota);
        const mediaCem = notasSimulados.reduce((acc, curr) => acc + curr, 0) / resultadosFacul.length;
        // Converter de 0-100 para 0-5
        notaEnade = mediaCem / 20;
      } else if (cursoFilter) {
        notaEnade = 0; // Sem respostas para o curso nesta faculdade
      }

      return {
        ...facul,
        notaCalculada: parseFloat(notaEnade.toFixed(2)),
        totalRespostas: resultadosFacul.length
      };
    })
    .filter(Boolean) // Remove faculdades sem o curso se filtrado
    // Ordenar por nota calculada decrescente
    .sort((a, b) => b.notaCalculada - a.notaCalculada);
  }, [cursoFilter]); // Recalcular se mudar filtros

  // Separar o Top 3 para o pódio
  const topThree = useMemo(() => {
    return {
      first: ranking[0] || null,
      second: ranking[1] || null,
      third: ranking[2] || null
    };
  }, [ranking]);

  // Restante das faculdades (da 4ª posição em diante)
  const remainingRanking = useMemo(() => {
    return ranking.slice(3);
  }, [ranking]);

  return (
    <div className="ranking-page animate-fadeIn">
      {/* Filtro do Ranking */}
      <div className="ranking-filters-bar glass">
        <div className="filters-label">
          <Trophy size={20} className="text-warning" />
          <h4>Classificação das Universidades</h4>
        </div>
        <div className="filters-selectors">
          <Select 
            placeholder="Filtrar por Curso"
            value={cursoFilter}
            onChange={(e) => setCursoFilter(e.target.value)}
            options={cursos}
          />
          {cursoFilter && (
            <button className="clear-filters" onClick={() => setCursoFilter('')}>
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Pódio dos Top 3 */}
      <div className="podium-container">
        {/* 2º Lugar */}
        {topThree.second && (
          <div className="podium-col podium-second animate-slideUp">
            <div className="podium-card glass">
              <span className="podium-place">2</span>
              <div className="podium-icon-box silver">
                <Building size={24} />
              </div>
              <h4 className="podium-name">{topThree.second.sigla}</h4>
              <p className="podium-fullname">{topThree.second.nome}</p>
              <div className="podium-score">
                <Star size={14} fill="currentColor" />
                <span>{formatNota(topThree.second.notaCalculada)} / 5.0</span>
              </div>
            </div>
            <div className="podium-block block-second" />
          </div>
        )}

        {/* 1º Lugar */}
        {topThree.first && (
          <div className="podium-col podium-first animate-slideUp">
            <div className="podium-card glass">
              <span className="podium-place">1</span>
              <div className="podium-icon-box gold">
                <Trophy size={32} />
              </div>
              <h4 className="podium-name">{topThree.first.sigla}</h4>
              <p className="podium-fullname">{topThree.first.nome}</p>
              <div className="podium-score">
                <Star size={16} fill="currentColor" />
                <span>{formatNota(topThree.first.notaCalculada)} / 5.0</span>
              </div>
            </div>
            <div className="podium-block block-first" />
          </div>
        )}

        {/* 3º Lugar */}
        {topThree.third && (
          <div className="podium-col podium-third animate-slideUp">
            <div className="podium-card glass">
              <span className="podium-place">3</span>
              <div className="podium-icon-box bronze">
                <Building size={24} />
              </div>
              <h4 className="podium-name">{topThree.third.sigla}</h4>
              <p className="podium-fullname">{topThree.third.nome}</p>
              <div className="podium-score">
                <Star size={14} fill="currentColor" />
                <span>{formatNota(topThree.third.notaCalculada)} / 5.0</span>
              </div>
            </div>
            <div className="podium-block block-third" />
          </div>
        )}
      </div>

      {/* Lista Geral do Ranking */}
      <Card className="ranking-table-card" title="Classificação Geral">
        <Table
          headers={[
            { label: 'Posição', align: 'center', width: '80px' },
            { label: 'Instituição' },
            { label: 'Localização' },
            { label: 'Simulados Realizados', align: 'center' },
            { label: 'Nota Conceito ENADE', align: 'center' },
            { label: 'Desempenho Visual', width: '200px' }
          ]}
        >
          {/* Renderizar Top 3 na Tabela */}
          {ranking.slice(0, 3).map((facul, idx) => {
            const isUserFacul = facul.id === user?.faculdadeId;
            return (
              <tr key={facul.id} className={`ranking-row-top3 ${isUserFacul ? 'user-facul-highlight' : ''}`}>
                <td className="text-center font-bold">
                  <span className={`place-badge place-${idx + 1}`}>{idx + 1}º</span>
                </td>
                <td>
                  <div className="facul-name-cell">
                    <strong>{facul.sigla}</strong>
                    <span>{facul.nome}</span>
                  </div>
                </td>
                <td>{facul.cidade} - {facul.estado}</td>
                <td className="text-center">{facul.totalRespostas}</td>
                <td className="text-center font-bold text-primary">{formatNota(facul.notaCalculada)}</td>
                <td>
                  <div className="progress-bar-tiny">
                    <div className="fill" style={{ width: `${(facul.notaCalculada / 5) * 100}%` }} />
                  </div>
                </td>
              </tr>
            );
          })}

          {/* Renderizar Restantes */}
          {remainingRanking.map((facul, idx) => {
            const pos = idx + 4;
            const isUserFacul = facul.id === user?.faculdadeId;
            return (
              <tr key={facul.id} className={isUserFacul ? 'user-facul-highlight' : ''}>
                <td className="text-center font-semibold">{pos}º</td>
                <td>
                  <div className="facul-name-cell">
                    <strong>{facul.sigla}</strong>
                    <span>{facul.nome}</span>
                  </div>
                </td>
                <td>{facul.cidade} - {facul.estado}</td>
                <td className="text-center">{facul.totalRespostas}</td>
                <td className="text-center font-semibold">{formatNota(facul.notaCalculada)}</td>
                <td>
                  <div className="progress-bar-tiny">
                    <div className="fill" style={{ width: `${(facul.notaCalculada / 5) * 100}%` }} />
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}
