import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';

// Proteções de Rota
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Páginas Públicas
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Páginas do Estudante (Aluno)
import StudentDashboard from './pages/student/DashboardPage';
import ExamListPage from './pages/student/ExamListPage';
import ExamTakePage from './pages/student/ExamTakePage';
import ExamResultPage from './pages/student/ExamResultPage';
import HistoryPage from './pages/student/HistoryPage';
import RankingPage from './pages/student/RankingPage';
import ProfilePage from './pages/student/ProfilePage';

// Páginas do Administrador (Instituição)
import AdminDashboard from './pages/admin/DashboardPage';
import FaculdadesPage from './pages/admin/FaculdadesPage';
import FaculdadeFormPage from './pages/admin/FaculdadeFormPage';
import AlunosPage from './pages/admin/AlunosPage';
import ProvasPage from './pages/admin/ProvasPage';
import ProvaFormPage from './pages/admin/ProvaFormPage';
import QuestoesPage from './pages/admin/QuestoesPage';
import QuestaoFormPage from './pages/admin/QuestaoFormPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Rotas do Aluno (Protegidas por login) */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="exams" element={<ExamListPage />} />
            <Route path="exams/:id" element={<ExamTakePage />} />
            <Route path="exams/:id/result" element={<ExamResultPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="ranking" element={<RankingPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Rotas de Administração (Protegidas por Admin) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="faculdades" element={<FaculdadesPage />} />
            <Route path="faculdades/new" element={<FaculdadeFormPage />} />
            <Route path="faculdades/:id/edit" element={<FaculdadeFormPage />} />
            <Route path="alunos" element={<AlunosPage />} />
            <Route path="provas" element={<ProvasPage />} />
            <Route path="provas/new" element={<ProvaFormPage />} />
            <Route path="provas/:id/edit" element={<ProvaFormPage />} />
            <Route path="provas/:id/questoes" element={<QuestoesPage />} />
            <Route path="provas/:id/questoes/new" element={<QuestaoFormPage />} />
            <Route path="provas/:id/questoes/:qId/edit" element={<QuestaoFormPage />} />
            <Route path="ranking" element={<RankingPage />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Rota Fallback (Redirecionar para a landing page) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      
      {/* Container de Alertas (Notificações Flutuantes) */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1e293b',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1e293b',
            },
          },
        }}
      />
    </AuthProvider>
  );
}
