@echo off
set "MDNAME=%~nx1"
echo MDNAME=%MDNAME%

for /f "tokens=*" %%a in ('powershell -NoProfile -Command "& { $c = [Convert]::ToBase64String([IO.File]::ReadAllBytes('%~f1')); $u = [Uri]::EscapeDataString($c); Write-Host $u }"') do set "B64=%%a"

echo B64=%B64%
echo LEN=%B64:~200,10%
