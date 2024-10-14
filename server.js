// Instead of require(), use import
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';

// Import `path` module and ensure you handle __dirname properly with ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser middleware
app.use(bodyParser.json());

// HTTP request logger
app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handle the login request
app.post("/api/login", (req, res) => {
    // Extract the username and password from the request body
    const { username, password } = req.body;

    // Log the data to verify the request
    console.log('Username:', username);
    console.log('Password:', password);

    // You can now add your own logic for handling login/authentication
    res.send(`Received login data: Username = ${username}, Password = ${password}`);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
