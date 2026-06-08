import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

export default function ExamTimer({ durationMinutes, onTimeUp, onTick }) {
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        const next = prev - 1;
        if (onTick) onTick(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp, onTick]);

  const isLowTime = secondsLeft < 300; // Menos de 5 minutos (300 segundos)

  return (
    <div className={`exam-timer-wrapper ${isLowTime ? 'time-low' : ''}`} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-2) var(--space-4)',
      borderRadius: 'var(--radius-full)',
      background: isLowTime ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
      border: `1px solid ${isLowTime ? 'var(--color-danger)' : 'var(--glass-border)'}`,
      color: isLowTime ? 'var(--color-danger)' : 'var(--text-primary)',
      fontWeight: '600',
      fontSize: 'var(--font-size-sm)',
      transition: 'all var(--transition-fast)'
    }}>
      <Clock size={16} className={isLowTime ? 'animate-pulse' : ''} />
      <span>{formatTime(secondsLeft)}</span>
    </div>
  );
}
