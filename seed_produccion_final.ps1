param([switch]$Clean)

$ErrorActionPreference = "Stop"
$BASE = "https://proyect-qr-backend.onrender.com/api"
$TIMEOUT = 60

function Call-Api($method, $path, $body) {
  $params = @{ Uri = "$BASE$path"; Method = $method; ContentType = "application/json"; Headers = $headers; TimeoutSec = $TIMEOUT }
  if ($body) { $params.Body = ($body | ConvertTo-Json -Depth 5 -Compress) }
  try { return Invoke-RestMethod @params -ErrorAction Stop }
  catch {
    if ($_.ErrorDetails) { try { $errMsg = ($_.ErrorDetails | ConvertFrom-Json).message } catch { $errMsg = $_.Exception.Message } } else { $errMsg = $_.Exception.Message }
    return @{ success = $false; error = $errMsg }
  }
}

# Login
Write-Host "=== CONECTANDO A PRODUCCION ===" -ForegroundColor Cyan
$login = Invoke-RestMethod -Uri "$BASE/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@cip.local","password":"Password123"}' -TimeoutSec $TIMEOUT
$token = $login.token
$script:headers = @{ Authorization = "Bearer $token" }
Write-Host "OK Login: $($login.user.nombre)" -ForegroundColor Green

# 1. ACTIVIDADES
Write-Host "`n--- CREANDO ACTIVIDADES ---" -ForegroundColor Cyan
$actividades = @(
  @{nombre="Curso de Gestion de Proyectos TI"; tipo="Curso"; descripcion="Gestion agil de proyectos con Scrum"; fecha_inicio="2026-03-01"; fecha_fin="2026-03-30"; responsable="Decano Nacional"}
  @{nombre="Taller de Etica Profesional 2026"; tipo="Taller"; descripcion="Etica en la ingenieria"; fecha_inicio="2026-04-10"; fecha_fin="2026-04-12"; responsable="Director Academico"}
  @{nombre="Conferencia de Actualizacion 2026"; tipo="Conferencia"; descripcion="Nuevas tecnologias en ingenieria"; fecha_inicio="2026-05-15"; fecha_fin="2026-05-15"; responsable="Comite Organizador"}
  @{nombre="Seminario de Seguridad Estructural"; tipo="Seminario"; descripcion="Normas de seguridad en construcciones"; fecha_inicio="2026-06-20"; fecha_fin="2026-06-22"; responsable="Jefe de Capitulo"}
  @{nombre="Diplomado en Gestion Publica"; tipo="Diplomado"; descripcion="Formacion en gestion publica"; fecha_inicio="2026-07-05"; fecha_fin="2026-09-30"; responsable="Director de Capacitacion"}
  @{nombre="Taller de Liderazgo Organizacional"; tipo="Taller"; descripcion="Habilidades directivas"; fecha_inicio="2026-08-01"; fecha_fin="2026-08-03"; responsable="Gerente General"}
  @{nombre="Capacitacion en Etica Profesional 2026"; tipo="Curso"; descripcion="Capacitacion obligatoria en etica"; fecha_inicio="2026-02-01"; fecha_fin="2026-02-28"; responsable="Comite de Etica"}
  @{nombre="Conferencia de Actualizacion 2026-II"; tipo="Conferencia"; descripcion="Tendencias tecnologicas"; fecha_inicio="2026-09-10"; fecha_fin="2026-09-10"; responsable="Comite Organizador"}
)
$actIds = @()
foreach ($a in $actividades) {
  Start-Sleep -Milliseconds 400
  $r = Call-Api POST "/actividades" $a
  if ($r.success) { $actIds += $r.data.id; Write-Host "  OK $($a.nombre) -> ID $($r.data.id)" -ForegroundColor Green }
  else { Write-Host "  -- $($a.nombre): $($r.error)" -ForegroundColor Yellow }
}
Write-Host "Total activas: $($actIds.Count)" -ForegroundColor Yellow

