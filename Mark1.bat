@echo off
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
set PROFILE=--profile-directory="Profile 13"

:: Read the .md file and encode as base64, pass as URL parameter
:: Uses PowerShell to read + base64 + URI-encode so +/= chars survive the URL
for /f "usebackq delims=" %%a in (`
  powershell -NoProfile -Command "[System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes('%~f1'))" 2^>nul
`) do set "B64RAW=%%a"

:: URL-encode the base64 so + becomes %2B, / becomes %2F, = becomes %3D
for /f "usebackq delims=" %%b in (`
  powershell -NoProfile -Command "[System.Uri]::EscapeDataString('%B64RAW%')" 2^>nul
`) do set "B64ENC=%%b"

set "FILEURL=file:///%~dp0MARKOne.html?b64=%B64ENC%&name=%~nx1"

start "" %CHROME% %PROFILE% "%FILEURL%"