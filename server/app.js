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
    const userData = req.body
    let query = ``
    if (userData.bloodPotassium || userData.bloodUrea || userData.bloodSodium) {
        subquery = `PREFIX disease: <http://www.semanticweb.org/diseaseAnalyser#>
        SELECT ?disease
        WHERE {`

        if (userData.symptoms.includes('Hypertension')) {
            subquery += `
              ?patient disease:hasContributingDisease ?cd .
              ?cd disease:Hypertension "Hypertension" .`;
}
        query = `${subquery}
                           ?patient disease:hasAge ${userData.ageForCalculation}; 
                            disease:hasDisease ?disease;
                           disease:hasBloodMineralLevels ?bloodMineral .`;
        
        if (userData.bloodSodium) {
          query += `
                           ?bloodMineral disease:hasSodiumValue ?sodiumValue .`;
        }
        
        if (userData.bloodUrea) {
          query += `
                           ?bloodMineral disease:hasUreaValue ?ureaValue .`;
        }
        
        if (userData.bloodPotassium) {
          query += `
                           ?bloodMineral disease:hasPotassiumValue ?potassiumValue .`;
        }
        
        if (userData.bloodPotassium || userData.bloodUrea || userData.bloodSodium) {
          query += `
                           FILTER(`;
        }
        
        if (userData.bloodSodium) {
          query += `xsd:float(?sodiumValue) >= ${userData.bloodSodium}`;
        }
        
        if (userData.bloodUrea) {
          if (userData.bloodSodium) {
            query += ' && ';
          }
          query += `xsd:float(?ureaValue) >= ${(userData.bloodUrea)}`;
        }
        
        if (userData.bloodPotassium) {
          if (userData.bloodSodium || userData.bloodUrea) {
            query += ' && ';
          }
          query += `xsd:float(?potassiumValue) >= ${(userData.bloodPotassium)}`;
        }
      
        query += `)
                         }`;
      } else {
        subquery = `PREFIX disease: <http://www.semanticweb.org/diseaseAnalyser#>
        SELECT ?disease
        WHERE {`
        if (userData.systolicPressure) {
            subquery += `
              ?patient disease:hasBloodPressureLEvel ?bp .
              ?bp disease:hasSystolicPressure ${userData.systolicPressure} .`;
        }
        if (userData.diastolicPressure) {
            subquery += `
              ?patient disease:hasBloodPressureLEvel ?bp .
              ?bp disease:hasDiastolicPressure ${userData.diastolicPressure} .`;
        }
        if (userData.symptoms.includes('Cardio Disease')) {
            subquery += `
              ?patient disease:hasContributingDisease ?cd .
              ?cd disease:Cardiovascular "Cardiovascular" .`;
        }
        if (userData.symptoms.includes('Pneumonia')) {
            subquery += `
              ?patient disease:hasContributingDisease ?cd .
              ?cd disease:Pneumonia "Pneumonia" .`;
        }
        if (userData.symptoms.includes('Hypertension')) {
            subquery += `
              ?patient disease:hasContributingDisease ?cd .
              ?cd disease:Hypertension "Hypertension" .`;
        }
        if (userData.symptoms.includes('Renal Chronic')) {
            subquery += `
              ?patient disease:hasContributingDisease ?cd .
              ?cd disease:RenalChronic "RenalChronic" .`;
        }
        query = `${subquery}
              ?patient disease:hasDisease ?disease;
              disease:hasAge ${userData.ageForCalculation} ;
              disease:hasGender ${userData.sex}`;
    
        if (userData.symptoms.includes('Active Smoking')) {
            query += ` ;
              disease:doesSmoking disease:ActiveSmoking`;
        }
        if (userData.symptoms.includes('Passive Smoking')) {
            query += ` ;
              disease:doesSmoking disease:PassiveSmoking`;
        }
        if (userData.symptoms.includes('Alcohol Consumption')) {
            query += ` ;
              disease:consumesHarmfulSubstance disease:Alcohol`;
        }
        if (userData.symptoms.includes('Blood Coughing')) {
            query += ` ;
              disease:hasCoughing disease:BloodCoughing`;
        }
        if (userData.symptoms.includes('Pregnancy')) {
            query += ` ;
              disease:hasPregnancy disease:Pregnant`;
        }
        if (userData.symptoms.includes('Air Pollution')) {
            query += ` ;
              disease:hasPollutionExposure disease:AirPollution`;
        }
        query += ` .
            }`;
    }
    
      
 
    
    const sparqlResult = await executeQuery(query, userData);

    res.json({ message: 'Symptoms submitted successfully.', data:sparqlResult  });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
