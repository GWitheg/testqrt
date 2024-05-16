const express = require('express');
const qr = require('qrcode');

const app = express();
const port = 3000;

app.get('/generate_qr', async (req, res) => {
    try {
        // Get parameters from the request
        const data = req.query.data || 'Hello, World!';
        const errorCorrectionLevel = req.query.errorCorrectionLevel || 'L'; // Use lower error correction level
        const size = parseInt(req.query.size) || 655; // Set a reasonable default size

        // Generate QR code
        const url = await generateQRCode(data, errorCorrectionLevel, size);

        // Convert base64 QR code to image
        const base64Data = url.replace(/^data:image\/png;base64,/, '');
        const binaryData = Buffer.from(base64Data, 'base64');

        // Set response headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'inline; filename=qr_code.png');

        // Send the image
        res.end(binaryData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

async function generateQRCode(data, errorCorrectionLevel, size) {
    return new Promise((resolve, reject) => {
        qr.toDataURL(data, { errorCorrectionLevel, width: size }, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
