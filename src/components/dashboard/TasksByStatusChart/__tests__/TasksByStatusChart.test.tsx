import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: (props: any) => <div data-testid="pie" {...props} />,
  Cell: (props: any) => <div data-testid="cell" {...props} />,
  Tooltip: (props: any) => <div data-testid="tooltip" {...props} />,
  Legend: (props: any) => <div data-testid="legend" {...props} />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>
}));

jest.mock('../../../ui/Card', () => {
  return function MockCard({ children, className }: any) {
    return <div data-testid="card" className={className}>{children}</div>;
  };
});

import TasksByStatusChart from '../TasksByStatusChart';
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
    createdAt: new Date('2024-01-15T08:00:00Z'),
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
    createdAt: new Date('2024-01-14T08:00:00Z'),
    updatedAt: new Date('2024-01-14T08:00:00Z'),
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
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z'),
    subtasks: [],
    comments: []
  }
];

describe('TasksByStatusChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart with title and components', () => {
    render(<TasksByStatusChart tasks={mockTasks} />);
    
    expect(screen.getByText('Tareas por Estado')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toHaveClass('chart-card');
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders all pie chart components with correct props', () => {
    render(<TasksByStatusChart tasks={mockTasks} />);
    
    const pie = screen.getByTestId('pie');
    const tooltip = screen.getByTestId('tooltip');
    const legend = screen.getByTestId('legend');
    
    expect(pie).toHaveAttribute('dataKey', 'value');
    expect(pie).toHaveAttribute('cx', '50%');
    expect(pie).toHaveAttribute('cy', '50%');
    expect(tooltip).toBeInTheDocument();
    expect(legend).toBeInTheDocument();
  });

  it('renders cells for each status', () => {
    render(<TasksByStatusChart tasks={mockTasks} />);
    
    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(3); // One for each status
  });

  it('handles empty tasks array', () => {
    render(<TasksByStatusChart tasks={[]} />);
    
    expect(screen.getByText('Tareas por Estado')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('cell')).not.toBeInTheDocument();
  });

  it('handles tasks with same status', () => {
    const sameStatusTasks: Task[] = [
      { ...mockTasks[0], status: 'todo' as const },
      { ...mockTasks[1], id: '2', status: 'todo' as const },
      { ...mockTasks[2], id: '3', status: 'todo' as const }
    ];
    
    render(<TasksByStatusChart tasks={sameStatusTasks} />);
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('cell')).toHaveLength(1); // Only one status
  });

  it('calculates and renders chart data correctly', () => {
    render(<TasksByStatusChart tasks={mockTasks} />);
    
    // Verify chart is rendered with data
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getAllByTestId('cell')).toHaveLength(3);
  });
});