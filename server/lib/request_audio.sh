#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
	DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
	SOURCE="$(readlink "$SOURCE")"
	[[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

mkdir -p $DIR/../cache
cd $DIR/../cache
CUR_DIR=${PWD##*/}

# If many people are downloading music at once, need to increase to a high number.
# If only I could pass "find . -type f -cmin +400" to the ls command below...
# As in, get files older than a day, sort them by time, and delete the oldest ones up to a cap of n
# However these two problems are most likely mutually exclusive. If Yuemi becomes popular I can just use find.
if [ $CUR_DIR == "cache" ]; then
	rm $(ls -tc *.mp3 | tail -n +30)
	youtube-dl --newline -f 43 -x --audio-format mp3 --embed-thumbnail -o "$1.%(ext)s" -- $1
fi

