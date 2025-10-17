# Video Streaming Platform - Backend MVP

A Node.js backend service for video streaming platform with authentication, video upload, and streaming capabilities.

## 🚀 Features

- **Authentication System**
  - User registration and login
  - JWT-based authentication
  - Password hashing with bcrypt

- **Video Management**
  - Upload MP4 video files (up to 500MB)
  - Store video metadata in MongoDB
  - List all public videos with pagination
  - Get user's own videos
  - Delete videos

- **Video Streaming**
  - HTTP Range Request support (206 Partial Content)
  - Pause, resume, and seek functionality
  - Efficient streaming for large files

- **Security**
  - Protected routes with JWT middleware
  - File type validation
  - File size limits
  - User ownership verification

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests

## 📁 Project Structure

```
video-streaming-backend/
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── videoController.js     # Video management logic
├── models/
│   ├── User.js               # User schema
│   └── Video.js              # Video schema
├── routes/
│   ├── auth.js               # Authentication routes
│   └── video.js              # Video routes
├── middlewares/
│   ├── authMiddleware.js     # JWT authentication
│   └── uploadMiddleware.js   # File upload handling
├── uploads/                  # Video files storage
├── server.js                 # Main application file
├── package.json
└── README.md
```

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 2. Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/video-streaming
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=7d
   ```

5. Start MongoDB (if running locally):
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

6. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64a7b8c9d1e2f3a4b5c6d7e8",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64a7b8c9d1e2f3a4b5c6d7e8",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer <your-jwt-token>
```

### Video Endpoints

#### Upload Video (Protected)
```http
POST /videos/upload
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data

Form Data:
- video: <video-file>
- title: "My Video Title"
```

**Response:**
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "video": {
      "id": "64a7b8c9d1e2f3a4b5c6d7e9",
      "title": "My Video Title",
      "filename": "my-video-1234567890-123456789.mp4",
      "size": 52428800,
      "sizeInMB": "50.00",
      "mimeType": "video/mp4",
      "uploadDate": "2023-07-06T10:30:00.000Z",
      "userId": "64a7b8c9d1e2f3a4b5c6d7e8"
    }
  }
}
```

#### Get All Videos
```http
GET /videos?page=1&limit=10&search=keyword
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "64a7b8c9d1e2f3a4b5c6d7e9",
        "title": "My Video Title",
        "filename": "my-video-1234567890-123456789.mp4",
        "size": 52428800,
        "sizeInMB": "50.00",
        "mimeType": "video/mp4",
        "uploadDate": "2023-07-06T10:30:00.000Z",
        "views": 15,
        "userId": {
          "id": "64a7b8c9d1e2f3a4b5c6d7e8",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalVideos": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Get My Videos (Protected)
```http
GET /videos/my/videos?page=1&limit=10
Authorization: Bearer <your-jwt-token>
```

#### Get Video Details
```http
GET /videos/:id
```

#### Stream Video (with Range Support)
```http
GET /videos/:id/stream
Range: bytes=0-1048575
```

**Response Headers:**
```
Content-Range: bytes 0-1048575/52428800
Accept-Ranges: bytes
Content-Length: 1048576
Content-Type: video/mp4
```

#### Delete Video (Protected)
```http
DELETE /videos/:id
Authorization: Bearer <your-jwt-token>
```

### Health Check
```http
GET /health
```

## 🧪 Testing with Postman

### 1. Authentication Flow

1. **Register a new user:**
   - Method: POST
   - URL: `http://localhost:3000/auth/register`
   - Body: JSON with name, email, password
   - Save the JWT token from response

2. **Login:**
   - Method: POST
   - URL: `http://localhost:3000/auth/login`
   - Body: JSON with email, password
   - Save the JWT token

3. **Test protected route:**
   - Method: GET
   - URL: `http://localhost:3000/auth/profile`
   - Headers: `Authorization: Bearer <your-jwt-token>`

### 2. Video Upload

1. **Upload video:**
   - Method: POST
   - URL: `http://localhost:3000/videos/upload`
   - Headers: `Authorization: Bearer <your-jwt-token>`
   - Body: form-data
     - Key: `video`, Type: File, Value: select MP4 file
     - Key: `title`, Type: Text, Value: "Test Video"

### 3. Video Streaming

1. **Get video list:**
   - Method: GET
   - URL: `http://localhost:3000/videos`

2. **Stream video:**
   - Method: GET
   - URL: `http://localhost:3000/videos/{video-id}/stream`
   - Use a video player that supports HTTP range requests

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/video-streaming |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |

### File Upload Limits

- **Max file size**: 500MB
- **Allowed formats**: MP4, AVI, MOV, WMV, FLV, WebM, MKV
- **Storage**: Local filesystem (`./uploads` directory)

## 🚀 Future Enhancements

- Docker containerization
- FFmpeg integration for video transcoding
- Multiple video quality support
- CDN integration
- Video thumbnails generation
- User roles and permissions
- Video comments and ratings
- Nginx reverse proxy setup
- Redis caching
- Video analytics

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB connection failed:**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify MongoDB is accessible

2. **File upload errors:**
   - Check file size (max 500MB)
   - Verify file format is supported
   - Ensure uploads directory has write permissions

3. **JWT token errors:**
   - Check if JWT_SECRET is set
   - Verify token format: `Bearer <token>`
   - Check token expiration

4. **Port already in use:**
   - Change PORT in `.env`
   - Kill process using the port: `lsof -ti:3000 | xargs kill -9`

## 📄 License

MIT License - feel free to use this project for learning and development purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Streaming! 🎥**

