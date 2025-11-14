# Connect Local

> A social connection app that combats loneliness by matching people with shared interests for local activities

## Overview

Connect Local is an Electron-based desktop application designed to address the loneliness crisis by helping people find and connect with others in their local area who share similar interests and activities. The app provides a chat interface for real-time communication and activity coordination.

## Features

- 💬 **Real-time Chat**: Instant messaging with a clean, modern interface
- 🔒 **Secure Communication**: Built with Electron's context isolation and IPC best practices
- 📱 **Activity Matching**: Connect with people based on shared interests
- 🌍 **Local Focus**: Find people in your area for in-person activities
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- ⚡ **Fast & Lightweight**: Built with native web technologies

## Technology Stack

- **Electron 38.0.0**: Latest cross-platform desktop framework
- **Node.js**: Backend runtime
- **HTML/CSS/JavaScript**: Frontend interface
- **IPC (Inter-Process Communication)**: Secure message handling

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

3. Run the application:
```bash
npm start
```

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Project Structure
```
connect-local/
├── package.json       # Project dependencies and scripts
├── main.js           # Main process (Electron backend)
├── preload.js        # Preload script (secure IPC bridge)
├── renderer.js       # Renderer process (frontend logic)
├── index.html        # Main HTML structure
├── styles.css        # Application styling
└── README.md         # This file
```

## Usage

1. Launch the app with `npm start`
2. Type your message in the input field
3. Press Enter or click Send to post messages
4. View your chat history in the message container
5. Use the Clear Chat button to reset the conversation

## Roadmap

- [ ] User authentication and profiles
- [ ] Activity preferences and interests
- [ ] Location-based matching
- [ ] In-app activity scheduling
- [ ] Group chat support
- [ ] Push notifications
- [ ] Mobile companion app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Mission

Our mission is to combat the global loneliness crisis by making it easier for people to connect over shared interests and activities. We believe that meaningful in-person connections are essential for mental health and community wellbeing.

---

Built with ❤️ to bring people together
