# SparkLink - Professional Networking Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://spark-link-kappa.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.5-blue)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/PREMKUMARDUDI/SparkLink)

A comprehensive full-stack professional networking platform built with modern web technologies, offering LinkedIn-like functionality for career networking, profile management, and professional content sharing.

## 🚀 Features

### Core Networking Features

- **User Authentication & Authorization**: Secure JWT-based authentication with bcrypt password encryption
- **Professional Profiles**: Comprehensive user profiles with education, work experience, and bio sections
- **Connection Management**: Send, receive, and manage professional connection requests
- **Social Posting**: Create and share professional content with multimedia support
- **Interactive Engagement**: Comment system for posts and professional discussions
- **Profile Picture Upload**: Secure file upload system with Multer integration

### Advanced Features

- **Resume Generation**: Automated PDF generation for user profiles and resumes
- **User Discovery**: Find and connect with other professionals on the platform
- **Real-time Updates**: Dynamic content updates using Redux state management
- **Responsive Design**: Mobile-first approach with professional UI/UX
- **File Management**: Comprehensive media upload and management system

## 🏗️ Architecture

### System Design

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   Next.js 15    │◄──────────────────►│   Express.js    │
│   Frontend      │    (Axios Client)   │   Backend       │
│   (React 19)    │                     │   (Node.js)     │
└─────────────────┘                     └─────────────────┘
        │                                        │
        │                                        │
   ┌────▼────┐                              ┌────▼────┐
   │ Vercel  │                              │ MongoDB │
   │ Hosting │                              │Database │
   └─────────┘                              └─────────┘
```

### Technology Stack

#### Frontend (Next.js)

- **Framework**: Next.js 15.2.5 with React 19.0
- **State Management**: Redux Toolkit with React-Redux for complex state handling
- **HTTP Client**: Axios for API communication
- **Rendering**: Server-Side Rendering (SSR) and Static Site Generation (SSG)
- **Styling**: Custom CSS with responsive design principles
- **Architecture**: Page-based routing with component-driven development

#### Backend (Express.js)

- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM for data modeling
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer middleware for handling multipart/form-data
- **PDF Generation**: PDF-creator-node and PDFKit for resume generation
- **Security**: CORS configuration and secure file handling

## 📁 Project Structure

```
SparkLink/
├── backend/                    # Express.js API server
│   ├── controllers/            # Request handlers
│   │   ├── user.controller.js  # User authentication & profile management
│   │   └── posts.controller.js # Social posts and interactions
│   ├── models/                 # MongoDB models
│   │   ├── user.model.js      # User authentication model
│   │   ├── profile.model.js   # Professional profile data
│   │   ├── posts.model.js     # Social posts with media
│   │   ├── comments.model.js  # Post comments system
│   │   └── connections.model.js # Networking connections
│   ├── routes/                # API route definitions
│   │   ├── user.routes.js     # User-related endpoints
│   │   └── posts.routes.js    # Posts and social features
│   ├── uploads/               # File storage directory
│   ├── util/                  # Utility functions
│   ├── server.js              # Server entry point
│   └── package.json           # Backend dependencies
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── pages/             # Next.js pages
│   │   │   ├── login/         # Authentication pages
│   │   │   ├── dashboard/     # Main dashboard interface
│   │   │   ├── profile/       # Profile management
│   │   │   ├── discover/      # User discovery
│   │   │   ├── my_connections/# Connection management
│   │   │   ├── blog/          # Social posts section
│   │   │   └── view_profile/  # Other user profiles
│   │   ├── Components/        # Reusable React components
│   │   ├── config/            # Configuration files
│   │   ├── layout/            # Layout components
│   │   └── styles/            # CSS styling
│   ├── public/                # Static assets
│   ├── next.config.mjs        # Next.js configuration
│   └── package.json           # Frontend dependencies
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /register` - User registration with profile creation
- `POST /login` - User authentication with JWT token generation

### Profile Management

- `GET /get_user_and_profile` - Fetch user and profile data
- `POST /user_update` - Update user information
- `POST /update_profile_data` - Update professional profile details
- `POST /update_profile_picture` - Upload profile picture
- `GET /user/download_resume` - Generate and download profile PDF

### Networking Features

- `GET /user/get_all_users` - Discover other professionals
- `POST /user/send_connection_request` - Send connection request
- `GET /user/getConnectionRequests` - Get incoming connection requests
- `POST /user/accept_connection_request` - Accept connection request
- `GET /user/getMyConnections` - Get user's connections
- `GET /user/get_profile_based_on_username` - View other profiles

### Social Features

- `POST /create_post` - Create new post with media
- `GET /get_posts` - Fetch social feed posts
- `POST /like_post` - Like/unlike posts
- `POST /comment_post` - Add comments to posts

## 📊 Database Schema

### User Model

```javascript
{
  name: String (required),
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  profilePicture: String (default: "default.jpg"),
  token: String,
  active: Boolean (default: true),
  createdAt: Date
}
```

### Profile Model

```javascript
{
  userId: ObjectId (ref: User),
  bio: String,
  currentPost: String,
  pastWork: [{
    company: String,
    position: String,
    years: String
  }],
  education: [{
    college: String,
    degree: String,
    fieldOfStudy: String
  }]
}
```

### Posts Model

```javascript
{
  userId: ObjectId (ref: User),
  body: String (required),
  likes: Number (default: 0),
  media: String,
  fileType: String,
  active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Connection Request Model

```javascript
{
  userId: ObjectId (ref: User),      // Sender
  connectionId: ObjectId (ref: User), // Receiver
  status_accepted: Boolean (default: null)
}
```

## 🌐 Deployment

The application is deployed with a modern cloud infrastructure:

- **Frontend**: Vercel platform for optimal Next.js performance
- **Backend**: Node.js hosting with environment configuration
- **Database**: MongoDB Atlas for scalable data storage

### Production Features

- **Environment Management**: Separate development and production configurations
- **File Upload Handling**: Secure media storage and retrieval
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Error Handling**: Comprehensive error management and logging

## 🧪 Key Features Demonstration

### Professional Networking

- **Profile Creation**: Users can create comprehensive professional profiles
- **Connection System**: LinkedIn-like connection requests and management
- **Professional Discovery**: Find and connect with other professionals

### Social Platform

- **Content Sharing**: Post professional updates with media support
- **Engagement**: Like and comment on posts for professional discussions
- **Feed System**: Personalized social feed for network updates

### File Management

- **Profile Pictures**: Secure upload and management of profile images
- **Media Posts**: Support for multimedia content in posts
- **PDF Generation**: Automated resume generation from profile data

## 👨‍💻 Author

**Prem Kumar Dudi**

- GitHub: [@PREMKUMARDUDI](https://github.com/PREMKUMARDUDI)
- LinkedIn: [Connect with me](https://linkedin.com/in/dudipremkumar)

## 🙏 Acknowledgments

- Next.js team for the powerful React framework
- MongoDB team for the flexible database solution
- React community for excellent component libraries
- Professional networking platforms for inspiration
- Open source community for continuous learning

---

⭐ **Star this repository if you found it helpful!**

_Building professional connections through modern web technology_
