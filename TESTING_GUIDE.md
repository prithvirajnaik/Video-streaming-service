# 🧪 Video Streaming Backend - Testing Guide

## ✅ Current Status

**Code Structure**: ✅ Perfect - All files created and verified
**Dependencies**: ⚠️ Need to install (see instructions below)
**Environment**: ✅ Configured (.env file created)

## 🚀 Quick Start Testing

### Step 1: Install Dependencies

**Option A: Use the batch file**
```bash
# Double-click install-deps.bat or run:
install-deps.bat
```

**Option B: Manual installation**
```bash
# Try these commands in order:
npm install

# If that fails, try:
cmd /c "npm install"

# If still failing, try:
& "C:\Program Files\nodejs\npm.cmd" install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system:
- **Windows**: `net start MongoDB`
- **macOS**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

### Step 3: Start the Server
```bash
npm start
```
The server should start on `http://localhost:3000`

### Step 4: Test with Postman

## 📋 Postman Testing Checklist

### 1. Health Check
```
GET http://localhost:3000/health
```
**Expected**: 200 OK with server status

### 2. User Registration
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```
**Expected**: 201 Created with user data and JWT token

### 3. User Login
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```
**Expected**: 200 OK with user data and JWT token

### 4. Get Profile (Protected)
```
GET http://localhost:3000/auth/profile
Authorization: Bearer <your-jwt-token>
```
**Expected**: 200 OK with user profile

### 5. Upload Video (Protected)
```
POST http://localhost:3000/videos/upload
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data

Form Data:
- video: [select MP4 file]
- title: "Test Video"
```
**Expected**: 201 Created with video metadata

### 6. Get All Videos
```
GET http://localhost:3000/videos
```
**Expected**: 200 OK with video list

### 7. Stream Video
```
GET http://localhost:3000/videos/{video-id}/stream
```
**Expected**: 200 OK with video stream (or 206 Partial Content with Range header)

## 🔧 Troubleshooting

### Common Issues:

1. **"npm is not recognized"**
   - Node.js might not be in PATH
   - Use full path: `"C:\Program Files\nodejs\npm.cmd" install`

2. **"MongoDB connection failed"**
   - Start MongoDB service
   - Check connection string in .env file

3. **"JWT_SECRET is required"**
   - Make sure .env file exists and has JWT_SECRET set

4. **"File upload failed"**
   - Check file size (max 500MB)
   - Ensure file is MP4 format
   - Verify Authorization header with Bearer token

5. **"Port already in use"**
   - Change PORT in .env file
   - Kill process: `taskkill /f /im node.exe`

## 🎯 Success Criteria

Your backend is working correctly if:
- ✅ Server starts without errors
- ✅ Health check returns 200 OK
- ✅ User can register and login
- ✅ JWT token is generated and accepted
- ✅ Video upload works with multipart/form-data
- ✅ Video streaming works with Range requests
- ✅ Database stores user and video data correctly

## 📊 Expected API Responses

### Successful Registration
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64a7b8c9d1e2f3a4b5c6d7e8",
      "name": "Test User",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Successful Video Upload
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "video": {
      "id": "64a7b8c9d1e2f3a4b5c6d7e9",
      "title": "Test Video",
      "filename": "test-video-1234567890.mp4",
      "size": 52428800,
      "sizeInMB": "50.00",
      "mimeType": "video/mp4",
      "uploadDate": "2023-07-06T10:30:00.000Z",
      "userId": "64a7b8c9d1e2f3a4b5c6d7e8"
    }
  }
}
```

## 🎥 Video Streaming Test

To test video streaming properly:
1. Upload a small MP4 video (under 50MB for testing)
2. Note the video ID from the upload response
3. Use a video player that supports HTTP Range requests
4. Test with: `GET /videos/{video-id}/stream`
5. Add Range header: `Range: bytes=0-1048575` for partial content

## 📝 Next Steps After Testing

Once everything works:
1. **Production Setup**: Configure proper JWT secrets and MongoDB URI
2. **Security**: Add rate limiting, input validation
3. **Performance**: Add caching, compression
4. **Monitoring**: Add logging and health checks
5. **Deployment**: Consider Docker, Nginx, CDN

---

**Happy Testing! 🚀**
