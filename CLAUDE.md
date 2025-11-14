# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Connect Local is a multi-platform application (Android, iOS, web, desktop) designed to combat loneliness by helping people find and connect with others in their local area who share similar interests and activities. The app automatically matches users into local interest-based groups with AI-assisted meetup coordination.

**Current Status**: Initial setup phase - converting from Electron to Capacitor for true cross-platform support.

## Technology Stack

- **Capacitor**: Cross-platform runtime (iOS, Android, web, desktop)
- **HTML/CSS/JavaScript**: Core web technologies
- **Node.js**: Development tooling (v16 or higher required)
- **Google OAuth**: Authentication
- **WebSocket/Real-time**: For chat functionality
- **AI Integration**: For meetup suggestions in chat rooms

## Development Commands

```bash
# Install dependencies
npm install

# Run in web browser (development)
npm start

# Build for web
npm run build

# Add mobile platforms
npx cap add ios
npx cap add android

# Sync web code to native projects
npx cap sync

# Open in native IDEs
npx cap open ios
npx cap open android

# Run on specific platforms
npm run ios
npm run android
```

## Project Architecture

### Capacitor Multi-Platform Model

Capacitor uses a **web-first architecture** where you build a standard web app that gets wrapped in native containers for each platform:

1. **Web Layer** (`www/` or `dist/`):
   - Standard HTML/CSS/JavaScript application
   - Runs directly in browsers for web deployment
   - Same code is bundled into native apps

2. **Native Bridge**:
   - Capacitor plugins provide access to native device features
   - JavaScript API calls native iOS/Android code
   - Key plugins needed:
     - `@capacitor/geolocation` - For location services
     - `@capacitor-community/google-auth` - For Google OAuth
     - `@capacitor/push-notifications` - For notifications

3. **Platform-Specific Projects**:
   - `ios/` - Xcode project (generated)
   - `android/` - Android Studio project (generated)
   - Native code only modified for advanced customization

### Application Architecture

**Authentication Flow**:
1. Google OAuth login via Capacitor plugin
2. Store auth token securely (Capacitor SecureStorage)
3. Maintain session across app restarts

**Onboarding Flow**:
1. Request location permission (`@capacitor/geolocation`)
2. Ask for travel radius (distance willing to travel)
3. Show interest/hobby selection (chip cloud UI)
4. Normalize interests on backend for matching
5. Auto-assign to local interest-based groups

**Group Matching System**:
- Match users by: location proximity + shared interests
- Auto-create/join chat rooms
- Each room has AI bot for meetup coordination

**Real-Time Chat**:
- WebSocket connection for instant messaging
- Group chat per interest/location combination
- AI bot integration for suggesting meetups & RSVP tracking

### Data Normalization Strategy

**Interest/Hobby Normalization**:
- Maintain master list of canonical interests
- Map user inputs to normalized versions using fuzzy matching
- Examples: "hiking"/"hikes"/"nature walks" → "Hiking"
- Ensures effective matching across similar interests

### File Structure

```
connect-local/
├── www/                    # Web app source (or dist/ if using build tool)
│   ├── index.html         # Main entry point
│   ├── css/
│   │   └── styles.css     # Application styles
│   ├── js/
│   │   ├── app.js         # Main application logic
│   │   ├── auth.js        # Google OAuth handling
│   │   ├── location.js    # Location services
│   │   ├── interests.js   # Interest selection & normalization
│   │   ├── chat.js        # Real-time chat functionality
│   │   └── groups.js      # Group matching logic
│   └── assets/            # Images, icons, etc.
├── ios/                   # iOS native project (auto-generated)
├── android/               # Android native project (auto-generated)
├── capacitor.config.json  # Capacitor configuration
└── package.json           # Dependencies and scripts
```

## Core Features Implementation Order

1. **Phase 1 - Authentication & Onboarding**:
   - Google OAuth integration
   - Location permission & radius selection
   - Interest selection UI with chip cloud
   - Profile creation

2. **Phase 2 - Matching & Groups**:
   - Interest normalization backend
   - Location-based matching algorithm
   - Auto-group assignment
   - Basic chat UI

3. **Phase 3 - AI & Coordination**:
   - AI bot integration per chat room
   - Meetup location suggestions
   - RSVP system
   - Notifications

## Key Capacitor Plugins Required

- `@capacitor/core` - Core Capacitor functionality
- `@capacitor/geolocation` - Location services
- `@capacitor-community/google-auth` - Google OAuth
- `@capacitor/preferences` - Local data storage
- `@capacitor/push-notifications` - Push notifications
- `@capacitor/network` - Network status
- `@capacitor/haptics` - Haptic feedback (mobile)

## Testing on Different Platforms

- **Web**: Standard browser testing (`npm start`)
- **iOS**: Requires macOS with Xcode
- **Android**: Requires Android Studio
- **Desktop**: Use Electron builder or PWA approach

## Mission

Combat the global loneliness crisis by automatically connecting people locally through shared interests, facilitating meaningful in-person connections with AI-assisted coordination.