# 2. PARTICIPANTES
Write-Host "`n--- CREANDO PARTICIPANTES ---" -ForegroundColor Cyan
$participantes = @(
  @{ai=0;n="Jorge Lennon";a="Anccasi Espinoza";td="DNI";nd="71534031";em="jorge.anccasi@email.com"}
  @{ai=0;n="Maria Fernanda";a="Torres Quispe";td="DNI";nd="45678901";em="maria.torres@email.com"}
  @{ai=0;n="Carlos Alberto";a="Ramos Huanca";td="DNI";nd="32145678";em="carlos.ramos@email.com"}
  @{ai=0;n="Ana Lucia";a="Mendoza Ccori";td="CE";nd="CE00234567";em="ana.mendoza@email.com"}
  @{ai=0;n="Luis Miguel";a="Palomino Vega";td="DNI";nd="67890123";em="luis.palomino@email.com"}
  @{ai=0;n="Rosa Elena";a="Garcia Paredes";td="DNI";nd="23456789";em="rosa.garcia@email.com"}
  @{ai=1;n="Pedro Andres";a="Torres Vega";td="DNI";nd="99887766";em="pedro.torres@email.com"}
  @{ai=1;n="Lucia Milagros";a="Cardenas Ruiz";td="CE";nd="CE00345678";em="lucia.cardenas@email.com"}
  @{ai=1;n="Diego Armando";a="Quispe Huaman";td="DNI";nd="11223344";em="diego.quispe@email.com"}
  @{ai=1;n="Carmen Rosa";a="Delgado Pacheco";td="DNI";nd="55667788";em="carmen.delgado@email.com"}
  @{ai=1;n="Alberto Jose";a="Fernandez Lopez";td="PASAPORTE";nd="P12345678";em="alberto.fernandez@email.com"}
  @{ai=2;n="Ana Sofia";a="Martinez Rios";td="DNI";nd="11223399";em="ana.sofia.martinez@email.com"}
  @{ai=2;n="Javier Eduardo";a="Salazar Castro";td="DNI";nd="33445566";em="javier.salazar@email.com"}
  @{ai=2;n="Patricia Beatriz";a="Huaman Quispe";td="DNI";nd="77889900";em="patricia.huaman@email.com"}
  @{ai=2;n="Gustavo Adolfo";a="Reyes Pantoja";td="CE";nd="CE00456789";em="gustavo.reyes@email.com"}
  @{ai=2;n="Silvia Marina";a="Cordova Sanchez";td="DNI";nd="99001122";em="silvia.cordova@email.com"}
  @{ai=3;n="Raul Enrique";a="Moya Lozano";td="DNI";nd="13579246";em="raul.moya@email.com"}
  @{ai=3;n="Gloria Esther";a="Villegas Torres";td="DNI";nd="24681357";em="gloria.villegas@email.com"}
  @{ai=3;n="Hugo Martin";a="Rojas Pineda";td="CE";nd="CE00567890";em="hugo.rojas@email.com"}
  @{ai=3;n="Diana Patricia";a="Soto Vasquez";td="DNI";nd="86420975";em="diana.soto@email.com"}
  @{ai=3;n="Fernando Jesus";a="Campos Ortiz";td="PASAPORTE";nd="P98765432";em="fernando.campos@email.com"}
  @{ai=4;n="Rebecca Liz";a="Contreras Paniura";td="DNI";nd="74185296";em="rebecca.contreras@email.com"}
  @{ai=4;n="Omar Alexander";a="Hinostroza Ccanto";td="DNI";nd="96385274";em="omar.hinostroza@email.com"}
  @{ai=4;n="Claudia Maria";a="Espinoza Rivas";td="DNI";nd="15935728";em="claudia.espinoza@email.com"}
  @{ai=4;n="Victor Manuel";a="Arias Huerta";td="CE";nd="CE00678901";em="victor.arias@email.com"}
  @{ai=4;n="Ruth Noemi";a="Palomino Cordova";td="DNI";nd="35795146";em="ruth.palomino@email.com"}
  @{ai=4;n="Edgar Antonio";a="Zevallos Mendez";td="DNI";nd="75315982";em="edgar.zevallos@email.com"}
  @{ai=5;n="Katherine";a="Sanchez Arones";td="CE";nd="CE00789012";em="katherine.sanchez@email.com"}
  @{ai=5;n="Marco Antonio";a="Cardenas Ruiz";td="DNI";nd="65432187";em="marco.cardenas@email.com"}
  @{ai=5;n="Rocio del Pilar";a="Meza Quintana";td="DNI";nd="15926348";em="rocio.meza@email.com"}
  @{ai=5;n="Jose Daniel";a="Mamani Coila";td="DNI";nd="98765432";em="jose.mamani@email.com"}
  @{ai=5;n="Fiorella Stefany";a="Rivera Gutierrez";td="DNI";nd="45612378";em="fiorella.rivera@email.com"}
  @{ai=6;n="Juan Carlos";a="Perez Garcia";td="DNI";nd="11111111";em="juan.perez@email.com"}
  @{ai=6;n="Maria Elena";a="Lopez Torres";td="DNI";nd="22222222";em="maria.lopez@email.com"}
  @{ai=6;n="Carlos Alberto";a="Ramirez Silva";td="DNI";nd="33333333";em="carlos.ramirez@email.com"}
  @{ai=7;n="Pedro Antonio";a="Luna Garcia";td="DNI";nd="44444444";em="pedro.luna@email.com"}
  @{ai=7;n="Rosa Maria";a="Vallejos Rios";td="DNI";nd="55555555";em="rosa.vallejos@email.com"}
)
$partData = @()
$dupes = 0
$errors = 0
foreach ($p in $participantes) {
  Start-Sleep -Milliseconds 250
  $aid = $actIds[$p.ai]
  if (-not $aid) { Write-Host "  ?? $($p.n) $($p.a): no actividad"; continue }
  $body = @{nombres=$p.n;apellidos=$p.a;tipo_documento=$p.td;numero_documento=$p.nd;email=$p.em;actividad_id=$aid}
  $r = Call-Api POST "/participantes" $body
  if ($r.success -and $r.data) { $partData += @{id=$r.data.id;actividad_id=$aid}; Write-Host "  OK $($p.n) $($p.a) -> ID $($r.data.id)" -ForegroundColor Green }
  elseif ($r.error -match "duplicado|Conflict|409") { $dupes++; Write-Host "  -- $($p.n) $($p.a): duplicado" -ForegroundColor Yellow }
  else { $errors++; Write-Host "  FAIL $($p.n) $($p.a): $($r.error)" -ForegroundColor Red }
}
Write-Host "Creados: $($partData.Count) | Duplicados: $dupes | Errores: $errors" -ForegroundColor Yellow

