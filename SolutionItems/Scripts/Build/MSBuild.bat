@echo off

REM Compiles the project with MSBuild & quite mode
REM SH - 07 May '14

REM Confirmation
CHOICE /M "Are you sure you want to run the script"
IF ERRORLEVEL 2 EXIT

echo.
REM TODO MSBuild folder could differ
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\msbuild "%~dp0\..\..\..\Wealtheconomy.sln" /v:q

echo Script execution completed
echo.
pause
