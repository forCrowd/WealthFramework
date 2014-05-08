@echo off

REM Runs IISExpress for "Web" project on port 10001
REM SH - 07 May '14

REM Confirmation
CHOICE /M "Are you sure you want to run the script"
IF ERRORLEVEL 2 EXIT

REM Change the current directory
cd /d %~dp0\..\..\..

echo.
REM TODO IIS Express folder could differ
"C:\Program Files\IIS Express\iisexpress" /path:%cd%\Web /port:10001 /systray:true
echo.
pause
