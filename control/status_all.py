from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
import os

# 2310 -> 10
FIRST_PORT = 10
LAST_PORT = 21

import get_liquidsoap_status

def output_status(func):
	for i in range(FIRST_PORT,LAST_PORT + 1):
		status = get_liquidsoap_status.get_status(2300 + i)
		func("Harbor %i (80%i / 23%i / lausch%i): %s\n" % (i,i,i,i-10, status))

def output_to_stdout(text):
	print(text),

class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        output_status(self.wfile.write)
        
def run(server_class=HTTPServer, handler_class=S, port=80):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print 'Starting httpd...'
    httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

    if len(argv) > 1 and argv[1] == "--webserver":
	    if len(argv) == 3:
	        run(port=int(argv[2]))
	    else:
	        run()
    else:
		output_status(output_to_stdout)