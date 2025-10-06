# Testing Guide

Este directorio contiene todas las pruebas para el proyecto Kanban.

## Estructura de Testing

```
src/
├── __tests__/
│   ├── integration.test.tsx     # Pruebas de integración
│   └── README.md               # Esta guía
├── components/
│   ├── kanban/
│   │   ├── __tests__/
│   │   │   ├── TaskForm.test.tsx        # Pruebas del formulario de tareas
│   │   │   ├── DragDrop.test.tsx        # Pruebas de drag and drop
│   │   │   └── ColumnManagement.test.tsx # Pruebas de gestión de columnas
│   │   └── ...
│   └── ui/
│       └── __tests__/
│           └── ThemeToggle.test.tsx     # Pruebas del toggle de tema
├── hooks/
│   └── __tests__/
│       └── useAutoSave.test.ts         # Pruebas de hooks personalizados
├── store/
│   └── __tests__/
│       └── kanbanStore.test.ts         # Pruebas del store
├── utils/
│   └── __tests__/
│       └── helpers.test.ts             # Pruebas de funciones utilitarias
└── test-utils.tsx                      # Utilidades de testing
```

## Tipos de Pruebas

### 1. Pruebas de Componentes (Requerido)
- **TaskForm.test.tsx**: Formulario de creación de tareas con validación
- **DragDrop.test.tsx**: Operaciones de drag and drop (simuladas)
- **ColumnManagement.test.tsx**: Gestión de columnas
- **ThemeToggle.test.tsx**: Cambio de tema

### 2. Pruebas Unitarias (Requerido)
- **useAutoSave.test.ts**: Hook de auto-guardado
- **kanbanStore.test.ts**: Lógica de gestión de estado
- **helpers.test.ts**: Funciones de utilidad

### 3. Pruebas de Integración (Opcional)
- **integration.test.tsx**: Ciclo de vida completo de tareas, cambio de boards, búsqueda y filtros

## Comandos de Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas en CI
npm run test:ci
```

## Configuración

### Jest Configuration
- **Archivo**: `jest.config.js`
- **Cobertura mínima**: 70%
- **Entorno**: jsdom
- **Setup**: `src/setupTests.ts`

### Dependencias de Testing
- `@testing-library/react`: Testing de componentes React
- `@testing-library/jest-dom`: Matchers adicionales para Jest
- `@testing-library/user-event`: Simulación de interacciones de usuario
- `jest`: Framework de testing
- `ts-jest`: Soporte para TypeScript
- `identity-obj-proxy`: Mock para archivos CSS

## Cobertura de Código

El proyecto está configurado para mantener una cobertura mínima del 70% en:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Archivos Excluidos de Cobertura
- `src/main.tsx`
- `src/vite-env.d.ts`
- Archivos de tipos (`.d.ts`)
- Archivos de historias (`.stories.tsx`)
- Archivos de índice (`index.ts`)

## Mejores Prácticas

### 1. Naming Conventions
- Archivos de prueba: `*.test.ts` o `*.test.tsx`
- Describe blocks: Descripción clara de la funcionalidad
- Test cases: Comportamiento específico a probar

### 2. Estructura de Pruebas
```typescript
describe('ComponentName', () => {
  describe('Feature/Behavior', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 3. Mocks y Stubs
- Mock de hooks personalizados
- Mock de localStorage
- Mock de APIs externas
- Mock de componentes complejos

### 4. Testing de Accesibilidad
- Navegación por teclado
- Etiquetas ARIA
- Focus management
- Screen reader compatibility

## Debugging

### 1. Logs de Testing
```bash
# Ejecutar con logs detallados
npm test -- --verbose

# Ejecutar una prueba específica
npm test -- --testNamePattern="should create task"
```

### 2. Coverage Reports
```bash
# Generar reporte HTML
npm run test:coverage

# Abrir reporte en navegador
open coverage/lcov-report/index.html
```

### 3. Watch Mode
```bash
# Modo watch para desarrollo
npm run test:watch

# Filtrar por archivo
npm run test:watch -- --testPathPattern="TaskForm"
```

## Troubleshooting

### Problemas Comunes

1. **Error de módulo no encontrado**
   - Verificar configuración de `moduleNameMapping` en `jest.config.js`

2. **Error de TypeScript**
   - Verificar configuración de `ts-jest`
   - Asegurar que los tipos están correctamente importados

3. **Error de styled-components**
   - Verificar que `identity-obj-proxy` está instalado
   - Verificar configuración en `moduleNameMapping`

4. **Error de localStorage**
   - Verificar que el mock está configurado en `setupTests.ts`

### Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)