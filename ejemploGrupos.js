import { group, check } from 'k6';
import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const id = 10;



export default function () {
    // reconsider this type of code
    group('get post', function () {
        http.get(`http://example.com/posts/${id}`);
    });
    group('list posts', function () {
        const res = http.get(`http://example.com/posts`);
    check(res, {
      'is status 200': (r) => r.status === 200,
        });
    });
}

export function handleSummary(data) {     //Generación de reporte html
    return { 
    "ejemplosGrupos.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}