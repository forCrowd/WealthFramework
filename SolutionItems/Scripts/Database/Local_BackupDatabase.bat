@ECHO OFF

REM Runs the backup script.
REM SH - 06 Mar. '14

REM Confirmation
CHOICE /M "Are you sure you want to run the script"
IF ERRORLEVEL 2 EXIT

ECHO.
sqlcmd -S (LocalDb)\MSSQLLocalDB -d WealthEconomy -i "Sql\Local - Backup Database.sql"
ECHO.
PAUSE
