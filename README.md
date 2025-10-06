# 🎯 Kanban Project Management Tool

A modern Kanban board application built with React 18 + TypeScript, featuring drag-and-drop functionality, comprehensive task management, and analytics dashboard.

## ✨ Key Features

- **Multi-board Management** - Create and switch between multiple boards
- **Drag & Drop** - Reorder columns and tasks with @dnd-kit
- **Task Management** - Full CRUD with priority, tags, due dates, and subtasks
- **Search & Filtering** - Global search with advanced filtering options
- **Analytics Dashboard** - Data visualization with charts and metrics
- **Theme Support** - Light/dark themes with smooth transitions
- **Responsive Design** - Mobile, tablet, and desktop support

## 🛠 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **State Management:** Zustand (lightweight, TypeScript-first)
- **Styling:** Styled-components (custom design system)
- **Testing:** Jest + React Testing Library
- **Drag & Drop:** @dnd-kit
- **Charts:** Recharts
- **Containerization:** Docker + Docker Compose

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### Docker
```bash
# Development
docker-compose up --build

# Access at http://localhost:3000
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── kanban/       # Kanban-specific components
│   ├── dashboard/    # Analytics components
│   └── search/       # Search & filtering
├── store/            # Zustand state management
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── styles/           # Global styles & theme
└── types/            # TypeScript definitions
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

**Testing Strategy:** Jest + React Testing Library for component and unit tests. Achieves 70%+ code coverage with focus on user behavior testing.

## 🎨 Architecture Decisions

- **Zustand over Redux:** Simpler API, better TypeScript support, less boilerplate
- **Vite over CRA:** Faster development server, better build performance
- **Styled-components over UI libraries:** Complete design control, no bundle bloat
- **Jest + RTL over Cypress:** Team familiarity, faster execution, better CI integration

## 📊 Performance

- React.lazy() for code splitting
- Virtual scrolling for 50+ tasks
- React.memo for expensive components
- Debounced search and auto-save
- Optimized bundle with Vite

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Full keyboard navigation
- Screen reader support
- Proper ARIA labels
- Focus management

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with modern React practices and TypeScript for type safety.**
** yes mejras**client-side