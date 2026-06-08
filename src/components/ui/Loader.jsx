import React from 'react';
import './Loader.css';

export default function Loader({ fullPage = false, size = 'md', className = '' }) {
  if (fullPage) {
    return (
      <div className="loader-fullpage">
        <div className={`spinner spinner-${size}`} />
        <p className="loader-text">Carregando...</p>
      </div>
    );
  }

  return (
    <div className={`loader-inline ${className}`}>
      <div className={`spinner spinner-${size}`} />
    </div>
  );
}
