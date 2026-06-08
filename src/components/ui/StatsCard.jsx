import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatsCard.css';

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, // { value: '12%', positive: true }
  variant = 'default',
  className = ''
}) {
  return (
    <Card className={`stats-card stats-card-${variant} ${className}`} variant={variant === 'glass' ? 'glass' : 'default'}>
      <div className="stats-card-content">
        <div className="stats-card-main">
          <p className="stats-card-title">{title}</p>
          <h3 className="stats-card-value">{value}</h3>
          
          {(trend || description) && (
            <div className="stats-card-footer">
              {trend && (
                <span className={`stats-card-trend ${trend.positive ? 'trend-positive' : 'trend-negative'}`}>
                  {trend.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {trend.value}
                </span>
              )}
              {description && <span className="stats-card-desc">{description}</span>}
            </div>
          )}
        </div>
        
        {Icon && (
          <div className="stats-card-icon-wrapper">
            <Icon className="stats-card-icon" size={24} />
          </div>
        )}
      </div>
    </Card>
  );
}
