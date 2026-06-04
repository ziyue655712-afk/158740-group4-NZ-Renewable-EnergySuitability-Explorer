"""Local static server for the NZ Renewable Energy Suitability Explorer.

Run with:
    py server.py

Then open:
    http://localhost:8000
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8000


class NoStoreStaticFileHandler(SimpleHTTPRequestHandler):
    """Serve local frontend files with no browser caching during development."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    server_address = ("", PORT)
    httpd = ThreadingHTTPServer(server_address, NoStoreStaticFileHandler)
    print(f"Serving NZ Renewable Energy Suitability Explorer at http://localhost:{PORT}")
    print("All application data is loaded from local files in the data folder.")
    print("Press Ctrl+C to stop the server.")
    httpd.serve_forever()