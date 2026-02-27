# Setup Checklist - Daily Time Log

## Pre-Deployment Checklist

### Phase 1: Local Development Testing ✓

- [ ] **Install dependencies**
  ```bash
  npm install
  ```
  - Verify no errors in installation
  - Check `node_modules` folder created

- [ ] **Run development server**
  ```bash
  npm run dev
  ```
  - Should start on http://localhost:5173
  - No errors in terminal

- [ ] **Test state persistence**
  1. Open http://localhost:5173
  2. Enter date and times in Record page
  3. Click to History tab
  4. Click back to Record tab
  - Verify: **Form data is still there!**

- [ ] **Test auto-save**
  1. Open browser DevTools (F12)
  2. Go to Console tab
  3. Type in Record form
  4. Watch for `[v0] Auto-saved to localStorage: dtr-form-draft` messages
  - Verify: **Messages appear after ~500ms of typing**

- [ ] **Test form save**
  1. Enter all four time fields
  2. Click "Save Record"
  3. Check toast notification shows "Time record saved!"
  4. Go to History tab
  - Verify: **Your record appears in the list**

- [ ] **Test reload persistence**
  1. Go to Record page, enter times
  2. Wait 1 second for auto-save
  3. Press F5 to refresh browser
  - Verify: **Form data is restored after reload**

- [ ] **Test browser DevTools**
  1. Open DevTools → Application → LocalStorage
  2. Look for entries:
     - `dtr-form-draft` (current form)
     - `dtr-records` (saved records)
  - Verify: **Both exist and contain correct data**

- [ ] **Verify TypeScript compilation**
  ```bash
  npm run lint
  ```
  - Should complete with no errors

- [ ] **Check all pages accessible**
  - [ ] Record page: `http://localhost:5173/`
  - [ ] History page: `http://localhost:5173/history`
  - [ ] Install page: `http://localhost:5173/install`

### Phase 2: Production Web Build ✓

- [ ] **Build for production**
  ```bash
  npm run build
  ```
  - Should complete without errors
  - `dist/` folder created with files

- [ ] **Preview production build**
  ```bash
  npm run preview
  ```
  - Test form persistence with production build
  - Verify all features work

- [ ] **Test in production mode**
  - Open preview URL
  - Test all three features:
    1. State persistence across navigation
    2. Auto-save on form input
    3. Save and view records

- [ ] **Check for console errors**
  - Open DevTools Console
  - Should see no red error messages
  - Only info messages starting with `[v0]`

### Phase 3: Android APK Build (Optional) ✓

#### Prerequisites Check
- [ ] **Android Studio installed**
  - Download from https://developer.android.com/studio
  - Verify installation: Launch Android Studio

- [ ] **Android SDK configured**
  - In Android Studio: Tools → SDK Manager
  - Verify:
    - Android API 30+ installed
    - Build Tools 30+ installed
    - Android Emulator installed (optional)

- [ ] **Java JDK 11+ installed**
  ```bash
  java -version
  ```
  - Should show version 11 or higher

- [ ] **git installed** (for version control)
  ```bash
  git --version
  ```

#### Android Build Steps
- [ ] **Initialize Capacitor (first time only)**
  ```bash
  npx cap init
  ```
  - App name: `Daily Time Log`
  - App ID: `com.dailytimelog.app` (or your own)
  - Directory: `dist`

- [ ] **Build web assets for Android**
  ```bash
  npm run build
  ```

- [ ] **Add Android platform (first time only)**
  ```bash
  npx cap add android
  ```
  - Creates `android/` folder with Gradle project

- [ ] **Sync to Android**
  ```bash
  npm run cap:sync
  ```
  - Or: `npm run build && cap sync`

- [ ] **Open in Android Studio**
  ```bash
  npx cap open android
  ```
  - Android Studio should launch with project

- [ ] **Build APK in Android Studio**
  1. Wait for Gradle to sync (bottom right progress)
  2. Click **Build** menu → **Build Bundle(s) / APK(s)** → **Build APK(s)**
  3. Wait for build to complete
  4. Notification appears: "Build APK (debug): 100%"
  5. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

- [ ] **Test on emulator or device**
  1. Android Studio → **Run** → **Run 'app'**
  2. Select emulator or connected device
  3. Click OK
  4. App installs and launches
  5. Test form persistence on device

- [ ] **Verify Android app features**
  - [ ] Form loads without errors
  - [ ] Can enter times
  - [ ] Form persists across navigation
  - [ ] Can save records
  - [ ] Can view history
  - [ ] Can delete records
  - [ ] Works offline (disable WiFi/mobile)

#### Building Release APK (Optional)
- [ ] **Sign APK for distribution**
  1. In Android Studio: **Build** → **Generate Signed Bundle/APK**
  2. Choose **APK** (not Bundle)
  3. Create/select keystore file
  4. Build type: **Release**
  5. Choose signing certificate
  6. Click Finish
  7. Signed APK generated in output folder

- [ ] **Test signed APK**
  1. Install on device: `adb install app-release.apk`
  2. Verify app functions correctly

