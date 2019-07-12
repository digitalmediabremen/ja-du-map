#!/bin/bash

# RADIOPHONIC SPACES - web documentation
# ja + du
# 2019-07-12

# requirements: ffmpeg with AAC support + MP4Box
# usage: mp3-to-dash.sh XX.mp3 [XX.mp3 [...]]

# Audio Transcoder for use with MPEG-DASH (audio only)
# works in the directory of each input file! (relativly to $PWD)

# Input: mp3 audio
# Output: Segmented mp4 audio (m4s) + mpd file + init.mp4

BASE=$PWD

for INFILE in "$@"
do
	if [ -f "$INFILE" ] && [ "$INFILE" == "*.mp3" ]
	then
	      echo "File $INFILE does not exist or does not seem to be an mp3."
	fi
	FILENAME=$(basename "$INFILE" .mp3)
	DIR=$(dirname "${INFILE}")
	echo ".. working now in directory: $DIR .."
	cd $DIR
	echo "Transcoding to mp4 (AAC): $FILENAME.mp3"
	# Transcode mp3 to mp4 with AAC
	ffmpeg -i "$FILENAME.mp3"  -c:a libfdk_aac -b:a 128k "$FILENAME.mp4"

	echo "Generating MPEG-DASH files: $FILENAME.mp4"
	# Segment to DASH
	# (live is required to get single segments as seperate files)
	MP4Box -dash 60000 -profile live "$FILENAME.mp4"
	cd $BASE
done