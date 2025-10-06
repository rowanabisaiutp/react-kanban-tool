import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../../../ui/Card', () => {
  return function MockCard({ children, className, ...props }: any) {
    return (
      <div data-testid="card" className={className} {...props}>
        {children}
      </div>
    );
  };
});

// Mock Date for consistent tests
const mockDate = new Date('2024-01-15T10:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
global.Date.now = jest.fn(() => mockDate.getTime());

import MetricsCards from '../MetricsCards';
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
    tags: ['frontend'],
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z'),
    completedAt: new Date('2024-01-15T09:00:00Z'),
    estimatedHours: 5,
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
    tags: ['backend'],
    createdAt: new Date('2024-01-14T08:00:00Z'),
    updatedAt: new Date('2024-01-14T08:00:00Z'),
    completedAt: new Date('2024-01-14T10:00:00Z'),
    estimatedHours: 3,
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
    tags: ['testing'],
    dueDate: new Date('2024-01-14T10:00:00Z'), // Overdue
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z'),
    subtasks: [],
    comments: []
  }
];

describe('MetricsCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all metric cards with correct labels', () => {
    render(<MetricsCards tasks={mockTasks} />);
    
    expect(screen.getByText('Completadas hoy')).toBeInTheDocument();
    expect(screen.getByText('Esta semana')).toBeInTheDocument();
    expect(screen.getByText('Promedio/día')).toBeInTheDocument();
    expect(screen.getByText('Vencidas')).toBeInTheDocument();
    expect(screen.getByText('Velocidad equipo')).toBeInTheDocument();
    
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(5);
  });

  it('calculates and displays correct metrics', () => {
    render(<MetricsCards tasks={mockTasks} />);
    
    // Check specific metric values exist
    expect(screen.getAllByText('2')).toHaveLength(2); // Today and this week
    expect(screen.getByText('0')).toBeInTheDocument(); // Overdue
    expect(screen.getByText('2.0')).toBeInTheDocument(); // Average
    expect(screen.getByText('8h')).toBeInTheDocument(); // Hours
  });

  it('handles empty tasks array', () => {
    render(<MetricsCards tasks={[]} />);
    
    expect(screen.getAllByText('0')).toHaveLength(3);
    expect(screen.getByText('0.0')).toBeInTheDocument(); // Average
    expect(screen.getByText('0h')).toBeInTheDocument(); // Hours
  });

  it('displays correct icons for each metric', () => {
    render(<MetricsCards tasks={mockTasks} />);
    
    expect(screen.getByText('✅')).toBeInTheDocument(); // Completed today
    expect(screen.getByText('📅')).toBeInTheDocument(); // This week
    expect(screen.getByText('📊')).toBeInTheDocument(); // Average
    expect(screen.getByText('⚠️')).toBeInTheDocument(); // Overdue
    expect(screen.getByText('⚡')).toBeInTheDocument(); // Velocity
  });

  it('handles tasks without completedAt or estimatedHours', () => {
    const incompleteTasks: Task[] = [
      {
        ...mockTasks[0],
        status: 'done' as const,
        completedAt: undefined,
        estimatedHours: undefined
      }
    ];
    
    render(<MetricsCards tasks={incompleteTasks} />);
    
    expect(screen.getByText('Completadas hoy')).toBeInTheDocument();
    expect(screen.getByText('0h')).toBeInTheDocument();
  });

  it('calculates average correctly over 7 days', () => {
    render(<MetricsCards tasks={mockTasks} />);
    
    // Should show average (2 tasks over 7 days = 2.0)
    expect(screen.getByText('2.0')).toBeInTheDocument();
  });
});