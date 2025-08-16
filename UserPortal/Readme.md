# 🏥 **Appointment Service System**

> **A modern, scalable appointment booking system built with TypeScript, React, and Node.js**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 🚀 **Project Overview**

The **Appointment Service System** is a comprehensive solution for managing appointments, departments, and services. It features a modern React frontend with a robust Node.js backend, following clean architecture principles and best practices.

### ✨ **Key Features**

- 🔐 **User Authentication & Authorization** (JWT-based)
- 👥 **Multi-role Support** (Citizen, Foreigner, Business Owner, Admin)
- 🏢 **Department & Service Management**
- 📅 **Appointment Booking & Scheduling**
- 📱 **Responsive Design** (Mobile-first approach)
- 🎨 **Modern UI/UX** with Tailwind CSS
- 🔒 **Secure API** with validation middleware
- 📊 **Real-time Updates**

---

## 🏗️ **Architecture**

The system follows a **clean, layered architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend     │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MySQL)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   Controllers   │    │   Prisma ORM    │
│   Pages        │    │   Services      │    │   Repositories  │
│   Hooks        │    │   Schema        │    │   Migrations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🛠️ **Tech Stack**

### **Frontend**

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Shadcn/ui** - Beautiful UI components

### **Backend**

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### **Database**

- **MySQL** - Relational database
- **Prisma** - Database client & migrations

### **DevOps**

- **Docker** - Containerization
- **Docker Compose** - Multi-container setup

---

## 📁 **Project Structure**

```
appointment_service/
├── 📁 Presentation/          # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/   # Reusable UI components
│   │   ├── 📁 pages/        # Page components
│   │   ├── 📁 services/     # API service layer
│   │   ├── 📁 hooks/        # Custom React hooks
│   │   └── 📁 lib/          # Utility functions
│   ├── 📁 public/           # Static assets
│   └── 📁 package.json      # Frontend dependencies
│
├── 📁 Server/               # Node.js Backend
│   ├── 📁 src/
│   │   ├── 📁 controllers/  # Request handlers
│   │   ├── 📁 services/     # Business logic
│   │   ├── 📁 routes/       # API endpoints
│   │   ├── 📁 models/       # Data models
│   │   ├── 📁 middleware/   # Custom middleware
│   │   └── 📁 infrastructure/ # Database & config
│   ├── 📁 prisma/           # Database schema
│   └── 📁 package.json      # Backend dependencies
│
└── 📁 docker-compose.yaml   # Development environment
```

---

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+
- MySQL 8.0+
- Docker & Docker Compose (optional)

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd appointment_service
```

### **2. Backend Setup**

```bash
cd Server
npm install
cp .env.example .env
# Configure your database connection in .env
npm run dev
```

### **3. Frontend Setup**

```bash
cd Presentation
npm install
npm run dev
```

### **4. Database Setup**

```bash
cd Server
npx prisma generate
npx prisma db push
npx prisma db seed
```

### **5. Using Docker (Alternative)**

```bash
docker-compose up -d
```

---

## 🔐 **Authentication & Roles**

The system supports multiple user roles with different permissions:

| Role                  | Description           | Permissions                     |
| --------------------- | --------------------- | ------------------------------- |
| 👤 **Citizen**        | Sri Lankan citizens   | Book appointments, View profile |
| 🌍 **Foreigner**      | International users   | Book appointments, View profile |
| 🏢 **Business Owner** | Business entities     | Book appointments, View profile |
| 👑 **Admin**          | System administrators | Full system access              |

---

## 📱 **Screenshots**

> _Screenshots will be added here to showcase the UI_

---

## 🔌 **API Endpoints**

### **Authentication**

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### **Appointments**

- `GET /appointments` - List appointments
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

### **Departments & Services**

- `GET /departments` - List departments
- `GET /departments/:id/services` - Get department services
- `GET /services` - List services

---

## 🧪 **Testing**

```bash
# Backend tests
cd Server
npm test

# Frontend tests
cd Presentation
npm test
```

---

## 📊 **Performance & Monitoring**

- **Response Time**: < 200ms average
- **Database Queries**: Optimized with Prisma
- **Frontend**: Lazy loading & code splitting
- **Caching**: Redis ready (future implementation)

---

## 🔒 **Security Features**

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ Rate limiting ready
- ✅ SQL injection protection (Prisma)

---

## 🚀 **Deployment**

### **Production Build**

```bash
# Frontend
cd Presentation
npm run build

# Backend
cd Server
npm run build
npm start
```

### **Environment Variables**

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/appointments"

# JWT
JWT_SECRET="your-secret-key"

# Server
PORT=3000
NODE_ENV=production
```

---

## 🤝 **Contributing**

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 **Team**

- **Frontend Developer** - React & TypeScript expertise
- **Backend Developer** - Node.js & API development
- **DevOps Engineer** - Docker & deployment
- **UI/UX Designer** - User experience & design

---

## 📞 **Support**

- 📧 **Email**: support@appointmentservice.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- 📚 **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- 💬 **Discord**: [Join our community](https://discord.gg/your-server)

---

## 🎯 **Roadmap**

- [ ] **Phase 1**: Core functionality ✅
- [ ] **Phase 2**: Advanced features 🚧
- [ ] **Phase 3**: Mobile app 📱
- [ ] **Phase 4**: AI integration 🤖
- [ ] **Phase 5**: Multi-tenant support 🏢

---

<div align="center">

**Made with ❤️ by the Appointment Service Team**

[![GitHub stars](https://img.shields.io/github/stars/your-repo/appointment-service?style=social)](https://github.com/your-repo/appointment-service)
[![GitHub forks](https://img.shields.io/github/forks/your-repo/appointment-service?style=social)](https://github.com/your-repo/appointment-service)
[![GitHub issues](https://img.shields.io/github/issues/your-repo/appointment-service)](https://github.com/your-repo/appointment-service)

</div>

migration - npx prisma migrate dev --schema=src/prisma/schema.prisma
