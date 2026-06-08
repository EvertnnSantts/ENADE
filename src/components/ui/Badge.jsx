import { forwardRef } from 'react';
import './Badge.css';

/**
 * Badge (etiqueta) do Design System ENADE.
 *
 * @param {'primary'|'success'|'warning'|'danger'|'info'|'neutral'} variant
 * @param {'sm'|'md'} size
 * @param {boolean}   dot    – exibe como pequeno círculo
 * @param {boolean}   pulse  – animação de pulso (somente com dot)
 */
const Badge = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      dot = false,
      pulse = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const classes = [
      'badge',
      `badge--${variant}`,
      `badge--${size}`,
      dot && 'badge--dot',
      dot && pulse && 'badge--dot-pulse',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        ref={ref}
        className={classes}
        role={dot ? 'status' : undefined}
        aria-label={dot ? `Status: ${variant}` : undefined}
        {...rest}
      >
        {!dot && children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
