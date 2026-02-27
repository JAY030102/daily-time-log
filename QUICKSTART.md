# Quick Start - Daily Time Log

## What's New?

Your app now features:
- **Stateless Form**: Form data persists across page navigation and browser reloads
- **Auto-save**: Your draft is automatically saved every 500ms as you type
- **SQLite Database**: Submit records to a local SQLite database for permanent storage
- **Android APK**: Build the app as a native Android app with full offline support

## Running Locally (Development)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173 in your browser.

### Test State Persistence:
1. Go to Record page
2. Enter times and navigate away
3. Come back - data is still there!
4. Click "Save Record" to store permanently
5. Refresh page - draft is restored from localStorage

## Building Android APK

### Prerequisites:
- Android Studio installed
- Android SDK configured
- Java 11+ installed

### Quick Build:
```bash
# One-command build and open in Android Studio
npm run mobile:build
```

Then in Android Studio:
1. Wait for Gradle to build
2. Click **Build** → **Build APK(s)**
3. Install on your device or emulator

### Detailed Guide:
See [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md)

## Understanding the Architecture

### State Flow:
```
User Input → Form Context → localStorage (auto-save) → SQLite (on submit)
```

### Key Files:

| File | Purpose |
|------|---------|
| `src/contexts/FormContext.tsx` | Global form state management |
| `src/hooks/useLocalStorage.ts` | Custom hook for localStorage with debouncing |
| `src/lib/sqlite-db.ts` | Database abstraction (SQLite on mobile, localStorage on web) |
| `src/pages/RecordPage.tsx` | Time input form with auto-save |
| `src/pages/HistoryPage.tsx` | View saved records from database |
| `capacitor.config.ts` | Android/iOS configuration |

## Using the App

### Record Page
1. Select date (defaults to today)
2. Enter work times:
   - Morning In: When you arrived
   - Lunch Out: When you left for lunch
   - Afternoon In: When you returned from lunch
   - Evening Out: When you left for the day
3. Form auto-saves every keystroke
4. Click "Save Record" to submit to database
5. Click "Clear" to reset the form (clears both draft and storage)

### History Page
- View all saved records in reverse chronological order
- Delete individual records with trash icon
- Loads from SQLite (mobile) or localStorage (web)

## Features

### Auto-Save Draft (localStorage)
- Saves form state every 500ms
- Works offline
- Persists on browser/app reload
- Cleared only when user clicks "Clear"

### Submitted Records (SQLite/localStorage)
- Only saved when user clicks "Save Record"
- Persists permanently on device
- Visible in History page
- Can be deleted individually

### Cross-Page State
- Navigate from Record → History → Record
- Form data remains intact
- No data loss during navigation

## Deployment

### Web Version
```bash
npm run build
# Output in 'dist/' folder
# Deploy to Vercel, GitHub Pages, or your host
```

### Android APK
See [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md) for:
- Building debug APK
- Building release APK for app store
- Installing on devices
- Signing for distribution

## Troubleshooting

### Form Data Not Persisting?
1. Check browser console for `[v0] Auto-saved` messages
2. Ensure localStorage is enabled (not incognito mode)
3. Check browser storage limits (~5-10MB)

### Can't Build APK?
1. Ensure Android Studio and SDK are installed
2. Run `npm run build` first
3. Check [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md) troubleshooting section

### Records Not Showing in History?
1. Make sure you clicked "Save Record", not just "Clear"
2. Check browser DevTools → Application → localStorage → dtr-records
3. On mobile: Check if SQLite database is initialized

## Documentation

- [State Persistence Guide](./STATE_PERSISTENCE_GUIDE.md) - Deep dive into how state works
- [Android Build Guide](./ANDROID_BUILD_GUIDE.md) - Complete Android APK build instructions

## Next Steps

1. **Test locally**: `npm run dev` and verify form persistence
2. **Build web**: `npm run build` for production web deployment
3. **Build Android**: `npm run mobile:build` to create APK
4. **Customize**: Edit colors, fonts, and labels in the app
5. **Deploy**: Push to Vercel or distribute APK

---

Happy building! For questions, check the documentation files or examine the debug logs.
