const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to enable cross-origin requests and JSON parsing
app.use(cors());
app.use(bodyParser.json());  // Middleware to parse JSON bodies

// Mock patient data (same as before)

const patients = {
  "12345": {
    name: "Akash Roy",
    age: 35,
    gender: "Male",
    medical_history: ["Hypertension", "Diabetes"],
    hospital_admission_history: "None",
    last_lab_results: {
      blood_pressure: "120/80",
      sugar_level: "120",
      cholesterol: "180"
    }
  },
  "22345": {
    name: "Prapti Mukherjee",
    age: 25,
    gender: "Female",
    medical_history: ["Dengue", "Typhoid"],
    hospital_admission_history: "Once",
    last_lab_results: {
      blood_pressure: "110/70",
      sugar_level: "70",
      cholesterol: "160"
    }
  },
  "33345": {
    name: "Sneha Dey",
    age: 18,
    gender: "Female", 
    medical_history: ["Pneumonia", "Diabetes", "Migraine"],
    hospital_admission_history: "Twice",
    last_lab_results: {
      blood_pressure: "100/80",
      sugar_level: "110",
      cholesterol: "180"
    }
  },
  "44445": {
    name: "Priyam Dutta",
    age: 50,
    gender: "Male",
    medical_history: ["Hypertension", "Jaundice"],
    hospital_admission_history: "Thrice",
    last_lab_results: {
      blood_pressure: "120/80",
      sugar_level: "73",
      cholesterol: "185"
    }
  },
  "55555": {
    name: ["Shadaf Anjum"],
    age: 30,
    gender: "Female",
    medical_history: ["Diptheria"],
    hospital_admission_history: "Fifth",
    last_lab_results: {
      blood_pressure: "112/78",
      sugar_level: "90",
      cholesterol: "168"
    }
  },
  "67891": {
    name: "Arya Das",
    age: 20,
    gender: "Male",
    medical_history: ["Malaria", "Common Cold"],
    hospital_admission_history: "Twice",
    last_lab_results: {
      blood_pressure: "120/80",
      sugar_level: "90",
      cholesterol: "180"
    }
  },
  "66789": {
    name: "Rahul Das ",
    age: 55,
    gender: "Male",
    medical_history: ["Liver Cancer"],
    hospital_admission_history: "Once",
    last_lab_results: {
      blood_pressure: "130/90",
      sugar_level: "120",
      cholesterol: "168"
    }
  },
  "77789": {
    name: "Shreyanka Sahoo",
    age: 25,
    gender: "Female",
    medical_history: ["Ascarisis"],
    hospital_admission_history: "Twice",
    last_lab_results: {
      blood_pressure: "123/80",
      sugar_level: "90",
      cholesterol: "180"
    }
  },
  "88889": {
    name: "Arghadip Mishra",
    age: 85,
    gender: "Male",
    medical_history: ["Diabetes", "Cholera", "Dengue Fever", "Liver Infection"],
    hospital_admission_history: "Thrice",
    last_lab_results: {
      blood_pressure: "117/80",
      sugar_level: "124",
      cholesterol: "180"
    }
  },
  "99999": {
    name: "Poonam Banerjee",
    age: 40,
    gender: "Female",
    medical_history: ["AIDS", "Hypertension"],
    hospital_admission_history: "Once",
    last_lab_results: {
      blood_pressure: "119/90",
      sugar_level: "90",
      cholesterol: "180"
    }
  }

  // Add other patient data here...
};

// Endpoint to fetch patient details
app.get('/api/patient/:abhaId', (req, res) => {
  const { abhaId } = req.params;
  console.log(`Received request for ABHA ID: ${abhaId}`); // Log the ABHA ID
  const patient = patients[abhaId];
  if (patient) {
    console.log("Returning patient data:", patient); // Log the patient data being sent
    res.json(patient);
  } else {
    console.log("Patient not found for ABHA ID:", abhaId); // Log if patient not found
    res.status(404).send("Patient not found");
  }
});

