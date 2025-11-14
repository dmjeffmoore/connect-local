/**
 * Main App Module
 * Handles app initialization, navigation, and UI interactions
 */

const App = {
    // Current screen
    currentScreen: 'loading',

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Connect Local app...');

        try {
            // Wait for Capacitor to be ready
            if (window.Capacitor) {
                await this.waitForCapacitor();
            }

            // Initialize all modules
            await Promise.all([
                Auth.init(),
                LocationService.init(),
                Interests.init(),
                Groups.init(),
                Chat.init()
            ]);

            // Check app state and navigate to appropriate screen
            await this.checkAppState();

            // Set up event listeners
            this.setupEventListeners();

            console.log('App initialized successfully');
        } catch (error) {
            console.error('App initialization error:', error);
            alert('Error initializing app. Please refresh and try again.');
        }
    },

    /**
     * Wait for Capacitor to be ready
     */
    async waitForCapacitor() {
        return new Promise((resolve) => {
            if (window.Capacitor && window.Capacitor.Plugins) {
                resolve();
            } else {
                // Fallback - wait a bit for Capacitor to load
                setTimeout(resolve, 500);
            }
        });
    },

    /**
     * Check app state and navigate to correct screen
     */
    async checkAppState() {
        // Small delay to show loading screen
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if user is logged in
        if (!Auth.isLoggedIn()) {
            this.navigateTo('login');
            return;
        }

        // Check if location is set
        if (!LocationService.getCurrentLocation()) {
            this.navigateTo('location');
            return;
        }

        // Check if interests are selected
        const interests = Interests.getSelectedInterests();
        if (!interests || interests.length === 0) {
            this.navigateTo('interests');
            return;
        }

        // Check if groups are joined
        const groups = Groups.getUserGroups();
        if (!groups || groups.length === 0) {
            this.navigateTo('profile');
            return;
        }

        // All set - go to main screen
        this.navigateTo('main');
        this.renderGroups();
    },

    /**
     * Navigate to a screen
     */
    navigateTo(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            console.log('Navigated to:', screenName);
        }
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Login screen
        const googleLoginBtn = document.getElementById('google-login-btn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', () => this.handleGoogleLogin());
        }

        // Location screen
        const enableLocationBtn = document.getElementById('enable-location-btn');
        if (enableLocationBtn) {
            enableLocationBtn.addEventListener('click', () => this.handleEnableLocation());
        }

        const skipLocationBtn = document.getElementById('skip-location-btn');
        if (skipLocationBtn) {
            skipLocationBtn.addEventListener('click', () => this.handleSkipLocation());
        }

        const travelRadiusSelect = document.getElementById('travel-radius');
        if (travelRadiusSelect) {
            travelRadiusSelect.addEventListener('change', (e) => {
                LocationService.setTravelRadius(e.target.value);
            });
        }

        // Interests screen
        const interestSearch = document.getElementById('interest-search');
        if (interestSearch) {
            interestSearch.addEventListener('input', (e) => this.handleInterestSearch(e.target.value));
            interestSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAddCustomInterest(e.target.value);
                    e.target.value = '';
                }
            });
        }

        const continueInterestsBtn = document.getElementById('continue-interests-btn');
        if (continueInterestsBtn) {
            continueInterestsBtn.addEventListener('click', () => this.handleContinueInterests());
        }

        // Profile screen
        const findGroupsBtn = document.getElementById('find-groups-btn');
        if (findGroupsBtn) {
            findGroupsBtn.addEventListener('click', () => this.handleFindGroups());
        }

        // Main screen tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        console.log('Event listeners set up');
    },

    /**
     * Handle Google login
     */
    async handleGoogleLogin() {
        const btn = document.getElementById('google-login-btn');
        const originalText = btn.innerHTML;

        try {
            btn.innerHTML = 'Logging in...';
            btn.disabled = true;

            await Auth.loginWithGoogle();

            // Navigate to location screen
            this.navigateTo('location');
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    },

    /**
     * Handle enable location
     */
    async handleEnableLocation() {
        const btn = document.getElementById('enable-location-btn');
        const originalText = btn.innerHTML;

        try {
            btn.innerHTML = 'Getting location...';
            btn.disabled = true;

            await LocationService.requestLocation();

            // Navigate to interests screen
            this.navigateTo('interests');
            this.renderInterests();
        } catch (error) {
            console.error('Location error:', error);
            alert('Could not get location. Please check permissions and try again.');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    },

    /**
     * Handle skip location
     */
    handleSkipLocation() {
        // Set a default location
        LocationService.currentLocation = {
            name: 'Unknown Location',
            latitude: 0,
            longitude: 0
        };

        this.navigateTo('interests');
        this.renderInterests();
    },

    /**
     * Render interests chips
     */
    renderInterests(searchQuery = null) {
        const container = document.getElementById('interest-chips');
        if (!container) return;

        const interests = searchQuery
            ? Interests.searchInterests(searchQuery)
            : Interests.getAllInterests();

        container.innerHTML = '';

        interests.forEach(interest => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = interest;

            if (Interests.isSelected(interest)) {
                chip.classList.add('selected');
            }

            if (Interests.isCustom(interest)) {
                chip.classList.add('new');
            }

            chip.addEventListener('click', () => {
                Interests.toggleInterest(interest);
                chip.classList.toggle('selected');
                this.updateInterestCount();
            });

            container.appendChild(chip);
        });

        this.updateInterestCount();
    },

    /**
     * Handle interest search
     */
    handleInterestSearch(query) {
        this.renderInterests(query);
    },

    /**
     * Handle add custom interest
     */
    handleAddCustomInterest(interest) {
        if (!interest || !interest.trim()) return;

        const normalized = Interests.addCustomInterest(interest);
        this.renderInterests();

        // Scroll to the new chip
        setTimeout(() => {
            const newChip = Array.from(document.querySelectorAll('.chip'))
                .find(chip => chip.textContent === normalized);
            if (newChip) {
                newChip.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    },

    /**
     * Update selected interest count
     */
    updateInterestCount() {
        const countEl = document.getElementById('selected-count');
        const btnEl = document.getElementById('continue-interests-btn');

        if (countEl) {
            const count = Interests.getSelectedInterests().length;
            countEl.textContent = count;

            if (btnEl) {
                btnEl.disabled = count === 0;
            }
        }
    },

    /**
     * Handle continue from interests
     */
    handleContinueInterests() {
        this.navigateTo('profile');
        this.renderProfileSummary();
    },

    /**
     * Render profile summary
     */
    renderProfileSummary() {
        const locationEl = document.getElementById('summary-location');
        const radiusEl = document.getElementById('summary-radius');
        const interestsEl = document.getElementById('summary-interests');

        if (locationEl) {
            const location = LocationService.getCurrentLocation();
            locationEl.textContent = location?.name || 'Location not set';
        }

        if (radiusEl) {
            radiusEl.textContent = `${LocationService.getTravelRadius()} miles`;
        }

        if (interestsEl) {
            const interests = Interests.getSelectedInterests();
            interestsEl.innerHTML = '';

            interests.forEach(interest => {
                const chip = document.createElement('span');
                chip.className = 'summary-chip';
                chip.textContent = interest;
                interestsEl.appendChild(chip);
            });
        }
    },

    /**
     * Handle find groups
     */
    async handleFindGroups() {
        const btn = document.getElementById('find-groups-btn');
        const originalText = btn.innerHTML;

        try {
            btn.innerHTML = 'Finding groups...';
            btn.disabled = true;

            const interests = Interests.getSelectedInterests();
            const location = LocationService.getCurrentLocation();
            const radius = LocationService.getTravelRadius();

            await Groups.findAndJoinGroups(interests, location, radius);

            // Navigate to main screen
            this.navigateTo('main');
            this.renderGroups();
        } catch (error) {
            console.error('Find groups error:', error);
            alert('Error finding groups. Please try again.');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    },

    /**
     * Render groups list
     */
    renderGroups() {
        const container = document.querySelector('.groups-list');
        if (!container) return;

        const groups = Groups.getUserGroups();

        if (!groups || groups.length === 0) {
            container.innerHTML = '<p class="empty-state">No groups yet. Complete your profile to find groups!</p>';
            return;
        }

        container.innerHTML = '';

        groups.forEach(group => {
            const groupCard = this.createGroupCard(group);
            container.appendChild(groupCard);
        });
    },

    /**
     * Create group card element
     */
    createGroupCard(group) {
        const card = document.createElement('div');
        card.className = 'group-card';
        card.style.cssText = `
            background: var(--surface);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
        `;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${group.name}</h3>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.875rem;">
                        ${group.memberCount} members • ${group.location.name}
                    </p>
                </div>
                ${group.unreadCount > 0 ? `
                    <span style="
                        background: var(--primary-color);
                        color: white;
                        border-radius: 999px;
                        padding: 0.25rem 0.5rem;
                        font-size: 0.75rem;
                        font-weight: 600;
                    ">${group.unreadCount}</span>
                ` : ''}
            </div>
        `;

        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--primary-color)';
            card.style.boxShadow = 'var(--shadow-md)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--border-color)';
            card.style.boxShadow = 'none';
        });

        card.addEventListener('click', () => {
            // TODO: Open group chat
            console.log('Open group:', group.id);
        });

        return card;
    },

    /**
     * Switch tab in main screen
     */
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });

        const activePane = document.getElementById(`${tabName}-tab`);
        if (activePane) {
            activePane.classList.add('active');
        }
    },

    /**
     * Handle new message (called from Chat module)
     */
    onNewMessage(groupId, message) {
        // Update UI if needed
        console.log('New message in group:', groupId, message);
        // TODO: Update messages list if viewing that group
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Expose App globally for other modules
window.App = App;
