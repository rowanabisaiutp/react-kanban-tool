import type { Board, Task } from '../types';

export type UserStatus = 'available' | 'busy' | 'away' | 'online' | 'offline';

// Datos mock para desarrollo
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Diseñar wireframes',
    description: 'Crear wireframes de baja fidelidad para pantallas principales',
    status: 'todo',
    priority: 'high',
    assignee: 'Ana García',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['diseño', 'ux', 'wireframes'],
    subtasks: [
      { id: '1-1', title: 'Login', completed: false, createdAt: new Date('2024-01-15') },
      { id: '1-2', title: 'Dashboard', completed: false, createdAt: new Date('2024-01-15') },
      { id: '1-3', title: 'Perfil', completed: true, createdAt: new Date('2024-01-15') }
    ],
    comments: [
      {
        id: '1',
        content: '¿Revisión de wireframes?',
        author: 'Ana García',
        createdAt: new Date('2024-01-15T10:30:00')
      },
      {
        id: '2',
        content: 'Wireframes OK, falta registro',
        author: 'Carlos López',
        createdAt: new Date('2024-01-15T14:20:00')
      },
      {
        id: '3',
        content: '@Ana García ¿Agregar registro?',
        author: 'María Rodríguez',
        createdAt: new Date('2024-01-15T16:45:00')
      }
    ],
    dueDate: new Date('2024-01-25'),
    estimatedHours: 8
  },
  {
    id: '2',
    title: 'Configurar entorno',
    description: 'Instalar dependencias y configurar Vite + TypeScript',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Ana García',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
    tags: ['setup', 'desarrollo'],
    subtasks: [
      { id: '2-1', title: 'Instalar Vite', completed: true, createdAt: new Date('2024-01-14') },
      { id: '2-2', title: 'Configurar TypeScript', completed: true, createdAt: new Date('2024-01-14') },
      { id: '2-3', title: 'Configurar ESLint', completed: false, createdAt: new Date('2024-01-14') }
    ],
    comments: [
      {
        id: '1',
        content: 'Entorno configurado, faltan dependencias',
        author: 'Ana García',
        createdAt: new Date('2024-01-16T09:15:00')
      },
      {
        id: '2',
        content: '@Ana García ¿Qué falta?',
        author: 'Carlos López',
        createdAt: new Date('2024-01-16T11:30:00')
      }
    ],
    dueDate: new Date('2024-01-20'),
    estimatedHours: 4
  },
  {
    id: '3',
    title: 'Sistema de autenticación',
    description: 'Login y registro con validaciones',
    status: 'done',
    priority: 'urgent',
    assignee: 'Ana García',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
    tags: ['auth', 'backend', 'seguridad'],
    subtasks: [
      { id: '3-1', title: 'Modelo usuario', completed: true, createdAt: new Date('2024-01-10') },
      { id: '3-2', title: 'Login', completed: true, createdAt: new Date('2024-01-10') },
      { id: '3-3', title: 'Registro', completed: true, createdAt: new Date('2024-01-10') },
      { id: '3-4', title: 'Validaciones', completed: true, createdAt: new Date('2024-01-10') }
    ],
    comments: [
      {
        id: '1',
        content: 'Comentario de prueba',
        author: 'Ana García',
        createdAt: new Date('2024-01-15T10:30:00')
      }
    ],
    estimatedHours: 12
  },
  {
    id: '4',
    title: 'Componentes base UI',
    description: 'Button, Input, Card y componentes reutilizables',
    status: 'todo',
    priority: 'medium',
    assignee: 'Ana García',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    tags: ['ui', 'componentes', 'frontend'],
    subtasks: [
      { id: '4-1', title: 'Button', completed: false, createdAt: new Date('2024-01-16') },
      { id: '4-2', title: 'Input', completed: false, createdAt: new Date('2024-01-16') },
      { id: '4-3', title: 'Card', completed: false, createdAt: new Date('2024-01-16') }
    ],
    comments: [
      {
        id: '1',
        content: 'Comentario de prueba',
        author: 'Ana García',
        createdAt: new Date('2024-01-15T10:30:00')
      }
    ],
    dueDate: new Date('2024-01-30'),
    estimatedHours: 16
  },
  {
    id: '5',
    title: 'Optimizar rendimiento',
    description: 'Lazy loading y optimizaciones de bundle',
    status: 'todo',
    priority: 'low',
    assignee: 'Ana García',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    tags: ['performance', 'optimización'],
    subtasks: [],
    comments: [
      {
        id: '1',
        content: 'Comentario de prueba',
        author: 'Ana García',
        createdAt: new Date('2024-01-15T10:30:00')
      }
    ],
    estimatedHours: 6
  },
  {
    id: '6',
    title: 'Documentación técnica',
    description: 'Documentar APIs y componentes',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Ana García',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-15'),
    tags: ['documentación', 'técnica'],
    subtasks: [
      { id: '6-1', title: 'APIs', completed: true, createdAt: new Date('2024-01-13') },
      { id: '6-2', title: 'Componentes', completed: false, createdAt: new Date('2024-01-13') }
    ],
    comments: [
      {
        id: '1',
        content: 'Comentario de prueba',
        author: 'Ana García',
        createdAt: new Date('2024-01-15T10:30:00')
      }
    ],
    dueDate: new Date('2024-01-22'),
    estimatedHours: 10
  }
];

