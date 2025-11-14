# Connect Local

> A social connection app that combats loneliness by automatically matching people with shared interests for local activities

## Overview

Connect Local is a cross-platform application (iOS, Android, web, desktop) designed to address the loneliness crisis by helping people find and connect with others in their local area who share similar interests and activities. The app automatically assigns users to local interest-based group chats with AI-assisted meetup coordination.

## Key Features

- 🔐 **Simple Login**: Quick Google OAuth authentication
- 📍 **Location-Based**: Matches users within their preferred travel radius
- 🎯 **Smart Matching**: Automatically joins you to groups based on shared interests
- 💬 **Group Chat**: Real-time messaging with local people who share your interests
- 🤖 **AI Coordination**: AI bot suggests meetup times and locations in each group
- 📅 **RSVP System**: Easy coordination for in-person meetups
- 🌐 **Multi-Platform**: Works on iOS, Android, web, and desktop

## Technology Stack

- **Capacitor 6.0**: Cross-platform runtime for iOS, Android, web, and desktop
- **HTML/CSS/JavaScript**: Core web technologies
- **Google OAuth**: Secure authentication
- **Geolocation API**: Location-based matching
- **WebSocket**: Real-time chat functionality
- **AI Integration**: Meetup coordination and suggestions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dmjeffmoore/connect-local.git
cd connect-local
```

2. Install dependencies:
```bash
npm install
```

3. Run in browser (development):
```bash
npm start
```
The app will open automatically at `http://localhost:8080`

## Development Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **For iOS development**:
  - macOS with Xcode installed
  - Xcode Command Line Tools: `xcode-select --install`
  - CocoaPods: `sudo gem install cocoapods`
- **For Android development**:
  - Android Studio installed
  - Android SDK configured
  - Java Development Kit (JDK) 11 or higher

### Quick Start Guide

#### 1. Run the Web Version (Easiest - Start Here!)

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm start
```

The app will automatically open in your default browser at `http://localhost:8080`. Any changes to files in the `www/` directory will require a browser refresh.

#### 2. Build for Production (Web)

```bash
# Build optimized web version
npm run build

# The output will be in the www/ folder, ready to deploy to any web host
```

#### 3. Set Up Mobile Platforms

**First time setup only:**

```bash
# Add iOS platform (macOS only)
npm run cap:add:ios

# Add Android platform
npm run cap:add:android
```

This creates the `ios/` and `android/` directories with native project files.

#### 4. Run on iOS

**Prerequisites**: macOS with Xcode installed

```bash
# Option 1: Run directly (opens in simulator)
npm run ios

# Option 2: Open in Xcode for more control
npx cap open ios
# Then click the "Play" button in Xcode to run
```

**Sync changes after editing web files:**
```bash
npm run sync
npm run ios
```

#### 5. Run on Android

**Prerequisites**: Android Studio installed

```bash
# Option 1: Run directly (opens in emulator or connected device)
npm run android

# Option 2: Open in Android Studio for more control
npx cap open android
# Then click the "Run" button in Android Studio
```

**Sync changes after editing web files:**
```bash
npm run sync
npm run android
```

### Common Development Workflows

#### Making Changes to the App

1. **Edit web files** in the `www/` directory (HTML, CSS, JavaScript)
2. **For web testing**: Just refresh your browser
3. **For mobile testing**:
   ```bash
   npm run sync  # Sync changes to native projects
   npm run ios   # or npm run android
   ```

#### Building for Distribution

**Web/PWA:**
```bash
npm run build
# Deploy the www/ folder to your web hosting service
```

**iOS (App Store):**
```bash
npx cap open ios
# In Xcode:
# 1. Select "Any iOS Device" or "Generic iOS Device"
# 2. Product → Archive
# 3. Follow App Store submission process
```

**Android (Google Play):**
```bash
npx cap open android
# In Android Studio:
# 1. Build → Generate Signed Bundle / APK
# 2. Follow the wizard to create a release build
# 3. Upload to Google Play Console
```

### Troubleshooting

**Web version won't start:**
- Make sure port 8080 is not in use
- Try: `npx http-server www -p 3000 -o` to use a different port

**iOS build issues:**
- Run `cd ios/App && pod install` to update CocoaPods
- Clean build: In Xcode, Product → Clean Build Folder

**Android build issues:**
- Sync Gradle: In Android Studio, File → Sync Project with Gradle Files
- Invalidate caches: File → Invalidate Caches / Restart

**Changes not showing on mobile:**
- Always run `npm run sync` after making web changes
- Rebuild the app in Xcode/Android Studio

### Development Commands Reference

```bash
# Starting the app
npm start                  # Run web version (development)
npm run ios               # Run on iOS simulator
npm run android           # Run on Android emulator

# Building
npm run build             # Build web version for production
npm run sync              # Sync web code to native projects

# Platform management
npm run cap:add:ios       # Add iOS platform (one time)
npm run cap:add:android   # Add Android platform (one time)
npx cap open ios          # Open iOS project in Xcode
npx cap open android      # Open Android project in Android Studio

# Updating Capacitor plugins
npx cap sync              # Sync all platforms and update plugins
npx cap update            # Update Capacitor and plugins to latest
```

### Project Structure
```
connect-local/
├── www/                    # Web app source
│   ├── index.html         # Main entry point
│   ├── css/
│   │   └── styles.css     # Application styles
│   ├── js/
│   │   ├── app.js         # Main app logic
│   │   ├── auth.js        # Google OAuth
│   │   ├── location.js    # Location services
│   │   ├── interests.js   # Interest selection
│   │   ├── chat.js        # Real-time chat
│   │   └── groups.js      # Group matching
│   └── assets/            # Images, icons
├── ios/                   # iOS project (auto-generated)
├── android/               # Android project (auto-generated)
├── capacitor.config.json  # Capacitor configuration
├── package.json           # Dependencies
├── VISION.md             # Product vision & roadmap
└── CLAUDE.md             # Development guide
```

## How It Works

1. **Sign Up**: Users log in with Google OAuth
2. **Set Location**: Grant location permission and specify how far they're willing to travel
3. **Choose Interests**: Select from a cloud of interests/hobbies (or add custom ones)
4. **Auto-Match**: Algorithm automatically assigns users to local groups based on:
   - Geographic proximity
   - Shared interests
5. **Chat & Meet**:
   - Chat with group members in real-time
   - AI bot suggests meetup locations and times
   - RSVP to proposed events
   - Coordinate in-person activities

## Roadmap

See [VISION.md](VISION.md) for detailed product vision.

### Phase 1 (MVP) - In Progress
- [ ] Google OAuth integration
- [ ] Location permission & travel radius selection
- [ ] Interest selection UI (chip cloud)
- [ ] Basic profile creation
- [ ] Auto-group assignment
- [ ] Real-time group chat

### Phase 2
- [ ] AI bot for meetup suggestions
- [ ] RSVP system
- [ ] Meeting location recommendations
- [ ] Push notifications

### Phase 3
- [ ] User profiles with history
- [ ] Safety & moderation tools
- [ ] Calendar integration
- [ ] Advanced matching algorithms

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Mission

Our mission is to combat the global loneliness crisis by making it easier for people to connect over shared interests and activities. We believe that meaningful in-person connections are essential for mental health and community wellbeing.

---

Built with ❤️ to bring people together
