# Earings E-commerce Platform

A full-stack e-commerce application for earings with separate frontend and backend systems.

## Project Structure

```
earing/
├── frontend/                 # React/Vite frontend application
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── assets/          # Images, fonts, icons
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Third-party library configs
│   │   ├── pages/           # Route-level components
│   │   ├── routes/          # Routing configuration
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS and styling
│   │   ├── types/           # TypeScript definitions
│   │   ├── utils/           # Utility functions
│   │   ├── validation/      # Form validation schemas
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── index.html           # HTML template
│   ├── package.json         # Dependencies
│   └── vite.config.ts       # Vite configuration
└── backend/                 # Node.js/Express backend
    ├── src/                 # Source code
    │   ├── config/          # Configuration files
    │   ├── controllers/     # Business logic controllers
    │   ├── models/          # Database models
    │   ├── routes/          # Route definitions
    │   ├── services/        # Business logic services
    │   ├── middlewares/     # Express middleware
    │   ├── utils/           # Utility functions
    │   ├── validators/      # Input validators
    │   ├── helpers/         # Helper functions
    │   ├── types/           # TypeScript definitions
    │   ├── tests/           # Test files
    │   └── server.js        # Main server file
    ├── .env                 # Environment variables
    └── package.json         # Dependencies
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Features

- User authentication (separate login for regular users and admins)
- Product catalog with categories
- Shopping cart functionality
- Wishlist management
- Order processing
- Admin panel for managing products and orders
- MongoDB database integration