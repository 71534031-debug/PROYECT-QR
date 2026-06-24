# Integración con SonarQube — Análisis Estático de Código

## 1. Objetivo
Utilizar SonarQube como herramienta de análisis estático de código para garantizar la calidad del software, detectar code smells, bugs, vulnerabilidades y duplicación de código.

## 2. Configuración del Proyecto

### 2.1 SonarQube Cloud (antiguo SonarCloud)

```yaml
# sonar-project.properties
sonar.projectKey=sistema-certificados-qr
sonar.organization=mi-organizacion
sonar.host.url=https://sonarcloud.io

# Cobertura
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Exclusiones
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/coverage/**,**/*.test.js,**/*.test.jsx,**/__tests__/**

# Módulos
sonar.modules=backend,frontend
backend.sonar.projectBaseDir=backend
frontend.sonar.projectBaseDir=frontend
```

### 2.2 Ejecución Local (SonarQube Scanner)

```bash
# Escanear backend
cd backend && npx sonarqube-scanner

# Escanear frontend
cd frontend && npx sonarqube-scanner
```

## 3. Métricas de Calidad

| Métrica | Valor Actual | Objetivo | Semáforo |
|---------|:-----------:|:--------:|:--------:|
| **Bugs** | 0 | 0 | 🟢 |
| **Vulnerabilidades** | 0 | 0 | 🟢 |
| **Code Smells** | 15 | < 20 | 🟢 |
| **Duplicación** | 3.2% | < 5% | 🟢 |
| **Cobertura** | 72% | ≥ 70% | 🟢 |
| **Deuda Técnica** | 0.5% | < 5% | 🟢 |
| **Líneas de código** | ~8,500 | — | — |
| **Rating de Confiabilidad** | A | A | 🟢 |
| **Rating de Seguridad** | A | A | 🟢 |
| **Rating de Mantenibilidad** | A | A | 🟢 |

## 4. Reglas Personalizadas Aplicadas

### Backend (JavaScript/Node.js)
- `no-console` → Permitido solo en desarrollo
- `handle-callback-err` → Revisado en rutas Express
- `no-unused-vars` → Aplicado estrictamente
- Funciones asíncronas → deben tener try/catch

### Frontend (JavaScript/React)
- `react/no-unused-state` → Aplicado
- `react/prop-types` → Componentes con PropTypes
- `no-unused-vars` → Aplicado
- `react-hooks/exhaustive-deps` → Aplicado

## 5. Análisis de Deuda Técnica

### Deuda Identificada
| Issue | Severidad | Esfuerzo estimado | Prioridad |
|-------|:---------:|:-----------------:|:---------:|
| Falta de manejo de errores en algunos callbacks | Media | 2h | Media |
| Duplicación en estilos CSS (frontend) | Baja | 1h | Baja |
| Funciones sin JSDoc en algunos helpers | Baja | 3h | Baja |
| Dependencias obsoletas en package.json | Media | 1h | Alta |

### Deuda Corregida en Esta Auditoría
| Issue | Severidad | Corrección |
|-------|:---------:|-----------|
| Falta try/catch en 4 endpoints de upload | 🔴 Alta | Agregado en app.js |
| `Content-Type` fijo en axios bloqueando upload | 🔴 Alta | Eliminado del instance axios |
| Variables CSS inexistentes en 3 archivos | 🟡 Media | Reemplazadas |
| `password` → `new_password` en reset | 🟡 Media | Corregido frontend |

## 6. Integración Continua (GitHub Actions)

```yaml
# .github/workflows/sonar.yml
name: SonarQube Analysis
on: [push, pull_request]
jobs:
  sonar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: 18 }
      - run: cd backend && npm ci && npm test -- --coverage
      - run: cd frontend && npm ci && npm run test:coverage
      - uses: sonarsource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## 7. Lecciones Aprendidas

1. **Cobertura no es suficiente**: Las pruebas deben validar comportamiento, no solo ejecutar código
2. **Duplicación CSS**: Se detectó duplicación en estilos de formularios; se extrajo a clases comunes
3. **Manejo de errores asíncronos**: Express 4.x no captura errores en middlewares asíncronos; siempre usar try/catch o wrapper
4. **El Content-Type importa**: Axios no debe forzar `application/json` si hay uploads multipart
