import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock simple de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock del componente Button
jest.mock('../../../ui/Button', () => {
  return function MockButton({ children, onClick, ...props }: any) {
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  };
});

// Mock del componente UserDetectionPanel
jest.mock('../../../ui/UserDetectionPanel', () => {
  return function MockUserDetectionPanel() {
    return <div data-testid="user-detection-panel">User Detection Panel</div>;
  };
});

// Wrapper para React Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Importar después de los mocks
import Navbar from '../Navbar';

describe('Navbar Component - Simple Test', () => {
  const mockOnAddColumn = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with title', () => {
    renderWithRouter(<Navbar title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render with subtitle when provided', () => {
    renderWithRouter(<Navbar title="Test Title" subtitle="Test Subtitle" />);
    
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    renderWithRouter(<Navbar title="Test Title" />);
    
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  it('should render hamburger menu button', () => {
    renderWithRouter(<Navbar title="Test Title" />);
    
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
  });

  it('should toggle menu when hamburger is clicked', () => {
    renderWithRouter(<Navbar title="Test Title" />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    expect(hamburgerButton).not.toHaveClass('navbar__hamburger--active');
    
    fireEvent.click(hamburgerButton);
    expect(hamburgerButton).toHaveClass('navbar__hamburger--active');
    
    fireEvent.click(hamburgerButton);
    expect(hamburgerButton).not.toHaveClass('navbar__hamburger--active');
  });

  it('should show dropdown menu when menu is open', () => {
    renderWithRouter(<Navbar title="Test Title" />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    expect(screen.getAllByText('Usuario Actual')).toHaveLength(2);
    expect(screen.getByText('Usuarios Conectados')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it('should close menu when close button is clicked', () => {
    renderWithRouter(<Navbar title="Test Title" />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    expect(screen.getAllByText('Usuario Actual')).toHaveLength(2);
    
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    
    // Verificamos que el dropdown no tenga la clase activa
    const dropdown = screen.getAllByText('Usuario Actual')[0].closest('.navbar__dropdown');
    expect(dropdown).not.toHaveClass('navbar__dropdown--active');
  });

  it('should close menu when backdrop is clicked', () => {
    renderWithRouter(<Navbar title="Test Title" />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    expect(screen.getAllByText('Usuario Actual')).toHaveLength(2);
    
    const dropdown = screen.getAllByText('Usuario Actual')[0].closest('.navbar__dropdown');
    fireEvent.click(dropdown!);
    
    // Verificamos que el dropdown no tenga la clase activa
    expect(dropdown).not.toHaveClass('navbar__dropdown--active');
  });

  it('should render back button when showBackButton is true', () => {
    renderWithRouter(<Navbar title="Test Title" showBackButton onBack={mockOnBack} />);
    
    expect(screen.getAllByText('← Volver al Tablero')).toHaveLength(2);
  });

  it('should call onBack when back button is clicked', () => {
    renderWithRouter(<Navbar title="Test Title" showBackButton onBack={mockOnBack} />);
    
    const backButtons = screen.getAllByText('← Volver al Tablero');
    fireEvent.click(backButtons[0]); // Click the first one (main navbar)
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should render add column button when showAddColumnButton is true', () => {
    renderWithRouter(<Navbar title="Test Title" showAddColumnButton onAddColumn={mockOnAddColumn} />);
    
    expect(screen.getAllByText('+ Agregar Columna')).toHaveLength(2);
  });

  it('should call onAddColumn when add column button is clicked', () => {
    renderWithRouter(<Navbar title="Test Title" showAddColumnButton onAddColumn={mockOnAddColumn} />);
    
    const addColumnButtons = screen.getAllByText('+ Agregar Columna');
    fireEvent.click(addColumnButtons[0]); // Click the first one (main navbar)
    
    expect(mockOnAddColumn).toHaveBeenCalledTimes(1);
  });

  it('should render dashboard buttons when showDashboardButton is true', () => {
    renderWithRouter(<Navbar title="Test Title" showDashboardButton />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    expect(screen.getByText('📊 Dashboard Principal')).toBeInTheDocument();
    expect(screen.getByText('📈 Métricas Detalladas')).toBeInTheDocument();
    expect(screen.getByText('📋 Reportes')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Configuración')).toBeInTheDocument();
  });

  it('should navigate to dashboard when dashboard button is clicked', () => {
    renderWithRouter(<Navbar title="Test Title" showDashboardButton />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    const dashboardButton = screen.getByText('📊 Dashboard Principal');
    fireEvent.click(dashboardButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should navigate to metrics when metrics button is clicked', () => {
    renderWithRouter(<Navbar title="Test Title" showDashboardButton />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    const metricsButton = screen.getByText('📈 Métricas Detalladas');
    fireEvent.click(metricsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/metrics');
  });

  it('should navigate to reports when reports button is clicked', () => {
    renderWithRouter(<Navbar title="Test Title" showDashboardButton />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    const reportsButton = screen.getByText('📋 Reportes');
    fireEvent.click(reportsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/reports');
  });

  it('should navigate to settings when settings button is clicked', () => {
    renderWithRouter(<Navbar title="Test Title" showDashboardButton />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    const settingsButton = screen.getByText('⚙️ Configuración');
    fireEvent.click(settingsButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/settings');
  });

  it('should render user detection panel', () => {
    renderWithRouter(<Navbar title="Test Title" />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    expect(screen.getByTestId('user-detection-panel')).toBeInTheDocument();
  });

  it('should render with correct CSS classes', () => {
    const { container } = renderWithRouter(<Navbar title="Test Title" />);
    
    expect(container.firstChild).toHaveClass('navbar');
    expect(screen.getByText('Test Title').closest('.navbar__title-section')).toBeInTheDocument();
  });

  it('should render user info in dropdown', () => {
    renderWithRouter(<Navbar title="Test Title" />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    expect(screen.getAllByText('Usuario Actual')).toHaveLength(2);
    expect(screen.getByText('Administrador del proyecto')).toBeInTheDocument();
  });

  it('should close menu after navigation', () => {
    renderWithRouter(<Navbar title="Test Title" showDashboardButton />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburgerButton);
    
    expect(screen.getByText('📊 Dashboard Principal')).toBeInTheDocument();
    
    const dashboardButton = screen.getByText('📊 Dashboard Principal');
    fireEvent.click(dashboardButton);
    
    // El menú debería cerrarse después de la navegación
    // Verificamos que el dropdown no tenga la clase activa
    const dropdown = screen.getByText('📊 Dashboard Principal').closest('.navbar__dropdown');
    expect(dropdown).not.toHaveClass('navbar__dropdown--active');
  });

  it('should handle all props combinations', () => {
    renderWithRouter(
      <Navbar 
        title="Complex Title" 
        subtitle="Complex Subtitle"
        showBackButton 
        showAddColumnButton 
        showDashboardButton 
        onBack={mockOnBack}
        onAddColumn={mockOnAddColumn}
      />
    );
    
    expect(screen.getByText('Complex Title')).toBeInTheDocument();
    expect(screen.getByText('Complex Subtitle')).toBeInTheDocument();
    expect(screen.getAllByText('← Volver al Tablero')).toHaveLength(2);
    expect(screen.getAllByText('+ Agregar Columna')).toHaveLength(2);
  });
});
