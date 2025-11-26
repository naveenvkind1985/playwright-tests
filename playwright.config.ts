import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // ENHANCED REPORTER CONFIGURATION
  reporter: [
    // HTML Reporter with enhanced options
    ['html', { 
      open: 'never', // Don't auto-open, use command instead
      outputFolder: 'playwright-report',
      // Enhanced HTML report features
      attachScreenshots: true,
      showSteps: true,
      // Include test source code in report
      printSteps: true,
      // Better organization
      outputFile: 'playwright-report/index.html'
    }],
    // JSON reporter for CI integration
    ['json', { 
      outputFile: 'test-results/test-results.json' 
    }],
    // JUnit reporter for test management systems
    ['junit', { 
      outputFile: 'test-results/test-results.xml',
      includeProjectInTestName: true 
    }],
    // Line reporter for console output
    ['line'],
    // List reporter for better test listing
    ['list']
  ],

  use: {
    // Enhanced tracing for better debugging
    trace: 'on-first-retry',
    // Always capture screenshots on failure
    screenshot: 'only-on-failure',
    // Capture video for failed tests
    video: 'retain-on-failure',
    
    // Context options for better debugging
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium-medical',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
  ],

  // Output directory for test artifacts
  outputDir: 'test-results/',

  // Timeout configuration
  timeout: 120000,
  expect: {
    timeout: 10000
  }
});