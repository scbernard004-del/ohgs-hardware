OHGS clean URL update

This version removes .html from internal website links.

Examples:
https://www.ohgs.co.tz/products
https://www.ohgs.co.tz/projects
https://www.ohgs.co.tz/contact

Files added:
- vercel.json: tells Vercel to serve clean URLs.
- server_clean_urls.py: lets you test clean URLs locally.
- RUN_LOCAL_CLEAN_URLS_WINDOWS.bat: double-click this on Windows to test locally.

Important:
Upload vercel.json together with the website files to GitHub.
Do not upload the ZIP itself.
