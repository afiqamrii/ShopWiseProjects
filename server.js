const express = require('express');
const request = require('request');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Use CORS middleware
app.use(cors());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));

// Set up headers for all requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Route for proxy
app.get('/proxy', (req, res) => {
    const url = req.query.url;
    request(
        { url: url },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return res.status(500).json({ type: 'error', message: error.message });
            }
            res.json(JSON.parse(body));
        }
    );
});

// Route for search
app.get('/search', async (req, res) => {
    const { q } = req.query;
    const apiKey = '5f45a9f461cefbe08f7a813e57f4ca38a08924c2de85c0916e89f63b6cc6f488';
    const apiUrl = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q)}&google_domain=google.com&api_key=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Fallback to serving index.html for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
