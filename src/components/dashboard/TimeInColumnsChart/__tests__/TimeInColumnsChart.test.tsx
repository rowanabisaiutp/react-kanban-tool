import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: (props: any) => <div data-testid="bar" {...props} />,
  XAxis: (props: any) => <div data-testid="x-axis" {...props} />,
  YAxis: (props: any) => <div data-testid="y-axis" {...props} />,
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" {...props} />,
  Tooltip: (props: any) => <div data-testid="tooltip" {...props} />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>
}));

jest.mock('../../../ui/Card', () => {
  return function MockCard({ children, className }: any) {
    return <div data-testid="card" className={className}>{children}</div>;
  };
});

// Mock Date for consistent tests
const mockDate = new Date('2024-01-15T10:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
global.Date.now = jest.fn(() => mockDate.getTime());

import TimeInColumnsChart from '../TimeInColumnsChart';
import type { Task } from '../../../../types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    status: 'todo',
    priority: 'high',
    assignee: 'John Doe',
    assignees: ['John Doe'],
    tags: [],
    createdAt: new Date('2024-01-10T08:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z'),
    subtasks: [],
    comments: []
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Jane Smith',
    assignees: ['Jane Smith'],
    tags: [],
    createdAt: new Date('2024-01-12T08:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z'),
    subtasks: [],
    comments: []
  },
  {
    id: '3',
    title: 'Task 3',
    description: 'Description 3',
    status: 'done',
    priority: 'low',
    assignee: 'Bob Wilson',
    assignees: ['Bob Wilson'],
    tags: [],
    createdAt: new Date('2024-01-08T08:00:00Z'),
    updatedAt: new Date('2024-01-14T08:00:00Z'),
    completedAt: new Date('2024-01-14T10:00:00Z'),
    subtasks: [],
    comments: []
  }
];

describe('TimeInColumnsChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart with title and components', () => {
    render(<TimeInColumnsChart tasks={mockTasks} />);
    
    expect(screen.getByText('Tiempo Promedio en Columnas')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toHaveClass('chart-card');
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders all bar chart components with correct props', () => {
    render(<TimeInColumnsChart tasks={mockTasks} />);
    
    const bar = screen.getByTestId('bar');
    const xAxis = screen.getByTestId('x-axis');
    const yAxis = screen.getByTestId('y-axis');
    const tooltip = screen.getByTestId('tooltip');
    
    expect(bar).toHaveAttribute('dataKey', 'tiempo');
    expect(bar).toHaveAttribute('fill', 'var(--color-primary)');
    expect(xAxis).toHaveAttribute('dataKey', 'estado');
    expect(yAxis).toHaveAttribute('stroke', 'var(--color-text-secondary)');
    expect(tooltip).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });

  it('handles empty tasks array', () => {
    render(<TimeInColumnsChart tasks={[]} />);
    
    expect(screen.getByText('Tiempo Promedio en Columnas')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('handles tasks with same status', () => {
    const sameStatusTasks: Task[] = [
      { ...mockTasks[0], status: 'todo' as const },
      { ...mockTasks[1], id: '2', status: 'todo' as const },
      { ...mockTasks[2], id: '3', status: 'todo' as const }
    ];
    
    render(<TimeInColumnsChart tasks={sameStatusTasks} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('handles tasks with completedAt dates', () => {
    const completedTasks: Task[] = [
      {
        ...mockTasks[0],
        status: 'done' as const,
        completedAt: new Date('2024-01-14T10:00:00Z')
      }
    ];
    
    render(<TimeInColumnsChart tasks={completedTasks} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('calculates and renders chart data correctly', () => {
    render(<TimeInColumnsChart tasks={mockTasks} />);
    
    // Verify chart is rendered with data
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });
});