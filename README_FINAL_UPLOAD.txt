OHGS FINAL CLEAN UPLOAD PACKAGE

This package removes old conflicting patches that caused blinking.
Only this active frontend patch is loaded:
- ohgs-final-clean-patch.css
- ohgs-final-clean-patch.js

Local test:
1. Extract ZIP into a fresh folder.
2. Double-click RUN_LOCAL_WINDOWS.bat.
3. Open http://localhost:8000
4. Check console/server logs. You should NOT see:
   - ohgs-two-issues-polish.css
   - ohgs-final-upload-fix.css
   - ohgs-clean-no-blink-final.css

Local /api/notify:
The local server now accepts POST /api/notify and returns OK, so no 501 error.

Email notifications:
Real email sending works on Vercel after setting SMTP Environment Variables:
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
NOTIFY_FROM
NOTIFY_TO=scbernard004@gmail.com

Upload to GitHub:
Upload everything INSIDE the extracted folder to the root of the repository.
Do not upload the ZIP file itself.
