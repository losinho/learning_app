@echo off
rem Starts the Learning App on http://localhost:8080 and opens it in the browser.
cd /d "%~dp0"
set PORT=8080
echo Starting Learning App at http://localhost:%PORT%
echo Press Ctrl+C to stop.
start "" "http://localhost:%PORT%"
python -m http.server %PORT%
pause
