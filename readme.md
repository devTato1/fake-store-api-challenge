# FakeStore Login Load Test Challenge

Script de k6 para validar `https://fakestoreapi.com/auth/login` y demostrar que soporta ≥20 TPS con p95 < 1.5 s y errores < 3%.

## Stack Tecnológico
- **Lenguaje:** JavaScript ES6
- **Motor de carga:** k6 v0.47+
- **Data binding:** `SharedArray` + `papaparse` sobre `users.csv`
- **Reportes:** `handleSummary` + `textSummary` → `k6-report.txt`
- **IDE sugerido:** VS Code / cualquier editor ES6 friendly

## Instalando k6
| Sistema | Comando |
| --- | --- |
| Windows (Chocolatey) | `choco install k6` |
| Windows (winget) | `winget install k6 --source winget` |
| macOS (Homebrew) | `brew install k6` |
| Linux Debian/Ubuntu | `sudo apt update && sudo apt install -y gpg && curl -s https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg && echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list && sudo apt update && sudo apt install -y k6` |
| Linux Fedora/CentOS | `sudo dnf install k6` |

* Para confirmar la instalación con `k6 version`. 
* Asegúrate de tener `users.csv` junto a `load-test.js` y acceso a Internet.

## Puesta en marcha
```bash
git clone https://github.com/devTato1/fake-store-api-challenge.git
cd fake-store-api-challenge
```
* **Nota:** No hay dependencias adicionales: k6 ejecuta el script directamente.

## Ejecución
```bash
# Windows / Linux / macOS
k6 run load-test.js
```
1. `SharedArray` rota credenciales desde `users.csv`.
2. `check()` valida status 200/201 y la presencia de `token`.
3. Escenario por defecto: 30 VUs durante ~3 min (30s ↑, 2m meseta, 30s ↓) ≈ 23 TPS.
4. La consola y `k6-report.txt` muestran los thresholds (`http_req_failed`, `http_req_duration p(95)`, `http_reqs rate`).

## Escenarios Probados
```js
// Perfil largo ( ~3 min)

  { duration: '30s', target: 30 },
  { duration: '2m', target: 30 },
  { duration: '30s', target: 0 },
];

// Perfil corto (~1 min)

  { duration: '10s', target: 30 },
  { duration: '40s', target: 30 },
  { duration: '10s', target: 0 },
];
```
Modifica `options.stages` para cambiar duración o VUs, guarda y vuelve a correr `k6 run load-test.js`.

## Reportes y hallazgos
- `k6-report.txt` replica el resumen que ves en consola.
- Documenta los KPI (TPS, p95, % error) en `conclusiones.txt`, indicando qué escenario usaste.
- Si necesitas exportar a Grafana/Influx, puedes ampliar `handleSummary` o usar `--out` de k6.

## Estructura
```text
.
├── load-test.js      # Script k6 con escenarios, checks y handleSummary
├── users.csv         # Dataset user,passwd
├── k6-report.txt     # Reporte plano por ejecución
├── conclusiones.txt  # Resultados del ejercicio

```

## Notas útiles
- Si la API no devuelve token, se loguea `Status` y `Body` para depuración.
- Ajusta `thresholds` si cambian los SLA/SLO.
- `tags: { name: 'LoginReq' }` facilita filtrar métricas en herramientas externas.

---
**Autor:** Leonardo Reascos
