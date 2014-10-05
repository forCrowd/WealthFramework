# Web application warm-up script
#
# Makes the first request to the application to prevent waiting after the build operations (check Web project properties - Build Events tab)
#
# coni2k - 05 Oct. '14

# Make an async request
(New-Object System.Net.WebClient).DownloadStringAsync("http://localhost:10001")

# Write the script execution time on a text file
$currentDate = Get-Date
$contentValue = "WarmUp script last executed on: $currentDate"
$resultFile = "$PSScriptRoot\WarmUpResult.txt"

Set-Content $resultFile -Value $contentValue
