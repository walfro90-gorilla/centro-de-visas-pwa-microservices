// Script para probar el microservicio de generación de PDF
// Ejecuta: node test-pdf-endpoint.js

const https = require('https');
const fs = require('fs');

// Cambia el ID por uno válido de tu base de datos
const leadId = 'fceeda42-ff10-487f-b2da-e974bf166c04';
const url = `https://centro-de-visas-pwa-microservices.onrender.com/api/pdf/lead/${leadId}`;

const file = fs.createWriteStream(`lead-${leadId}.pdf`);

https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error('Error:', response.statusCode, response.statusMessage);
    response.resume();
    return;
  }
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('PDF descargado correctamente:', `lead-${leadId}.pdf`);
  });
}).on('error', (err) => {
  fs.unlink(`lead-${leadId}.pdf`, () => {});
  console.error('Error al descargar el PDF:', err.message);
});
