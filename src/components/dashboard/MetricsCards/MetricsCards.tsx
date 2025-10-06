import React, { useMemo } from 'react';
import type { Task } from '../../../types';
import Card from '../../ui/Card';
import './MetricsCards.css';

interface MetricsCardsProps {
  tasks: Task[];
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ tasks }) => {
  const metrics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    
    // Tareas completadas hoy
    const completedToday = tasks.filter(task => 
      task.status === 'done' && 
      task.completedAt && 
      new Date(task.completedAt) >= today
    ).length;

    // Tareas completadas esta semana
    const completedThisWeek = tasks.filter(task => 
      task.status === 'done' && 
      task.completedAt && 
      new Date(task.completedAt) >= weekStart
    ).length;

    // Promedio de tareas completadas por día (últimos 7 días)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      return tasks.filter(task => 
        task.status === 'done' && 
        task.completedAt && 
        new Date(task.completedAt).toDateString() === date.toDateString()
      ).length;
    });
    const avgCompletedPerDay = (last7Days.reduce((sum, count) => sum + count, 0) / 7).toFixed(1);

    // Tareas vencidas
    const overdueTasks = tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < today && 
      task.status !== 'done'
    ).length;

    // Velocidad del equipo (horas estimadas completadas)
    const completedTasksWithHours = tasks.filter(task => 
      task.status === 'done' && 
      task.estimatedHours
    );
    const totalCompletedHours = completedTasksWithHours.reduce(
      (sum, task) => sum + (task.estimatedHours || 0), 
      0
    );

    return {
      completedToday,
      completedThisWeek,
      avgCompletedPerDay,
      overdueTasks,
      totalCompletedHours
    };
  }, [tasks]);

  return (
    <div className="metrics-cards">
      <Card className="metrics-card" padding="md">
        <div className="metrics-card__icon">✅</div>
        <div className="metrics-card__content">
          <div className="metrics-card__value">{metrics.completedToday}</div>
          <div className="metrics-card__label">Completadas hoy</div>
        </div>
      </Card>

      <Card className="metrics-card" padding="md">
        <div className="metrics-card__icon">📅</div>
        <div className="metrics-card__content">
          <div className="metrics-card__value">{metrics.completedThisWeek}</div>
          <div className="metrics-card__label">Esta semana</div>
        </div>
      </Card>

      <Card className="metrics-card" padding="md">
        <div className="metrics-card__icon">📊</div>
        <div className="metrics-card__content">
          <div className="metrics-card__value">{metrics.avgCompletedPerDay}</div>
          <div className="metrics-card__label">Promedio/día</div>
        </div>
      </Card>

      <Card className="metrics-card" padding="md">
        <div className="metrics-card__icon">⚠️</div>
        <div className="metrics-card__content">
          <div className="metrics-card__value">{metrics.overdueTasks}</div>
          <div className="metrics-card__label">Vencidas</div>
        </div>
      </Card>

      <Card className="metrics-card" padding="md">
        <div className="metrics-card__icon">⚡</div>
        <div className="metrics-card__content">
          <div className="metrics-card__value">{metrics.totalCompletedHours}h</div>
          <div className="metrics-card__label">Velocidad equipo</div>
        </div>
      </Card>
    </div>
  );
};

export default MetricsCards;
