# Ejercicio 1 · Prueba de Carga al Login de FakeStore API

Este repositorio contiene un script de k6 que valida el desempeño del endpoint `https://fakestoreapi.com/auth/login` bajo una carga concurrente suficiente para superar el objetivo de 20 transacciones por segundo (TPS).

## Contenido del repositorio
- **load-test.js** · Script principal de k6 con los escenarios, umbrales (SLA/SLO) y lógica de autenticación.
- **users.csv** · Dataset de credenciales usado para parametrizar las solicitudes.
- **conclusiones.txt** · Plantilla para documentar resultados y hallazgos posteriores a la ejecución.
- **readme.md** · Este documento.

## Requisitos previos
1. [Instalar k6](https://k6.io/docs/get-started/installation/) (se recomienda la versión v0.47.0 o superior).
2. Confirmar acceso a Internet para alcanzar `fakestoreapi.com`.

## Cómo ejecutar la prueba
```bash
# 1. Ubícate en la carpeta del proyecto
cd /ruta/al/proyecto

# 2. Ejecuta el escenario
k6 run load-test.js
```

La prueba dura ~3 minutos (30 s de ramp-up, 2 min de meseta, 30 s de ramp-down). Al finalizar, k6 mostrará un resumen de los umbrales configurados:
- `http_req_failed < 3%`
- `http_req_duration p(95) < 1500 ms`
- `http_reqs rate > 20`

Cada petición usa credenciales seleccionadas aleatoriamente desde `users.csv`. Si alguna respuesta no contiene token, el script registrará el cuerpo de la respuesta para facilitar el diagnóstico.

## Personalización
- **Carga**: ajusta `stages` dentro de `options` para modificar usuarios virtuales, duración o rampas.
- **SLA/SLO**: modifica `thresholds` si necesitas otros límites de error, latencia o throughput.
- **Dataset**: agrega o reemplaza filas en `users.csv` manteniendo las columnas `user` y `passwd`.
- **Etiquetas**: cambia el valor de `tags.name` en la petición si deseas agrupar métricas por escenario en Grafana/InfluxDB.

## Reporte de resultados
Registra los KPI reales en `conclusiones.txt` después de cada corrida. Sustituye los placeholders `[PONER AQUI ...]` con los valores de `http_reqs`, `http_req_duration p(95)` y `http_req_failed` informados por k6 para dejar trazabilidad del ejercicio.

## Próximos pasos sugeridos
1. Ejecutar `k6 run load-test.js` y capturar la evidencia (output de consola o archivo `summary.json` si configuras `handleSummary`).
2. Completar `conclusiones.txt` con los valores obtenidos y adjuntar insights adicionales (por ejemplo, behavior bajo picos, errores HTTP específicos, etc.).
3. Si es necesario iterar, ajustar el script, volver a ejecutar y comparar los indicadores contra los objetivos.
