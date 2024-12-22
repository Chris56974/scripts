#!/bin/sh

echo "Would you like to see the code for this file? y (yes) / else (no)"

read -n 1 choice # overwriting choice

if [ $choice = "y" ]; then
  echo ""
  [ $1 ] && cat "$1" || cat "$0"
  echo ""
else 
  exit 1
fi