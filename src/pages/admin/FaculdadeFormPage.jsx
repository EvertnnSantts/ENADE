import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Plus, X, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import './FaculdadeFormPage.css';

export default function FaculdadeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Estados dos inputs
  const [nome, setNome] = useState('');
  const [sigla, setSigla] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  
  // Controle de Cursos (Tags Dinâmicas)
  const [cursos, setCursos] = useState([]);
  const [cursoInput, setCursoInput] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Carregar dados se for Edição
  useEffect(() => {
    if (isEdit) {
      const facul = mockData.faculdades.find(f => f.id === id);
      if (facul) {
        setNome(facul.nome);
        setSigla(facul.sigla);
        setCidade(facul.cidade);
        setEstado(facul.estado);
        setCursos(facul.cursos || []);
      } else {
        toast.error('Faculdade não encontrada.');
        navigate('/admin/faculdades');
      }
    }
  }, [id, isEdit, navigate]);

  const handleAddCurso = () => {
    if (!cursoInput) return;

    if (cursos.includes(cursoInput)) {
      toast.error('Este curso já foi adicionado.');
      return;
    }

    setCursos([...cursos, cursoInput]);
    setCursoInput('');
  };

  const handleRemoveCurso = (cursoId) => {
    setCursos(cursos.filter(c => c !== cursoId));
  };

  const validate = () => {
    const tempErrors = {};
    if (!nome.trim()) tempErrors.nome = 'Nome da faculdade é obrigatório';
    if (!sigla.trim()) tempErrors.sigla = 'Sigla é obrigatória';
    if (!cidade.trim()) tempErrors.cidade = 'Cidade é obrigatória';
    if (!estado) tempErrors.estado = 'Selecione o estado';
    if (cursos.length === 0) tempErrors.cursos = 'Adicione pelo menos 1 curso de graduação';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      if (isEdit) {
        // Atualizar faculdade global
        const idx = mockData.faculdades.findIndex(f => f.id === id);
        if (idx !== -1) {
          mockData.faculdades[idx] = {
            ...mockData.faculdades[idx],
            nome,
            sigla,
            cidade,
            estado,
            cursos
          };
        }
        toast.success('Faculdade atualizada com sucesso!');
      } else {
        // Criar nova faculdade global
        const newFacul = {
          id: crypto.randomUUID(),
          nome,
          sigla,
          cidade,
          estado,
          cursos,
          notaMedia: 0,
          totalAlunos: 0,
          ativo: true,
          createdAt: new Date().toISOString()
        };
        mockData.faculdades.push(newFacul);
        toast.success('Faculdade cadastrada com sucesso!');
      }
      setLoading(false);
      navigate('/admin/faculdades');
    }, 1000);
  };

  const estadoOptions = mockData.estados.map(est => ({
    value: est.sigla,
    label: `${est.sigla} - ${est.nome}`
  }));

  const cursoOptions = mockData.cursos.map(c => ({
    value: c.id,
    label: c.nome
  }));

  return (
    <div className="faculdade-form-page animate-fadeIn">
      {/* Voltar */}
      <div className="form-header-back">
        <button className="back-btn" onClick={() => navigate('/admin/faculdades')}>
          <ArrowLeft size={16} />
          <span>Voltar para a Lista</span>
        </button>
      </div>

      <Card className="form-card" title={isEdit ? 'Editar Faculdade' : 'Cadastrar Nova Faculdade'}>
        <div className="form-card-intro">
          <h3>{isEdit ? 'Editar Faculdade' : 'Cadastrar Nova Faculdade'}</h3>
          <p>Insira as informações básicas e a grade de cursos oferecidos pela instituição.</p>
        </div>

        <form onSubmit={handleSubmit} className="faculdade-form">
          <div className="form-row-2col">
            <Input
              label="Nome da Instituição (Faculdade/Universidade)"
              placeholder="Ex: Universidade de São Paulo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              error={errors.nome}
              required
            />
            <Input
              label="Sigla da Faculdade"
              placeholder="Ex: USP"
              value={sigla}
              onChange={(e) => setSigla(e.target.value)}
              error={errors.sigla}
              required
            />
          </div>

          <div className="form-row-2col">
            <Input
              label="Cidade Sede"
              placeholder="Ex: São Paulo"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              error={errors.cidade}
              required
            />
            <Select
              label="Estado (UF)"
              placeholder="Selecione a UF"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              options={estadoOptions}
              error={errors.estado}
              required
            />
          </div>

          {/* Controle Dinâmico de Cursos */}
          <div className="form-courses-block">
            <label className="courses-label">Cursos de Graduação Ofertados</label>
            <div className="courses-input-row">
              <Select
                placeholder="Selecione um curso para adicionar"
                value={cursoInput}
                onChange={(e) => setCursoInput(e.target.value)}
                options={cursoOptions}
                error={errors.cursos}
              />
              <button 
                type="button" 
                className="add-course-btn"
                onClick={handleAddCurso}
              >
                <Plus size={18} />
                Adicionar
              </button>
            </div>
            {errors.cursos && <span className="courses-error-msg">{errors.cursos}</span>}

            {/* Listagem de Cursos Adicionados */}
            <div className="added-courses-list">
              {cursos.map((cId, i) => {
                const courseObj = mockData.cursos.find(c => c.id === cId);
                const courseName = courseObj ? courseObj.nome : cId;
                return (
                  <div key={i} className="added-course-chip animate-scaleIn">
                    <span>{courseName}</span>
                    <button type="button" onClick={() => handleRemoveCurso(cId)}>
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
              {cursos.length === 0 && (
                <p className="no-courses-placeholder">Nenhum curso adicionado ainda.</p>
              )}
            </div>
          </div>

          <div className="form-actions-row">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/faculdades')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              loading={loading}
            >
              <Save size={16} />
              {isEdit ? 'Salvar Alterações' : 'Cadastrar Faculdade'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
