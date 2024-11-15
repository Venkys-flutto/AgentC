from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess

class ProdWebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.end_headers()
        subprocess.run(["/home/AgentC/prod-webhook-handler.sh"], shell=True)
        self.wfile.write(b"Production webhook received and processed")

if __name__ == "__main__":
    server = HTTPServer(('', 8000), ProdWebhookHandler)
    print("Starting production webhook server on port 8000")
    server.serve_forever()
