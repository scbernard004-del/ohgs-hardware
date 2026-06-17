@echo off
title OHGS Local Preview
echo Starting OHGS local clean URL server...
echo.
echo Open: http://localhost:8000
echo Example clean page: http://localhost:8000/projects
echo.
python server_clean_urls.py
pause
