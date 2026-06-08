import React from 'react';
import Badge from '../ui/Badge';
import { Card } from '../ui/Card';
import './QuestionCard.css';

export default function QuestionCard({ 
  question, 
  selectedAnswer, 
  essayAnswer,
  onChangeAnswer, 
  questionIndex 
}) {
  const isMultipleChoice = question.tipo === 'multipla_escolha';

  const getDifficultyBadge = (dif) => {
    switch (dif) {
      case 'facil': return <Badge variant="success">Fácil</Badge>;
      case 'medio': return <Badge variant="warning">Médio</Badge>;
      case 'dificil': return <Badge variant="danger">Difícil</Badge>;
      default: return null;
    }
  };

  const getCategoryBadge = (cat) => {
    return cat === 'formacao_geral' 
      ? <Badge variant="info">Formação Geral</Badge> 
      : <Badge variant="primary">Componente Específico</Badge>;
  };

  return (
    <Card className="question-card" variant="default">
      <div className="question-card-header">
        <span className="question-number">Questão {questionIndex + 1}</span>
        <div className="question-badges">
          {getCategoryBadge(question.categoria)}
          {getDifficultyBadge(question.dificuldade)}
          <Badge variant="neutral">{question.pontos} Pts</Badge>
        </div>
      </div>

      <div className="question-enunciado">
        <p>{question.enunciado}</p>
      </div>

      <div className="question-answer-area">
        {isMultipleChoice ? (
          <div className="alternatives-list">
            {question.alternativas.map((alt, idx) => {
              const isSelected = selectedAnswer === alt.letra;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`alternative-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => onChangeAnswer(alt.letra)}
                >
                  <div className="alternative-letter">{alt.letra}</div>
                  <div className="alternative-text">{alt.texto}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="essay-area">
            <label className="essay-label" htmlFor={`essay-${question.id}`}>
              Escreva sua resposta discursiva abaixo:
            </label>
            <textarea
              id={`essay-${question.id}`}
              className="essay-textarea"
              placeholder="Digite aqui sua resposta..."
              value={essayAnswer || ''}
              onChange={(e) => onChangeAnswer(e.target.value)}
              rows={8}
            />
            <div className="essay-footer">
              <span className="char-count">
                {(essayAnswer || '').length} caracteres
              </span>
              <span className="essay-hint">
                * Sua resposta será analisada e pontuada.
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
