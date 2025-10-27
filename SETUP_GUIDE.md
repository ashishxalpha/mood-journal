# Setup & Deployment Guide

Complete guide for setting up, running, and deploying the Mood Journal app.

## Prerequisites

### Required Software
- **Node.js** (v16.0.0 or higher)
  - Download: https://nodejs.org/
  - Verify: `node --version`
  
- **npm** (v8.0.0 or higher) or **yarn**
  - Comes with Node.js
  - Verify: `npm --version`

- **Expo CLI** (optional, can use npx)
  - Install: `npm install -g expo-cli`
  - Verify: `expo --version`

### Development Environment

#### For iOS Development
- macOS only
- Xcode (latest version)
- iOS Simulator
- Download from Mac App Store

#### For Android Development
- Android Studio
- Android SDK
- Android Emulator
- Download: https://developer.android.com/studio

#### For Physical Device Testing
- **Expo Go app** (Available on both iOS and Android)
  - iOS: https://apps.apple.com/app/apple-store/id982107779
  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

## Installation Steps

### 1. Clone or Navigate to Project
```bash
cd my-app
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- React Native core packages
- Expo SDK and related packages
- Navigation libraries
- UI component libraries (react-native-paper, react-native-calendars)
- State management (zustand)
- Gradient support (expo-linear-gradient)
- Development tools (TypeScript, ESLint)

### 3. Verify Installation
```bash
npm list
```

Check that all packages installed without errors.

## Running the App

### Development Mode

#### Start the Development Server
```bash
npx expo start
```

Or with cache clearing:
```bash
npx expo start --clear
```

#### Alternative Port (if 8081 is in use)
```bash
npx expo start --port 8082
```

### Running on Different Platforms

#### iOS Simulator (macOS only)
```bash
npx expo start --ios
```
Or press `i` in the terminal after starting the dev server.

#### Android Emulator
```bash
npx expo start --android
```
Or press `a` in the terminal after starting the dev server.

#### Web Browser
```bash
npx expo start --web
```
Or press `w` in the terminal.

#### Physical Device (via Expo Go)
1. Start the dev server: `npx expo start`
2. Open Expo Go app on your phone
3. Scan the QR code shown in terminal
4. App will load on your device

## Development Workflow

### 1. Making Changes
- Edit files in your code editor
- Changes automatically reload in the app (Fast Refresh)
- Check terminal for any errors

### 2. Running Linter
```bash
npm run lint
```

Fix any ESLint errors before committing.

### 3. Type Checking
```bash
npx tsc --noEmit
```

Verify no TypeScript errors.

### 4. Testing Features
- Test on multiple screen sizes
- Try both iOS and Android if possible
- Test edge cases (no internet, empty states, etc.)

## Building for Production

### Create Development Build

#### iOS
```bash
npx expo run:ios
```

#### Android
```bash
npx expo run:android
```

### Create Production Build

#### Using EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Build for iOS**
   ```bash
   eas build --platform ios
   ```

5. **Build for Android**
   ```bash
   eas build --platform android
   ```

### Submit to App Stores

#### iOS App Store
```bash
eas submit --platform ios
```

Requirements:
- Apple Developer Account ($99/year)
- App Store Connect setup
- Provisioning profiles

#### Google Play Store
```bash
eas submit --platform android
```

Requirements:
- Google Play Developer Account ($25 one-time)
- Keystore for signing
- Play Console setup

## Environment Configuration

### Development
Create `.env.development`:
```env
API_URL=http://localhost:3000
ENV=development
```

### Production
Create `.env.production`:
```env
API_URL=https://api.yourapp.com
ENV=production
```

### Loading Environment Variables
Install dotenv:
```bash
npm install dotenv
```

In your code:
```typescript
import { API_URL } from '@env';
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 8081
npx kill-port 8081

# Or use different port
npx expo start --port 8082
```

#### Metro Bundler Issues
```bash
# Clear cache and restart
npx expo start --clear
```

#### Module Not Found
```bash
# Reinstall node modules
rm -rf node_modules
npm install
```

#### iOS Build Fails
```bash
# Clean iOS build
cd ios
pod deintegrate
pod install
cd ..
```

#### Android Build Fails
```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

### Cache Clearing

#### Clear npm cache
```bash
npm cache clean --force
```

#### Clear Expo cache
```bash
npx expo start --clear
```

#### Clear watchman (if installed)
```bash
watchman watch-del-all
```

## Performance Optimization

### Development
- Use React DevTools
- Monitor bundle size
- Check for unnecessary re-renders
- Profile with Performance tools

### Production
- Enable Hermes engine (Android)
- Minimize bundle size
- Optimize images
- Use code splitting
- Enable ProGuard (Android)

## Debugging

### React Native Debugger
1. Install: https://github.com/jhen0409/react-native-debugger
2. Open debugger
3. Shake device or press Cmd+D (iOS) / Cmd+M (Android)
4. Select "Debug"

### Chrome DevTools
1. Start app in dev mode
2. Shake device
3. Select "Debug in Chrome"
4. Open Chrome DevTools

### Console Logs
```typescript
console.log('Debug info:', data);
console.warn('Warning message');
console.error('Error details');
```

### VS Code Debugging
1. Install React Native Tools extension
2. Add launch configuration
3. Set breakpoints
4. Start debugging

## Continuous Integration

### GitHub Actions Example
```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run lint
      - run: npx tsc --noEmit
```

## Monitoring & Analytics

### Expo Analytics
```bash
npm install expo-firebase-analytics
```

### Sentry Error Tracking
```bash
npm install @sentry/react-native
```

### App Performance Monitoring
- Firebase Performance Monitoring
- New Relic Mobile
- Datadog

## Updating Dependencies

### Check for Updates
```bash
npm outdated
```

### Update All Packages
```bash
npm update
```

### Update Expo SDK
```bash
npx expo install --fix
```

### Update Specific Package
```bash
npm install package-name@latest
```

## Security Best Practices

1. **Never commit sensitive data**
   - Use `.env` files
   - Add to `.gitignore`

2. **Keep dependencies updated**
   - Regular security audits: `npm audit`
   - Fix vulnerabilities: `npm audit fix`

3. **Secure API communication**
   - Use HTTPS only
   - Implement authentication
   - Validate all inputs

4. **Code obfuscation**
   - Enable ProGuard (Android)
   - Use Hermes engine

## Deployment Checklist

- [ ] All tests passing
- [ ] No ESLint errors
- [ ] No TypeScript errors
- [ ] App icon and splash screen updated
- [ ] app.json configured correctly
- [ ] Environment variables set
- [ ] API endpoints updated for production
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Performance optimized
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] App store listings prepared
- [ ] Screenshots captured
- [ ] Beta testing completed

## Support Resources

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/
- **Expo Forums**: https://forums.expo.dev/
- **Stack Overflow**: Tag with `react-native` and `expo`
- **GitHub Issues**: For package-specific problems

## Getting Help

1. Check documentation first
2. Search existing issues
3. Ask in Expo forums
4. Create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Code samples

---

Happy coding! 🚀
