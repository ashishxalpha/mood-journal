# Project Structure

This document provides an overview of the Mood Journal app's architecture and file organization.

## Directory Structure

```
my-app/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx            # Root layout component with theme provider
│   └── index.tsx              # Main dashboard/home screen
│
├── components/                 # Reusable UI components
│   ├── Card.tsx               # Base card component with gradient support
│   ├── StatCard.tsx           # Statistic display card with icon
│   ├── QuoteCard.tsx          # Quote display with gradient background
│   ├── JournalModal.tsx       # Full-screen modal for journal entry creation/viewing
│   ├── DateActionModal.tsx    # Bottom sheet for calendar date actions
│   └── index.ts               # Component exports
│
├── services/                   # API and external services
│   └── api.ts                 # Mock API with simulated backend calls
│
├── store/                      # State management
│   └── useAppStore.ts         # Zustand store for global state
│
├── types/                      # TypeScript type definitions
│   └── index.ts               # All interfaces and types
│
├── utils/                      # Utility functions and constants
│   ├── helpers.ts             # Helper functions (date formatting, etc.)
│   └── constants.ts           # App constants (colors, spacing, etc.)
│
├── hooks/                      # Custom React hooks
│   └── index.ts               # Reusable hooks (useModal, useDebounce, etc.)
│
├── assets/                     # Static assets
│   └── images/                # Images and icons
│
├── .prettierrc                 # Prettier configuration
├── eslint.config.js           # ESLint configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies and scripts
├── app.json                   # Expo app configuration
└── README.md                  # Project documentation
```

## File Descriptions

### App Directory (`/app`)

**_layout.tsx**
- Root layout component
- Sets up PaperProvider for Material Design
- Configures navigation structure
- Applies global theme

**index.tsx**
- Main dashboard screen
- Displays statistics, quote, and calendar
- Handles user interactions
- Manages modal states

### Components Directory (`/components`)

**Card.tsx**
- Reusable container component
- Supports gradients and custom styling
- Provides consistent shadow and border radius

**StatCard.tsx**
- Displays a single statistic
- Includes icon, label, and value
- Shows loading state

**QuoteCard.tsx**
- Displays inspirational quotes
- Gradient background
- Quote icon and author attribution

**JournalModal.tsx**
- Full-screen modal for journal entries
- Supports view, add, and edit modes
- Mood selection interface
- Title and content input fields

**DateActionModal.tsx**
- Bottom sheet modal for calendar dates
- View or add journal options
- Smooth animations

### Services Directory (`/services`)

**api.ts**
- Mock API functions with simulated delays
- CRUD operations for journal entries
- Streak and mood statistics
- Quote retrieval
- Ready for backend integration

### Store Directory (`/store`)

**useAppStore.ts**
- Zustand state management
- Global app state (streak, mood, quotes, logs)
- Loading and error states
- Actions for data fetching and updates

### Types Directory (`/types`)

**index.ts**
- TypeScript interfaces and types
- MoodLevel, MoodEntry, JournalEntry
- StreakData, MoodStats, Quote
- MarkedDates, ModalState
- Ensures type safety throughout app

### Utils Directory (`/utils`)

**helpers.ts**
- Date formatting utilities
- Date range calculations
- Text truncation
- ID generation

**constants.ts**
- Color palette
- Spacing and sizing values
- Font sizes and weights
- Shadow presets
- API and app configuration

### Hooks Directory (`/hooks`)

**index.ts**
- useModal: Modal state management
- useDebounce: Value debouncing
- useAsync: Async operation handling

## Data Flow

```
User Interaction
    ↓
Screen Component (index.tsx)
    ↓
Zustand Store (useAppStore.ts)
    ↓
API Service (services/api.ts)
    ↓
Mock Data (simulated backend)
    ↓
Update Store State
    ↓
Re-render Components
```

## State Management Flow

1. **App Initialization**: `initializeApp()` fetches all data in parallel
2. **User Actions**: Button clicks, calendar taps trigger store actions
3. **Store Updates**: Zustand updates state immutably
4. **Component Re-render**: Components subscribed to store re-render
5. **UI Update**: User sees updated interface

## Component Composition

```
index.tsx (Dashboard)
├── LinearGradient (Header)
│   └── Header Content
├── StatCard (Streak)
├── StatCard (Mood)
├── QuoteCard
├── Calendar
│   └── Marked Dates
├── Overview Cards
├── DateActionModal
│   ├── View Journal Button
│   └── Add Journal Button
└── JournalModal
    ├── Mood Selection
    ├── Title Input
    └── Content Input
```

## Type Safety

All components, functions, and data structures are strongly typed:
- Props interfaces for every component
- Return types for all functions
- Type guards for data validation
- Generic types for reusable utilities

## Best Practices Implemented

1. **Separation of Concerns**: UI, logic, and data are separated
2. **DRY Principle**: Reusable components and utilities
3. **Type Safety**: Comprehensive TypeScript usage
4. **Performance**: Optimized re-renders with proper hooks
5. **Accessibility**: Semantic components and proper labels
6. **Maintainability**: Clear file structure and documentation
7. **Scalability**: Easy to add new features and screens

## Adding New Features

### Adding a New Screen
1. Create new file in `/app` directory
2. Use Expo Router file-based routing
3. Import and use components from `/components`

### Adding a New Component
1. Create component file in `/components`
2. Export from `/components/index.ts`
3. Use TypeScript for props interface

### Adding State
1. Add state to Zustand store in `/store/useAppStore.ts`
2. Create actions for state updates
3. Use store hooks in components

### Adding API Integration
1. Replace mock functions in `/services/api.ts`
2. Keep function signatures the same
3. Update error handling as needed

## Testing Considerations

While tests aren't included in the MVP, the structure supports:
- Unit tests for utilities and helpers
- Component tests with React Testing Library
- Integration tests for store actions
- E2E tests with Detox or Appium

## Performance Optimization

- Parallel API calls on initialization
- Memoized calendar marked dates
- Optimized list rendering
- Debounced search (when implemented)
- Lazy loading for future features
