#!/bin/zsh

# Double-click this file in Finder to preview the portfolio locally.
cd "$(dirname "$0")"
python3 -m http.server 8010 >/tmp/likith-portfolio-preview.log 2>&1 &
server_pid=$!
sleep 1
open "http://localhost:8010"
wait "$server_pid"