// Función para crear columnas por defecto
const createDefaultColumns = (boardId: string) => [
  {
    id: `${boardId}-todo`,
    title: 'Por Hacer',
    status: 'todo' as const,
    color: '#3b82f6',
    tasks: [] as Task[],
    maxTasks: 10
  },
  {
    id: `${boardId}-in-progress`,
    title: 'En Progreso',
    status: 'in-progress' as const,
    color: '#f59e0b',
    tasks: [] as Task[],
    maxTasks: 5
  },
  {
    id: `${boardId}-done`,
    title: 'Terminado',
    status: 'done' as const,
    color: '#22c55e',
    tasks: [] as Task[],
    maxTasks: undefined
  }
];

export const mockBoards: Board[] = [
  {
    id: 'board-1',
    title: 'Proyecto Kanban App',
    description: 'Desarrollo de una aplicación de gestión de tareas estilo Kanban',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-17'),
    columns: [
      {
        id: 'col-1',
        title: 'Por Hacer',
        status: 'todo',
        color: '#3b82f6',
        tasks: mockTasks.filter(task => task.status === 'todo'),
        maxTasks: 10
      },
      {
        id: 'col-2',
        title: 'En Progreso',
        status: 'in-progress',
        color: '#f59e0b',
        tasks: mockTasks.filter(task => task.status === 'in-progress'),
        maxTasks: 5
      },
      {
        id: 'col-3',
        title: 'Terminado',
        status: 'done',
        color: '#22c55e',
        tasks: mockTasks.filter(task => task.status === 'done'),
        maxTasks: undefined
      }
    ]
  },
  {
    id: 'board-2',
    title: 'Sprint Planning',
    description: 'Planificación del próximo sprint de desarrollo',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    columns: createDefaultColumns('board-2')
  }
];

// Colores predefinidos para columnas
export const columnColors = [
  '#3b82f6', // Azul
  '#f59e0b', // Amarillo
  '#22c55e', // Verde
  '#ef4444', // Rojo
  '#8b5cf6', // Púrpura
  '#06b6d4', // Cian
  '#f97316', // Naranja
  '#84cc16', // Lima
  '#ec4899', // Rosa
  '#6b7280', // Gris
] as const;

// Tags predefinidos
export const predefinedTags = [
  'diseño',
  'desarrollo',
  'frontend',
  'backend',
  'ui',
  'ux',
  'testing',
  'documentación',
  'bug',
  'feature',
  'optimización',
  'refactor',
  'setup',
  'deploy',
  'hotfix'
] as const;

// Gestión de usuarios - Arrays vacíos para implementar nueva funcionalidad
// Lista simple de nombres para compatibilidad (ahora vacía)
export const teamMembers: string[] = [
  'Ana García',
  'Carlos López', 
  'María Rodríguez',
  'Pedro Martínez',
  'Laura Sánchez',
  'Diego Fernández',
  'Sofia Torres',
  'Miguel Ruiz'
];

// Información completa de usuarios con estado (ahora vacía)
export const teamMembersDetailed: Array<{
  name: string;
  status: UserStatus;
  avatar: string;
}> = [
  { name: 'Ana García', status: 'online', avatar: 'A' },
  { name: 'Carlos López', status: 'busy', avatar: 'C' },
  { name: 'María Rodríguez', status: 'away', avatar: 'M' },
  { name: 'Pedro Martínez', status: 'online', avatar: 'P' },
  { name: 'Laura Sánchez', status: 'offline', avatar: 'L' },
  { name: 'Diego Fernández', status: 'online', avatar: 'D' },
  { name: 'Sofia Torres', status: 'busy', avatar: 'S' },
  { name: 'Miguel Ruiz', status: 'away', avatar: 'M' }
];

