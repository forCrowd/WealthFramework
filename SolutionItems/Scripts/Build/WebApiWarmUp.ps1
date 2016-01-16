# WebApi warm-up script
#
# Makes a request to WebApi application to prevent waiting after the build operations (check WebApi project properties - Build Events tab)
#
# SH - 05 Oct. '14

# Make an async request
(New-Object System.Net.WebClient).DownloadStringAsync("http://localhost:15001")

# Write the script execution time on a text file
$currentDate = Get-Date
$contentValue = "WarmUp script last executed on: $currentDate"
$resultFile = "$PSScriptRoot\WebApiWarmUpResult.txt"

Set-Content $resultFile -Value $contentValue
