const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const executeQuery = require('./sparql'); // Assuming sparql.js is in the same directory

const cors = require('cors'); 

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json());

app.post('/submitSymptoms', async (req, res) => {
    console.log(req.body);
    const sparqlResult = await executeQuery();
        console.log('Output from sparql.js:', sparqlResult);
 ; // Call a function from another script
    // exec('python3 app.py', (error, stdout, stderr) => {
    //     console.log('Python script output:', stdout);
    //     if (error) {
    //         console.error(`Error executing Python script: ${error}`);
    //         return res.status(500).send('Internal Server Error');
    //     } else {
    //         console.log("no error");
    //     }
    // });
    res.json({ message: 'Symptoms submitted successfully.' });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
