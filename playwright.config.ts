import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  
  // Custom reporter configuration for organized results
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    ['line']
  ],

  use: {
    baseURL: 'https://katalon-demo-cura.herokuapp.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Custom test ID for organized results
    testIdAttribute: 'data-testid',
  },

  // Configure output directories for different test types
  outputDir: 'test-results/',

  projects: [
    {
      name: 'ai-workflows',
      testDir: './tests/e2e/ai-case-processing',
      outputDir: 'test-results/ai-workflows',
      use: { 
        ...devices['Desktop Chrome'],
        // Custom metadata for AI tests
        metadata: {
          category: 'ai-workflows',
          priority: 'high'
        }
      },
    },
    {
      name: 'patient-registration', 
      testDir: './tests/e2e/medical',
      outputDir: 'test-results/patient-registration',
      use: { 
        ...devices['Desktop Chrome'],
        metadata: {
          category: 'patient-registration',
          priority: 'high'
        }
      },
    },
    {
      name: 'multilingual',
      testDir: './tests/e2e/multilingual',
      outputDir: 'test-results/multilingual',
      use: { 
        ...devices['Desktop Chrome'],
        metadata: {
          category: 'multilingual',
          priority: 'medium'
        }
      },
    },
    {
      name: 'security',
      testMatch: '**/*.security.test.ts',
      outputDir: 'test-results/security',
      use: { 
        ...devices['Desktop Chrome'],
        metadata: {
          category: 'security',
          priority: 'critical'
        }
      },
    }
  ],
});