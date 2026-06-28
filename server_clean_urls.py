from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json, os
PORT = 8000
class CleanURLHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path.startswith('/api/notify'):
            length = int(self.headers.get('Content-Length', 0) or 0)
            if length:
                self.rfile.read(length)
            body = json.dumps({'ok': True, 'local': True, 'message': 'Local test accepted. Real email sends on Vercel after SMTP setup.'}).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type','application/json')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self.send_error(404, 'Not found')
    def do_GET(self):
        path = self.path.split('?',1)[0].split('#',1)[0]
        if path == '/':
            self.path = '/index.html'
        elif '.' not in Path(path).name:
            candidate = Path(os.getcwd()) / (path.strip('/') + '.html')
            if candidate.exists():
                self.path = '/' + path.strip('/') + '.html'
        return super().do_GET()
if __name__ == '__main__':
    print('OHGS local clean URL server running')
    print(f'Open: http://localhost:{PORT}')
    print(f'Example: http://localhost:{PORT}/projects')
    print('Local /api/notify returns OK. Real email works on Vercel after SMTP setup.')
    print('Press Ctrl + C to stop')
    ThreadingHTTPServer(('', PORT), CleanURLHandler).serve_forever()
