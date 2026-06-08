import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Footer from './Footer';
import './PublicLayout.css';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      {/* Elementos decorativos de fundo */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />
      
      <header className="public-header">
        <div className="public-header-content container">
          <Link to="/" className="public-logo">
            <GraduationCap size={28} />
            <span>ENADE</span>
          </Link>
          <nav className="public-nav">
            <Link to="/login" className="nav-item">Entrar</Link>
            <Link to="/register" className="nav-item nav-btn">Cadastrar</Link>
          </nav>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
