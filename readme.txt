Ejercicio 1 - Prueba de Carga Login API

## Tecnologías Utilizadas
- Herramienta de Pruebas de Carga: k6 (Versión v0.47.0 o superior recomendada)
- Lenguaje del Script: JavaScript (ES6)

## Requisitos Previos
Tener instalado k6 en la máquina donde se ejecutará la prueba.
- Instalación: https://k6.io/docs/get-started/installation/

## Archivos del Proyecto
- load-test.js: El script principal de la prueba de carga.
- users.csv: Archivo de datos con credenciales de usuario (parametrización).
- readme.txt: Este archivo de instrucciones.
- conclusiones.txt: Análisis de los resultados de la prueba.

## Instrucciones de Ejecución Paso a Paso

1. Abra una terminal o línea de comandos.
2. Navegue hasta el directorio donde se encuentran los archivos `load-test.js` y `users.csv`.
3. Ejecute el siguiente comando:

   k6 run load-test.js

4. Espere a que la prueba finalice (duración aproximada: 3 minutos).
5. Al finalizar, k6 mostrará un resumen en la consola indicando si se cumplieron los umbrales (thresholds) definidos (indicados con un ✓ verde).

## Configuración del Escenario
El script está configurado para simular 30 usuarios virtuales concurrentes durante 2 minutos (más ramp-up y ramp-down), lo cual es suficiente para superar el objetivo de 20 TPS contra el endpoint objetivo.