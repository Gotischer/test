const http = require('http');
const https = require('https');

// Permite configurar el puerto desde el entorno de Docker (ej. PORT=80)
const PORT = process.env.PORT || 8080;

http.createServer((req, res) => {
    // Cabeceras CORS universales
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Manejar peticiones prevuelo de CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    // La URL destino será todo lo que vaya después de la primera barra
    let targetUrl = req.url.slice(1);
    if (!targetUrl.startsWith('http')) {
        // Auto-completa rutas relativas de los .ts asumiendo que vienen de Telemundo
        targetUrl = 'https://vfdbdfbd.pages.dev/' + targetUrl;
    }

    console.log(`[PROXY] Peticion entrante: ${targetUrl.split('?')[0]}`);

    // Falsificamos la cabecera Referer
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Referer': 'https://findleembeds.pages.dev/',
            'Origin': 'https://findleembeds.pages.dev'
        }
    };

    const protocol = targetUrl.startsWith('https') ? https : http;

    protocol.get(targetUrl, options, (targetRes) => {
        // Copiamos las cabeceras originales del servidor
        Object.keys(targetRes.headers).forEach(key => {
            if (key.toLowerCase() !== 'access-control-allow-origin') {
                res.setHeader(key, targetRes.headers[key]);
            }
        });
        
        res.writeHead(targetRes.statusCode);
        targetRes.pipe(res);
    }).on('error', (err) => {
        console.error(`[ERROR] ${err.message}`);
        res.writeHead(500);
        res.end('Proxy Error: ' + err.message);
    });

}).listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Proxy Local Anti-Leech Ejecutándose`);
    console.log(`🌐 Escuchando en el puerto: ${PORT}`);
    console.log(`=========================================`);
});
