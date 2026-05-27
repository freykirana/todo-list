# Docker + Cloudflare Deployment Script
# Jalankan: .\deploy.ps1

Write-Host "🚀 Starting Docker Deployment..." -ForegroundColor Cyan

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker tidak ditemukan. Install Docker Desktop terlebih dahulu." -ForegroundColor Red
    exit
}

# Get to project root
$projectRoot = "d:\Kuliah\SEMESTER 6\Backend\tugas_besar"
Set-Location $projectRoot

# Build & Start Docker
Write-Host "📦 Building Docker images..." -ForegroundColor Yellow
docker-compose build

Write-Host "🐳 Starting containers..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to start
Write-Host "⏳ Waiting for services to start (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check status
Write-Host "✅ Container Status:" -ForegroundColor Green
docker-compose ps

# Display URLs
Write-Host "`n📍 Local URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:4000" -ForegroundColor White
Write-Host "   Database: localhost:5432" -ForegroundColor White

Write-Host "`n📤 To expose via Cloudflare Tunnel:" -ForegroundColor Cyan
Write-Host "   1. Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/" -ForegroundColor White
Write-Host "   2. Run: cloudflared tunnel login" -ForegroundColor White
Write-Host "   3. Run: cloudflared tunnel create todo-app" -ForegroundColor White
Write-Host "   4. Run: cloudflared tunnel run todo-app" -ForegroundColor White

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
