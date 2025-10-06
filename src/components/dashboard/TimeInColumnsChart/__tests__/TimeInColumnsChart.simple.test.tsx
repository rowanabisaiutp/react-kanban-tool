import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
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

describe('TimeInColumnsChart Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart title', () => {
    render(<TimeInColumnsChart tasks={mockTasks} />);
    expect(screen.getByText('Tiempo Promedio en Columnas')).toBeInTheDocument();
  });

  it('renders chart container and components', () => {
    render(<TimeInColumnsChart tasks={mockTasks} />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders chart elements', () => {
    render(<TimeInColumnsChart tasks={mockTasks} />);
    
    expect(screen.getByTestId('bar')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('handles empty tasks array', () => {
    render(<TimeInColumnsChart tasks={[]} />);
    
    expect(screen.getByText('Tiempo Promedio en Columnas')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
