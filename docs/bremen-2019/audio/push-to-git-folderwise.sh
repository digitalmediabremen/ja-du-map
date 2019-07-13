#!/bin/bash

# RADIOPHONIC SPACES - web documentation
# ja + du
# 2019-07-12

# add, commit and push each subfolder seperatly
# this is used for large amounts of data (audio)

for D in *; do
    if [ -d "${D}" ]; then
        echo ".. $D ..."
	    git add -A $D/*
	    git commit -m "Add one channel at a time: $D"
	    git push origin master
    fi
done