@ECHO OFF

REM Runs the backup script for localhost
REM coni2k - 23 Feb. '16

REM Confirmation
CHOICE /M "Are you sure you want to run the script"
IF ERRORLEVEL 2 EXIT

ECHO.
sqlcmd -S (LocalDb)\MSSQLLocalDB -d WealthEconomy -i "Sql\Backup Database.sql" -v path="D:\Development\Databases\Backup\WealthEconomy\local\" dbName="WealthEconomy"

ECHO.
PAUSE
