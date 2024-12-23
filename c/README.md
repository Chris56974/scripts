```sh
apropos . # find all man pages
man -k . # ibid

clang -E -v - < /dev/null # find include paths
xcrun --show-sdk-path # find the sdk paths

apropos socket # once you find a header file, apropos the method name
man socket # to find out more information
man 2 # system call
man 3 # library function
```