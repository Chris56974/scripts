Write-Output "This script will add your ps1 folder to your path so you can run your powershell scripts"

# Folder to add to the environment
$folderToAddToEnv = $PSScriptRoot

# [Environment] && [EnvironmentVariableTarget] are dotnet classes
# You access its static methods/properties with ::
$currentPath = [Environment]::GetEnvironmentVariable("PATH", [EnvironmentVariableTarget]::User)

# Break down the path into an array
$envPathArray = $currentPath.Split(';')

# Check if the folder is already in PATH
if ($envPathArray -Contains $folderToAddToEnv) {
    Write-Output "$folderToAddToEnv is already on the user's PATH. `n"
    Write-Output $envPathArray
} else {
    Write-Output "Adding $folderToAddToEnv to PATH `n"

    $newPath = $currentPath + ";" + $folderToAddToEnv
    
    [Environment]::SetEnvironmentVariable("PATH", $newPath, [EnvironmentVariableTarget]::User)

    $newPath.Split(';')
}
