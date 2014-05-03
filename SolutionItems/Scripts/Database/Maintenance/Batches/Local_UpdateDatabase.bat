@echo off

REM Runs the necessary scripts after restoring the database.
REM SH - 06 Mar. '14

REM Confirmation
CHOICE /M "Are you sure you want to run the script"
IF ERRORLEVEL 2 EXIT

REM ECHO.
REM sqlcmd -S (LocalDb)\v11.0 -d WealthEconomy -e "%~dp0\..\Local - Create Login + User.sql"
REM ECHO.

REM ECHO.
REM %SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\aspnet_regsql.exe -S (LocalDb)\v11.0 -sstype c -d WealthEconomy -e -ssadd
REM ECHO.

ECHO.
sqlcmd -S (LocalDb)\v11.0 -d WealthEconomy -e -i "%~dp0\..\Local - Update Database.sql"
ECHO.
PAUSE
