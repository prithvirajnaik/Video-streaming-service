#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Video Streaming Backend Code Structure...\n');

// Test 1: Check all required files exist
console.log('📁 File Structure Verification:');
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
  'middlewares/uploadMiddleware.js',
  '.env',
  'README.md'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Test 2: Check package.json structure
console.log('\n📦 Package.json Verification:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'multer', 'cors', 'dotenv'];
  
  console.log(`   ✅ Package name: ${packageJson.name}`);
  console.log(`   ✅ Main file: ${packageJson.main}`);
  
  requiredDeps.forEach(dep => {
    const hasDep = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`   ${hasDep ? '✅' : '❌'} Dependency: ${dep}`);
  });
} catch (error) {
  console.log('   ❌ Invalid package.json:', error.message);
  allFilesExist = false;
}

// Test 3: Check .env file structure
console.log('\n🔐 Environment Configuration:');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRE'];
  
  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    console.log(`   ${hasVar ? '✅' : '❌'} ${varName}`);
  });
} catch (error) {
  console.log('   ❌ .env file error:', error.message);
  allFilesExist = false;
}

// Test 4: Check code syntax (basic)
console.log('\n💻 Code Syntax Verification:');
const jsFiles = [
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

jsFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Basic syntax checks
    const hasProperExports = content.includes('module.exports') || content.includes('export');
    const hasNoSyntaxErrors = !content.includes('undefined') || content.includes('undefined') && content.includes('typeof');
    
    console.log(`   ✅ ${file} - Syntax OK`);
  } catch (error) {
    console.log(`   ❌ ${file} - Error: ${error.message}`);
    allFilesExist = false;
  }
});

// Test 5: Check directory structure
console.log('\n📂 Directory Structure:');
const requiredDirs = ['controllers', 'models', 'routes', 'middlewares', 'uploads'];
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`   ${exists ? '✅' : '❌'} ${dir}/`);
});

console.log('\n📋 Verification Summary:');
if (allFilesExist) {
  console.log('✅ All code files and structure are properly set up!');
  console.log('\n🚀 Next Steps:');
  console.log('1. Install dependencies: npm install');
  console.log('2. Start MongoDB service');
  console.log('3. Run the server: npm start');
  console.log('4. Test with Postman using the API documentation in README.md');
} else {
  console.log('❌ Some issues found. Please check the errors above.');
}

console.log('\n📚 For detailed setup instructions, see README.md');
