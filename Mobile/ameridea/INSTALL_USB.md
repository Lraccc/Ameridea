# Install App Directly on Android Phone via USB

## Prerequisites

1. **Enable USB Debugging on your phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times to enable Developer Options
   - Go to Settings → Developer Options
   - Enable "USB Debugging"

2. **Install ADB (Android Debug Bridge):**
   - **Windows:** Download Android Platform Tools from https://developer.android.com/tools/releases/platform-tools
   - Extract and add to PATH, or run from the extracted folder
   - **macOS:** `brew install android-platform-tools`
   - **Linux:** `sudo apt install adb` or `sudo pacman -S android-tools`

## Steps to Install

### 1. Connect Your Phone
Connect your phone to your computer via USB cable.

### 2. Verify Connection
```bash
npm run adb:devices
```
You should see your device listed. If it shows "unauthorized", check your phone for a prompt to allow USB debugging.

### 3. Build and Install Debug Version (Recommended for Development)
```bash
npm run install:android
```
This builds a debug APK and installs it on your phone.

### 4. Alternative: Build and Install Release Version
```bash
npm run install:android:release
```
Note: Release builds require signing configuration.

## Quick Commands

- **Check connected devices:** `npm run adb:devices`
- **Uninstall app:** `npm run adb:uninstall`
- **Just build (don't install):** `npm run build:android:debug`
- **Manual install:** `adb install android/app/build/outputs/apk/debug/app-debug.apk`

## Troubleshooting

### Device not detected
- Make sure USB debugging is enabled
- Try different USB cable (some cables are charge-only)
- On Windows, you may need device-specific USB drivers

### "Unauthorized device"
- Check your phone for authorization prompt
- Revoke USB debugging authorizations in Developer Options and try again

### Build fails
- Make sure you've run `npm install` first
- Run `npm run prebuild:android` to regenerate Android project

### App crashes on startup
- Debug APKs are larger but better for development
- Check logcat: `adb logcat | grep ReactNative`

## Development Workflow

Once installed, you can run the Metro bundler and it will connect to your phone:

```bash
npm run dev
```

The app on your phone will automatically reload when you make code changes.
