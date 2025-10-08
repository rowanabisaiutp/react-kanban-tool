# Herramienta de Gestión de Proyectos Kanban

Una aplicación moderna de tablero Kanban construida con React 18 + TypeScript, que incluye funcionalidad de arrastrar y soltar, gestión integral de tareas y panel de análisis.

## Características Principales

### Características Básicas
- **Gestión Multi-tablero** - Crear y cambiar entre múltiples tableros
- **Arrastrar y Soltar** - Reordenar columnas y tareas con @dnd-kit
- **Gestión de Tareas** - CRUD completo con prioridad, etiquetas, fechas de vencimiento y subtareas
- **Búsqueda y Filtrado** - Búsqueda global con opciones de filtrado avanzadas
- **Panel de Análisis** - Visualización de datos con gráficos y métricas
- **Soporte de Temas** - Temas claro/oscuro con transiciones suaves
- **Diseño Responsivo** - Soporte para móvil, tablet y escritorio

### Características Avanzadas
- **Sistema de Comentarios** - Comentarios con menciones @ y respuestas
- **Gestión de Subtareas** - Listas de verificación con seguimiento de progreso
- **Soporte Markdown** - Descripciones de texto enriquecido
- **Sistema de Archivo** - Archivar tareas completadas
- **Auto-guardado** - Guardado automático con persistencia
- **Notificaciones** - Sistema de notificaciones toast
- **Menús Contextuales** - Menús de clic derecho con acciones rápidas
- **Desplazamiento Virtual** - Renderizado eficiente de listas grandes
- **División de Código** - Carga diferida con React.lazy

## Stack Tecnológico

- **React 18 + TypeScript** - Framework principal con seguridad de tipos
- **Vite** - Herramienta de construcción rápida
- **Zustand** - Gestión de estado ligera
- **Styled-components** - Estilos con CSS-in-JS
- **@dnd-kit** - Funcionalidad de arrastrar y soltar
- **Recharts** - Visualización de datos
- **Jest + React Testing Library** - Pruebas

## Inicio Rápido

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Acceder en http://localhost:5173
```

### Docker
```bash
# Desarrollo
docker-compose up --build

# Acceder en http://localhost:3000
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/           # Componentes UI reutilizables
│   ├── kanban/       # Componentes específicos de Kanban
│   ├── dashboard/    # Componentes de análisis
│   └── search/       # Búsqueda y filtrado
├── store/            # Gestión de estado Zustand
├── hooks/            # Hooks personalizados de React
├── utils/            # Funciones de utilidad
├── styles/           # Estilos globales y tema
└── types/            # Definiciones de TypeScript
```

## Pruebas

```bash
# Ejecutar pruebas
npm test

# Ejecutar con cobertura
npm test -- --coverage

# Modo de observación
npm test -- --watch
```


## Arquitectura

### Patrón Arquitectónico
- **Arquitectura en Capas** - Separación clara de responsabilidades
- **Arquitectura Basada en Componentes** - Componentes modulares y reutilizables
- **Principios SOLID** - Código mantenible y escalable

### Flujo de Datos
```
Acción del Usuario → Componente → Hook → Store → Re-renderizado del Componente
```

### Patrones Implementados
- **Custom Hooks Pattern** - Lógica de negocio encapsulada
- **Compound Component Pattern** - Composición modular de componentes
- **Provider Pattern** - Context providers para servicios globales
- **Observer Pattern** - Actualizaciones reactivas con Zustand

## Rendimiento

- **División de Código** - React.lazy() para división basada en rutas
- **Virtualización** - Renderizado eficiente de listas grandes
- **Memoización** - React.memo para componentes costosos
- **Debouncing** - Operaciones optimizadas
- **Optimización de Paquetes** - Construcción optimizada con Vite

## Accesibilidad

- Compatible con WCAG 2.1 AA
- Navegación completa por teclado
- Soporte para lectores de pantalla
- Etiquetas ARIA apropiadas
- Gestión de foco

## Estado del Proyecto

### ✅ Listo para Producción
- **Todas las Pruebas Pasando:** 549 pruebas, 53 suites de pruebas
- **TypeScript:** Cumplimiento de modo estricto
- **Rendimiento:** Optimizado con división de código y memoización
- **Accesibilidad:** Compatible con WCAG 2.1 AA
- **Docker:** Containerización completa

### Logros Clave
- **Características Avanzadas:** 15+ nuevos componentes implementados
- **UX Mejorada:** Sistema de menciones @, menús contextuales, notificaciones
- **Rendimiento:** Desplazamiento virtual, auto-guardado, operaciones optimizadas
- **Pruebas:** Suite de pruebas integral con cobertura completa
- **DevOps:** Configuración completa de Docker

## Licencia

Licencia MIT - ver [LICENSE](LICENSE) para más detalles.