# Stop & cleanup
# Jalankan: .\cleanup.ps1

Write-Host "🧹 Cleaning up Docker containers..." -ForegroundColor Yellow

$projectRoot = "d:\Kuliah\SEMESTER 6\Backend\tugas_besar"
Set-Location $projectRoot

# Stop containers
docker-compose down

Write-Host "✅ Containers stopped and removed." -ForegroundColor Green

# Optional: Remove volumes
$response = Read-Host "Remove database volume? (y/n)"
if ($response -eq 'y') {
    docker-compose down -v
    Write-Host "✅ Volumes removed." -ForegroundColor Green
}

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
