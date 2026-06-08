import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { getInitials } from '../../utils/formatters';
import './Navbar.css';

export default function Navbar({ title, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-toggle-btn" onClick={onToggleSidebar} aria-label="Alternar menu">
          <Menu size={20} />
        </button>
        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" aria-label="Notificações">
          <Bell size={20} />
          <span className="notification-badge" />
        </button>

        <div className="navbar-user-menu">
          <button 
            className="navbar-profile-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className="navbar-avatar">
              {user ? getInitials(user.nome) : 'U'}
            </div>
            <span className="navbar-username">{user?.nome?.split(' ')[0]}</span>
            <ChevronDown size={14} className={`navbar-chevron ${dropdownOpen ? 'rotated' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="navbar-dropdown glass animate-scaleIn">
              <div className="dropdown-header">
                <p className="dropdown-name">{user?.nome}</p>
                <p className="dropdown-email">{user?.email}</p>
                <p className="dropdown-role">{user?.role === 'admin' ? 'Administrador' : 'Aluno'}</p>
              </div>
              
              <div className="dropdown-divider" />
              
              <button className="dropdown-item logout-item" onClick={logout}>
                <LogOut size={16} />
                <span>Sair da Conta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
