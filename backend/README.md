# PocketBase Backend for Connect Local

## Quick Start

### Running PocketBase

```bash
# From project root
npm run backend

# Or directly
cd backend && ./pocketbase serve
```

PocketBase will start at:
- **API**: http://127.0.0.1:8090/api/
- **Admin UI**: http://127.0.0.1:8090/_/

### First Time Setup

1. Visit http://127.0.0.1:8090/_/ in your browser
2. Create an admin account (email/password)
3. You'll be taken to the admin dashboard

### Setting Up the Database Schema

Follow the schema defined in `SCHEMA.md`. You'll need to create these collections:

#### 1. Users Collection (Built-in)
The `users` collection already exists. Add these custom fields:
- `displayName` (Text)
- `latitude` (Number)
- `longitude` (Number)
- `travelRadius` (Number)
- `bio` (Text, optional)

#### 2. Create Collections
Use the admin UI to create these collections:

**interests**:
- `name` (Text, required, unique)
- `category` (Text, optional)

**user_interests**:
- `user` (Relation to users, required)
- `interest` (Relation to interests, required)
- Add unique index on (user, interest)

**groups**:
- `name` (Text, required)
- `interest` (Relation to interests, required)
- `latitude` (Number)
- `longitude` (Number)
- `radius` (Number)

**group_members**:
- `user` (Relation to users, required)
- `group` (Relation to groups, required)
- `joined` (Date, auto)
- Add unique index on (user, group)

**messages**:
- `group` (Relation to groups, required)
- `user` (Relation to users, optional - null for AI bot)
- `content` (Text, required)
- `isBot` (Bool, default: false)
- `messageType` (Text, default: "text")
- `metadata` (JSON, optional)

### Access Rules

For now, you can set simple rules in the admin UI:
- Users can read all users in their groups
- Users can only update their own profile
- Users can create messages in groups they're members of
- All users can read interests

### Data Location

All data is stored in `backend/pb_data/` (excluded from git).

### Backups

To backup your data:
```bash
cp -r backend/pb_data backend/pb_data_backup_$(date +%Y%m%d)
```

### Development Notes

- The admin UI is accessible at http://127.0.0.1:8090/_/
- The API automatically generates REST endpoints for all collections
- Real-time subscriptions are available via the JavaScript SDK
- OAuth providers can be configured in Settings > Auth providers
