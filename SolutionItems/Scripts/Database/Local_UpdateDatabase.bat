@ECHO OFF

REM Runs the necessary scripts after restoring the database.
REM SH - 06 Mar. '14

REM Confirmation
CHOICE /M "Are you sure you want to run the script"
IF ERRORLEVEL 2 EXIT

REM ECHO.
REM sqlcmd -S (LocalDb)\v11.0 -d WealthEconomy -i "%~dp0\..\Local - Create Login + User.sql"
REM ECHO.

ECHO.
sqlcmd -S (LocalDb)\v11.0 -d WealthEconomy -i "Sql\Local - Update Database.sql"
ECHO.
PAUSE
