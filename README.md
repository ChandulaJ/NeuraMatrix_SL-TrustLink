# SL-TrustLink: Sri Lanka Government Services Management System

## Overview

SL-TrustLink is a comprehensive digital platform designed to streamline and modernize the Sri Lanka Government services. The system facilitates efficient management of  services, appointments, and administrative tasks through three interconnected portals.

## System Architecture

The project is structured into three main components:

### 1. Dashboard 📊
- Administrative control center
- Analytics and reporting
- Service management interface
- Built with React (frontend) and Node.js/Express (backend)

### 2. Government Officer Portal 👨‍💼
- Officer task management
- Document verification
- Service processing
- Built with Vue.js (frontend) and Node.js/TypeScript (backend)

### 3. User Portal 👥
- Tourist and business registration
- Service applications
- Appointment scheduling
- Built with Vue.js (frontend) and Node.js/TypeScript (backend)

## Tech Stack

### Frontend
- React.js (Dashboard)
- Vue.js/TypeScript (Government & User Portals)
- TailwindCSS
- Vite

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM

### Infrastructure
- Docker
- PostgreSQL
- Redis
- REST APIs

## Getting Started

Each component has its own setup instructions. Navigate to the respective directories:

- [Dashboard Setup](Dashboard/README.md)
- [Government Officer Portal Setup](government_officer/README.md)
- [User Portal Setup](UserPortal/README.md)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/ChandulaJ/NeuraMatrix_SL-TrustLink.git
   cd NeuraMatrix_SL-TrustLink
   ```

2. Set up each component:
   ```bash
   # For Dashboard
   cd Dashboard
   npm install
   
   # For Government Officer Portal
   cd government_officer
   npm install
   
   # For User Portal
   cd UserPortal
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in each component directory
   - Update the variables according to your setup

4. Start the development servers:
   - Each component has its own start script (refer to individual READMEs)

## Features

### Dashboard
- Real-time analytics
- Service management
- User management
- Report generation

### Government Officer Portal
- Task assignment and tracking
- Document verification
- Application processing
- Communication management

### User Portal
- User registration and authentication
- Service application submission
- Appointment scheduling
- Status tracking

### Prerequisites
- Node.js v16+
- npm or yarn
- Docker and Docker Compose
- PostgreSQL
- Redis


## License

Copyright © 2025 NeuraMatrix. All rights reserved.

