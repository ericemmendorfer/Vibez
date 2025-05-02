# Vibez - Bar Social Network

A social web application for discovering and sharing bar experiences with friends. Track your favorite bars, share experiences, and connect with friends who share your taste in nightlife.

## Features

- User authentication with private profiles
- Profile picture upload and management
- Friend system with friend requests
- Community feed showing public posts
- Friends-only feed
- Bar tracking and rating system
- Location-based bar discovery

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- File Storage: Cloudinary

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
4. Start the development server:
   ```bash
   npm run dev:full
   ```

## Project Structure

```
vibez/
├── client/           # React frontend
├── models/           # MongoDB models
├── routes/           # API routes
├── middleware/       # Custom middleware
├── config/           # Configuration files
└── server.js         # Main server file
``` 