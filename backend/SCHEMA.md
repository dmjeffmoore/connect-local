# PocketBase Schema for Connect Local

This document describes the database collections (tables) for the Connect Local app.

## Collections

### 1. users (extends PocketBase auth collection)
Built-in PocketBase users collection with additional fields:

- `id` (auto) - Primary key
- `email` (auto) - User email
- `username` (auto) - Username
- `avatar` (auto) - Profile picture URL
- `created` (auto) - Account creation timestamp
- `updated` (auto) - Last update timestamp

**Custom fields to add:**
- `displayName` (text) - User's display name
- `latitude` (number) - User's latitude
- `longitude` (number) - User's longitude
- `travelRadius` (number) - Distance willing to travel (in miles)
- `bio` (text, optional) - User bio

### 2. interests
Master list of normalized interests/hobbies

- `id` (auto) - Primary key
- `name` (text, unique) - Canonical interest name (e.g., "Hiking")
- `category` (text, optional) - Category (e.g., "Outdoor", "Sports", "Arts")
- `created` (auto)
- `updated` (auto)

### 3. user_interests
Many-to-many relationship between users and interests

- `id` (auto) - Primary key
- `user` (relation) - User ID (relation to users)
- `interest` (relation) - Interest ID (relation to interests)
- `created` (auto)

**Indexes:**
- Unique constraint on (user, interest)

### 4. groups
Chat groups based on location + shared interests

- `id` (auto) - Primary key
- `name` (text) - Group name (e.g., "SF Bay Area - Hiking")
- `interest` (relation) - Interest ID (relation to interests)
- `latitude` (number) - Group's center latitude
- `longitude` (number) - Group's center longitude
- `radius` (number) - Group's radius (in miles)
- `created` (auto)
- `updated` (auto)

### 5. group_members
Many-to-many relationship between users and groups

- `id` (auto) - Primary key
- `user` (relation) - User ID (relation to users)
- `group` (relation) - Group ID (relation to groups)
- `joined` (auto) - When user joined group
- `created` (auto)

**Indexes:**
- Unique constraint on (user, group)

### 6. messages
Chat messages within groups

- `id` (auto) - Primary key
- `group` (relation) - Group ID (relation to groups)
- `user` (relation, optional) - User ID (null for AI bot messages)
- `content` (text) - Message content
- `isBot` (bool) - True if message is from AI bot
- `messageType` (text) - "text", "meetup_suggestion", "rsvp", etc.
- `metadata` (json, optional) - Additional data for special message types
- `created` (auto)
- `updated` (auto)

**Indexes:**
- Index on group + created (for efficient message retrieval)

### 7. meetups (future phase)
Proposed meetups with RSVP tracking

- `id` (auto) - Primary key
- `group` (relation) - Group ID
- `proposedBy` (relation) - User who proposed it (or AI bot)
- `title` (text) - Meetup title
- `description` (text) - Details
- `location` (text) - Meetup location
- `datetime` (date) - When it's happening
- `status` (text) - "proposed", "confirmed", "cancelled"
- `created` (auto)
- `updated` (auto)

### 8. meetup_rsvps (future phase)
RSVP tracking for meetups

- `id` (auto) - Primary key
- `meetup` (relation) - Meetup ID
- `user` (relation) - User ID
- `status` (text) - "yes", "no", "maybe"
- `created` (auto)
- `updated` (auto)

**Indexes:**
- Unique constraint on (meetup, user)

## Access Rules

All collections should have appropriate access rules:
- Users can only update their own profile
- Users can read other users in their groups
- Users can create messages in groups they're members of
- AI bot has special permissions for creating messages
