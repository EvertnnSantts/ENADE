import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <p className="footer-text">
          Plataforma ENADE © {new Date().getFullYear()} — Desenvolvido para Simulação Acadêmica.
        </p>
        <div className="footer-links">
          <a href="#" className="footer-link">Sobre o ENADE</a>
          <a href="#" className="footer-link">Termos de Uso</a>
          <a href="#" className="footer-link">Contato</a>
        </div>
      </div>
    </footer>
  );
}
