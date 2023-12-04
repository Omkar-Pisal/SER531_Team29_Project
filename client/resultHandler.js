document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from localStorage
    const resultData = localStorage.getItem('data');
    let objectData;
    if (resultData) {
        try {
            objectData = JSON.parse(resultData);
            console.log(objectData, typeof(objectData));
        } catch (error) {
            console.error("Error parsing JSON from localStorage:", error);
            return;
        }
    } else {
        console.log("No data found in localStorage.");
        return;
    }

    // Handle diseaseInfo data
    const diseaseInfo = objectData.diseaseInfo;
    if (Array.isArray(diseaseInfo)) {
        const resultContainer = document.getElementById('result-container');

        diseaseInfo.forEach(info => {
            const diseaseDiv = document.createElement('div');
            diseaseDiv.classList.add('disease-info');

            // Create link element
            const linkElement = document.createElement('a');
            linkElement.href = info.informationLink.value; // URL from informationLink.value
            linkElement.textContent = 'Learn More';
            linkElement.target = '_blank';
            diseaseDiv.appendChild(linkElement);

            // Create summary element
            const summaryElement = document.createElement('p');
            summaryElement.textContent = info.summary.value; // Summary text from summary.value
            diseaseDiv.appendChild(summaryElement);

            resultContainer.appendChild(diseaseDiv);
        });
    }

    // Handle graphResult data for the bar chart
    let newData = objectData?.graphResult;
    if (Array.isArray(newData) && newData.length > 0) {
        const ctx = document.getElementById('barChart').getContext('2d');
        document.getElementById('image1').style.display = 'none';
        document.getElementById('image2').style.display = 'none';
        document.getElementById('image3').style.display = 'none';
        document.getElementById('image4').style.display = 'none';

        // Create bar chart
        const barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: newData.map(entry => entry.name),
                datasets: [{
                    label: 'Number of Patients',
                    data: newData.map(entry => entry.value),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            }
        });
    }
    else{
        const canvasElement = document.getElementById('barChart');
        if (canvasElement) {
            canvasElement.style.display = 'block';
        }
    }
    // Return button event listener
    const returnButton = document.getElementById('returnButton');
    returnButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
