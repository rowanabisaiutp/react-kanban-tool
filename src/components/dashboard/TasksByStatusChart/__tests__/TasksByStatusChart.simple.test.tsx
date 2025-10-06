import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>
}));

jest.mock('../../../ui/Card', () => {
  return function MockCard({ children }: any) {
    return <div data-testid="card">{children}</div>;
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

describe('TasksByStatusChart Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart title', () => {
    render(<TasksByStatusChart tasks={mockTasks} />);
    expect(screen.getByText('Tareas por Estado')).toBeInTheDocument();
  });

  it('renders chart container and components', () => {
    render(<TasksByStatusChart tasks={mockTasks} />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders chart elements', () => {
    render(<TasksByStatusChart tasks={mockTasks} />);
    
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('handles empty tasks array', () => {
    render(<TasksByStatusChart tasks={[]} />);
    
    expect(screen.getByText('Tareas por Estado')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });
});
