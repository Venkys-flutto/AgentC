from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess

class StagingWebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.end_headers()
        subprocess.run(["/home/AgentC/staging-webhook-handler.sh"], shell=True)
        self.wfile.write(b"Staging webhook received and processed")

if __name__ == "__main__":
    server = HTTPServer(('', 8000), StagingWebhookHandler)
    print("Starting staging webhook server on port 8000")
    server.serve_forever()
