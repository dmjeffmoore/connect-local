/**
 * Interests Module
 * Handles interest/hobby selection and normalization
 */

const Interests = {
    // Predefined interests with normalized names
    predefinedInterests: [
        'Hiking', 'Running', 'Cycling', 'Yoga', 'Fitness', 'Sports',
        'Basketball', 'Soccer', 'Tennis', 'Golf', 'Swimming', 'Climbing',
        'Board Games', 'Video Games', 'Chess', 'Cards', 'Puzzles',
        'Reading', 'Writing', 'Poetry', 'Book Club', 'Journaling',
        'Cooking', 'Baking', 'Wine Tasting', 'Coffee', 'Foodie',
        'Photography', 'Art', 'Painting', 'Drawing', 'Crafts',
        'Music', 'Guitar', 'Piano', 'Singing', 'Dancing', 'DJ',
        'Movies', 'Theater', 'Comedy', 'Concerts', 'Festivals',
        'Travel', 'Camping', 'Fishing', 'Hunting', 'Kayaking',
        'Gardening', 'Plants', 'Volunteering', 'Charity', 'Community',
        'Technology', 'Coding', 'Startups', 'Crypto', 'AI',
        'Investing', 'Real Estate', 'Business', 'Entrepreneurship',
        'Meditation', 'Spirituality', 'Mindfulness', 'Self-Improvement',
        'Language Learning', 'Culture', 'History', 'Science',
        'Pets', 'Dogs', 'Cats', 'Animals', 'Nature',
        'Fashion', 'Style', 'Beauty', 'Makeup', 'Shopping',
        'Anime', 'Comics', 'Cosplay', 'Sci-Fi', 'Fantasy',
        'Politics', 'Activism', 'Environment', 'Sustainability'
    ],

    // User's selected interests
    selectedInterests: [],

    // Custom interests added by user
    customInterests: [],

    /**
     * Initialize interests module
     */
    async init() {
        console.log('Initializing interests...');

        // Load saved interests
        const savedInterests = await this.getSavedInterests();
        if (savedInterests) {
            this.selectedInterests = savedInterests.selected || [];
            this.customInterests = savedInterests.custom || [];
            console.log('Loaded saved interests:', this.selectedInterests);
            return true;
        }

        return false;
    },

    /**
     * Get saved interests from storage
     */
    async getSavedInterests() {
        try {
            const { Preferences } = window.Capacitor.Plugins;
            const { value } = await Preferences.get({ key: 'interests' });
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error getting saved interests:', error);
            return null;
        }
    },

    /**
     * Save interests to storage
     */
    async saveInterests() {
        try {
            const { Preferences } = window.Capacitor.Plugins;
            const data = {
                selected: this.selectedInterests,
                custom: this.customInterests
            };
            await Preferences.set({
                key: 'interests',
                value: JSON.stringify(data)
            });
            console.log('Interests saved');
        } catch (error) {
            console.error('Error saving interests:', error);
        }
    },

    /**
     * Get all available interests (predefined + custom)
     */
    getAllInterests() {
        return [...this.predefinedInterests, ...this.customInterests];
    },

    /**
     * Toggle interest selection
     */
    toggleInterest(interest) {
        const index = this.selectedInterests.indexOf(interest);

        if (index > -1) {
            // Remove interest
            this.selectedInterests.splice(index, 1);
            console.log('Removed interest:', interest);
        } else {
            // Add interest
            this.selectedInterests.push(interest);
            console.log('Added interest:', interest);
        }

        // Save to storage
        this.saveInterests();

        return this.selectedInterests;
    },

    /**
     * Add custom interest
     */
    addCustomInterest(interest) {
        // Normalize the interest name
        const normalized = this.normalizeInterest(interest);

        // Check if it already exists in predefined or custom
        if (this.predefinedInterests.includes(normalized) ||
            this.customInterests.includes(normalized)) {
            console.log('Interest already exists:', normalized);
            return normalized;
        }

        // Add to custom interests
        this.customInterests.push(normalized);
        console.log('Added custom interest:', normalized);

        // Also select it
        this.selectedInterests.push(normalized);

        // Save to storage
        this.saveInterests();

        return normalized;
    },

    /**
     * Normalize interest name
     * Converts to title case and handles common variations
     */
    normalizeInterest(interest) {
        // Trim and title case
        let normalized = interest.trim()
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Handle common variations and synonyms
        const synonyms = {
            'Hike': 'Hiking',
            'Hikes': 'Hiking',
            'Nature Walks': 'Hiking',
            'Run': 'Running',
            'Runs': 'Running',
            'Jog': 'Running',
            'Jogging': 'Running',
            'Bike': 'Cycling',
            'Biking': 'Cycling',
            'Boardgames': 'Board Games',
            'Tabletop Games': 'Board Games',
            'Video Gaming': 'Video Games',
            'Gaming': 'Video Games',
            'Cook': 'Cooking',
            'Bake': 'Baking',
            'Photo': 'Photography',
            'Photos': 'Photography',
            'Paint': 'Painting',
            'Draw': 'Drawing',
            'Dog': 'Dogs',
            'Cat': 'Cats',
            'Tech': 'Technology',
            'Code': 'Coding',
            'Programming': 'Coding',
            'Meditate': 'Meditation',
            'Garden': 'Gardening',
            'Camp': 'Camping',
            'Fish': 'Fishing',
            'Movie': 'Movies',
            'Film': 'Movies',
            'Films': 'Movies'
        };

        if (synonyms[normalized]) {
            normalized = synonyms[normalized];
        }

        return normalized;
    },

    /**
     * Search interests
     */
    searchInterests(query) {
        const lowerQuery = query.toLowerCase().trim();

        if (!lowerQuery) {
            return this.getAllInterests();
        }

        // Search in both predefined and custom interests
        return this.getAllInterests().filter(interest =>
            interest.toLowerCase().includes(lowerQuery)
        );
    },

    /**
     * Get selected interests
     */
    getSelectedInterests() {
        return this.selectedInterests;
    },

    /**
     * Check if interest is selected
     */
    isSelected(interest) {
        return this.selectedInterests.includes(interest);
    },

    /**
     * Check if interest is custom (user-added)
     */
    isCustom(interest) {
        return this.customInterests.includes(interest);
    },

    /**
     * Clear all selections
     */
    clearSelections() {
        this.selectedInterests = [];
        this.saveInterests();
    }
};
