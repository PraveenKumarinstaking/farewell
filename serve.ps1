$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server running at http://localhost:8080/"
Start-Process "http://localhost:8080/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $url = $request.Url.LocalPath

    if ($url -eq "/") { $url = "/index.html" }

    $basePath = "c:\Users\student\Desktop\farewell"
    if ($url.StartsWith("/photos/")) {
        $imageName = $url.Substring(8)
        $filePath = Join-Path "C:\Users\student\Pictures\party" $imageName
    } elseif ($url.StartsWith("/videos/")) {
        $videoName = $url.Substring(8)
        $filePath = Join-Path "C:\Users\student\Videos\part video" $videoName
    } else {
        $filePath = Join-Path $basePath ($url.TrimStart("/"))
    }

    if (Test-Path $filePath) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        
        $mime = switch ($ext) {
            ".html" { "text/html" }
            ".css"  { "text/css" }
            ".js"   { "application/javascript" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".png"  { "image/png" }
            ".gif"  { "image/gif" }
            ".svg"  { "image/svg+xml" }
            ".webp" { "image/webp" }
            ".mp4"  { "video/mp4" }
            default { "application/octet-stream" }
        }

        $response.ContentType = $mime
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Not Found: $url")
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }
    
    $response.OutputStream.Close()
}
