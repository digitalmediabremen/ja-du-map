import getpass
import sys
import telnetlib
import re

HOST = "stream.radioangrezi.de"

def get_status(PORT, harbor = False):

	tn = telnetlib.Telnet(HOST, PORT)

	if harbor:
		cmd = "harbor_%i.status\n" % HARBOR
	else:
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
		return answer

	if "source client connected from" in answer:
		return 1
	else:
		return 0

if __name__ == "__main__":
	if len(sys.argv) == 3:
		print get_status(sys.argv[1], sys.argv[2])
	elif len(sys.argv) == 2:
		print get_status(sys.argv[1])
	else:
		print("Please provide the following arguments:")
		print("1: Telnet Port")
		print("2: Harbor ID (from help command)")
		quit()