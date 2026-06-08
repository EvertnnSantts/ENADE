import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, FileText, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './AdminLayout.css';

const ADMIN_MENU = [
  { label: 'Painel Geral', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Faculdades', path: '/admin/faculdades', icon: Building2 },
  { label: 'Alunos', path: '/admin/alunos', icon: Users },
  { label: 'Provas', path: '/admin/provas', icon: FileText },
  { label: 'Ranking', path: '/admin/ranking', icon: Trophy },
];

const ROUTE_TITLES = {
  '/admin/dashboard': 'Painel Administrativo',
  '/admin/faculdades': 'Gerenciamento de Faculdades',
  '/admin/faculdades/new': 'Nova Faculdade',
  '/admin/alunos': 'Gerenciamento de Alunos',
  '/admin/provas': 'Gerenciamento de Provas',
  '/admin/provas/new': 'Nova Prova',
  '/admin/ranking': 'Ranking das Instituições',
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Painel Administrativo');

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Correspondência para rotas dinâmicas
    if (currentPath.match(/^\/admin\/faculdades\/[^/]+\/edit/)) {
      setPageTitle('Editar Faculdade');
    } else if (currentPath.match(/^\/admin\/provas\/[^/]+\/edit/)) {
      setPageTitle('Editar Prova');
    } else if (currentPath.match(/^\/admin\/provas\/[^/]+\/questoes\/new/)) {
      setPageTitle('Adicionar Questão');
    } else if (currentPath.match(/^\/admin\/provas\/[^/]+\/questoes/)) {
      setPageTitle('Questões da Prova');
    } else {
      setPageTitle(ROUTE_TITLES[currentPath] || 'Administração ENADE');
    }
  }, [location]);

  // Fechar sidebar no mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  }, [location]);

  return (
    <div className="layout-wrapper admin-theme">
      <Sidebar 
        items={ADMIN_MENU} 
        user={user} 
        onLogout={logout} 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`layout-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar 
          title={pageTitle} 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className="layout-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
