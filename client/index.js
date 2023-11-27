function submitSymptoms() {
    const symptomsInput = document.getElementById('symptoms').value;
    
    // Sending data to the backend
    fetch('http://localhost:3000/submitSymptoms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: symptomsInput }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}
