import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: (props: any) => <div data-testid="line" {...props} />,
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

// Mock Date
const mockDate = new Date('2024-01-15T10:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

import TasksCompletedChart from '../TasksCompletedChart';
import type { Task } from '../../../../types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    status: 'done',
    priority: 'high',
    assignee: 'John Doe',
    assignees: ['John Doe'],
    tags: [],
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z'),
    completedAt: new Date('2024-01-15T09:00:00Z'),
    subtasks: [],
    comments: []
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    status: 'done',
    priority: 'medium',
    assignee: 'Jane Smith',
    assignees: ['Jane Smith'],
    tags: [],
    createdAt: new Date('2024-01-14T08:00:00Z'),
    updatedAt: new Date('2024-01-14T08:00:00Z'),
    completedAt: new Date('2024-01-14T10:00:00Z'),
    subtasks: [],
    comments: []
  },
  {
    id: '3',
    title: 'Task 3',
    description: 'Description 3',
    status: 'todo',
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

describe('TasksCompletedChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart with title and components', () => {
    render(<TasksCompletedChart tasks={mockTasks} />);
    
    expect(screen.getByText('Tareas Completadas (7 días)')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toHaveClass('chart-card');
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders all chart components with correct props', () => {
    render(<TasksCompletedChart tasks={mockTasks} />);
    
    const line = screen.getByTestId('line');
    const xAxis = screen.getByTestId('x-axis');
    
    expect(line).toHaveAttribute('dataKey', 'completadas');
    expect(line).toHaveAttribute('stroke', 'var(--color-primary)');
    expect(xAxis).toHaveAttribute('dataKey', 'date');
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('handles empty tasks array', () => {
    render(<TasksCompletedChart tasks={[]} />);
    
    expect(screen.getByText('Tareas Completadas (7 días)')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('handles tasks without completedAt', () => {
    const tasksWithoutCompletedAt: Task[] = [{
      ...mockTasks[0],
      status: 'done' as const,
      completedAt: undefined
    }];
    
    render(<TasksCompletedChart tasks={tasksWithoutCompletedAt} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('handles mixed task statuses', () => {
    const mixedTasks: Task[] = [
      { ...mockTasks[0], status: 'done' as const },
      { ...mockTasks[1], status: 'in-progress' as const },
      { ...mockTasks[2], status: 'todo' as const }
    ];
    
    render(<TasksCompletedChart tasks={mixedTasks} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Tareas Completadas (7 días)')).toBeInTheDocument();
  });

  it('calculates and renders chart data', () => {
    render(<TasksCompletedChart tasks={mockTasks} />);
    
    // Verify chart is rendered with data
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
  });
});