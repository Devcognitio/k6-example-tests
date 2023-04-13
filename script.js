import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  scenarios:{ // Declaracion de escenarios para la prueba
    prueba1:{ // Nombre del escenario
        executor: 'ramping-vus', // Se declara el ejecutor según la prueba a realizar
        startVUs: 0, // Número de usuarios con los que inicia la prueba
        startTime : '0s',
        tags: { scenario: 'concurrencia' },
        stages: [
            { duration: '1s', target: 2 }, // Un Rampa de ejecución para que suba el npumero de usuarios en un tiempo determinado
            { duration: '1s', target: 0 }, // Finaliza bajando a 0 el número de usuarios en un tiempo determiando
        ],
        exec: 'prueba1', // Referencia a la función de ejecución
    }
},
  thresholds: {
    'http_req_duration': ['p(99)<2000'], // 99% of requests must complete below 1.5s
    'logged in successfully': ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};

const BASE_URL = 'https://test-api.k6.io';
const USERNAME = 'TestUser';
const PASSWORD = 'SuperCroc202';

export function prueba1 () {
    const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
      username: USERNAME,
      password: PASSWORD,
    });

    check(loginRes, {
      'logged in successfully': (resp) => resp.json('access') !== '',
    });

    const authHeaders = {
      headers: {
        Authorization: `Bearer ${loginRes.json('access')}`,
      },
    };

    const myObjects = http.get(`${BASE_URL}/my/crocodiles/`, authHeaders).json();
    check(myObjects, { 'retrieved crocodiles': (obj) => obj.length > 0 });

    sleep(1);
};

export function handleSummary(data) {

  return {
    "result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}