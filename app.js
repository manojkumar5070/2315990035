const http = require('http');
const PORT = 3001;

const requestHandler = (req, res) => {
    const start = Date.now();

    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && req.url === '/register') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                console.log('Request Body:', parsedBody);

                const responseTime = Date.now() - start;

                res.statusCode = 201;
                res.end(JSON.stringify({
                    message: 'Company registered successfully!',
                    company: "Afford Medical Limited",
                    responseTime: `${responseTime}ms`
                }));
            } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON format' }));
            }
        });
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
