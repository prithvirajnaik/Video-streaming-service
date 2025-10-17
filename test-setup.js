#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Video Streaming Backend Setup...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'server.js',
  'models/User.js',
  'models/Video.js',
  'controllers/authController.js',
  'controllers/videoController.js',
  'routes/auth.js',
  'routes/video.js',
  'middlewares/authMiddleware.js',
  'middlewares/uploadMiddleware.js'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Check if .env exists
const envExists = fs.existsSync(path.join(__dirname, '.env'));
console.log(`\n🔐 Environment file: ${envExists ? '✅ .env exists' : '⚠️  .env not found (copy from env.example)'}`);

// Check uploads directory
const uploadsExists = fs.existsSync(path.join(__dirname, 'uploads'));
console.log(`📁 Uploads directory: ${uploadsExists ? '✅ exists' : '❌ missing'}`);

console.log('\n📋 Setup Summary:');
if (allFilesExist) {
  console.log('✅ All required files are present');
} else {
  console.log('❌ Some files are missing');
}

if (!envExists) {
  console.log('⚠️  Please copy env.example to .env and configure your environment variables');
}

console.log('\n🚀 Next steps:');
console.log('1. npm install');
console.log('2. cp env.example .env');
console.log('3. Configure your .env file');
console.log('4. npm start');
console.log('\n📚 Check README.md for detailed setup instructions');
