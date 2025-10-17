@echo off
echo Installing Video Streaming Backend Dependencies...
echo.

REM Try different npm installation methods
echo Attempting npm install...
npm install

if %errorlevel% neq 0 (
    echo.
    echo npm install failed. Trying alternative method...
    echo.
    
    REM Try using cmd directly
    cmd /c "npm install"
    
    if %errorlevel% neq 0 (
        echo.
        echo All installation methods failed.
        echo Please manually run: npm install
        echo.
        pause
        exit /b 1
    )
)

echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run: npm start
echo 3. Test the API with Postman
echo.
pause

