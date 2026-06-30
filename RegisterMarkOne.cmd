@echo off
title MarkOne - Set File Association

:: Register MarkOne as the default handler for .md files
ftype MarkOne.md.file="%~dp0Build\MarkOneApp.exe" "%%1"
assoc .md=MarkOne.md.file

echo Done. .md files will now open in MarkOne.
pause
