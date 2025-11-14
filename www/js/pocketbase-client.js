/**
 * PocketBase Client Configuration
 *
 * This file initializes and exports the PocketBase client for use throughout the app.
 */

import PocketBase from 'https://unpkg.com/pocketbase@0.26.3/dist/pocketbase.es.mjs';

// Initialize PocketBase client
// Default local development URL
const PB_URL = 'http://127.0.0.1:8090';

const pb = new PocketBase(PB_URL);

// Enable auto cancellation for requests
pb.autoCancellation(false);

// Optional: Enable real-time subscriptions
// This allows listening to database changes in real-time
console.log('PocketBase client initialized:', PB_URL);

// Export the client
export default pb;

/**
 * Helper function to check if user is authenticated
 */
export function isAuthenticated() {
    return pb.authStore.isValid;
}

/**
 * Helper function to get current user
 */
export function getCurrentUser() {
    return pb.authStore.model;
}

/**
 * Helper function to logout
 */
export function logout() {
    pb.authStore.clear();
}
