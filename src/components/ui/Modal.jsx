import { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './Modal.css';

/**
 * Modal (diálogo) do Design System ENADE.
 * Renderizado via React Portal no <body>.
 *
 * @param {boolean}  open
 * @param {function} onClose
 * @param {string}   title
 * @param {'sm'|'md'|'lg'} size
 * @param {ReactNode} footer – conteúdo do rodapé (botões de ação)
 */
const Modal = ({
  open = false,
  onClose,
  title,
  size = 'md',
  footer,
  children,
  className = '',
  ...rest
}) => {
  const overlayRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Fecha com Escape
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  // Bloqueia scroll do body quando aberto
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      // Restaura foco
      previousActiveElement.current?.focus?.();
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  // Click no backdrop fecha
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const overlayClasses = [
    'modal-overlay',
    open ? 'modal-overlay--visible' : 'modal-overlay--hidden',
  ].join(' ');

  const modalClasses = ['modal', `modal--${size}`, className]
    .filter(Boolean)
    .join(' ');

  // Não renderiza nada se nunca foi aberto (evita flash)
  if (!open && !overlayRef.current) return null;

  const content = (
    <div
      ref={overlayRef}
      className={overlayClasses}
      onClick={handleOverlayClick}
      aria-hidden={!open}
    >
      <div
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Diálogo'}
        {...rest}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="modal__header">
            {title && <h2 className="modal__title">{title}</h2>}
            {onClose && (
              <button
                type="button"
                className="modal__close"
                onClick={onClose}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal__body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

Modal.displayName = 'Modal';

export default Modal;
