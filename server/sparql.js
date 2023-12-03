const axios = require('axios');

const query = `
PREFIX disease: <http://www.semanticweb.org/diseaseAnalyser#>

SELECT ?patient
WHERE {
  ?patient disease:hasDisease disease:Covid19;
           disease:doesSmoking disease:ActiveSmoking;
           disease:hasPregnancy disease:NotPossible.
}
`;


const executeQuery = async()=>{
    axios.post('https://sd-17877f73.stardog.cloud:5820/', query, {
  headers: {
    'Content-Type': 'application/sparql-query',
    'Authorization': 'Basic' + Buffer.from('ymahesh3@asu.edu:Yash@project531').toString('base64'),
  },
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
}

module.exports = executeQuery;
