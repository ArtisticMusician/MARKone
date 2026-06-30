$mdPath = $args[0]
if (-not $mdPath) { exit }

$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($mdPath))
$enc = [Uri]::EscapeDataString($b64)
$name = [System.IO.Path]::GetFileName($mdPath)

$url = "file:///C:/Users/Josh/Documents/0000000000-MyApps/MarkOne/MARKOne.html?b64=$enc&name=$name"

# Try launching without profile restriction
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "`"$url`""
