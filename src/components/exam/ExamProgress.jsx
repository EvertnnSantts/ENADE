import React from 'react';
import './ExamProgress.css';

export default function ExamProgress({ 
  total, 
  current, 
  answers, 
  flags = [], 
  onNavigate 
}) {
  const percentComplete = Math.round((Object.keys(answers).length / total) * 100);

  return (
    <div className="exam-progress-card glass">
      <div className="exam-progress-header">
        <span className="progress-label">Progresso do Simulado</span>
        <span className="progress-percentage">{percentComplete}% concluído</span>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${percentComplete}%` }} />
      </div>

      <div className="question-grid-header">
        Navegação de Questões
      </div>

      <div className="question-grid">
        {Array.from({ length: total }).map((_, idx) => {
          const qNum = idx + 1;
          const isCurrent = current === idx;
          const isAnswered = answers[idx] !== undefined && answers[idx] !== '';
          const isFlagged = flags.includes(idx);
          
          let btnClass = 'grid-item';
          if (isCurrent) btnClass += ' current';
          else if (isFlagged) btnClass += ' flagged';
          else if (isAnswered) btnClass += ' answered';

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => onNavigate(idx)}
              aria-label={`Ir para a questão ${qNum}`}
            >
              {qNum}
            </button>
          );
        })}
      </div>

      <div className="grid-legend">
        <div className="legend-item">
          <span className="legend-dot legend-current" />
          <span>Atual</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-answered" />
          <span>Respondida</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-flagged" />
          <span>Revisar</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot legend-empty" />
          <span>Pendente</span>
        </div>
      </div>
    </div>
  );
}
