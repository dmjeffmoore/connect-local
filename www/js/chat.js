/**
 * Chat Module
 * Handles real-time messaging (placeholder for WebSocket integration)
 */

const Chat = {
    // Chat messages by group ID
    messagesByGroup: {},

    // WebSocket connection (to be implemented)
    ws: null,

    /**
     * Initialize chat module
     */
    async init() {
        console.log('Initializing chat...');

        // Load saved messages
        const savedMessages = await this.getSavedMessages();
        if (savedMessages) {
            this.messagesByGroup = savedMessages;
            console.log('Loaded saved messages');
        }

        // TODO: Initialize WebSocket connection
        // this.connectWebSocket();
    },

    /**
     * Get saved messages from storage
     */
    async getSavedMessages() {
        try {
            const { Preferences } = window.Capacitor.Plugins;
            const { value } = await Preferences.get({ key: 'messages' });
            return value ? JSON.parse(value) : {};
        } catch (error) {
            console.error('Error getting saved messages:', error);
            return {};
        }
    },

    /**
     * Save messages to storage
     */
    async saveMessages() {
        try {
            const { Preferences } = window.Capacitor.Plugins;
            await Preferences.set({
                key: 'messages',
                value: JSON.stringify(this.messagesByGroup)
            });
        } catch (error) {
            console.error('Error saving messages:', error);
        }
    },

    /**
     * Get messages for a group
     */
    getGroupMessages(groupId) {
        if (!this.messagesByGroup[groupId]) {
            this.messagesByGroup[groupId] = [];

            // Add welcome message for new groups
            this.messagesByGroup[groupId].push({
                id: 'welcome_' + Date.now(),
                groupId: groupId,
                sender: 'AI Bot',
                isBot: true,
                message: 'Welcome to the group! I\'m your AI assistant. I can help coordinate meetups and suggest activities. Just ask!',
                timestamp: Date.now()
            });
        }

        return this.messagesByGroup[groupId];
    },

    /**
     * Send a message to a group
     */
    async sendMessage(groupId, message) {
        const newMessage = {
            id: 'msg_' + Date.now(),
            groupId: groupId,
            sender: Auth.getCurrentUser()?.name || 'You',
            isBot: false,
            message: message,
            timestamp: Date.now()
        };

        // Add message to group
        if (!this.messagesByGroup[groupId]) {
            this.messagesByGroup[groupId] = [];
        }

        this.messagesByGroup[groupId].push(newMessage);

        // Save messages
        await this.saveMessages();

        // Update group's last message
        await Groups.updateGroupLastMessage(groupId, {
            text: message,
            sender: newMessage.sender,
            timestamp: newMessage.timestamp
        });

        // TODO: Send via WebSocket to server
        // this.ws.send(JSON.stringify(newMessage));

        console.log('Message sent:', newMessage);

        // Simulate AI bot response (in production, this would come from backend)
        setTimeout(() => {
            this.simulateAIResponse(groupId, message);
        }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds

        return newMessage;
    },

    /**
     * Simulate AI bot response (for development)
     * In production, this would be handled by the backend
     */
    async simulateAIResponse(groupId, userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        let botResponse = '';

        // Simple keyword-based responses
        if (lowerMessage.includes('meetup') || lowerMessage.includes('meet')) {
            botResponse = 'Great idea! How about meeting this weekend? I can suggest some local spots if you\'d like. What day works best for everyone?';
        } else if (lowerMessage.includes('where') || lowerMessage.includes('location')) {
            botResponse = 'I can suggest a few local spots:\n\n1. Central Park Cafe - Great for casual meetups\n2. Community Center - Free and spacious\n3. Local Library - Quiet and comfortable\n\nWhich sounds good to everyone?';
        } else if (lowerMessage.includes('when') || lowerMessage.includes('time')) {
            botResponse = 'How about this Saturday at 2 PM? Let me know if that works for you, and I\'ll help coordinate!';
        } else if (lowerMessage.includes('rsvp') || lowerMessage.includes('yes') || lowerMessage.includes('count me in')) {
            botResponse = 'Awesome! I\'ve noted your RSVP. We now have enough people for a great meetup!';
        } else if (lowerMessage.includes('help')) {
            botResponse = 'I can help you:\n\n• Suggest meetup locations\n• Coordinate times\n• Track RSVPs\n• Find local activities\n\nJust let me know what you need!';
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            botResponse = 'Hello! Ready to plan something fun? Let me know if you want to organize a meetup!';
        } else {
            // Default response
            const responses = [
                'That sounds interesting! Would you like to organize a meetup around that?',
                'I\'m here to help coordinate activities. Let me know if you want to plan something!',
                'Great to see the conversation going! Feel free to ask me for meetup suggestions anytime.',
            ];
            botResponse = responses[Math.floor(Math.random() * responses.length)];
        }

        const botMessage = {
            id: 'msg_bot_' + Date.now(),
            groupId: groupId,
            sender: 'AI Bot',
            isBot: true,
            message: botResponse,
            timestamp: Date.now()
        };

        // Add bot message
        this.messagesByGroup[groupId].push(botMessage);

        // Save messages
        await this.saveMessages();

        // Update group's last message
        await Groups.updateGroupLastMessage(groupId, {
            text: botResponse,
            sender: botMessage.sender,
            timestamp: botMessage.timestamp
        });

        console.log('Bot response sent:', botMessage);

        // Trigger UI update event if needed
        if (window.App && window.App.onNewMessage) {
            window.App.onNewMessage(groupId, botMessage);
        }
    },

    /**
     * Connect to WebSocket server (to be implemented)
     */
    connectWebSocket() {
        // TODO: Implement WebSocket connection
        /*
        this.ws = new WebSocket('wss://your-backend.com/chat');

        this.ws.onopen = () => {
            console.log('WebSocket connected');
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleIncomingMessage(message);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            // Attempt to reconnect
            setTimeout(() => this.connectWebSocket(), 5000);
        };
        */
    },

    /**
     * Handle incoming message from WebSocket
     */
    handleIncomingMessage(message) {
        // Add message to appropriate group
        if (!this.messagesByGroup[message.groupId]) {
            this.messagesByGroup[message.groupId] = [];
        }

        this.messagesByGroup[message.groupId].push(message);
        this.saveMessages();

        // Update group's last message
        Groups.updateGroupLastMessage(message.groupId, {
            text: message.message,
            sender: message.sender,
            timestamp: message.timestamp
        });
    }
};
