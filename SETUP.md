# Connect Local - Setup Guide

Complete setup instructions for developers to get the app running.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required for All Platforms
- **Node.js** (v16 or higher): [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git**: [Download here](https://git-scm.com/)

### For iOS Development (macOS only)
- **Xcode** (latest version): Install from Mac App Store
- **Xcode Command Line Tools**:
  ```bash
  xcode-select --install
  ```
- **CocoaPods**:
  ```bash
  sudo gem install cocoapods
  ```

### For Android Development
- **Android Studio**: [Download here](https://developer.android.com/studio)
- **Java Development Kit (JDK)** 11 or higher
- **Android SDK** (installed via Android Studio)

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/dmjeffmoore/connect-local.git
cd connect-local

# Install dependencies
npm install
```

### 2. Run the Web Version

The easiest way to start developing is to run the web version:

```bash
npm start
```

This will start a local server at `http://localhost:8080` and automatically open your browser.

### 3. Test the App

The app is currently in development mode with mock authentication:
- Click "Continue with Google" - it will simulate a login
- Allow location access or skip
- Select some interests from the chip cloud or add your own
- Continue through the flow to see the auto-generated groups

## Google OAuth Setup (Production)

For production deployment, you'll need to set up real Google OAuth:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API

### 2. Create OAuth Credentials

1. Go to "Credentials" in the sidebar
2. Click "Create Credentials" → "OAuth client ID"
3. Configure consent screen if needed
4. Create credentials for:
   - **Web application** (for web version)
   - **iOS** (if building iOS app)
   - **Android** (if building Android app)

### 3. Update Configuration

**For Web:**
- Uncomment and update the Google Web Auth code in `www/js/auth.js`
- Add Google's JavaScript SDK to `www/index.html`

**For Native (iOS/Android):**
- Update `capacitor.config.json` with your OAuth client IDs:
  ```json
  {
    "plugins": {
      "GoogleAuth": {
        "scopes": ["profile", "email"],
        "serverClientId": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
        "forceCodeForRefreshToken": true
      }
    }
  }
  ```

## Mobile Development Setup

### iOS Setup

1. **Add iOS platform** (first time only):
   ```bash
   npm run cap:add:ios
   ```

2. **Configure iOS project**:
   - Open `ios/App/App.xcworkspace` in Xcode (NOT .xcodeproj)
   - Select your development team in project settings
   - Update Bundle Identifier if needed

3. **Install CocoaPods dependencies**:
   ```bash
   cd ios/App
   pod install
   cd ../..
   ```

4. **Run on iOS**:
   ```bash
   npm run ios
   ```

### Android Setup

1. **Add Android platform** (first time only):
   ```bash
   npm run cap:add:android
   ```

2. **Configure Android project**:
   - Open `android/` folder in Android Studio
   - Wait for Gradle sync to complete
   - Update package name in `AndroidManifest.xml` if needed

3. **Run on Android**:
   ```bash
   npm run android
   ```

## Development Workflow

### Making Changes

1. Edit files in the `www/` directory
2. For web: Just refresh your browser
3. For mobile:
   ```bash
   npm run sync  # Sync changes to native projects
   npm run ios   # or npm run android
   ```

### File Structure

```
www/
├── index.html          # Main HTML file with all screens
├── manifest.json       # PWA manifest
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── app.js          # Main app logic and navigation
│   ├── auth.js         # Google OAuth authentication
│   ├── location.js     # Geolocation services
│   ├── interests.js    # Interest selection and normalization
│   ├── groups.js       # Group matching and management
│   └── chat.js         # Chat functionality (WebSocket placeholder)
└── assets/
    └── (icons, images)
```

## Backend Development (Future)

Currently, the app uses mock data and local storage. For production, you'll need to build a backend:

### Recommended Stack
- **Node.js + Express** or **Python + FastAPI**
- **PostgreSQL** or **MongoDB** for database
- **WebSocket** (Socket.io or similar) for real-time chat
- **Redis** for caching and sessions

### Key Backend Features to Implement
1. **User Authentication**: Verify Google OAuth tokens
2. **User Profiles**: Store user data, interests, location
3. **Matching Algorithm**: Match users based on location + interests
4. **Group Management**: Create/manage groups, add/remove members
5. **Real-time Chat**: WebSocket server for messaging
6. **AI Integration**: OpenAI API or similar for meetup suggestions
7. **RSVP System**: Track event attendance
8. **Notifications**: Push notifications for new messages/events

### Environment Variables

Create a `.env` file (not in git):
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_web_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Backend API
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/connectlocal

# WebSocket
WS_URL=ws://localhost:3000

# OpenAI (for AI bot)
OPENAI_API_KEY=your_openai_key
```

## Testing

### Manual Testing Checklist
- [ ] Login flow works
- [ ] Location permission requested and coordinates obtained
- [ ] Interest selection works (select/deselect)
- [ ] Custom interests can be added
- [ ] Interest normalization works (e.g., "hike" → "Hiking")
- [ ] Profile summary shows correct data
- [ ] Groups are created for each interest
- [ ] Groups display in main screen
- [ ] Tab navigation works

### Browser Testing
Test in multiple browsers:
- Chrome/Edge
- Firefox
- Safari (iOS)

### Mobile Testing
- iOS Simulator (via Xcode)
- Android Emulator (via Android Studio)
- Real devices for best accuracy

## Troubleshooting

### "npm command not found"
Install Node.js from [nodejs.org](https://nodejs.org/)

### Port 8080 already in use
```bash
npx http-server www -p 3000 -o
```

### iOS pod install fails
```bash
cd ios/App
pod repo update
pod install
```

### Android build fails
- Update Android Studio to latest version
- Update Android SDK in Android Studio
- File → Invalidate Caches / Restart

### Google Auth not working
- Check OAuth credentials are correct
- Ensure redirect URIs are configured
- For iOS/Android, ensure bundle IDs match

### Location not working
- Check browser/device location permissions
- For iOS: Update `Info.plist` with location permission descriptions
- For Android: Update `AndroidManifest.xml` with location permissions

## Next Steps

1. **Set up backend API** - Build the server for production
2. **Implement real Google OAuth** - Replace mock authentication
3. **WebSocket integration** - Add real-time chat
4. **AI bot integration** - Connect to OpenAI or similar
5. **Push notifications** - Set up notification service
6. **App icons** - Design and add app icons
7. **Testing** - Write unit and integration tests
8. **Deployment** - Deploy to app stores and web

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [iOS Development Guide](https://developer.apple.com/ios/)
- [Android Development Guide](https://developer.android.com/)

## Support

For issues or questions:
1. Check the [README.md](README.md) for quick reference
2. Review [VISION.md](VISION.md) for product details
3. Check [CLAUDE.md](CLAUDE.md) for architecture info
4. Create an issue in the GitHub repository
