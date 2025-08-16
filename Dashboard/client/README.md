# SL-TrustLink Dashboard

This is the dashboard component of the SL-TrustLink system, a comprehensive platform for managing Sri Lanka Government services and operations.

## Overview

The SL-TrustLink Dashboard provides administrative and analytical capabilities for managing services, appointments, and analytics. It consists of:

- **Client**: A React-based front-end application
- **Server**: A Node.js backend with Express

## Features

- Service Management
- Appointment Tracking
- Analytics Dashboard
- Real-time Data Visualization

## Project Structure

```
Dashboard/
├── client/          # React front-end application
└── server/          # Node.js backend
    ├── models/      # Database models
    └── routes/      # API routes
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ChandulaJ/NeuraMatrix_SL-TrustLink.git
   cd NeuraMatrix_SL-TrustLink/Dashboard
   ```

2. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

3. Install server dependencies:
   ```bash
   cd ../server
   npm install
   ```

### Running the Application

1. Start the client:
   ```bash
   cd client
   npm start
   ```
   The client will run on http://localhost:3000

2. Start the server:
   ```bash
   cd server
   npm start
   ```
   The server will run on http://localhost:5000

## Development

- The client is built with Create React App
- The server uses Express.js with MongoDB
- API routes are organized by feature in the server/routes directory


## Related Components

- Government Officer Portal
- User Portal
- Main Documentation

## License

This project is part of the SL-TrustLink system. All rights reserved.
