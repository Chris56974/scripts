if [ "$(uname)" = "Darwin" ]; then
  ls $(xcode-select -p)/usr/bin
  echo "\nAll can be xcrun\n"
else
  echo "This script only works on macOS"
fi
