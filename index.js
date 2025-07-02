const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/pdf/lead/:id', async (req, res) => {
    const { id } = req.params;
    const url = `https://v0-centro-de-visas.vercel.app/crm/leads/${id}/reporte-pdf`;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="lead-${id}.pdf"`,
    });
    res.send(pdfBuffer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));