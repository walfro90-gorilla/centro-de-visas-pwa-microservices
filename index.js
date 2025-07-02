// Importa el framework Express para crear el servidor HTTP
const express = require('express');
// Importa Puppeteer para controlar un navegador headless y generar PDFs
const puppeteer = require('puppeteer');
// Importa CORS para permitir peticiones desde otros orígenes (como tu frontend)
const cors = require('cors');

// Inicializa la aplicación Express
const app = express();
// Habilita CORS en todas las rutas
app.use(cors());

// Define una ruta GET para generar el PDF de un lead por su ID
app.get('/api/pdf/lead/:id', async (req, res) => {
    // Obtiene el parámetro 'id' de la URL
    const { id } = req.params;
    // Construye la URL del reporte del lead en el frontend
    const url = `https://v0-centro-de-visas.vercel.app/crm/leads/${id}/reporte-pdf?pdf=1`;

    // Lanza una instancia de navegador headless con Puppeteer
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    // Abre una nueva pestaña en el navegador
    const page = await browser.newPage();
    // Navega a la URL del reporte del lead y espera a que cargue completamente
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Genera un PDF de la página cargada con formato A4 y fondo de impresión
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    // Cierra el navegador para liberar recursos
    await browser.close();

    // Configura los headers de la respuesta para indicar que es un archivo PDF descargable
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="lead-${id}.pdf"`,
    });
    // Envía el PDF generado como respuesta
    res.send(pdfBuffer);
});

// Define el puerto en el que escuchará el servidor (usa el de Render o 3000 por defecto)
const PORT = process.env.PORT || 3000;
// Inicia el servidor y muestra un mensaje en consola cuando está listo
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));