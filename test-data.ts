// Comprehensive test data for all scenarios
export const TestData = {
  // Patient Information
  patients: {
    adult: {
      name: 'John Smith',
      age: 45,
      conditions: ['Hypertension', 'Diabetes Type 2'],
      medications: ['Lisinopril 10mg', 'Metformin 500mg']
    },
    pediatric: {
      name: 'Emma Johnson',
      age: 8,
      conditions: ['Asthma', 'Allergies'],
      medications: ['Albuterol Inhaler']
    },
    geriatric: {
      name: 'Robert Brown',
      age: 72,
      conditions: ['Arthritis', 'Hypertension', 'High Cholesterol'],
      medications: ['Atorvastatin 20mg', 'Lisinopril 10mg']
    }
  },
  
  // Medical Scenarios
  medicalScenarios: {
    routine: {
      type: 'Routine Checkup',
      urgency: 'Scheduled',
      description: 'Annual physical examination and health assessment',
      tests: ['Blood Pressure', 'Blood Tests', 'Physical Exam']
    },
    chronic: {
      type: 'Chronic Condition Management',
      urgency: 'Follow-up',
      description: 'Management of ongoing chronic health conditions',
      tests: ['Blood Work', 'Medication Review', 'Symptom Assessment']
    },
    emergency: {
      type: 'Emergency Care',
      urgency: 'Urgent',
      description: 'Immediate medical attention required',
      tests: ['Vital Signs', 'ECG', 'Emergency Blood Work']
    },
    preventive: {
      type: 'Preventive Care',
      urgency: 'Routine',
      description: 'Preventive screenings and health maintenance',
      tests: ['Cancer Screening', 'Vaccinations', 'Health Counseling']
    }
  },
  
  // AI Medical Analysis Templates
  aiAnalysisTemplates: {
    comprehensive: `AI MEDICAL ANALYSIS REPORT
===========================
PATIENT ASSESSMENT:
- Overall Health Status: {status}
- Risk Factors Identified: {risks}
- Recommended Screenings: {screenings}

TREATMENT RECOMMENDATIONS:
- Immediate Actions: {immediate}
- Long-term Management: {longTerm}
- Specialist Referrals: {referrals}

FOLLOW-UP PLAN:
- Next Appointment: {nextAppointment}
- Monitoring Requirements: {monitoring}
- Patient Education: {education}

AI CONFIDENCE SCORE: {confidence}%`,
    
    emergency: `EMERGENCY AI ASSESSMENT
=======================
CRITICAL FINDINGS:
- Primary Concern: {concern}
- Vital Signs: {vitals}
- Risk Level: {riskLevel}

IMMEDIATE ACTIONS REQUIRED:
- {action1}
- {action2}
- {action3}

URGENCY: {urgency}
CONFIDENCE: {confidence}%`,
    
    chronic: `CHRONIC CONDITION AI MANAGEMENT
===============================
CONDITION OVERVIEW:
- Primary Condition: {condition}
- Severity: {severity}
- Stability: {stability}

MANAGEMENT RECOMMENDATIONS:
- Medication Adjustments: {meds}
- Lifestyle Modifications: {lifestyle}
- Monitoring Parameters: {monitoring}

FOLLOW-UP: {followup}
CONFIDENCE: {confidence}%`
  },
  
  // Multilingual Medical Terms
  multilingualTerms: {
    english: {
      common: ['Appointment', 'Medical', 'Health', 'Care', 'Patient', 'Doctor', 'Hospital'],
      forms: ['Login', 'Username', 'Password', 'Submit', 'Book', 'Date'],
      clinical: ['Treatment', 'Diagnosis', 'Prescription', 'Symptoms', 'Examination']
    },
    spanish: {
      common: ['Cita', 'Médico', 'Salud', 'Cuidado', 'Paciente', 'Doctor', 'Hospital'],
      forms: ['Iniciar Sesión', 'Usuario', 'Contraseña', 'Enviar', 'Reservar', 'Fecha'],
      clinical: ['Tratamiento', 'Diagnóstico', 'Receta', 'Síntomas', 'Examen']
    },
    french: {
      common: ['Rendez-vous', 'Médical', 'Santé', 'Soins', 'Patient', 'Docteur', 'Hôpital'],
      forms: ['Connexion', 'Nom d\'utilisateur', 'Mot de passe', 'Soumettre', 'Réserver', 'Date'],
      clinical: ['Traitement', 'Diagnostic', 'Ordonnance', 'Symptômes', 'Examen']
    }
  },
  
  // Security Test Scenarios
  securityTests: {
    sqlInjection: [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM passwords --"
    ],
    xssAttempts: [
      "<script>alert('xss')</script>",
      "<img src=x onerror=alert('xss')>",
      "javascript:alert('xss')"
    ],
    pathTraversal: [
      "../../../etc/passwd",
      "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts"
    ]
  },
  
  // Error Scenarios
  errorScenarios: {
    invalidDates: [
      '2020-01-01', // Past date
      'invalid-date',
      '2025-02-30', // Invalid day
      '13/13/2023'  // Invalid format
    ],
    longInputs: [
      'A'.repeat(1000),
      'Test with special chars!@#$%^&*()',
      'Multi\nline\ninput\nwith\nmany\nlines',
      '   Leading and trailing spaces   '
    ],
    boundaryValues: [
      '', // Empty
      ' ', // Space only
      'a', // Single character
      'VeryLongNameThatExceedsTypicalFieldLimitsByHavingLotsOfCharactersInIt'
    ]
  }
};