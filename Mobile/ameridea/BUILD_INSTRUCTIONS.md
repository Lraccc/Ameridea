# Building APK with GitHub Actions

This project is configured to build Android APKs directly using Expo Prebuild and Gradle in GitHub Actions.

## Setup Instructions

### 1. Push to GitHub
Simply push your code to the `main` or `master` branch, and the GitHub Action will automatically trigger and build your APK.

**That's it!** No tokens or additional setup required.

### 2. Download Your APK
After the build completes:
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Click on the latest workflow run
4. Scroll down to "Artifacts" section
5. Download the `app-release` artifact

## Building Locally

### Prerequisites
- Node.js 18+
- Android Studio (for Android SDK)
- Java 17

### Build Commands

```bash
# Generate native Android project
npm run prebuild:android

# Build production APK
npm run build:android

# Build debug APK
npm run build:android:debug
```

The APK will be located at:
- **Release**: `android/app/build/outputs/apk/release/app-release.apk`
- **Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`

## How It Works

1. **Expo Prebuild**: Generates native Android project from your Expo app
2. **Gradle Build**: Compiles the native code and creates the APK
3. **GitHub Actions**: Automates this process on every push

## Monitoring Builds

Monitor your builds in the GitHub Actions tab of your repository.

## Troubleshooting

If you encounter issues:
1. Ensure all dependencies are installed: `npm ci`
2. Clean the build: `rm -rf android` then `npm run prebuild:android`
3. Check GitHub Actions logs for specific error messages
4. Verify Java 17 is installed locally
5. Make sure Android SDK is properly configured
