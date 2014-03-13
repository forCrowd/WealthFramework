@echo off

REM Runs the backup script.
REM SH - 06 Mar. '14

REM Confirmation
CHOICE /M "Are you sure you want to run the script"
IF ERRORLEVEL 2 EXIT

echo.
sqlcmd -S localhost -d WealthEconomy -e -i "%~dp0\..\Local - Backup Database.sql"
echo.
pause
