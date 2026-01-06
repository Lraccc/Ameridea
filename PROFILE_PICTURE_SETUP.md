# Profile Picture Implementation - Setup Instructions

## Changes Made

### 1. Database Schema
- Added `profile_picture` column to the `users` table in `schema.sql`
- Created migration file: `migration_add_profile_picture.sql`

### 2. Backend (Node.js/Express)
- Updated auth routes to include `profilePicture` in all user responses
- Modified `/profile` endpoint to accept `profilePicture` field for updates
- Now returns profile picture URL with login, register, and profile update responses

### 3. Mobile App (React Native)
- Updated `User` type to include optional `profilePicture` field
- Added `updateProfilePicture()` method to auth service
- Added `updateUser()` method to AuthContext for updating user data
- Modified Settings screen to:
  - Load profile picture from user data on mount
  - Convert selected image to base64
  - Upload to backend via API
  - Show loading indicator during upload
  - Hide "Tap to update" text after image is set

## Setup Steps

### 1. Update Supabase Database
Go to your Supabase Dashboard → SQL Editor and run:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;
```

Or use the migration file at: `Backend/database/migration_add_profile_picture.sql`

### 2. Restart Backend Server
The backend changes are already in place. Just restart your server:

```bash
cd Backend
npm run dev
```

### 3. Test the Feature
1. Open your mobile app
2. Go to Settings tab
3. Tap the camera icon on the profile avatar
4. Select an image from your gallery
5. The image will be uploaded and saved to the database
6. Log out and log back in - your profile picture should persist

## How It Works

1. **Image Selection**: User selects image via ImagePicker with base64 encoding
2. **Upload**: Image data (as base64) is sent to backend API at `/api/auth/profile`
3. **Storage**: Backend stores the base64 string in the `profile_picture` column
4. **Retrieval**: Profile picture is returned with user data on login/register
5. **Display**: Image is rendered from the stored base64 data

## Notes

- Images are stored as base64 strings in the database (good for small images)
- For production, consider using Supabase Storage for better performance
- Current implementation supports JPEG images up to ~500KB (due to base64 encoding)
- Profile pictures persist across sessions and devices

## Future Improvements

Consider implementing Supabase Storage for larger images:
- Upload to Supabase Storage bucket
- Store only the URL in the database
- Better performance for larger images
- CDN support for faster loading
