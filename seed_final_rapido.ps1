$ErrorActionPreference = 'Continue'
$BASE = 'https://proyect-qr-backend.onrender.com/api'
$TIMEOUT = 90

function Call-Api($method, $path, $body) {
  $params = @{ Uri = "$BASE$path"; Method = $method; ContentType = 'application/json'; Headers = $headers; TimeoutSec = $TIMEOUT }
  if ($body) { $params.Body = ($body | ConvertTo-Json -Depth 5 -Compress) }
  try { return (Invoke-RestMethod @params -ErrorAction Stop) }
  catch { return $null }
}

$login = Invoke-RestMethod -Uri "$BASE/auth/login" -Method Post -ContentType 'application/json' -Body '{"email":"admin@cip.local","password":"Password123"}' -TimeoutSec $TIMEOUT
$global:headers = @{ Authorization = "Bearer $($login.token)" }

# Get activities (skip ID 1 and Test)
$acts = (Call-Api GET '/actividades' $null).data
$goodActs = @()
foreach ($a in $acts) { if ($a.id -ne 1 -and $a.nombre -ne 'Test Actividad XYZ') { $goodActs += $a.id } }
Write-Host "Actividades: $($goodActs -join ', ')" -ForegroundColor Cyan

# Get existing participants
$existing = (Call-Api GET '/participantes' $null).data
$existingEmails = @{}
$existingPartIds = @()
foreach ($p in $existing) { $existingEmails[$p.email] = $true; $existingPartIds += $p.id }
Write-Host "Participantes existentes: $($existingPartIds.Count)" -ForegroundColor Yellow

# Participants to create
$participantes = @(
  @{n='Ana Lucia';a='Mendoza Ccori';td='CE';nd='CE00234567';em='ana.lucia.mendoza@email.com'}
  @{n='Luis Miguel';a='Palomino Vega';td='DNI';nd='67890123';em='luis.palomino@email.com'}
  @{n='Rosa Elena';a='Garcia Paredes';td='DNI';nd='23456789';em='rosa.garcia@email.com'}
  @{n='Raul Enrique';a='Moya Lozano';td='DNI';nd='13579246';em='raul.moya@email.com'}
  @{n='Gloria Esther';a='Villegas Torres';td='DNI';nd='24681357';em='gloria.villegas@email.com'}
  @{n='Hugo Martin';a='Rojas Pineda';td='CE';nd='CE00567890';em='hugo.rojas@email.com'}
  @{n='Diana Patricia';a='Soto Vasquez';td='DNI';nd='86420975';em='diana.soto@email.com'}
  @{n='Fernando Jesus';a='Campos Ortiz';td='PASAPORTE';nd='P98765432';em='fernando.campos@email.com'}
  @{n='Rebecca Liz';a='Contreras Paniura';td='DNI';nd='74185296';em='rebecca.contreras@email.com'}
  @{n='Omar Alexander';a='Hinostroza Ccanto';td='DNI';nd='96385274';em='omar.hinostroza@email.com'}
  @{n='Claudia Maria';a='Espinoza Rivas';td='DNI';nd='15935728';em='claudia.espinoza@email.com'}
  @{n='Victor Manuel';a='Arias Huerta';td='CE';nd='CE00678901';em='victor.arias@email.com'}
  @{n='Ruth Noemi';a='Palomino Cordova';td='DNI';nd='35795146';em='ruth.palomino@email.com'}
  @{n='Edgar Antonio';a='Zevallos Mendez';td='DNI';nd='75315982';em='edgar.zevallos@email.com'}
  @{n='Katherine';a='Sanchez Arones';td='CE';nd='CE00789012';em='katherine.sanchez@email.com'}
  @{n='Marco Antonio';a='Cardenas Ruiz';td='DNI';nd='65432187';em='marco.cardenas@email.com'}
  @{n='Rocio del Pilar';a='Meza Quintana';td='DNI';nd='15926348';em='rocio.meza@email.com'}
  @{n='Jose Daniel';a='Mamani Coila';td='DNI';nd='98765432';em='jose.mamani@email.com'}
  @{n='Fiorella Stefany';a='Rivera Gutierrez';td='DNI';nd='45612378';em='fiorella.rivera@email.com'}
  @{n='Juan Carlos';a='Perez Garcia';td='DNI';nd='11111111';em='juan.perez@email.com'}
  @{n='Maria Elena';a='Lopez Torres';td='DNI';nd='22222222';em='maria.lopez@email.com'}
  @{n='Carlos Alberto';a='Ramirez Silva';td='DNI';nd='33333333';em='carlos.ramirez@email.com'}
  @{n='Pedro Antonio';a='Luna Garcia';td='DNI';nd='44444444';em='pedro.luna@email.com'}
  @{n='Rosa Maria';a='Vallejos Rios';td='DNI';nd='55555555';em='rosa.vallejos@email.com'}
)

