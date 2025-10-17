# Book Hub - Book Discovery Application

A full-stack web application for discovering and managing books, built with React, TypeScript, and Node.js.

## Features

- Browse and search through a comprehensive book collection
- Filter books by genre, author, and publication date
- Responsive design that works on desktop and mobile devices
- User authentication system
- Interactive book details view
- Real-time search functionality
- Pagination for large book collections

## Technology Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Redux for filter state management
- Context API for authentication
- Vite for build tooling

### Backend
- Node.js with Express
- MongoDB for data storage
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Pnayiturik/Summative-Project---Discovery-App.git
```

2. Install Backend Dependencies:
```bash
cd book-hub-backend
npm install
```

3. Install Frontend Dependencies:
```bash
cd book-hub-frontend
npm install
```

4. Start the Backend Server:
```bash
cd book-hub-backend
npm start
```

5. Start the Frontend Development Server:
```bash
cd book-hub-frontend
npm run dev
```

## Project Structure

### Frontend Structure
- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/features` - Redux slices and features
- `/src/context` - React Context providers
- `/src/api` - API client and endpoints
- `/src/types` - TypeScript type definitions

### Backend Structure
- `/src/controllers` - Request handlers
- `/src/models` - Database models
- `/src/routes` - API routes
- `/src/middleware` - Custom middleware
