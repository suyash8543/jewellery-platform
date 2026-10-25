Write-Host "==========================================================" -ForegroundColor DarkYellow
Write-Host "  SWARNA MAHAL JEWELLERS - PLATFORM LAUNCHER" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor DarkYellow

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"

Write-Host "1. Starting ASP.NET Core 9 Backend API on http://localhost:5083..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; dotnet run"

Start-Sleep -Seconds 3

Write-Host "2. Starting React 18 Frontend on http://localhost:5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "`nPlatform successfully launched!" -ForegroundColor Green
Write-Host "Storefront:     http://localhost:5173" -ForegroundColor White
Write-Host "Admin Portal:   http://localhost:5173/admin (admin / DiwaliGold2026!)" -ForegroundColor White
Write-Host "Swagger Docs:   http://localhost:5083/swagger" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor DarkYellow