// Step 1: Define symptom severity weights
const severityWeights = {
  Emergency: 5,
  Moderate: 3,
  Mild: 1
};

// Lists of symptoms (same as before)
const emergencySymptoms = ["Chest Pain", "Severe Headache", "Severe Bleeding", "Shortness of Breath", "Unconscious", 
                           "Stroke Symptoms", "Seizures", "Severe Allergic Reactions", "Poisoning", "Severe Abdominal Pain", 
                           "Traumatic Injuries","Chest pain", "Severe headache", "Severe bleeding", "Shortness of breath", "Unconscious", 
                           "Stroke symptoms", "Seizures", "Severe allergic reactions", "Poisoning", "Severe abdominal pain", 
                           "Traumatic injuries","chest pain", "severe headache", "severe bleeding", "shortness of breath", "unconscious", 
                           "stroke symptoms", "seizures", "severe allergic reactions", "poisoning", "severe abdominal pain", 
                           "traumatic injuries"];

const moderateSymptoms = ["Moderate Headache", "Persistent Cough", "Prolonged Fever", "Kidney Stones", "Moderate Asthma", 
                          "Severe Migraines", "Skin Infections", "Moderate Burns", "Moderate Allergic Reactions", "Fractures","Moderate headache", "Persistent cough", "Prolonged fever", "Kidney stones", "Moderate asthma", 
                          "Severe migraines", "Skin infections", "Moderate burns", "Moderate allergic reactions", "Fractures","moderate headache", "persistent cough", "prolonged fever", "kidney stones", "moderate asthma", 
                          "severe migraines", "skin infections", "moderate burns", "moderate allergic reactions", "fractures"];

const mildSymptoms = ["Fatigue", "Mild Cough", "Slight Fever", "Common Cold", "Minor Cuts and Bruises", "Mild Allergies", 
                      "Minor Burns", "Mild Asthma", "Digestive Issues", "Sprains and Strains", "Back Pain","Fatigue", "Mild cough", "Slight fever", "Common cold", "Minor cuts and bruises", "Mild allergies", 
                      "Minor burns", "Mild asthma", "Digestive issues", "Sprains and strains", "Back pain","fatigue", "mild cough", "slight fever", "common cold", "minor cuts and bruises", "mild allergies", 
                      "minor burns", "mild asthma", "digestive issues", "sprains and strains", "back pain"];

// Step 2: Priority Calculation Logic
function calculatePriority(symptoms) {
  let totalScore = 0;
  let emergencyFlag = false;

  // Check for emergency symptoms
  for (let symptom of symptoms) {
    if (emergencySymptoms.includes(symptom)) {
      totalScore += severityWeights.Emergency;
      emergencyFlag = true;
      break; // Once an emergency symptom is found, no need to check further
    }
  }

  if (emergencyFlag) return "Emergency";  // Emergency symptom found

  // Count moderate symptoms
  let moderateCount = 0;
  for (let symptom of symptoms) {
    if (moderateSymptoms.includes(symptom)) {
      moderateCount += 1;
      totalScore += severityWeights.Moderate;
    }
  }

  // Two or more moderate symptoms = Emergency priority
  if (moderateCount >= 2) return "Emergency";
  if (moderateCount === 1) return "Moderate";  // One moderate symptom

  // Count mild symptoms
  let mildCount = 0;
  for (let symptom of symptoms) {
    if (mildSymptoms.includes(symptom)) {
      mildCount += 1;
      totalScore += severityWeights.Mild;
    }
  }

  // Only mild symptoms = Mild priority
  if (mildCount > 0) return "Mild";

  // Default case if no symptoms match
  return "No Symptoms";
}

// Endpoint to handle priority calculation
app.post('/getPriority', (req, res) => {
  const symptoms = req.body.symptoms;
  console.log("Received symptoms:", symptoms); // Log the symptoms for debugging

  if (!Array.isArray(symptoms)) {
    return res.status(400).send("Symptom data must be an array.");
  }

  const priority = calculatePriority(symptoms);
  res.json({ priority });
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
