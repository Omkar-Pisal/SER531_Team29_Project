const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors module

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

app.post('/submitSymptoms', (req, res) => {
    const symptoms = req.body.symptoms;
    console.log('Symptoms submitted:', symptoms);

    // Sending a response to the frontend
    res.json({ message: 'Symptoms submitted successfully.' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
