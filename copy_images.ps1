$source = "C:\Users\student\Pictures\party"
$dest = "c:\Users\student\Desktop\farewell\photos"
$source_videos = "C:\Users\student\Videos\part video"
$dest_videos = "c:\Users\student\Desktop\farewell\videos"

# Create photos directory
if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest }
Copy-Item -Path "$source\*" -Destination "$dest\" -Force

# Create videos directory
if (-not (Test-Path $dest_videos)) { New-Item -ItemType Directory -Path $dest_videos }
Copy-Item -Path "$source_videos\*" -Destination "$dest_videos\" -Force

Write-Host "Images and Videos copied successfully!"
