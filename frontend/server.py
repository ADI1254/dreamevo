#!/usr/bin/env python3
"""
Simple HTTP server for DreamPulse frontend
Run this script to serve the frontend on http://localhost:3000
"""
import http.server
import socketserver
import os
import sys
from pathlib import Path

PORT = 3000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Add cache control for development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom log format
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

def main():
    # Change to the frontend directory
    frontend_dir = Path(__file__).parent
    os.chdir(frontend_dir)
    
    Handler = MyHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"🚀 DreamPulse Frontend Server")
            print(f"📡 Serving on http://localhost:{PORT}")
            print(f"📁 Directory: {frontend_dir}")
            print(f"⏹️  Press Ctrl+C to stop\n")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98 or "Address already in use" in str(e):
            print(f"❌ Error: Port {PORT} is already in use.")
            print(f"💡 Try: lsof -ti:{PORT} | xargs kill (Linux/Mac)")
            print(f"💡 Or: netstat -ano | findstr :{PORT} (Windows)")
            sys.exit(1)
        else:
            raise

if __name__ == "__main__":
    main()

