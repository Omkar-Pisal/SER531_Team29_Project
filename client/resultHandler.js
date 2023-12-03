// resultHandler.js

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the data from localStorage
    const resultData = localStorage.getItem('resultData');
    
    if (resultData) {
        // Parse the JSON data
        const data = JSON.parse(resultData);
        
        // Display the message in the result-container
        const resultContainer = document.getElementById('result-container');
        console.log(resultContainer)
        resultContainer.innerHTML = `<p>${data.message}</p>`;
        
        // Clear the localStorage
        localStorage.removeItem('resultData');
    }
});
