# Android APK Build Guide - Daily Time Log

This guide walks you through building and installing the Daily Time Log app as a native Android APK with SQLite database support.

## Prerequisites

Before starting, make sure you have installed:

1. **Node.js** (v16+) - [Download](https://nodejs.org/)
2. **Android Studio** - [Download](https://developer.android.com/studio)
3. **Android SDK** (via Android Studio)
4. **Java Development Kit (JDK)** 11 or higher

## Setup Steps

### Step 1: Install Dependencies

```bash
npm install
```

This installs all project dependencies including Capacitor and SQLite plugin.

### Step 2: Build Web Assets

```bash
npm run build
```

This creates the optimized web build in the `dist/` folder that will be packaged into the APK.

### Step 3: Initialize Capacitor (First Time Only)

If this is your first time building for Android:

```bash
npx cap init
```

You'll be prompted with:
- **App name**: `Daily Time Log`
- **App ID**: `com.dailytimelog.app` (recommended, or use your own)
- **Directory of web assets**: `dist`
- **Build web assets before opening in Android Studio**: `No` (you already built in Step 2)

### Step 4: Add Android Platform (First Time Only)

```bash
npx cap add android
```

This creates the `android/` folder with the native Android project structure.

### Step 5: Sync Web Assets to Android

Every time you make changes to the web app, sync the new build:

```bash
npm run cap:sync
```

This is equivalent to:
```bash
npm run build && cap sync
```

### Step 6: Open in Android Studio

```bash
npx cap open android
```

This opens the Android project in Android Studio where you can:
- Test on an emulator
- Build the APK
- Sign the app for release

## Building and Installing the APK

### Option A: Using Android Studio (Recommended for First Time)

1. After running `npx cap open android`, Android Studio will open
2. Wait for Gradle to finish building
3. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
4. Android Studio will show a notification when the APK is built
5. Connect your Android device and click **Run** → **Run 'app'** to install directly

### Option B: Using Command Line

```bash
cd android
./gradlew assembleDebug
```

This creates a debug APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

Then install on your device:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Using the App

Once installed:

1. **Record Time**: Log your morning in, lunch out, afternoon in, and evening out times
   - Form data auto-saves to localStorage while you're editing
   - Data persists even if you navigate to other pages

2. **Save Records**: Click "Save Record" to store the entry in SQLite database
   - Submitted records are saved permanently to the device's SQLite database
   - The app works completely offline

3. **View History**: See all saved records sorted by date
   - Data loads from SQLite on the device
   - Delete records as needed

## Important Notes

### State Persistence Features

- **Auto-save Draft**: Form data is automatically saved to browser storage every 500ms as you type
- **Survives Navigation**: Switch between pages without losing your current form data
- **Survives Reload**: Form data persists even if the app is reloaded
- **Submitted Records**: Only saved records (in SQLite) are permanent

### Database

- **SQLite Database**: Records are stored in SQLite on the device (not cloud-synced)
- **Offline-First**: The app works completely without internet
- **Local Only**: All data stays on your device

### Data Storage Locations

**Web Version (Browser)**:
- Draft form: `localStorage` under key `dtr-form-draft`
- Submitted records: `localStorage` under key `dtr-records`

**Mobile Version (APK)**:
- Draft form: Device browser storage (if accessed via web)
- Submitted records: SQLite database `dtr_database.db` on device

## Troubleshooting

### "capacitor.config.ts not found"
Make sure you're in the project root directory and have completed Step 3 (Capacitor init).

### APK Installation Fails
- Ensure "Unknown sources" is enabled on your Android device (Settings > Security)
- Your device must have enough storage space
- Try `adb uninstall com.dailytimelog.app` first, then reinstall

### App Crashes on Startup
- Check Android Studio logcat for error messages
- Ensure all build scripts completed without errors
- Try rebuilding: `npm run cap:sync` then rebuild in Android Studio

### Database Errors
- Clear app data: Settings > Apps > Daily Time Log > Storage > Clear Data
- Restart the app
- If problem persists, check logs in Android Studio

### Can't Connect to Android Studio
- Install USB drivers for your Android device
- Enable USB debugging: Settings > Developer Options > USB Debugging
- Try: `adb devices` to verify connection

## Production Build (Release)

For production release:

1. Generate a signed APK in Android Studio:
   - Build → Generate Signed Bundle/APK
   - Create a keystore file (keep it safe!)
   - Choose "APK" and select Release build type

2. Or use command line:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. The signed APK is ready to distribute

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/)
- [Capacitor SQLite Plugin](https://github.com/capacitor-community/sqlite)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Android Developer Docs](https://developer.android.com/docs)

## Quick Commands Reference

```bash
# Development workflow
npm run dev                    # Start dev server
npm run build                  # Build web assets
npm run cap:sync             # Sync to Android
npx cap open android         # Open in Android Studio
npm run mobile:build         # All-in-one: build + sync + open

# Building APK
cd android && ./gradlew assembleDebug    # Build debug APK
cd android && ./gradlew assembleRelease  # Build release APK

# Installing/Running
adb install android/app/build/outputs/apk/debug/app-debug.apk
adb logcat                    # View device logs
```

---

Happy building! 🚀
