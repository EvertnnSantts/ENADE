import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

/**
 * Botão reutilizável do Design System ENADE.
 *
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading  – exibe spinner e desabilita interações
 * @param {boolean} fullWidth
 * @param {ReactNode} leftIcon
 * @param {ReactNode} rightIcon
 */
const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon = null,
      rightIcon = null,
      className = '',
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const classes = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      loading && 'btn--loading',
      fullWidth && 'btn--fullwidth',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...rest}
      >
        {loading ? (
          <Loader2 size={iconSize} className="btn__spinner" aria-hidden="true" />
        ) : (
          leftIcon && (
            <span className="btn__icon" aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}

        {children && <span>{children}</span>}

        {!loading && rightIcon && (
          <span className="btn__icon" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
