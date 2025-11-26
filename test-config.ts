// Global test configuration
export const TestConfig = {
  // Application URLs
   baseURL: process.env.MEDICAL_APP_URL || 'https://katalon-demo-cura.herokuapp.com',
  
  // Enhanced Timeouts for AI Processing
  timeout: 120000,
  navigationTimeout: 30000,
  elementTimeout: 15000,
  aiProcessingTimeout: 60000,
  
  // Test Data
  credentials: {
    valid: {
      username: 'John Doe',
      password: 'ThisIsNotAPassword'
    },
    invalid: {
      username: 'invalid_user',
      password: 'wrong_password'
    },
    empty: {
      username: '',
      password: ''
    }
  },
  
  // Medical Facilities
  facilities: [
    'Hongkong CURA Healthcare Center',
    'Seoul CURA Healthcare Center', 
    'Tokyo CURA Healthcare Center'
  ],
  
  // Healthcare Programs
  programs: ['Medicare', 'Medicaid', 'None'],
  
  // Test Environments
  environments: {
    staging: 'https://katalon-demo-cura.herokuapp.com',
    production: 'https://katalon-demo-cura.herokuapp.com'
  },
  
  // Screenshot paths
  screenshotPaths: {
    aiWorkflow: 'test-results/ai-workflows',
    patientRegistration: 'test-results/patient-registration',
    multilingual: 'test-results/multilingual',
    security: 'test-results/security'
  }
};