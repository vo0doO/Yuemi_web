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

if [ $CUR_DIR == "cache" ]; then
	rm $(ls -tc *.mp3 | tail -n +30)
	youtube-dl --newline -f 43 -x --audio-format mp3 --embed-thumbnail -o "%(id)s.%(ext)s" -- $1
fi

