const axios = require('axios');




const executeQuery = async (query, userData) => {
  let diseaseInfo
  let dataInfo
  let graphResult
  let localQuery = ``
if (userData.bloodPotassium || userData.bloodUrea || userData.bloodSodium) {
    subquery = `PREFIX disease: <http://www.semanticweb.org/diseaseAnalyser#>
    SELECT ?patient
    WHERE {`

    if (userData.symptoms.includes('Hypertension')) {
        subquery += `
          ?patient disease:hasContributingDisease ?cd .
          ?cd disease:Hypertension "Hypertension" .`;
}
localQuery = `${subquery}
                       ?patient disease:hasAge ${userData.ageForCalculation}; 
                        disease:hasDisease ?disease;
                       disease:hasBloodMineralLevels ?bloodMineral .`;
    
    if (userData.bloodSodium) {
      localQuery += `
                       ?bloodMineral disease:hasSodiumValue ?sodiumValue .`;
    }
    
    if (userData.bloodUrea) {
      localQuery += `
                       ?bloodMineral disease:hasUreaValue ?ureaValue .`;
    }
    
    if (userData.bloodPotassium) {
      localQuery += `
                       ?bloodMineral disease:hasPotassiumValue ?potassiumValue .`;
    }
    
    if (userData.bloodPotassium || userData.bloodUrea || userData.bloodSodium) {
      localQuery += `
                       FILTER(`;
    }
    
    if (userData.bloodSodium) {
      localQuery += `xsd:float(?sodiumValue) >= ${userData.bloodSodium}`;
    }
    
    if (userData.bloodUrea) {
      if (userData.bloodSodium) {
        localQuery += ' && ';
      }
      localQuery += `xsd:float(?ureaValue) >= ${(userData.bloodUrea)}`;
    }
    
    if (userData.bloodPotassium) {
      if (userData.bloodSodium || userData.bloodUrea) {
        localQuery += ' && ';
      }
      localQuery += `xsd:float(?potassiumValue) >= ${(userData.bloodPotassium)}`;
    }
  
    localQuery += `)
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
    localQuery = `${subquery}
          ?patient disease:hasDisease ?disease;
          disease:hasAge ${userData.ageForCalculation} ;
          disease:hasGender ${userData.sex}`;

    if (userData.symptoms.includes('Active Smoking')) {
      localQuery += ` ;
          disease:doesSmoking disease:ActiveSmoking`;
    }
    if (userData.symptoms.includes('Passive Smoking')) {
      localQuery += ` ;
          disease:doesSmoking disease:PassiveSmoking`;
    }
    if (userData.symptoms.includes('Alcohol Consumption')) {
      localQuery += ` ;
          disease:consumesHarmfulSubstance disease:Alcohol`;
    }
    if (userData.symptoms.includes('Blood Coughing')) {
      localQuery += ` ;
          disease:hasCoughing disease:BloodCoughing`;
    }
    if (userData.symptoms.includes('Pregnancy')) {
      localQuery += ` ;
          disease:hasPregnancy disease:Pregnant`;
    }
    if (userData.symptoms.includes('Air Pollution')) {
      localQuery += ` ;
          disease:hasPollutionExposure disease:AirPollution`;
    }
    localQuery += ` .
        }`;
}
  query = query || localQuery;
  const stardogEndpoint = 'https://sd-17877f73.stardog.cloud:5820';  
  const dbName = 'ontology';  
  const username = 'ymahesh3@asu.edu';  
  const password = '1234567891011';  
  try {
    const response = await axios.post(`${stardogEndpoint}/${dbName}/query`, `query=${encodeURIComponent(query)}`, {
      auth: {
        username: username,
        password: password,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Changed to x-www-form-urlencoded
        'Accept': 'application/sparql-results+json',
      },
    });

    console.log(localQuery)
    const resultResponse = await axios.post(`${stardogEndpoint}/${dbName}/query`, `query=${encodeURIComponent(localQuery)}`, {
      auth: {
        username: username,
        password: password,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Changed to x-www-form-urlencoded
        'Accept': 'application/sparql-results+json',
      },
    });
    dataInfo = filterUniqueObjects(response.data.results.bindings, 'disease');
    
    graphResult =  categorizeEntries(resultResponse.data.results.bindings);
    const uniqueValues = Array.from(new Set(dataInfo.map(item => {
      // Split the value by '#' and return the part after '#'
      return item.disease?.value.split('#')[1];
    })));
    
    if(uniqueValues.length){
      for(data of uniqueValues){
        let query
        query = `PREFIX disease: <http://www.semanticweb.org/diseaseAnalyser#>


        SELECT ?summary ?informationLink
        WHERE {
         disease:${data} disease:hasDiseaseSummary ?summary ;
                         disease:hasInformationLink ?informationLink .
        }
        `
        const response = await axios.post(`${stardogEndpoint}/${dbName}/query`, `query=${encodeURIComponent(query)}`, {
          auth: {
            username: username,
            password: password,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Changed to x-www-form-urlencoded
            'Accept': 'application/sparql-results+json',
          },
        });
        // Make sure categorizeEntries is defined and can handle the response format
        
        
        diseaseInfo = filterUniqueObjects(response.data.results.bindings, 'disease');
      }
      
    }
    return {graphResult, uniqueValues,dataInfo, diseaseInfo};
  } catch (error) {
    // Improved error handling for better clarity on the error source
    console.error('Error executing SPARQL query:', error.response ? error.response.data : error.message);
  }
};
function filterUniqueObjects(array, key) {
  return array.filter((obj, index, self) =>
    index === self.findIndex((o) => o[key]?.value === obj[key]?.value)
  );
}





function categorizeEntries(dataArray) {
  const categorizedData = {};

  dataArray.forEach((entry) => {
    if (entry.patient && entry?.patient?.value) {
      const match = entry.patient.value.match(/#(\w+)_\d+/);
      
      if (match) {
        const type = match[1];
        const groupKey = `${type}_group`; 

        if (!categorizedData[groupKey]) {
          categorizedData[groupKey] = 1;
        } else {
          categorizedData[groupKey]++;
        }
      }
    }
  });

  const resultArray = Object.entries(categorizedData).map(([key, value]) => ({
    name: `#${key}`,
    value,
  }));

  return resultArray;
}

module.exports = executeQuery;