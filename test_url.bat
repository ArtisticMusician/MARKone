@echo off
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
set PROFILE=--profile-directory="Profile 13"
set "MDNAME=%~nx1"

for /f "tokens=*" %%a in ('powershell -NoProfile -Command "^& { $c = [Convert]::ToBase64String([IO.File]::ReadAllBytes('%~f1')); $u = [Uri]::EscapeDataString($c); Write-Host $u }"') do set "B64=%%a"

echo URL: file:///%~dp0MARKOne.html?b64=%B64%&name=%MDNAME%

start "" %CHROME% %PROFILE% "file:///%~dp0MARKOne.html?b64=%B64%&name=%MDNAME%"
