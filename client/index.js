function addSymptom() {
    const symptomsContainer = document.getElementById('symptoms-container');
    
    const newSymptomInput = document.createElement('div');
    newSymptomInput.classList.add('symptom-input');
    
    newSymptomInput.innerHTML = `
        <label for="symptom">Enter Symptom:</label>
        <input type="text" name="symptom" class="symptom">
        <button onclick="addSymptom()">+</button>
    `;
    
    symptomsContainer.appendChild(newSymptomInput);
}

function submitSymptoms() {
    const symptomInputs = document.querySelectorAll('.symptom');
    const symptoms = Array.from(symptomInputs).map(input => input.value);
    
    // Sending data to the backend
    fetch('http://localhost:3000/submitSymptoms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}
