import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// 1. CARGA DE DATOS CSV
const csvData = new SharedArray('users', function () {
    // Usamos papaparse para leer el CSV y convertirlo en un array de objetos JSON
    return papaparse.parse(open('./users.csv'), { header: true, skipEmptyLines: true }).data;
});


// 2. CONFIGURACIÓN DE LA PRUEBA (OPTIONS)
export const options = {
    // Escenario de carga:
    // Para alcanzar 20 TPS, si la API responde en 500ms promedio, necesitamos 10 VUs.
    // Si responde en 1s, necesitamos 20 VUs.
    // Usaremos 30 VUs para asegurar superar los 20 TPS cómodamente.
    stages: [
        { duration: '30s', target: 30 }, // Ramp-up: Subir a 30 usuarios virtuales en 30s
        { duration: '2m', target: 30 },  // Meseta: Mantener 30 usuarios por 2 minutos
        { duration: '30s', target: 0 },  // Ramp-down: Bajar a 0 usuarios en 30s
    ],

    // REQUISITO: Validaciones (SLA/SLO)
    thresholds: {
        // 1. Tasa de error aceptable, menor al 3%
        http_req_failed: ['rate<0.03'], 
        // 2. Tiempo de respuesta máximo 1.5 segundos (Usamos el percentil 95 para ser más precisos)
        http_req_duration: ['p(95)<1500'], 
        // Opcional: Validar que alcanzamos los TPS deseados (Requests/sec > 20)
        http_reqs: ['rate>20'], 
    },
};


// 3. LÓGICA DE USUARIO VIRTUAL
export default function () {
    // Seleccionar un usuario aleatorio del CSV para cada petición
    const randomIndex = Math.floor(Math.random() * csvData.length);
    const user = csvData[randomIndex];


    const url = 'https://fakestoreapi.com/auth/login';
    const payload = JSON.stringify({
        username: user.user,   // Usamos la columna 'user' del CSV
        password: user.passwd, // Usamos la columna 'passwd' del CSV
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        tags: { name: 'LoginReq' } // Etiqueta para identificar la petición en reportes
    };

    // Realizar la petición POST
    const res = http.post(url, payload, params);

    // Validaciones funcionales básicas
    // Verificar que responde 200 OK y que devuelve un token
    check(res, {
    // Aceptamos 200 o 201 (ambos son éxito)
    'status es 200 o 201': (r) => r.status === 200 || r.status === 201,
    'respuesta tiene token': (r) => {
        const hasToken = r.json('token') !== undefined;
        // Si no tiene token, imprimimos qué nos dijo el servidor para saber por qué
        if (!hasToken) { console.log("Error! Status: " + r.status + " Body: " + r.body); }
        return hasToken;
    },
  });

    // Pacing: Pequeña pausa aleatoria entre 0.5s y 1s entre peticiones
    // para simular un comportamiento más realista y no saturar artificialmente.
    sleep(Math.random() * 0.5 + 0.5);
}

export function handleSummary(data) {
    const reportFile = 'k6-report.txt';
    // textSummary replica el formato de la consola y k6 sobrescribe el archivo si ya existe.
    const summaryText = textSummary(data, { indent: ' ', enableColors: false });
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        [reportFile]: summaryText,
    };
}
