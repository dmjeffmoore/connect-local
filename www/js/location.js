/**
 * Location Service Module
 * Handles geolocation permissions and coordinates
 */

const LocationService = {
    // Current location data
    currentLocation: null,
    travelRadius: 10, // Default: 10 miles

    /**
     * Initialize location service
     */
    async init() {
        console.log('Initializing location service...');

        // Load saved location and radius
        const savedData = await this.getSavedLocationData();
        if (savedData) {
            this.currentLocation = savedData.location;
            this.travelRadius = savedData.radius;
            console.log('Loaded saved location data');
            return true;
        }

        return false;
    },

    /**
     * Get saved location data from storage
     */
    async getSavedLocationData() {
        try {
            const { Preferences } = window.Capacitor.Plugins;
            const { value } = await Preferences.get({ key: 'locationData' });
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error getting saved location:', error);
            return null;
        }
    },

    /**
     * Save location data to storage
     */
    async saveLocationData(location, radius) {
        try {
            const { Preferences } = window.Capacitor.Plugins;
            const data = { location, radius };
            await Preferences.set({
                key: 'locationData',
                value: JSON.stringify(data)
            });
            console.log('Location data saved');
        } catch (error) {
            console.error('Error saving location:', error);
        }
    },

    /**
     * Request location permission and get current location
     */
    async requestLocation() {
        try {
            console.log('Requesting location permission...');

            // Check if running in Capacitor
            if (window.Capacitor && window.Capacitor.Plugins.Geolocation) {
                const { Geolocation } = window.Capacitor.Plugins;

                // Request permission
                const permission = await Geolocation.requestPermissions();
                console.log('Permission status:', permission);

                if (permission.location === 'granted' || permission.coarseLocation === 'granted') {
                    // Get current position
                    const position = await Geolocation.getCurrentPosition({
                        enableHighAccuracy: false,
                        timeout: 10000
                    });

                    this.currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timestamp: position.timestamp
                    };

                    console.log('Location obtained:', this.currentLocation);

                    // Get city/area name from coordinates
                    const locationName = await this.getLocationName(
                        this.currentLocation.latitude,
                        this.currentLocation.longitude
                    );

                    this.currentLocation.name = locationName;

                    // Save location data
                    await this.saveLocationData(this.currentLocation, this.travelRadius);

                    return this.currentLocation;
                } else {
                    throw new Error('Location permission denied');
                }
            } else {
                // Fallback for web browser
                return await this.requestLocationWeb();
            }
        } catch (error) {
            console.error('Location request error:', error);
            throw error;
        }
    },

    /**
     * Request location using Web API
     */
    async requestLocationWeb() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    this.currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timestamp: position.timestamp
                    };

                    console.log('Web location obtained:', this.currentLocation);

                    // Get location name
                    const locationName = await this.getLocationName(
                        this.currentLocation.latitude,
                        this.currentLocation.longitude
                    );

                    this.currentLocation.name = locationName;

                    // Save location data
                    await this.saveLocationData(this.currentLocation, this.travelRadius);

                    resolve(this.currentLocation);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    reject(error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    },

    /**
     * Get human-readable location name from coordinates
     * Uses reverse geocoding
     */
    async getLocationName(latitude, longitude) {
        try {
            // Use OpenStreetMap's Nominatim API for reverse geocoding (free, no API key needed)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                {
                    headers: {
                        'User-Agent': 'ConnectLocal/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Geocoding request failed');
            }

            const data = await response.json();

            // Extract city and state
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const state = data.address.state;

            if (city && state) {
                return `${city}, ${state}`;
            } else if (city) {
                return city;
            } else if (state) {
                return state;
            }

            return 'Unknown Location';
        } catch (error) {
            console.error('Geocoding error:', error);
            return 'Location Obtained';
        }
    },

    /**
     * Set travel radius
     */
    setTravelRadius(radius) {
        this.travelRadius = parseInt(radius);
        console.log('Travel radius set to:', this.travelRadius, 'miles');

        // Save updated data
        if (this.currentLocation) {
            this.saveLocationData(this.currentLocation, this.travelRadius);
        }
    },

    /**
     * Get current location
     */
    getCurrentLocation() {
        return this.currentLocation;
    },

    /**
     * Get travel radius
     */
    getTravelRadius() {
        return this.travelRadius;
    },

    /**
     * Calculate distance between two coordinates (in miles)
     * Uses Haversine formula
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3959; // Earth's radius in miles
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) *
            Math.cos(this.toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    },

    /**
     * Convert degrees to radians
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
};
