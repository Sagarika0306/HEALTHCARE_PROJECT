const BASE_URL = "http://localhost:3000"; // Your base URL for patient data API

// Function to fetch patient data using ABHA ID
async function fetchPatientData(abhaId) {
    try {
        document.getElementById('patient-data').innerHTML = '<p>Loading...</p>';
        const url = `${BASE_URL}/api/patient/${abhaId}`;
        console.log("Fetching data from URL:", url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Patient not found. Please check the ABHA ID.');

        const patient = await response.json();
        console.log("Fetched patient data:", patient);

        // Display patient details
        displayPatientDetails(patient);
    } catch (error) {
        console.error("Error fetching patient data:", error);
        document.getElementById('patient-data').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Function to display patient details
function displayPatientDetails(patient) {
    const labResults = patient.last_lab_results || {};
    document.getElementById('patient-data').innerHTML = `
        <h3>Patient Details</h3>
        <p><strong>Name:</strong> ${patient.name}</p>
        <p><strong>Age:</strong> ${patient.age}</p>
        <p><strong>Gender:</strong> ${patient.gender}</p>
        <p><strong>Hospital Admission History:</strong> 
           ${patient.hospital_admission_history !== undefined ? patient.hospital_admission_history : 'No data available'}</p>
        <p><strong>Medical History:</strong> ${patient.medical_history?.join(', ') || 'No history available'}</p>
        
        <h4>Last Lab Results:</h4>
        <ul>
            <li><strong>Blood Pressure:</strong> ${labResults.blood_pressure || 'Not available'}</li>
            <li><strong>Sugar Level:</strong> ${labResults.sugar_level || 'Not available'}</li>
            <li><strong>Cholesterol:</strong> ${labResults.cholesterol || 'Not available'}</li>
        </ul>
    `;
}

// Event listener for ABHA form submission
document.getElementById('abha-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const abhaId = document.getElementById('abha-id-input').value;
    fetchPatientData(abhaId);
});

// Speech Input Logic
const voiceInputButton = document.getElementById('voice-input');
const symptomsInput = document.getElementById('symptoms');
let isListening = false;

voiceInputButton.addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    isListening = true;
    recognition.start();

    recognition.onresult = function(event) {
        const voiceText = event.results[0][0].transcript;
        symptomsInput.value = voiceText;
        isListening = false;
        // Once voice input is captured, automatically analyze symptoms
        analyzeSymptoms(voiceText);
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        alert('Speech recognition error. Please try again.');
        isListening = false;
    };

    setTimeout(() => {
        if (isListening) {
            recognition.stop();
            alert('Speech recognition timed out. Please try again.');
            isListening = false;
        }
    }, 60000);  // Reduced timeout to 60 seconds for better usability
});

// Event listener for symptom form submission to check priority
document.getElementById('symptomForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get user input (comma separated list of symptoms)
    const symptoms = document.getElementById('symptoms').value.split(',').map(symptom => symptom.trim());

    // Make an HTTP request to the server to process the symptoms and calculate priority
    fetch('/getPriority', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symptoms: symptoms })
    })
    .then(response => response.json())
    .then(data => {
        // Display the priority result on the page
        document.getElementById('priorityResult').textContent = data.priority;
    })
    .catch(error => console.error('Error:', error));
});

// Analyze Symptoms function (This needs to be defined or replaced by your symptom analysis logic)
function analyzeSymptoms(symptoms) {
    // Dummy function for symptom analysis
    console.log("Analyzing symptoms:", symptoms);
    // Add your analysis logic here
    // For now, just simulate a priority calculation
    const priority = "High Priority"; // This is just a placeholder
    document.getElementById('priorityResult').textContent = priority;
}