### Phase 4: Deployment Readiness ✓

#### Code Quality
- [ ] **No console errors**
  - Run `npm run lint`
  - Should have 0 errors

- [ ] **TypeScript compilation**
  ```bash
  npx tsc --noEmit
  ```
  - Should complete without type errors

- [ ] **Test on multiple browsers** (web version)
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] **Test form persistence on multiple browsers**
  - Each browser should have its own localStorage
  - Form data should persist independently

#### Documentation Review
- [ ] **QUICKSTART.md** - Updated with project info
- [ ] **STATE_PERSISTENCE_GUIDE.md** - Complete and accurate
- [ ] **ANDROID_BUILD_GUIDE.md** - Complete and tested
- [ ] **README.md** - Updated if exists

#### Git Repository
- [ ] **Commit all changes**
  ```bash
  git add .
  git commit -m "Implement stateless state management with SQLite"
  git push origin main
  ```

- [ ] **Create feature branch for mobile** (optional)
  ```bash
  git checkout -b feature/android-apk
  ```

- [ ] **PR review** (if team project)
  - Changes reviewed and approved
  - All tests passing

### Phase 5: Production Deployment ✓

#### Web Deployment (Vercel)
- [ ] **Deploy to Vercel**
  ```bash
  vercel --prod
  ```
  - Or use git push if connected to Vercel

- [ ] **Test production deployment**
  - Visit https://your-project.vercel.app
  - Test form persistence
  - Test save and load records

- [ ] **Verify environment variables** (if any)
  - Check Vercel project settings
  - Confirm all vars set correctly

#### Mobile Distribution
- [ ] **Google Play Store** (optional)
  - Register for developer account ($25 one-time)
  - Prepare store listing
  - Upload signed APK
  - Review and publish

- [ ] **Direct APK distribution** (simpler)
  - Host APK on your website
  - Provide download link
  - Document installation:
    1. Download APK
    2. Enable "Unknown sources" in Settings
    3. Open APK file to install
    4. App installs and launches

### Phase 6: Post-Deployment ✓

- [ ] **Monitor for errors**
  - Check browser console for issues
  - Monitor deployment logs
  - Setup error tracking if needed

- [ ] **User feedback**
  - Test with real users
  - Collect feedback
  - Note any issues

- [ ] **Performance monitoring**
  - Check app responsiveness
  - Monitor storage usage
  - Track load times

- [ ] **Backup procedures**
  - Document how to backup data
  - Test backup/restore process
  - Provide export option to users

- [ ] **Update documentation**
  - Add known issues if any
  - Document user feedback fixes
  - Update version history

## Quick Verification Steps

### Before Deployment
```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Build web version
npm run build

# 3. Run tests
npm run lint

# 4. Build APK (if deploying mobile)
npm run mobile:build  # Opens Android Studio

# 5. Final checks
npm run preview       # Test production build
```

### Daily Development
```bash
# Start dev server
npm run dev

# After making changes
npm run lint          # Check for errors
npm run build         # Build for production
npm run cap:sync      # If building for mobile
```

## Troubleshooting Checklist

### If Form Data Disappears
- [ ] Check localStorage is enabled (not incognito)
- [ ] Check browser storage limit not exceeded
- [ ] Check DevTools → Application → LocalStorage for `dtr-form-draft`
- [ ] Check browser console for `[v0] Auto-saved` messages

### If APK Build Fails
- [ ] Ensure `npm run build` completes first
- [ ] Ensure Android SDK is installed (Android Studio)
- [ ] Ensure Java 11+ is installed: `java -version`
- [ ] Clear Gradle cache: `cd android && ./gradlew clean`
- [ ] Retry: `npm run cap:sync` then open Android Studio

### If Records Don't Show
- [ ] Check localStorage: `console.log(localStorage.getItem('dtr-records'))`
- [ ] Verify "Save Record" button was clicked
- [ ] Clear browser cache and try again
- [ ] Check History page loads data async

### If State Lost on Navigation
- [ ] Verify FormProvider wraps entire App in `src/App.tsx`
- [ ] Check FormContext is properly exported
- [ ] Verify useForm() hook is used in components
- [ ] Check browser console for errors

## Success Criteria

### Web Version
- ✅ Form data persists across navigation
- ✅ Form auto-saves while typing
- ✅ Can save and load records
- ✅ Can delete records
- ✅ Works offline (after initial load)
- ✅ No console errors

### Android APK
- ✅ All web features work on Android
- ✅ SQLite database stores records
- ✅ Works completely offline
- ✅ Survives device reboot
- ✅ Installation is simple

---

## Support & Next Steps

- 📖 See [QUICKSTART.md](./QUICKSTART.md) for getting started
- 🔧 See [STATE_PERSISTENCE_GUIDE.md](./STATE_PERSISTENCE_GUIDE.md) for technical details
- 📱 See [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md) for APK building
- 💡 See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) for overview

**Ready to deploy! Good luck! 🚀**
