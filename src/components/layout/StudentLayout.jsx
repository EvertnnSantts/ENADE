import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, History, Trophy, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './StudentLayout.css';

const STUDENT_MENU = [
  { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Simulados', path: '/student/exams', icon: FileText },
  { label: 'Histórico', path: '/student/history', icon: History },
  { label: 'Ranking', path: '/student/ranking', icon: Trophy },
  { label: 'Meu Perfil', path: '/student/profile', icon: User },
];

const ROUTE_TITLES = {
  '/student/dashboard': 'Painel do Aluno',
  '/student/exams': 'Simulados Disponíveis',
  '/student/history': 'Histórico de Simulados',
  '/student/ranking': 'Ranking das Instituições',
  '/student/profile': 'Meu Perfil',
};

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Painel do Aluno');

  // Atualizar o título baseado na rota ativa
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Correspondência de rotas dinâmicas
    if (currentPath.match(/^\/student\/exams\/[^/]+\/result/)) {
      setPageTitle('Resultado do Simulado');
    } else if (currentPath.match(/^\/student\/exams\/[^/]+/)) {
      setPageTitle('Simulado em Andamento');
    } else {
      setPageTitle(ROUTE_TITLES[currentPath] || 'Plataforma ENADE');
    }
  }, [location]);

  // Fechar sidebar no mobile quando muda de página
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  }, [location]);

  return (
    <div className="layout-wrapper">
      <Sidebar 
        items={STUDENT_MENU} 
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
