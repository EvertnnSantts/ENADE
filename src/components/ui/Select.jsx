import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';

/**
 * Select estilizado do Design System ENADE.
 *
 * @param {string}   label
 * @param {string}   placeholder
 * @param {string}   error
 * @param {string}   helperText
 * @param {Array<{value:string, label:string}>} options
 * @param {boolean}  required
 * @param {boolean}  disabled
 */
const Select = forwardRef(
  (
    {
      label,
      placeholder,
      error,
      helperText,
      options = [],
      required = false,
      disabled = false,
      value,
      onChange,
      id,
      className = '',
      ...rest
    },
    ref
  ) => {
    const fieldId =
      id || `select-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;

    const hasPlaceholder = !value && placeholder;

    const rootClasses = [
      'select-field',
      error && 'select-field--error',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={rootClasses}>
        {label && (
          <label
            htmlFor={fieldId}
            className={`select-field__label${required ? ' select-field__label--required' : ''}`}
          >
            {label}
          </label>
        )}

        <div className="select-field__wrapper">
          <select
            ref={ref}
            id={fieldId}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
            }
            className={`select-field__control${hasPlaceholder ? ' select-field__control--placeholder' : ''}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <span className="select-field__chevron" aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </div>

        {error && (
          <span id={`${fieldId}-error`} className="select-field__error" role="alert">
            {error}
          </span>
        )}

        {!error && helperText && (
          <span id={`${fieldId}-helper`} className="select-field__helper">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
