package main

import (
	"fmt"
	"os/exec"
	"runtime"
)

// Only supports mac atm
func checkMacOs() error {
	if runtime.GOOS != "darwin" {
		return fmt.Errorf("this script only runs on MacOS currently")
	}
	return nil
}

func CheckTreeCmd() error {
	if _, err := exec.LookPath("tree"); err != nil {
		fmt.Println("treeGPT: tree command not found, attempting to install with homebrew...")
		if err := installTree(); err != nil {
			return err
		}
	}
	return nil
}
