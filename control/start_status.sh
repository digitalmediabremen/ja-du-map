#!/bin/sh

pkill -f "status_all.py"

while true
do
  python status_all.py --webserver 8098 > /dev/null 2>&1
  sleep 5
done

