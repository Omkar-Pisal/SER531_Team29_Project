// script.js

function addSymptom() {
    const symptomsContainer = document.getElementById('symptoms-container');

    // Check if the maximum number of selections is reached
    if (symptomsContainer.childElementCount >= 4) {
        alert('You can select up to four options.');
        return;
    }

    const newSymptomInput = document.createElement('div');
    newSymptomInput.classList.add('symptom-input', 'padding-top');

    newSymptomInput.innerHTML = `
    <label for="symptom">Select Symptom:*</label>
    <div id="symptoms-container">
        <div class="symptom-input">
            <select name="symptom" class="symptom margin-bottom" required>
                <option value="Exposure to Air Pollution">Exposure to Air Pollution</option>
                <option value="Passive Smoking">Passive Smoking</option>
                <option value="Active Smoking">Active Smoking</option>
                <option value="Alcohol Consumption">Alcohol Consumption</option>
                <option value="Blood Coughing">Blood Coughing</option>
                <option value="Cardio Disease">Cardio Disease</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Renal Chronic">Renal Chronic</option>
                <option value="Pregnancy">Pregnancy</option>
            </select>
            <button type="button" onclick="addSymptom()">+</button>
        </div> 
    </div>
    `;

    symptomsContainer.appendChild(newSymptomInput);
}

function submitSymptoms() {
    const ageInput = document.querySelector('.age');
    const age = ageInput ? ageInput.value : null;

    // Validate age
    if (age < 1 || age > 110) {
        alert('Please enter a valid age between 1 and 110.');
        return;
    }

    const sexSelect = document.querySelector('.sex');
    const sex = sexSelect ? sexSelect.value : null;

    const symptomSelects = document.querySelectorAll('.symptom');
    const symptoms = Array.from(symptomSelects).map(select => select.value);

    const bloodGlucoseInput = document.querySelector('[name="bloodGlucose"]');
    const bloodGlucose = bloodGlucoseInput ? bloodGlucoseInput.value : null;

    const bloodSodiumInput = document.querySelector('[name="bloodSodium"]');
    const bloodSodium = bloodSodiumInput ? bloodSodiumInput.value : null;

    const bloodPotassiumInput = document.querySelector('[name="bloodPotassium"]');
    const bloodPotassium = bloodPotassiumInput ? bloodPotassiumInput.value : null;

    const bloodUreaInput = document.querySelector('[name="bloodUrea"]');
    const bloodUrea = bloodUreaInput ? bloodUreaInput.value : null;

    const systolicPressureInput = document.querySelector('[name="systolicPressure"]');
    const systolicPressure = systolicPressureInput ? systolicPressureInput.value : null;

    const diastolicPressureInput = document.querySelector('[name="diastolicPressure"]');
    const diastolicPressure = diastolicPressureInput ? diastolicPressureInput.value : null;

    // Check for mandatory fields
    if (!sex || !symptoms) {
        alert('Mandatory fields cannot be empty');
        return;
    }

    // Check for duplicate selections
    if (hasDuplicates(symptoms)) {
        alert('Please select each option only once.');
        return;
    }

    // Sending data to the backend
    fetch('http://localhost:3000/submitSymptoms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ age, sex, symptoms, bloodGlucose, bloodSodium, bloodPotassium, bloodUrea, systolicPressure, diastolicPressure }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server
        console.log(data);

        // Check if the data has a message
        if (data.message) {
            // Save the data to localStorage for access in the new page
            localStorage.setItem('resultData', JSON.stringify(data));
            
            // Redirect to the new HTML file
            window.location.href = 'result.html';
        }
    })
    .catch(error => {
        console.error('Error submitting symptoms:', error);
    });
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}
