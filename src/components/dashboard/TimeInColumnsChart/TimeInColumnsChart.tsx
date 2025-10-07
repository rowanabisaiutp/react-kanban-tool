import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Task } from '../../../types';
import Card from '../../ui/Card';
import './TimeInColumnsChart.css';

interface TimeInColumnsChartProps {
  tasks: Task[];
}

const TimeInColumnsChart: React.FC<TimeInColumnsChartProps> = ({ tasks }) => {
  const chartData = useMemo(() => {
    const statusLabels: Record<string, string> = {
      'todo': 'Por hacer',
      'in-progress': 'En progreso',
      'done': 'Completadas'
    };

    const statusColors: Record<string, string> = {
      'todo': '#3b82f6',
      'in-progress': '#f59e0b',
      'done': '#22c55e'
    };

    // Calcular tiempo promedio en cada estado
    const statusTimes: Record<string, number[]> = {};
    
    tasks.forEach(task => {
      if (!statusTimes[task.status]) {
        statusTimes[task.status] = [];
      }
      
      // Calcular tiempo desde creación hasta ahora (o completado)
      const startTime = new Date(task.createdAt).getTime();
      const endTime = task.completedAt 
        ? new Date(task.completedAt).getTime()
        : new Date().getTime();
      
      const timeInHours = (endTime - startTime) / (1000 * 60 * 60);
      statusTimes[task.status].push(timeInHours);
    });

    return Object.entries(statusTimes).map(([status, times]) => {
      const avgTime = times.length > 0 
        ? times.reduce((sum, time) => sum + time, 0) / times.length 
        : 0;
      
      return {
        estado: statusLabels[status] || status,
        tiempo: Math.round(avgTime * 10) / 10,
        color: statusColors[status] || '#6b7280'
      };
    });
  }, [tasks]);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bar-tooltip">
          <p className="bar-tooltip__label">{payload[0].payload.estado}</p>
          <p className="bar-tooltip__value">
            {payload[0].value} horas promedio
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="chart-card" padding="md">
      <h3 className="chart-card__title">Tiempo Promedio en Columnas</h3>
      <div className="chart-card__content">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="estado" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="tiempo" 
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TimeInColumnsChart;
