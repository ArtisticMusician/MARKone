@echo off
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
set PROFILE=--profile-directory="Profile 13"

:: Get the markdown file path and convert backslashes to forward slashes
set "FILEPATH=%~f1"
set "FILEPATH=%FILEPATH:\=/%"

:: Build the URL with the file parameter
set "FILEURL=file:///%~dp0MARKOne.html?file=%FILEPATH%"

start "" %CHROME% %PROFILE% --allow-file-access-from-files "%FILEURL%"