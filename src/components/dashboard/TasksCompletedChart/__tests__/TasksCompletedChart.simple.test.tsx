import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>
}));

jest.mock('../../../ui/Card', () => {
  return function MockCard({ children }: any) {
    return <div data-testid="card">{children}</div>;
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
  }
];

describe('TasksCompletedChart Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart title', () => {
    render(<TasksCompletedChart tasks={mockTasks} />);
    expect(screen.getByText('Tareas Completadas (7 días)')).toBeInTheDocument();
  });

  it('renders chart container and components', () => {
    render(<TasksCompletedChart tasks={mockTasks} />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('renders chart elements', () => {
    render(<TasksCompletedChart tasks={mockTasks} />);
    
    expect(screen.getByTestId('line')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('handles empty tasks array', () => {
    render(<TasksCompletedChart tasks={[]} />);
    
    expect(screen.getByText('Tareas Completadas (7 días)')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});
