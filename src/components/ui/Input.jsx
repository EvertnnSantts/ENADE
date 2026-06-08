import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

/**
 * Campo de entrada reutilizável do Design System ENADE.
 *
 * @param {'default'|'error'|'success'} variant
 * @param {'text'|'email'|'password'|'number'} type
 * @param {string}    label
 * @param {string}    helperText
 * @param {string}    error       – texto do erro (também ativa variant error)
 * @param {ReactNode} icon        – ícone prefixo
 * @param {boolean}   required
 */
const Input = forwardRef(
  (
    {
      label,
      helperText,
      error,
      icon = null,
      variant: variantProp,
      type = 'text',
      required = false,
      disabled = false,
      id,
      className = '',
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // Se há erro, força variante error
    const variant = error ? 'error' : variantProp || 'default';

    const fieldId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;

    const rootClasses = [
      'input-field',
      variant !== 'default' && `input-field--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const wrapperClasses = [
      'input-field__wrapper',
      icon && 'input-field__wrapper--has-icon',
      isPassword && 'input-field__wrapper--has-toggle',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={rootClasses}>
        {label && (
          <label
            htmlFor={fieldId}
            className={`input-field__label${required ? ' input-field__label--required' : ''}`}
          >
            {label}
          </label>
        )}

        <div className={wrapperClasses}>
          <input
            ref={ref}
            id={fieldId}
            type={inputType}
            disabled={disabled}
            required={required}
            aria-invalid={variant === 'error'}
            aria-describedby={
              error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
            }
            className="input-field__control"
            {...rest}
          />

          {icon && <span className="input-field__icon" aria-hidden="true">{icon}</span>}

          {isPassword && (
            <button
              type="button"
              className="input-field__toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        {error && (
          <span id={`${fieldId}-error`} className="input-field__error" role="alert">
            {error}
          </span>
        )}

        {!error && helperText && (
          <span id={`${fieldId}-helper`} className="input-field__helper">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
