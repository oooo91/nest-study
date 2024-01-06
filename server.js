const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
const port = 8082;

dotenv.config();
app.use(cors());

app.use(express.static(__dirname));

app.get('/api/movies', async (req, res) => {
    console.log(req);

    const apiKey = process.env.MOVIE_DB_API_KEY;
    console.log(apiKey);
    const apiUrl = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`
        }
    };

    try {
        const response = await fetch(apiUrl, options);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
