@echo off

REM Runs the backup script.
REM SH - 06 Mar. '14

REM Confirmation
CHOICE /M "Are you sure you want to run the script"
IF ERRORLEVEL 2 EXIT

echo.
sqlcmd -S (LocalDb)\v11.0 -d WealthEconomy -e -i "Sql\Local - Backup Database.sql"
echo.
pause
