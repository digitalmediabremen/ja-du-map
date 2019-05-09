import getpass
import sys
import telnetlib
import re

HOST = "stream.radioangrezi.de"

try: 
	PORT = sys.argv[1]
except:
	print("Please provide the following arguments:")
	print("1: Telnet Port")
	print("2: Harbor ID (from help command)")
	quit()

tn = telnetlib.Telnet(HOST, PORT)

try: 
	HARBOR = int(sys.argv[2])
	cmd = "harbor_%i.status\n" % HARBOR
except:
	tn.write("help\n")
	answer = tn.read_until("END")

	try:
		m = re.search('harbor_\d+',answer)
		HARBOR = m.group()
		cmd = "%s.status\n" % HARBOR
	except:
		print("Could not find harbor ID.")
		quit()

tn.write(cmd)
answer = tn.read_until("END").replace("END","").replace("\n","").replace("\r","")

#print("harbor_%i: %s" % (id, answer))
if "ERROR" in answer:
	print(answer)
	quit()

if "source client connected from" in answer:
	print("1")
else:
	print("0")