import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Task } from '../../../types';
import Card from '../../ui/Card';
import './TasksCompletedChart.css';

interface TasksCompletedChartProps {
  tasks: Task[];
}

const TasksCompletedChart: React.FC<TasksCompletedChartProps> = ({ tasks }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      
      const completedTasks = tasks.filter(task => 
        task.status === 'done' && 
        task.completedAt && 
        new Date(task.completedAt).toDateString() === date.toDateString()
      ).length;

      return {
        date: date.toLocaleDateString('es-ES', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        completadas: completedTasks,
        total: tasks.filter(task => 
          new Date(task.createdAt).toDateString() === date.toDateString()
        ).length
      };
    });

    return last7Days;
  }, [tasks]);

  return (
    <Card className="chart-card" padding="md">
      <h3 className="chart-card__title">Tareas Completadas (7 días)</h3>
      <div className="chart-card__content">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                color: 'var(--color-text-primary)'
              }}
            />
            <Line
              type="monotone"
              dataKey="completadas"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TasksCompletedChart;
