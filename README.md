# 🎯 Kanban Project Management Tool

A modern, feature-rich Kanban board application built with React and TypeScript that demonstrates senior-level frontend development skills. This application provides an intuitive project management experience with drag-and-drop functionality, comprehensive task tracking, and insightful analytics.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Decisions](#-architecture-decisions)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Performance Optimizations](#-performance-optimizations)
- [Testing Strategy](#-testing-strategy)
- [Docker Deployment](#-docker-deployment)
- [Accessibility](#-accessibility)
- [Contributing](#-contributing)

## ✨ Features

### 🏗️ Board Management
- Create and manage multiple boards (Personal, Work, Side Projects)
- Switch seamlessly between different boards
- Edit board names and delete boards with confirmation dialogs
- Unique identifiers for each board with persistent storage

### 📊 Column Management
- Default columns: "To Do", "In Progress", "Done"
- Add custom columns to any board
- Inline column renaming
- Delete columns with task migration options
- Drag-and-drop column reordering

### 📝 Task Management
- **Complete Task Properties:**
  - Title (required, max 100 characters)
  - Description with markdown preview support
  - Priority levels: Low, Medium, High, Urgent
  - Due dates with validation
  - Custom tags with color coding
  - Time tracking with timestamps
  - Subtasks with progress tracking
  - Estimated hours

- **Task Operations:**
  - Create, edit, and delete tasks
  - Drag-and-drop between columns
  - Reorder tasks within columns
  - Quick actions menu (right-click/three-dot)
  - Task duplication and archiving
  - Bulk operations support

### 🔍 Search & Filtering
- Global search across all tasks
- Advanced filtering by:
  - Board selection
  - Priority levels
  - Tags and labels
  - Due date ranges
  - Assignee (prepared for multi-user)
- Multiple sorting options (created date, due date, priority, title)
- Clear all filters functionality

### 📈 Analytics Dashboard
- **Tasks Completed Over Time:** Line/Bar charts showing daily completion trends
- **Tasks by Status:** Pie charts with column distribution
- **Average Time in Column:** Workflow efficiency metrics
- **Productivity Metrics:**
  - Tasks completed today/this week
  - Average completion rate
  - Overdue tasks count
  - Team velocity (with time estimates)
- Date range filtering and board-specific analytics

### 🎨 Theme Management
- Light and dark themes with smooth transitions
- Persistent theme preferences in localStorage
- Proper color contrast ratios for accessibility
- System theme detection support

## 🛠 Tech Stack

### Core Technologies
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite (for fast development and optimized builds)
- **State Management:** Zustand (lightweight, TypeScript-first)
- **Styling:** Custom styled-components (no UI libraries)
- **Testing:** Jest + React Testing Library
- **Drag & Drop:** @dnd-kit (modern, accessible)

### Additional Libraries
- **Date Manipulation:** date-fns
- **Data Visualization:** Recharts
- **Form Management:** React Hook Form
- **Icons:** Lucide React
- **Routing:** React Router DOM

## 🏗 Architecture Decisions

### State Management: Why Zustand?

**Decision:** Chose Zustand over Redux for the following reasons:

1. **Simplicity:** Zustand provides a minimal API with less boilerplate code compared to Redux
2. **TypeScript Integration:** Excellent TypeScript support out of the box
3. **Performance:** Smaller bundle size and better performance for medium-scale applications
4. **Developer Experience:** Easier to learn and maintain, especially for smaller teams
5. **Persistence:** Built-in support for localStorage persistence without additional middleware

**Trade-offs:**
- Less ecosystem compared to Redux
- Fewer debugging tools available
- May not scale as well for very large applications

### Build Tool: Why Vite?

**Decision:** Selected Vite over Create React App:

1. **Performance:** Significantly faster development server startup
2. **Hot Module Replacement:** Lightning-fast HMR for better development experience
3. **Modern Build:** Uses Rollup for production builds with better tree-shaking
4. **ESM Support:** Native ES modules support for faster cold starts
5. **Plugin Ecosystem:** Rich plugin ecosystem with excellent TypeScript support

### Styling: Why Styled-Components?

**Decision:** Custom styled-components instead of UI libraries:

1. **Design Control:** Complete control over design system and components
2. **No Bundle Bloat:** Avoid including unused components from UI libraries
3. **Theme Integration:** Seamless integration with dynamic theming
4. **TypeScript Support:** Excellent TypeScript integration with theme typing
5. **Component Co-location:** Styles live next to components for better maintainability

**Trade-offs:**
- More initial development time
- Need to build components from scratch
- Less design consistency out of the box

## 📁 Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── ui/                    # Basic UI components (Button, Input, Modal, etc.)
│   ├── kanban/               # Kanban-specific components
│   │   ├── Board/            # Main board component
│   │   ├── TaskCard/         # Individual task display
│   │   ├── TaskForm/         # Task creation/editing
│   │   ├── DraggableTask/    # Drag-and-drop wrapper
│   │   ├── DraggableColumn/  # Column drag-and-drop
│   │   └── ...               # Other Kanban components
│   ├── dashboard/            # Analytics dashboard components
│   ├── search/               # Search and filtering components
│   └── layout/               # Layout components (Navbar, etc.)
├── pages/                    # Route-level components
├── store/                    # Zustand state management
│   ├── kanbanStore.ts       # Main Kanban store
│   └── useKanbanStore.ts    # Store hook
├── hooks/                    # Custom React hooks
│   ├── useTheme.ts          # Theme management
│   ├── useNotifications.ts  # Notification system
│   └── useDateUtils.ts      # Date manipulation utilities
├── utils/                    # Utility functions
│   ├── helpers.ts           # General helper functions
│   ├── dateUtils.ts         # Date manipulation
│   └── storageManager.ts    # localStorage management
├── styles/                   # Global styles and theme
│   ├── theme.ts             # Theme configuration
│   └── GlobalStyles.ts      # Global CSS
├── types/                    # TypeScript type definitions
└── __tests__/               # Integration tests
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kanban-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open http://localhost:5173 in your browser

### Docker Deployment

1. **Using Docker Compose (Recommended)**
   ```bash
   # Development
   docker-compose up --build
   
   # Production
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

2. **Using Docker directly**
   ```bash
   # Build image
   docker build -t kanban-app .
   
   # Run container
   docker run -p 3000:5173 kanban-app
   ```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## ⚡ Performance Optimizations

### Code Splitting
- **Route-based splitting:** Implemented React.lazy() for main routes
- **Component-based splitting:** Dashboard analytics loaded on demand
- **Bundle analysis:** Regular bundle size monitoring

### Rendering Optimizations
- **React.memo:** Applied to expensive components (TaskCard, Board)
- **useMemo/useCallback:** Optimized expensive calculations and event handlers
- **Virtual scrolling:** Implemented for boards with 50+ tasks

### Data Management
- **Optimistic updates:** Immediate UI feedback for better UX
- **Debounced operations:** Search inputs and auto-save functionality
- **Efficient re-renders:** Proper dependency arrays and state structure

### Build Optimizations
- **Tree shaking:** Vite's built-in dead code elimination
- **Asset optimization:** Image compression and lazy loading
- **Caching strategies:** Proper cache headers for static assets

## 🧪 Testing Strategy

### Testing Framework Selection: Jest + React Testing Library

**Decision Rationale:**

1. **Jest:** 
   - Industry standard for React applications
   - Excellent TypeScript support
   - Built-in mocking and assertion libraries
   - Great ecosystem and community support

2. **React Testing Library:**
   - Focuses on testing user behavior rather than implementation details
   - Encourages accessible testing patterns
   - Better long-term maintainability
   - Aligns with accessibility best practices

**Why not Cypress?**
- **Learning curve:** Team familiarity with Jest/RTL
- **Unit testing focus:** Primary need for component and logic testing
- **CI/CD integration:** Easier integration with existing pipelines
- **Performance:** Faster execution for unit tests

### Testing Coverage

**Component Tests (Required - 70%+ coverage):**
- ✅ Task creation form with validation
- ✅ Drag and drop operations (mocked)
- ✅ Column management functionality
- ✅ Theme switching behavior
- ✅ Board switching and data persistence

**Unit Tests:**
- ✅ State management logic (Zustand store)
- ✅ Utility functions (date manipulation, helpers)
- ✅ Custom hooks (theme, notifications, date utils)
- ✅ Form validation logic

**Integration Tests (Optional):**
- ✅ Complete task lifecycle workflows
- ✅ Search and filter functionality
- ✅ Data persistence across sessions

### Testing Best Practices

```typescript
// Example test structure
describe('TaskCard Component', () => {
  it('should render task information correctly', () => {
    // Arrange
    const mockTask = createMockTask();
    
    // Act
    render(<TaskCard task={mockTask} />);
    
    // Assert
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
  });
});
```

## 🐳 Docker Deployment

### Development Environment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

### Production Environment
- Multi-stage build for optimized image size
- Nginx for serving static assets
- Health checks and proper logging
- Security headers and compression

### Docker Compose Services
- **kanban-app:** Main application container
- **nginx:** Reverse proxy and static file serving
- **postgres:** Database (optional, for future expansion)
- **redis:** Caching layer (optional, for future expansion)

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Keyboard Navigation:** Full keyboard support for all interactive elements
- **Screen Readers:** Proper ARIA labels and semantic HTML
- **Color Contrast:** Minimum 4.5:1 ratio for all text
- **Focus Management:** Visible focus indicators and logical tab order

### Implementation Details
- **ARIA Labels:** Descriptive labels for all interactive elements
- **Semantic HTML:** Proper heading hierarchy and landmark regions
- **Focus Trapping:** Modal dialogs trap focus appropriately
- **Live Regions:** Dynamic content updates announced to screen readers

## 🎯 Future Enhancements

### Planned Features
- **Multi-user Support:** Real-time collaboration
- **Advanced Analytics:** More detailed reporting and insights
- **API Integration:** Backend service integration
- **Mobile App:** React Native implementation
- **Offline Support:** Service worker implementation

### Technical Improvements
- **Performance:** Further bundle optimization and lazy loading
- **Testing:** End-to-end testing with Playwright
- **Monitoring:** Application performance monitoring
- **Security:** Enhanced security headers and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Ensure accessibility compliance
- Follow the established code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite Team** for the blazing-fast build tool
- **Zustand Team** for the simple state management
- **Styled-components Team** for the CSS-in-JS solution
- **Testing Library Team** for the testing utilities

---

**Built with ❤️ for demonstrating modern React development practices**
