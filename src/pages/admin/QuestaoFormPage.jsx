import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as mockData from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './QuestaoFormPage.css';

export default function QuestaoFormPage() {
  const { id, qId } = useParams(); // id = provaId, qId = questaoId
  const navigate = useNavigate();
  const isEdit = !!qId;

  const [exam, setExam] = useState(null);
  const [tipo, setTipo] = useState('multipla_escolha');
  const [numero, setNumero] = useState('');
  const [categoria, setCategoria] = useState('formacao_geral');
  const [dificuldade, setDificuldade] = useState('medio');
  const [pontos, setPontos] = useState('2');
  const [enunciado, setEnunciado] = useState('');

  // Alternativas para múltipla escolha
  const [alternativas, setAlternativas] = useState([
    { letra: 'A', texto: '', correta: true },
    { letra: 'B', texto: '', correta: false },
    { letra: 'C', texto: '', correta: false },
    { letra: 'D', texto: '', correta: false },
    { letra: 'E', texto: '', correta: false }
  ]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Carregar dados
  useEffect(() => {
    const foundExam = mockData.provas.find(p => p.id === id);
    if (!foundExam) {
      toast.error('Prova não encontrada.');
      navigate('/admin/provas');
      return;
    }
    setExam(foundExam);

    if (isEdit) {
      const q = mockData.questoes.find(quest => quest.id === qId);
      if (q) {
        setTipo(q.tipo);
        setNumero(String(q.numero));
        setCategoria(q.categoria);
        setDificuldade(q.dificuldade);
        setPontos(String(q.pontos));
        setEnunciado(q.enunciado);
        if (q.tipo === 'multipla_escolha' && q.alternativas) {
          setAlternativas(q.alternativas);
        }
      } else {
        toast.error('Questão não encontrada.');
        navigate(`/admin/provas/${id}/questoes`);
      }
    } else {
      // Auto-definir próximo número da questão
      const existingQCount = mockData.questoes.filter(quest => quest.provaId === id).length;
      setNumero(String(existingQCount + 1));
    }
  }, [id, qId, isEdit, navigate]);

  // Atualizar texto de uma alternativa
  const handleAltTextChange = (idx, text) => {
    setAlternativas(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], texto: text };
      return updated;
    });
  };

  // Definir qual alternativa é a correta
  const handleSelectCorrect = (idx) => {
    setAlternativas(prev => {
      return prev.map((alt, i) => ({
        ...alt,
        correta: i === idx
      }));
    });
  };

  const validate = () => {
    const tempErrors = {};
    if (!numero || isNaN(parseInt(numero)) || parseInt(numero) <= 0) {
      tempErrors.numero = 'Número da questão deve ser um inteiro válido';
    }
    if (!enunciado.trim()) {
      tempErrors.enunciado = 'Enunciado é obrigatório';
    }
    if (!pontos || isNaN(parseInt(pontos)) || parseInt(pontos) <= 0) {
      tempErrors.pontos = 'Pontos deve ser um valor maior que zero';
    }

    if (tipo === 'multipla_escolha') {
      const emptyAlts = alternativas.filter(alt => !alt.texto.trim());
      if (emptyAlts.length > 0) {
        tempErrors.alternativas = 'Preencha o texto de todas as alternativas';
      }
      
      const hasCorrect = alternativas.some(alt => alt.correta);
      if (!hasCorrect) {
        tempErrors.alternativas = 'Selecione uma alternativa como a correta';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Preencha corretamente todos os campos.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const cleanQuestoes = {
        id: isEdit ? qId : `q-${Date.now()}`,
        provaId: id,
        numero: parseInt(numero),
        tipo,
        categoria,
        dificuldade,
        pontos: parseInt(pontos),
        enunciado: enunciado.trim(),
        alternativas: tipo === 'multipla_escolha' ? alternativas : null
      };

      if (isEdit) {
        // Atualizar
        const idx = mockData.questoes.findIndex(quest => quest.id === qId);
        if (idx !== -1) {
          mockData.questoes[idx] = cleanQuestoes;
        }
        toast.success(`Questão nº ${numero} atualizada com sucesso!`);
      } else {
        // Inserir
        mockData.questoes.push(cleanQuestoes);
        toast.success(`Questão nº ${numero} adicionada com sucesso!`);
      }

      setLoading(false);
      navigate(`/admin/provas/${id}/questoes`);
    }, 800);
  };

  const tipoOptions = [
    { value: 'multipla_escolha', label: 'Múltipla Escolha' },
    { value: 'discursiva', label: 'Discursiva' }
  ];

  const categoriaOptions = [
    { value: 'formacao_geral', label: 'Formação Geral' },
    { value: 'componente_especifico', label: 'Componente Específico' }
  ];

  const dificuldadeOptions = [
    { value: 'facil', label: 'Fácil' },
    { value: 'medio', label: 'Médio' },
    { value: 'dificil', label: 'Difícil' }
  ];

  return (
    <div className="questao-form-page animate-fadeIn">
      {/* Voltar */}
      <div className="form-header-back">
        <button className="back-btn" onClick={() => navigate(`/admin/provas/${id}/questoes`)}>
          <ArrowLeft size={16} />
          <span>Voltar para Questões</span>
        </button>
      </div>

      <Card className="form-card" title={isEdit ? 'Editar Questão' : 'Nova Questão'}>
        <div className="form-card-intro">
          <h3>{isEdit ? `Editar Questão ${numero}` : 'Adicionar Nova Questão'}</h3>
          <p>Cadastre o enunciado, defina o peso dos pontos e as alternativas corretas.</p>
        </div>

        <form onSubmit={handleSubmit} className="questao-form">
          <div className="form-row-3col">
            <Select
              label="Tipo de Questão"
              placeholder="Selecione o tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              options={tipoOptions}
              disabled={isEdit} // Não permite mudar tipo após criada
              required
            />
            <Input
              label="Número da Questão"
              placeholder="Ex: 1"
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              error={errors.numero}
              required
            />
            <Input
              label="Pontos (Peso)"
              placeholder="Ex: 2 ou 10"
              type="number"
              value={pontos}
              onChange={(e) => setPontos(e.target.value)}
              error={errors.pontos}
              required
            />
          </div>

          <div className="form-row-2col">
            <Select
              label="Categoria"
              placeholder="Selecione a categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              options={categoriaOptions}
              required
            />
            <Select
              label="Dificuldade"
              placeholder="Selecione a dificuldade"
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value)}
              options={dificuldadeOptions}
              required
            />
          </div>

          <div className="form-row">
            <div className="textarea-container">
              <label className="textarea-label">Enunciado da Questão</label>
              <textarea
                placeholder="Insira o texto da pergunta ou enunciado completo..."
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                className={`form-textarea ${errors.enunciado ? 'error' : ''}`}
                required
                rows={5}
              />
              {errors.enunciado && <span className="textarea-error-msg">{errors.enunciado}</span>}
            </div>
          </div>

          {/* Alternativas (apenas se for Múltipla Escolha) */}
          {tipo === 'multipla_escolha' && (
            <div className="alternativas-block">
              <label className="block-label">Alternativas e Resposta Correta</label>
              <p className="block-description">Digite o texto de cada uma das 5 alternativas e selecione o botão de check correspondente à opção correta.</p>
              
              {errors.alternativas && (
                <div className="alts-error-box">{errors.alternativas}</div>
              )}

              <div className="alternativas-inputs-list">
                {alternativas.map((alt, idx) => (
                  <div 
                    key={alt.letra} 
                    className={`alt-input-row ${alt.correta ? 'selected' : ''}`}
                  >
                    <button
                      type="button"
                      className={`alt-correct-selector ${alt.correta ? 'active' : ''}`}
                      onClick={() => handleSelectCorrect(idx)}
                      title="Marcar como correta"
                    >
                      <CheckCircle size={18} />
                      <span className="selector-letter">{alt.letra}</span>
                    </button>
                    <div className="alt-text-input-field">
                      <Input
                        placeholder={`Digite o texto da alternativa ${alt.letra}`}
                        value={alt.texto}
                        onChange={(e) => handleAltTextChange(idx, e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions-row">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/admin/provas/${id}/questoes`)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              loading={loading}
            >
              <Save size={16} />
              {isEdit ? 'Salvar Questão' : 'Adicionar Questão'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
