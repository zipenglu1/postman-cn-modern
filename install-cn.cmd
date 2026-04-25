@echo off
setlocal
cd /d "%~dp0"

echo.
echo Postman-cn
echo ==========
echo.

if not "%~1"=="" (
  set "ACTION=%~1"
  goto dispatch
)

echo 1. Install Chinese UI
echo 2. Restore English UI
echo 3. Detect Postman only
echo.
set /p ACTION=Choose an option [1-3]:

:dispatch
if "%ACTION%"=="1" goto install
if "%ACTION%"=="2" goto restore
if "%ACTION%"=="3" goto detect
if /i "%ACTION%"=="install" goto install
if /i "%ACTION%"=="restore" goto restore
if /i "%ACTION%"=="detect" goto detect

echo.
echo Invalid option.
pause
exit /b 1

:prepare
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js was not found. Please install Node.js 20 or newer first:
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo.
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)
exit /b 0

:detect
call :prepare
if errorlevel 1 exit /b 1
echo.
echo Detecting Postman...
call npm run cn:detect
echo.
pause
exit /b %errorlevel%

:install
echo.
echo This will install the Chinese localization override for the latest
echo Postman version under %%LOCALAPPDATA%%\Postman\app-*.
echo.
echo Please close Postman before continuing.
pause
call :prepare
if errorlevel 1 exit /b 1
echo.
echo Detecting Postman...
call npm run cn:detect
if errorlevel 1 (
  echo.
  echo Could not detect Postman.
  pause
  exit /b 1
)
echo.
echo Installing Chinese localization...
call npm run cn:install
if errorlevel 1 (
  echo.
  echo Installation failed. Make sure Postman is fully closed, then run this file again.
  pause
  exit /b 1
)
echo.
echo Done. Start Postman normally to use the Chinese UI.
echo Run install-cn.cmd again and choose option 2 to restore English.
echo.
pause
exit /b 0

:restore
echo.
echo This will remove the Chinese localization override created by this tool
echo and restore Postman's original app.asar.
echo.
echo Please close Postman before continuing.
pause
call :prepare
if errorlevel 1 exit /b 1
echo.
echo Restoring English Postman...
call npm run cn:restore
if errorlevel 1 (
  echo.
  echo Restore failed. Make sure Postman is fully closed and this tool was used to install the override.
  pause
  exit /b 1
)
echo.
echo Done. Start Postman normally to use the original English UI.
echo.
pause
exit /b 0
