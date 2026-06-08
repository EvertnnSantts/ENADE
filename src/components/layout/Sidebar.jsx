import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { getInitials } from '../../utils/formatters';
import './Sidebar.css';

export default function Sidebar({ items = [], user, onLogout, collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-circle">
            <GraduationCap size={24} />
          </div>
          {!collapsed && <span className="sidebar-logo-text">ENADE</span>}
        </div>
        <button className="sidebar-collapse-btn" onClick={onToggle} aria-label={collapsed ? 'Expandir' : 'Recolher'}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={idx} 
              to={item.path} 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className="sidebar-link-icon" />
              {!collapsed && <span className="sidebar-link-text">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="sidebar-avatar">
            {user ? getInitials(user.nome) : 'U'}
          </div>
          {!collapsed && (
            <div className="sidebar-user-details">
              <p className="sidebar-user-name">{user?.nome?.split(' ')[0]}</p>
              <p className="sidebar-user-role">{user?.role === 'admin' ? 'Painel Admin' : 'Portal Aluno'}</p>
            </div>
          )}
        </div>
        <button className="sidebar-logout-btn" onClick={onLogout} title="Sair da Conta">
          <LogOut size={20} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
