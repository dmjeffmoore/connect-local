/**
 * Groups Module
 * Handles group matching and management
 */

const Groups = {
    // User's groups
    userGroups: [],

    /**
     * Initialize groups module
     */
    async init() {
        console.log('Initializing groups...');

        // Load saved groups
        const savedGroups = await this.getSavedGroups();
        if (savedGroups) {
            this.userGroups = savedGroups;
            console.log('Loaded saved groups:', this.userGroups.length);
            return true;
        }

        return false;
    },

    /**
     * Get saved groups from storage
     */
    async getSavedGroups() {
        try {
            const { Preferences } = window.Capacitor.Plugins;
            const { value } = await Preferences.get({ key: 'groups' });
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error getting saved groups:', error);
            return null;
        }
    },

    /**
     * Save groups to storage
     */
    async saveGroups() {
        try {
            const { Preferences } = window.Capacitor.Plugins;
            await Preferences.set({
                key: 'groups',
                value: JSON.stringify(this.userGroups)
            });
            console.log('Groups saved');
        } catch (error) {
            console.error('Error saving groups:', error);
        }
    },

    /**
     * Find and join groups based on user's interests and location
     * In production, this would call a backend API
     */
    async findAndJoinGroups(interests, location, radius) {
        console.log('Finding groups for:', interests, 'near', location.name);

        // TODO: In production, this would make an API call to the backend
        // For now, we'll create mock groups for each interest

        const groups = [];

        for (const interest of interests) {
            // Create a mock group for each interest
            const group = {
                id: `group_${interest.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
                name: `${interest} - ${location.name}`,
                interest: interest,
                location: {
                    name: location.name,
                    latitude: location.latitude,
                    longitude: location.longitude
                },
                radius: radius,
                memberCount: Math.floor(Math.random() * 50) + 5, // Random 5-55 members
                unreadCount: 0,
                lastMessage: null,
                joinedAt: Date.now(),
                hasAIBot: true
            };

            groups.push(group);
        }

        // Save groups
        this.userGroups = groups;
        await this.saveGroups();

        console.log('Joined', groups.length, 'groups');
        return groups;
    },

    /**
     * Get user's groups
     */
    getUserGroups() {
        return this.userGroups;
    },

    /**
     * Get group by ID
     */
    getGroupById(groupId) {
        return this.userGroups.find(group => group.id === groupId);
    },

    /**
     * Leave a group
     */
    async leaveGroup(groupId) {
        const index = this.userGroups.findIndex(group => group.id === groupId);

        if (index > -1) {
            this.userGroups.splice(index, 1);
            await this.saveGroups();
            console.log('Left group:', groupId);
            return true;
        }

        return false;
    },

    /**
     * Update group's last message
     */
    async updateGroupLastMessage(groupId, message) {
        const group = this.getGroupById(groupId);

        if (group) {
            group.lastMessage = message;
            await this.saveGroups();
        }
    },

    /**
     * Increment unread count for a group
     */
    async incrementUnreadCount(groupId) {
        const group = this.getGroupById(groupId);

        if (group) {
            group.unreadCount = (group.unreadCount || 0) + 1;
            await this.saveGroups();
        }
    },

    /**
     * Clear unread count for a group
     */
    async clearUnreadCount(groupId) {
        const group = this.getGroupById(groupId);

        if (group) {
            group.unreadCount = 0;
            await this.saveGroups();
        }
    }
};
