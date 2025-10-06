import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Task } from '../../../types';
import Card from '../../ui/Card';
import './TasksByStatusChart.css';

interface TasksByStatusChartProps {
  tasks: Task[];
}

const TasksByStatusChart: React.FC<TasksByStatusChartProps> = ({ tasks }) => {
  const chartData = useMemo(() => {
    const statusCounts = tasks.reduce((acc, task) => {
      const status = task.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusLabels: Record<string, string> = {
      'todo': 'Por hacer',
      'in-progress': 'En progreso',
      'done': 'Completadas'
    };

    const colors = {
      'todo': '#3b82f6',
      'in-progress': '#f59e0b',
      'done': '#22c55e'
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
      color: colors[status as keyof typeof colors] || '#6b7280'
    }));
  }, [tasks]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="pie-tooltip">
          <p className="pie-tooltip__label">{payload[0].name}</p>
          <p className="pie-tooltip__value">{payload[0].value} tareas</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="chart-card" padding="md">
      <h3 className="chart-card__title">Tareas por Estado</h3>
      <div className="chart-card__content">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span style={{ color: 'var(--color-text-primary)' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TasksByStatusChart;
