# 📔 Mood Journal - AI-Powered Journal & Mood Tracking App

A modern, beautiful React Native mobile application built with Expo and TypeScript for journaling and mood tracking. This is an MVP showcasing best practices in React Native development.

## ✨ Features

- **📊 Dashboard with Statistics**: View your current streak and average mood score at a glance
- **💭 Daily Inspirational Quotes**: Get motivated with a random quote each day
- **📅 Interactive Calendar**: 
  - Tap any date to view or add journal entries
  - Visual indicators for days with entries
  - Color-coded mood markers
- **✍️ Journal Entries**:
  - Create new entries with title and content
  - Track your mood with each entry (5-level scale)
  - View and edit past entries
- **🎨 Modern UI Design**:
  - Soft gradients and shadows
  - Smooth animations
  - Accessible components
  - Clean, minimal design

## 🏗️ Architecture & Best Practices

### Project Structure

```
my-app/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with theme
│   └── index.tsx          # Main dashboard screen
├── components/            # Reusable UI components
│   ├── Card.tsx
│   ├── StatCard.tsx
│   ├── QuoteCard.tsx
│   ├── JournalModal.tsx
│   ├── DateActionModal.tsx
│   └── index.ts
├── services/              # API services
│   └── api.ts            # Mock API with simulated delays
├── store/                # State management
│   └── useAppStore.ts    # Zustand store
├── types/                # TypeScript definitions
│   └── index.ts
└── assets/               # Images and static files
```

### Technologies Used

- **[Expo](https://expo.dev)**: Framework for React Native development
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Zustand](https://github.com/pmndrs/zustand)**: Lightweight state management
- **[React Native Paper](https://callstack.github.io/react-native-paper/)**: Material Design components
- **[React Native Calendars](https://github.com/wix/react-native-calendars)**: Calendar component
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)**: Beautiful gradients
- **ESLint & Prettier**: Code quality and formatting

### Key Design Patterns

1. **Component Modularity**: All UI elements are broken into reusable components
2. **Type Safety**: Comprehensive TypeScript types for all data structures
3. **Global State Management**: Zustand for clean, performant state management
4. **Mock API Layer**: Simulated backend with realistic delays for future integration
5. **Accessibility**: Proper labels and accessible props throughout
6. **Performance**: Optimized with proper React hooks and memoization

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, can use npx)
- iOS Simulator or Android Emulator (or Expo Go app on physical device)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npx expo start
   ```

3. **Run on your device**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## 📱 Usage

### Main Dashboard
- View your current streak and average mood
- Read today's inspirational quote
- See your journal entries on the calendar

### Adding a Journal Entry
1. Tap any date on the calendar
2. Select "Add New Journal" or "Edit Entry"
3. Choose your mood (optional)
4. Write a title and your thoughts
5. Save your entry

### Viewing Past Entries
1. Tap a date with an entry (marked with a dot)
2. Select "View Journal"
3. Read your past entry

## 🔧 Configuration

### Customizing Colors
Edit the color scheme in `app/index.tsx`:
```typescript
const colors = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  // ... other colors
};
```

### Modifying Mock Data
Update the dummy API in `services/api.ts`:
```typescript
const mockStreakData: StreakData = {
  currentStreak: 7,
  longestStreak: 15,
  // ... customize
};
```

## 🎯 Future Enhancements

- [ ] Backend integration with real API
- [ ] Data persistence with AsyncStorage/Database
- [ ] AI-powered mood insights
- [ ] Export journal entries
- [ ] Reminder notifications
- [ ] Dark mode support
- [ ] Advanced analytics and charts
- [ ] Search and filter entries
- [ ] Tags and categories
- [ ] Cloud sync

## 📝 API Documentation

### Mock API Functions

Located in `services/api.ts`:

- `getStreakCount()`: Returns current and longest streak
- `getMoodScore()`: Returns mood statistics
- `getQuoteOfTheDay()`: Returns a random inspirational quote
- `getDailyLogs()`: Returns journal entries with mood data
- `getJournalByDate(date)`: Fetches entry for specific date
- `createJournalEntry(entry)`: Creates new journal entry
- `updateJournalEntry(id, updates)`: Updates existing entry
- `saveMoodEntry(date, mood, label, emoji)`: Saves mood data

All functions include simulated network delays (400-800ms) for realistic behavior.

## 🧪 Testing

Run the linter:
```bash
npm run lint
```

## 🤝 Contributing

This is an MVP project demonstrating best practices. Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for educational and portfolio purposes.

## 👨‍💻 Developer Notes

### Code Quality
- All components are strongly typed with TypeScript
- ESLint and Prettier ensure consistent code style
- Comments document major functionality
- Modular architecture for easy maintenance

### Performance Considerations
- Parallel API calls on app initialization
- Optimized calendar rendering
- Proper use of React hooks to prevent unnecessary re-renders
- Efficient state management with Zustand

### Accessibility
- Screen reader support
- Proper touch target sizes
- High contrast text
- Semantic HTML/React Native components

## 📞 Support

For questions or issues, please open an issue in the repository.

---

Built with ❤️ using Expo and React Native