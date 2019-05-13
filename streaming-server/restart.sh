
#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'please provide at least one harbor port number to restart'
    exit 0
fi

for PORT in "$@"
do
	echo "killing process with harbor-$PORT.cfg"
	pkill -f "harbor-$PORT.cfg"
	sleep 1

	echo "starting: liquidsoap harbor-$PORT.cfg"
	liquidsoap harbor-$PORT.cfg &
done