# 3. VALIDAR APTO
Write-Host "`n--- VALIDANDO APTO ---" -ForegroundColor Cyan
$validados = 0
foreach ($pd in $partData) {
  Start-Sleep -Milliseconds 150
  $r = Call-Api POST "/participantes/$($pd.id)/validar-apto" @{actividad_id=$pd.actividad_id}
  if ($r.success) { $validados++ }
}
Write-Host "OK $validados participantes validados APTO" -ForegroundColor Green

# 4. PLANTILLA
Write-Host "`n--- CREANDO PLANTILLA ---" -ForegroundColor Cyan
$plt = Call-Api POST "/plantillas" @{nombre="Certificado Oficial CIP"}
if ($plt.success) {
  $pltId = $plt.data.id
  Write-Host "OK Plantilla ID $pltId" -ForegroundColor Green
  
  $campos = @(
    @{placeholder="{{NOMBRE_COMPLETO}}";x=50;y=42;font_size=32;alignment="center";color="#1a1a2e";width=600;height=50;orden=1}
    @{placeholder="{{DOCUMENTO}}";x=50;y=49;font_size=16;alignment="center";color="#555555";width=400;height=30;orden=2}
    @{placeholder="{{ACTIVIDAD_NOMBRE}}";x=50;y=56;font_size=22;alignment="center";color="#6B1D2A";width=600;height=40;orden=3}
    @{placeholder="{{FECHA_EMISION}}";x=50;y=63;font_size=14;alignment="center";color="#888888";width=300;height=25;orden=4}
    @{placeholder="{{CODIGO_UNICO}}";x=50;y=68;font_size=11;alignment="center";color="#aaaaaa";width=350;height=20;orden=5}
    @{placeholder="{{QR}}";x=78;y=78;font_size=12;alignment="center";color="#000000";width=100;height=100;orden=6}
    @{placeholder="{{LOGO_INSTITUCION}}";x=12;y=8;font_size=12;alignment="center";color="#000000";width=80;height=80;orden=7}
    @{placeholder="{{NOMBRE_AUTORIDAD}}";x=35;y=76;font_size=16;alignment="center";color="#1a1a2e";width=300;height=30;orden=8}
    @{placeholder="{{CARGO_AUTORIDAD}}";x=35;y=80;font_size=13;alignment="center";color="#6B1D2A";width=300;height=25;orden=9}
    @{placeholder="{{FIRMA_AUTORIDAD}}";x=35;y=83;font_size=12;alignment="center";color="#000000";width=120;height=50;orden=10}
  )
  $cr = Call-Api PUT "/plantillas/$pltId/campos" @{campos=$campos}
  if ($cr.success) { Write-Host "OK $($cr.data.campos.Count) campos configurados" -ForegroundColor Green }
  else { Write-Host "FAIL campos: $($cr.error)" -ForegroundColor Red }

  # 5. CERTIFICADOS
  Write-Host "`n--- GENERANDO CERTIFICADOS ---" -ForegroundColor Cyan
  $totalCert = 0
  for ($i = 0; $i -lt $actIds.Count; $i++) {
    $aid = $actIds[$i]
    Start-Sleep -Milliseconds 600
    $r = Call-Api POST "/certificados/generar" @{actividad_id=$aid;plantilla_id=$pltId}
    if ($r.success) { $totalCert += $r.generados; Write-Host "  OK Act $($i+1) (ID $aid): $($r.generados) certs" -ForegroundColor Green }
    else { Write-Host "  -- Act $($i+1) (ID $aid): $($r.error)" -ForegroundColor Yellow }
  }
  Write-Host "Total: $totalCert certificados" -ForegroundColor Yellow
} else {
  Write-Host "FAIL plantilla: $($plt.error)" -ForegroundColor Red
}

# RESUMEN
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "         RESUMEN PRODUCCION              " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$fa = Invoke-RestMethod -Uri "$BASE/actividades" -Method Get -Headers $headers -TimeoutSec $TIMEOUT
$fp = Invoke-RestMethod -Uri "$BASE/participantes" -Method Get -Headers $headers -TimeoutSec $TIMEOUT
$fc = Invoke-RestMethod -Uri "$BASE/certificados" -Method Get -Headers $headers -TimeoutSec $TIMEOUT
$fl = Invoke-RestMethod -Uri "$BASE/plantillas" -Method Get -Headers $headers -TimeoutSec $TIMEOUT
Write-Host "  URL:        https://proyect-qr-backend.onrender.com"
Write-Host "  Email:      admin@cip.local"
Write-Host "  Password:   Password123"
Write-Host "  Actividades:   $($fa.data.Count)"
Write-Host "  Participantes: $($fp.data.Count)"
Write-Host "  Certificados:  $($fc.data.Count)"
Write-Host "  Plantillas:    $($fl.data.Count)"
Write-Host "========================================" -ForegroundColor Cyan