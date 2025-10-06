import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../../../ui/Card', () => {
  return function MockCard({ children }: any) {
    return <div data-testid="card">{children}</div>;
  };
});

// Mock Date
const mockDate = new Date('2024-01-15T10:00:00Z');
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

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
    tags: [],
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z'),
    completedAt: new Date('2024-01-15T09:00:00Z'),
    estimatedHours: 5,
    subtasks: [],
    comments: []
  }
];

describe('MetricsCards Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders metric cards', () => {
    render(<MetricsCards tasks={mockTasks} />);
    
    expect(screen.getByText('Completadas hoy')).toBeInTheDocument();
    expect(screen.getByText('Esta semana')).toBeInTheDocument();
    expect(screen.getByText('Promedio/día')).toBeInTheDocument();
    expect(screen.getByText('Vencidas')).toBeInTheDocument();
    expect(screen.getByText('Velocidad equipo')).toBeInTheDocument();
  });

  it('renders correct number of cards', () => {
    render(<MetricsCards tasks={mockTasks} />);
    
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(5);
  });

  it('handles empty tasks array', () => {
    render(<MetricsCards tasks={[]} />);
    
    expect(screen.getAllByText('0')).toHaveLength(3);
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByText('0h')).toBeInTheDocument();
  });

  it('displays metric icons', () => {
    render(<MetricsCards tasks={mockTasks} />);
    
    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getByText('📅')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });
});
