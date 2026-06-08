import { forwardRef } from 'react';
import './Card.css';

/**
 * Card reutilizável do Design System ENADE.
 *
 * @param {'default'|'elevated'|'outlined'|'glass'} variant
 * @param {boolean} hoverable  – ativa animação de hover
 * @param {boolean} clickable  – torna o card clicável (role=button)
 * @param {function} onClick
 */
const Card = forwardRef(
  (
    {
      children,
      variant = 'default',
      hoverable = false,
      clickable = false,
      onClick,
      className = '',
      ...rest
    },
    ref
  ) => {
    const classes = [
      'card',
      `card--${variant}`,
      (hoverable || clickable) && 'card--hoverable',
      clickable && 'card--clickable',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const interactiveProps = clickable
      ? {
          role: 'button',
          tabIndex: 0,
          onClick,
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick?.(e);
            }
          },
        }
      : {};

    return (
      <div ref={ref} className={classes} {...interactiveProps} {...rest}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/* ---------- Sub-components ---------- */

const CardHeader = ({ children, title, subtitle, className = '', ...rest }) => (
  <div className={`card__header ${className}`} {...rest}>
    <div>
      {title && <h3 className="card__header-title">{title}</h3>}
      {subtitle && <p className="card__header-subtitle">{subtitle}</p>}
      {children}
    </div>
  </div>
);

CardHeader.displayName = 'CardHeader';

const CardBody = ({ children, flush = false, className = '', ...rest }) => (
  <div
    className={`card__body${flush ? ' card__body--flush' : ''} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

CardBody.displayName = 'CardBody';

const CardFooter = ({ children, className = '', ...rest }) => (
  <div className={`card__footer ${className}`} {...rest}>
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';

export default Card;
export { Card, CardHeader, CardBody, CardFooter };
