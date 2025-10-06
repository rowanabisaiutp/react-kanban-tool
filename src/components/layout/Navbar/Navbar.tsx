import React, { useState } from 'react';
import Button from '../../ui/Button';
import { useNavigate } from 'react-router-dom';
import UserDetectionPanel from '../../ui/UserDetectionPanel';

interface NavbarProps {
  title: string;
  subtitle?: string;
  showDashboardButton?: boolean;
  showAddColumnButton?: boolean;
  showBackButton?: boolean;
  onAddColumn?: () => void;
  onBack?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  title, 
  subtitle, 
  showDashboardButton = false, 
  showAddColumnButton = false,
  showBackButton = false,
  onAddColumn,
  onBack
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };


  return (
    <div className="navbar">
      <div className="navbar__content">
        <div className="navbar__title-section">
          <h1 className="navbar__title">{title}</h1>
          {subtitle && <p className="navbar__subtitle">{subtitle}</p>}
        </div>
        
        {/* Botón hamburguesa */}
        <button 
          className={`navbar__hamburger ${isMenuOpen ? 'navbar__hamburger--active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
          <span className="navbar__hamburger-line"></span>
        </button>
        
        {/* Acciones del navbar (visibles en desktop) */}
        <div className="navbar__actions">


          {showBackButton && (
            <Button
              variant="secondary"
              size="md"
              onClick={onBack}
            >
              ← Volver al Tablero
            </Button>
          )}
          {showAddColumnButton && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onAddColumn}
            >
              + Agregar Columna
            </Button>
          )}
        </div>
      </div>
      
      {/* Menú desplegable */}
      <div 
        className={`navbar__dropdown ${isMenuOpen ? 'navbar__dropdown--active' : ''}`}
        onClick={handleBackdropClick}
      >
        <div className="navbar__dropdown-content">
          <button className="navbar__dropdown-close" onClick={closeMenu} aria-label="Close menu">
            ×
          </button>
          
          {/* Información del usuario actual */}
          <div className="navbar__dropdown-section">
            <div className="navbar__dropdown-section-title">Usuario Actual</div>
            <div className="navbar__dropdown-user-info">
              <div className="navbar__dropdown-user-avatar">U</div>
              <div className="navbar__dropdown-user-details">
                <h3>Usuario Actual</h3>
                <p>Administrador del proyecto</p>
              </div>
            </div>
          </div>
          
          {/* Panel de detección de usuarios en tiempo real (mobile) */}
          <div className="navbar__dropdown-section">
            <div className="navbar__dropdown-section-title">Usuarios Conectados</div>
            <div className="navbar__dropdown-user-detection">
              <UserDetectionPanel 
                showDetails={false}
                maxUsers={10}
                onUserClick={(_user) => {
                  // Usuario seleccionado (funcionalidad futura)
                }}
              />
            </div>
          </div>
          
          {/* Acciones */}
          <div className="navbar__dropdown-section">
            <div className="navbar__dropdown-section-title">Acciones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {showDashboardButton && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      navigate('/dashboard');
                      closeMenu();
                    }}
                  >
                    📊 Dashboard Principal
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigate('/dashboard/metrics');
                      closeMenu();
                    }}
                  >
                    📈 Métricas Detalladas
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigate('/dashboard/reports');
                      closeMenu();
                    }}
                  >
                    📋 Reportes
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      navigate('/dashboard/settings');
                      closeMenu();
                    }}
                  >
                    ⚙️ Configuración
                  </Button>
                </div>
              )}
              {showBackButton && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    onBack?.();
                    closeMenu();
                  }}
                >
                  ← Volver al Tablero
                </Button>
              )}
              {showAddColumnButton && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onAddColumn?.();
                    closeMenu();
                  }}
                >
                  + Agregar Columna
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
