@echo off
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
set PROFILE=--profile-directory="Profile 13"
set "MDNAME=%~nx1"

:: Generate base64 + URL-encode via a temp PowerShell script file
set "PSFILE=%TEMP%\markone_b64.ps1"
echo $c = [Convert]::ToBase64String([IO.File]::ReadAllBytes('%~f1')) > "%PSFILE%"
echo $u = [Uri]::EscapeDataString($c) >> "%PSFILE%"
echo Write-Host $u >> "%PSFILE%"

set "B64="
for /f "usebackq tokens=* delims=" %%a in (`powershell -NoProfile -ExecutionPolicy Bypass -File "%PSFILE%"`) do set "B64=%%a"

del "%PSFILE%" 2>nul

start "" %CHROME% %PROFILE% "file:///%~dp0MARKOne.html?b64=%B64%&name=%MDNAME%"
