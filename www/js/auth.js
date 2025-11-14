/**
 * Authentication Module
 * Handles user authentication with PocketBase
 */

import pb from './pocketbase-client.js';

const Auth = {
    /**
     * Initialize authentication
     */
    async init() {
        console.log('Initializing authentication...');

        // PocketBase automatically manages auth state
        // Check if user is already logged in
        if (pb.authStore.isValid) {
            console.log('User already logged in:', pb.authStore.model.email);
            return true;
        }

        return false;
    },

    /**
     * Register new user with email/password
     */
    async register(email, password, displayName) {
        try {
            console.log('Registering new user:', email);

            const userData = {
                email: email,
                password: password,
                passwordConfirm: password,
                displayName: displayName,
                emailVisibility: true
            };

            const user = await pb.collection('users').create(userData);

            // Automatically login after registration
            await this.login(email, password);

            console.log('Registration successful:', user);
            return user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    /**
     * Login with email/password
     */
    async login(email, password) {
        try {
            console.log('Logging in user:', email);

            const authData = await pb.collection('users').authWithPassword(email, password);

            console.log('Login successful:', authData.record);
            return authData.record;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Login with OAuth provider (Google, etc.)
     * Note: Requires PocketBase OAuth setup
     */
    async loginWithOAuth(provider = 'google') {
        try {
            console.log('Starting OAuth login with:', provider);

            const authData = await pb.collection('users').authWithOAuth2({ provider });

            console.log('OAuth login successful:', authData.record);
            return authData.record;
        } catch (error) {
            console.error('OAuth login error:', error);
            throw error;
        }
    },

    /**
     * Logout
     */
    logout() {
        pb.authStore.clear();
        console.log('Logout successful');
    },

    /**
     * Get current user
     */
    getCurrentUser() {
        return pb.authStore.model;
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return pb.authStore.isValid;
    }
};

// Export Auth module
export default Auth;
