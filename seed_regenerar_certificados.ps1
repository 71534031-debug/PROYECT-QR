$BASE = "https://proyect-qr-backend.onrender.com/api"
$login = Invoke-RestMethod -Uri "$BASE/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@cip.local","password":"Password123"}' -TimeoutSec 30
$token = $login.token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "Login OK" -ForegroundColor Green

# Clean up existing certificates
Write-Host "Limpiando certificados anteriores..." -ForegroundColor Cyan
$clean = Invoke-RestMethod -Uri "$BASE/certificados/limpiar" -Method Delete -Headers $headers -TimeoutSec 30
Write-Host "Clean: $($clean.message)" -ForegroundColor Yellow

# Get plantilla ID and activities
$plt = Invoke-RestMethod -Uri "$BASE/plantillas" -Method Get -Headers $headers -TimeoutSec 15
$pltId = $plt.data[0].id
Write-Host "Plantilla ID: $pltId" -ForegroundColor Cyan

$acts = Invoke-RestMethod -Uri "$BASE/actividades" -Method Get -Headers $headers -TimeoutSec 15
$goodActs = @()
foreach ($a in $acts.data) {
  if ($a.id -ne 1 -and $a.nombre -ne 'Test Actividad XYZ') {
    $goodActs += $a.id
  }
}
Write-Host "Actividades: $($goodActs -join ', ')" -ForegroundColor Cyan

# Regenerate certificates
$totalCert = 0
foreach ($aid in $goodActs) {
  Start-Sleep -Milliseconds 500
  try {
    $body = "{`"actividad_id`":$aid,`"plantilla_id`":$pltId}"
    $r = Invoke-RestMethod -Uri "$BASE/certificados/generar" -Method Post -Headers $headers -ContentType "application/json" -Body $body -TimeoutSec 120
    if ($r.success) {
      $totalCert += $r.generados
      Write-Host "  OK Act ID $($aid): $($r.generados) certificados" -ForegroundColor Green
    } else {
      Write-Host "  -- Act ID $($aid): $($r.message)" -ForegroundColor Yellow
    }
  } catch {
    Write-Host "  FAIL Act ID $($aid): $_" -ForegroundColor Red
  }
}

Write-Host "Total: $totalCert certificados generados" -ForegroundColor Yellow

$fc = (Invoke-RestMethod -Uri "$BASE/certificados" -Method Get -Headers $headers -TimeoutSec 15).data
Write-Host "Certificados totales: $($fc.Count)" -ForegroundColor Magenta
Write-Host "Hecho!" -ForegroundColor Green
