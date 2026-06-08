import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, FileText, Trophy, Clock, BarChart3, ChevronRight } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Seção Hero */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content animate-slideInLeft">
            <div className="hero-badge">Exames de Alto Nível</div>
            <h1 className="hero-title">
              Prepare-se para o <span className="gradient-text">ENADE</span> com Maestria
            </h1>
            <p className="hero-subtitle">
              A plataforma definitiva de simulados para estudantes e ferramentas de gestão de desempenho para instituições de ensino superior.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Começar Agora
                <ChevronRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-lg">
                Já tenho uma conta
              </Link>
            </div>
          </div>
          
          <div className="hero-visual animate-fadeIn">
            <div className="visual-card-wrapper">
              <div className="visual-card glass">
                <div className="visual-card-header">
                  <div className="circle red" />
                  <div className="circle yellow" />
                  <div className="circle green" />
                </div>
                <div className="visual-card-body">
                  <div className="mock-exam-header">
                    <span className="mock-badge">Simulado</span>
                    <span className="mock-timer">03:45:12</span>
                  </div>
                  <div className="mock-line title" />
                  <div className="mock-line p1" />
                  <div className="mock-line p2" />
                  <div className="mock-options">
                    <div className="mock-opt selected">
                      <span className="letter">A</span>
                      <div className="opt-line" />
                    </div>
                    <div className="mock-opt">
                      <span className="letter">B</span>
                      <div className="opt-line" />
                    </div>
                    <div className="mock-opt">
                      <span className="letter">C</span>
                      <div className="opt-line" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section className="features-section container">
        <div className="section-header text-center">
          <h2 className="section-title">O que oferecemos?</h2>
          <p className="section-desc">Ferramentas avançadas para potencializar os resultados no exame oficial.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card glass hover-lift">
            <div className="feature-icon-wrapper fg-primary">
              <FileText size={24} />
            </div>
            <h3 className="feature-title">Simulados Completos</h3>
            <p className="feature-text">
              Questões reais e inéditas, divididas em formação geral e componentes específicos, com cronômetro real.
            </p>
          </div>

          <div className="feature-card glass hover-lift">
            <div className="feature-icon-wrapper fg-success">
              <Trophy size={24} />
            </div>
            <h3 className="feature-title">Ranking Nacional</h3>
            <p className="feature-text">
              Compare as médias de notas de diferentes faculdades e veja sua instituição no topo do ranking.
            </p>
          </div>

          <div className="feature-card glass hover-lift">
            <div className="feature-icon-wrapper fg-warning">
              <BarChart3 size={24} />
            </div>
            <h3 className="feature-title">Histórico Detalhado</h3>
            <p className="feature-text">
              Acompanhe sua pontuação ao longo das tentativas com relatórios completos e áreas de melhoria.
            </p>
          </div>

          <div className="feature-card glass hover-lift">
            <div className="feature-icon-wrapper fg-info">
              <Clock size={24} />
            </div>
            <h3 className="feature-title">Timer e Condições Reais</h3>
            <p className="feature-text">
              Treine sob a pressão do tempo regulamentado pelo INEP com alertas visuais de tempo limite.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Estatísticas */}
      <section className="stats-section">
        <div className="container stats-container">
          <div className="stats-item">
            <span className="stats-number">500+</span>
            <span className="stats-label">Questões Cadastradas</span>
          </div>
          <div className="stats-item">
            <span className="stats-number">50+</span>
            <span className="stats-label">Universidades Parceiras</span>
          </div>
          <div className="stats-item">
            <span className="stats-number">10K+</span>
            <span className="stats-label">Simulados Realizados</span>
          </div>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section className="how-it-works container">
        <div className="section-header text-center">
          <h2 className="section-title">Como Funciona?</h2>
          <p className="section-desc">Passos simples para iniciar sua jornada de preparação.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3 className="step-title">Cadastre-se</h3>
            <p className="step-text">Insira seus dados, RA, CPF e selecione sua universidade cadastrada.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3 className="step-title">Faça o Simulado</h3>
            <p className="step-text">Escolha a prova de seu curso e realize-a com controle de tempo.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3 className="step-title">Veja os Resultados</h3>
            <p className="step-text">Receba nota imediata, veja as corretas e compare sua posição no ranking.</p>
          </div>
        </div>
      </section>

      {/* Seção Final de Chamada para Ação */}
      <section className="cta-section container">
        <div className="cta-box glass">
          <h2 className="cta-title">Pronto para dar o próximo passo?</h2>
          <p className="cta-text">Comece a treinar agora mesmo e garanta sua regularidade no ENADE com ótimas notas.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Registrar-se Gratuitamente
          </Link>
        </div>
      </section>
    </div>
  );
}
