# Quick Start Guide 🚀

Get the Mood Journal app running in 5 minutes!

## Prerequisites Check ✅

Make sure you have:
- [ ] Node.js installed (v16+)
- [ ] npm or yarn installed
- [ ] A phone with Expo Go app OR an emulator

## Step 1: Install Dependencies

```bash
npm install
```

⏱️ Takes ~2-3 minutes

## Step 2: Start the App

```bash
npx expo start
```

You should see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

## Step 3: Run on Your Device

### Option A: Physical Device (Easiest)

1. **Install Expo Go**:
   - iOS: App Store
   - Android: Google Play Store

2. **Scan QR Code**:
   - iOS: Use Camera app
   - Android: Use Expo Go app

3. **Wait for App to Load** (~30 seconds)

### Option B: iOS Simulator (macOS only)

Press `i` in the terminal OR:
```bash
npx expo start --ios
```

### Option C: Android Emulator

Press `a` in the terminal OR:
```bash
npx expo start --android
```

### Option D: Web Browser

Press `w` in the terminal OR:
```bash
npx expo start --web
```

## What You'll See 👀

### Dashboard Screen
1. **Header**: Welcome message with gradient background
2. **Stats Cards**: 
   - Current Streak: 7 days 🔥
   - Average Mood: 3.8 ⭐
3. **Daily Quote**: Inspirational quote in purple gradient card
4. **Calendar**: Interactive calendar with marked dates
5. **Monthly Stats**: Total entries, weekly average, best streak

### Try These Features

#### View Journal Entry
1. Tap on a date with a colored dot
2. Select "View Journal"
3. See the entry with mood, title, and content

#### Add New Entry
1. Tap any date on calendar
2. Select "Add New Journal"
3. Choose your mood (😄 😊 😐 😔 😢)
4. Write a title
5. Write your thoughts
6. Tap "Save"

#### Pull to Refresh
- Pull down from the top to reload data

## Features Overview 📱

✅ **Current Features** (MVP):
- View streak and mood statistics
- Daily inspirational quotes
- Interactive calendar
- Create journal entries
- Add mood to entries
- View past entries
- Beautiful, modern UI
- Smooth animations

🔜 **Coming Soon**:
- User authentication
- Cloud sync
- Data persistence
- AI mood insights
- Export entries
- Dark mode
- Notifications

## Troubleshooting 🔧

### App Won't Start?

1. **Clear cache**:
   ```bash
   npx expo start --clear
   ```

2. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Check Node version**:
   ```bash
   node --version
   # Should be v16 or higher
   ```

### QR Code Won't Scan?

- Make sure phone and computer are on same WiFi
- Try using the manual connection code
- Restart the Metro bundler

### App Crashes?

- Check terminal for error messages
- Try restarting the app
- Clear Expo Go cache on your phone

## Development Tips 💡

### Hot Reload
- Save any file to see changes instantly
- No need to restart the app
- Shake device for developer menu

### Developer Menu
- **iOS**: Cmd+D
- **Android**: Cmd+M
- **Physical Device**: Shake

### View Logs
Watch the terminal for console.log outputs

### Modify Mock Data

Edit `services/api.ts` to change:
- Streak count
- Mood scores
- Quotes
- Journal entries

Example:
```typescript
const mockStreakData: StreakData = {
  currentStreak: 10, // Change this!
  longestStreak: 20,
  lastEntryDate: new Date().toISOString().split('T')[0],
};
```

## Next Steps 📚

### Learn More
- Read `README.md` for full documentation
- Check `PROJECT_STRUCTURE.md` for architecture
- See `BACKEND_INTEGRATION.md` for API setup
- Review `SETUP_GUIDE.md` for deployment

### Customize the App
1. **Change Colors**: Edit `utils/constants.ts`
2. **Add Features**: Create new components in `components/`
3. **Modify UI**: Update `app/index.tsx`
4. **Add State**: Update `store/useAppStore.ts`

### Deploy Your App
1. Create Expo account
2. Run `eas build`
3. Submit to app stores

## Get Help 🆘

Having issues? Try:
1. Check the error message in terminal
2. Read the full `SETUP_GUIDE.md`
3. Search Expo documentation
4. Ask in Expo forums

## Success! 🎉

Your app is now running! You should see:
- ✅ Stats cards loading
- ✅ Quote appearing
- ✅ Calendar showing dates
- ✅ Smooth animations
- ✅ No errors in terminal

**Enjoy building your mood journal app!** 📔✨

---

**Time to First Run**: ~5 minutes
**Stack**: React Native + Expo + TypeScript
**Lines of Code**: ~2500+
**Components**: 14
**Features**: 8

Made with ❤️ and modern best practices