$newPartCount = 0
$actIdx = 0
foreach ($p in $participantes) {
  if ($existingEmails[$p.em]) { Write-Host "  -- $($p.n): ya existe" -ForegroundColor Yellow; continue }
  $aid = $goodActs[$actIdx % $goodActs.Count]
  $actIdx++
  $body = @{nombres=$p.n;apellidos=$p.a;tipo_documento=$p.td;numero_documento=$p.nd;email=$p.em;actividad_id=$aid}
  $r = Call-Api POST '/participantes' $body
  if ($r -and $r.success -and $r.data) {
    $newPartCount++
    Write-Host "  OK $($p.n) $($p.a) -> ID $($r.data.id)" -ForegroundColor Green
  } else {
    Write-Host "  FAIL $($p.n) $($p.a): sin respuesta" -ForegroundColor Red
  }
  Start-Sleep -Milliseconds 150
}
Write-Host "Creados: $newPartCount nuevos" -ForegroundColor Yellow

# Validate all participants
Write-Host "Validando APTO..." -ForegroundColor Cyan
$allParts = (Call-Api GET '/participantes' $null).data
$validados = 0
foreach ($p in $allParts) {
  if ($p.estado_validacion -eq 'APTO') { $validados++; continue }
  Start-Sleep -Milliseconds 100
  $r = Call-Api POST "/participantes/$($p.id)/validar-apto" @{actividad_id=$p.actividad_id}
  if ($r -and $r.success) { $validados++ }
}
Write-Host "OK $validados participantes APTO" -ForegroundColor Green

# Delete existing plantillas
$plant = (Call-Api GET '/plantillas' $null).data
if ($plant) { foreach ($pt in $plant) { $null = Call-Api DELETE "/plantillas/$($pt.id)" $null; Start-Sleep 100 } }

# Create plantilla
Write-Host "Creando plantilla..." -ForegroundColor Cyan
$plt = Call-Api POST '/plantillas' @{nombre='Certificado Oficial CIP - Consejo Departamental de Lima'}
if ($plt -and $plt.success) {
  $pltId = $plt.data.id
  Write-Host "OK Plantilla ID $pltId" -ForegroundColor Green
  $campos = @(
    @{placeholder='{{NOMBRE_COMPLETO}}';x=50;y=42;font_size=32;alignment='center';color='#1a1a2e';width=600;height=50;orden=1}
    @{placeholder='{{DOCUMENTO}}';x=50;y=49;font_size=16;alignment='center';color='#555555';width=400;height=30;orden=2}
    @{placeholder='{{ACTIVIDAD_NOMBRE}}';x=50;y=56;font_size=22;alignment='center';color='#6B1D2A';width=600;height=40;orden=3}
    @{placeholder='{{FECHA_EMISION}}';x=50;y=63;font_size=14;alignment='center';color='#888888';width=300;height=25;orden=4}
    @{placeholder='{{CODIGO_UNICO}}';x=50;y=68;font_size=11;alignment='center';color='#aaaaaa';width=350;height=20;orden=5}
    @{placeholder='{{QR}}';x=78;y=78;font_size=12;alignment='center';color='#000000';width=100;height=100;orden=6}
    @{placeholder='{{LOGO_INSTITUCION}}';x=12;y=8;font_size=12;alignment='center';color='#000000';width=80;height=80;orden=7}
    @{placeholder='{{NOMBRE_AUTORIDAD}}';x=35;y=76;font_size=16;alignment='center';color='#1a1a2e';width=300;height=30;orden=8}
    @{placeholder='{{CARGO_AUTORIDAD}}';x=35;y=80;font_size=13;alignment='center';color='#6B1D2A';width=300;height=25;orden=9}
    @{placeholder='{{FIRMA_AUTORIDAD}}';x=35;y=83;font_size=12;alignment='center';color='#000000';width=120;height=50;orden=10}
  )
  $cr = Call-Api PUT "/plantillas/$pltId/campos" @{campos=$campos}
  if ($cr -and $cr.success) { Write-Host "OK $($cr.data.campos.Count) campos configurados" -ForegroundColor Green }
  else { Write-Host "FAIL campos: sin respuesta" -ForegroundColor Red }

  # Generate certificates
  Write-Host "Generando certificados..." -ForegroundColor Cyan
  $totalCert = 0
  foreach ($aid in $goodActs) {
    Start-Sleep -Milliseconds 500
    $r = Call-Api POST '/certificados/generar' @{actividad_id=$aid;plantilla_id=$pltId}
    if ($r -and $r.success) { $totalCert += $r.generados; Write-Host "  OK Act ID $($aid): $($r.generados) certs" -ForegroundColor Green }
    else { Write-Host "  -- Act ID $($aid): sin certificados" -ForegroundColor Yellow }
  }
  Write-Host "Total: $totalCert certificados generados" -ForegroundColor Yellow
} else {
  Write-Host "FAIL creando plantilla" -ForegroundColor Red
}

# Final summary
Write-Host "`n=== RESUMEN FINAL ===" -ForegroundColor Magenta
$fa = (Call-Api GET '/actividades' $null).data
$fp = (Call-Api GET '/participantes' $null).data
$fc = (Call-Api GET '/certificados' $null).data
$fl = (Call-Api GET '/plantillas' $null).data
Write-Host "  Actividades:   $($fa.Count)"
Write-Host "  Participantes: $($fp.Count)"
Write-Host "  Certificados:  $($fc.Count)"
Write-Host "  Plantillas:    $($fl.Count)"
if ($fc -and $fc.Count -gt 0) {
  Write-Host "`n  URL del sistema: https://proyect-qr-backend.onrender.com"
  Write-Host "  Email:           admin@cip.local"
  Write-Host "  Password:        Password123"
}
Write-Host "`nHecho!" -ForegroundColor Green
