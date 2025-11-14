# Connect Local - Product Vision

## Mission

Combat the global loneliness crisis by connecting people locally through shared interests and activities, facilitating meaningful in-person connections.

## Platform Goals

- **Android**: Native mobile app
- **iOS**: Native mobile app
- **Web**: Progressive web app accessible via browser
- **Desktop**: Mac, Windows, Linux native applications

## Core User Flow

### 1. Onboarding & Authentication
- **Simple Sign-Up**: Quick and easy account creation
- **Google OAuth**: Primary authentication method
- **Location Permission**: Request user's location for local matching
- **Travel Radius**: Ask "How far are you willing to travel/drive to meet people?"

### 2. Interest Selection
- **UI**: Cloud of clickable chips/tags displaying common interests
- **Interaction**:
  - Users can select from pre-populated interests
  - Users can add custom interests
- **Normalization**: Backend normalizes similar interests (e.g., "hiking", "hikes", "nature walks") to ensure effective matching
- **Storage**: Save user's selected interests for matching algorithm

### 3. Automatic Group Matching
- **Algorithm**: Match users based on:
  - Geographic proximity (within travel radius)
  - Shared interests/hobbies
- **Auto-Join**: Automatically add users to relevant chat rooms/groups
- **Multiple Groups**: Users can be in multiple groups based on different interests

### 4. Chat Rooms/Groups
- **Real-time Chat**: Users can communicate with others in their interest groups
- **AI Bot Integration**: Each chat room has an AI assistant that:
  - Suggests meeting locations (homes, public places, local businesses)
  - Proposes meeting times based on group availability
  - Coordinates logistics
- **RSVP System**:
  - Users can respond to proposed meetups
  - Track who's attending
  - Confirm/decline invitations

## Key Features

### Phase 1 (MVP)
- [ ] Google OAuth login
- [ ] Location permission and travel radius selection
- [ ] Interest/hobby selection with normalization
- [ ] Basic profile creation
- [ ] Automatic group assignment based on location + interests
- [ ] Real-time chat functionality

### Phase 2
- [ ] AI bot for suggesting meetups
- [ ] RSVP system for proposed events
- [ ] Meeting location suggestions (home, public, business)
- [ ] Time/date coordination
- [ ] Notification system

### Phase 3
- [ ] User profiles with activity history
- [ ] Group moderation tools
- [ ] Safety features (verification, reporting)
- [ ] Calendar integration
- [ ] In-app scheduling

## Technical Requirements

### Data Normalization
- Maintain a master list of normalized interests/hobbies
- Map user-entered custom interests to normalized versions
- Use fuzzy matching or ML for similarity detection
- Examples:
  - "hiking", "hikes", "nature walks" → "Hiking"
  - "board games", "boardgames", "tabletop games" → "Board Games"

### Location-Based Matching
- Store user coordinates (with permission)
- Calculate distance between users
- Filter matches within specified travel radius
- Privacy: Only share general area, not exact location

### Real-Time Communication
- WebSocket or similar for instant messaging
- Support for group chats
- Message history persistence
- Online/offline status

### AI Integration
- Chat bot per group for coordination
- Natural language processing for scheduling
- Location API integration for venue suggestions
- Smart RSVP tracking and reminders

## Privacy & Safety
- Location privacy (approximate area only)
- User verification options
- Reporting and blocking features
- Moderation tools for group safety
- Data encryption in transit and at rest

## Success Metrics
- Number of successful in-person meetups facilitated
- User retention and engagement
- Geographic coverage and density
- User satisfaction scores
- Reduction in reported loneliness (surveys)
