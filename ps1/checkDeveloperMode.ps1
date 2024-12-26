Write-Output "This script checks if the device is in Developer Mode"
Write-Output "It will set it to developer mode for you in the future"

# chatGPT provided lol
$regPath = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock"
$regName = "AllowDevelopmentWithoutDevLicense"

function Enable-DeveloperMode {
    Write-Output "Enabling Developer Mode..."
    New-Item -Path $regPath -Force | Out-Null
    Set-ItemProperty -Path $regPath -Name $regName -Value 1
    Write-Output "Developer Mode enabled. Please restart your device to apply all changes."
}

function Check-DeveloperMode {
    if (Test-Path $regPath) {
        $devModeStatus = Get-ItemProperty -Path $regPath -Name $regName -ErrorAction SilentlyContinue
        if ($devModeStatus.$regName -eq 1) {
            Write-Output "Developer Mode is already enabled."
        } else {
            Write-Output "Developer Mode is not enabled."
            # Enable-DeveloperMode
        }
    } else {
        Write-Output "Developer Mode is not enabled."
        # Enable-DeveloperMode
    }
}

Check-DeveloperMode
