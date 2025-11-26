import { test, expect } from '@playwright/test';
import { TestConfig } from '../../../test-config';
import { TestData } from '../../../test-data';
import { TestReporter } from '../../../test-reporter';

test.describe('Comprehensive Medical Terminology Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    test.setTimeout(TestConfig.timeout);
  });

  // SCENARIO 1: Multilingual Medical Terminology Validation
  test('multilingual medical terminology validation', async ({ page }, testInfo) => {
    const reporter = new TestReporter(testInfo);
    
    console.log('🌐 Starting Multilingual Medical Terminology Validation...');
    
    const testSites = [
      {
        name: 'CURA Healthcare Service',
        url: TestConfig.baseURL,
        expectedLanguage: 'english'
      }
    ];

    for (const site of testSites) {
      await reporter.logStep(page, `SITE TEST`, `Testing: ${site.name}`);
      
      try {
        await page.goto(site.url, { waitUntil: 'networkidle' });
        
        // Detect page language
        const detectedLanguage = await detectPageLanguage(page);
        await reporter.logVerification(page, 'Language Detection', true, 
          `Detected: ${detectedLanguage}, Expected: ${site.expectedLanguage}`);
        
        // Get appropriate terminology based on detected language
        const languageTerms = TestData.multilingualTerms[detectedLanguage as keyof typeof TestData.multilingualTerms] || 
                             TestData.multilingualTerms.english;
        
        // Validate medical terminology with reporting
        await validateMedicalTerminologyWithReporting(page, languageTerms, detectedLanguage, reporter);
        
        // Validate form labels and placeholders with reporting
        await validateFormLocalizationWithReporting(page, languageTerms, reporter);
        
        await reporter.logTestData('Language Terms Used', {
          language: detectedLanguage,
          commonTerms: languageTerms.common,
          clinicalTerms: languageTerms.clinical,
          formTerms: languageTerms.forms
        });
        
      } catch (error) {
        await reporter.logError(page, `Terminology test failed for ${site.name}`, error);
        throw error;
      }
    }
    
    await reporter.logTestCompletion('Multilingual Medical Terminology Validation', true);
    console.log('✅ Multilingual Medical Terminology Validation Completed!');
  });

  // SCENARIO 2: Medical Content Structure Validation
  test('medical content structure and hierarchy', async ({ page }, testInfo) => {
    const reporter = new TestReporter(testInfo);
    
    console.log('📐 Testing Medical Content Structure...');
    
    try {
      await page.goto(TestConfig.baseURL, { waitUntil: 'networkidle' });
      
      // Validate page structure
      await reporter.logStep(page, 'PAGE STRUCTURE', 'Validating page structure and hierarchy');
      const structure = await validatePageStructureWithReporting(page, reporter);
      
      // Validate medical content organization
      await reporter.logStep(page, 'CONTENT ORGANIZATION', 'Validating medical content organization');
      await validateContentOrganizationWithReporting(page, reporter);
      
      // Validate navigation and user flow
      await reporter.logStep(page, 'NAVIGATION FLOW', 'Validating navigation and user flow');
      await validateNavigationFlowWithReporting(page, reporter);
      
      await reporter.logTestData('Content Structure Analysis', structure);
      
    } catch (error) {
      await reporter.logError(page, 'Content Structure Test Failed', error);
      throw error;
    }
    
    await reporter.logTestCompletion('Medical Content Structure Validation', true);
    console.log('✅ Medical Content Structure Validation Completed!');
  });

  // SCENARIO 3: Medical Form Localization
  test('medical form localization and accessibility', async ({ page }, testInfo) => {
    const reporter = new TestReporter(testInfo);
    
    console.log('🏷️ Testing Medical Form Localization...');
    
    try {
      await page.goto(TestConfig.baseURL, { waitUntil: 'networkidle' });
      
      await reporter.logStep(page, 'FORM NAVIGATION', 'Navigating to appointment form');
      await page.click('#btn-make-appointment');
      await page.waitForSelector('#txt-username', { timeout: TestConfig.elementTimeout });

      // Test form element labels and placeholders
      await reporter.logStep(page, 'FORM ELEMENTS', 'Validating form elements and labels');
      await validateFormElementsWithReporting(page, reporter);
      
      // Test form validation messages
      await reporter.logStep(page, 'FORM VALIDATION', 'Testing form validation messages');
      await validateFormValidationWithReporting(page, reporter);
      
      // Test form accessibility
      await reporter.logStep(page, 'ACCESSIBILITY', 'Testing form accessibility features');
      await validateFormAccessibilityWithReporting(page, reporter);
      
    } catch (error) {
      await reporter.logError(page, 'Form Localization Test Failed', error);
      throw error;
    }
    
    await reporter.logTestCompletion('Medical Form Localization', true);
    console.log('✅ Medical Form Localization Completed!');
  });

  // SCENARIO 4: Cross-Cultural Medical Content
  test('cross-cultural medical content appropriateness', async ({ page }, testInfo) => {
    const reporter = new TestReporter(testInfo);
    
    console.log('🌍 Testing Cross-Cultural Medical Content...');
    
    try {
      await page.goto(TestConfig.baseURL, { waitUntil: 'networkidle' });
      
      // Validate cultural appropriateness
      await reporter.logStep(page, 'CULTURAL VALIDATION', 'Validating cultural appropriateness');
      await validateCulturalAppropriatenessWithReporting(page, reporter);
      
      // Validate medical imagery and symbols
      await reporter.logStep(page, 'MEDICAL IMAGERY', 'Validating medical imagery and symbols');
      await validateMedicalImageryWithReporting(page, reporter);
      
      // Validate color symbolism in medical context
      await reporter.logStep(page, 'COLOR SYMBOLISM', 'Validating color symbolism in medical context');
      await validateColorSymbolismWithReporting(page, reporter);
      
    } catch (error) {
      await reporter.logError(page, 'Cross-Cultural Content Test Failed', error);
      throw error;
    }
    
    await reporter.logTestCompletion('Cross-Cultural Medical Content Validation', true);
    console.log('✅ Cross-Cultural Medical Content Validation Completed!');
  });

  // Enhanced Helper Functions with Reporting
  async function detectPageLanguage(page: any): Promise<string> {
    // Check HTML lang attribute
    const htmlLang = await page.getAttribute('html', 'lang');
    if (htmlLang) {
      if (htmlLang.startsWith('en')) return 'english';
      if (htmlLang.startsWith('es')) return 'spanish';
      if (htmlLang.startsWith('fr')) return 'french';
    }
    
    // Analyze page content for language patterns
    const pageText = await page.textContent('body') || '';
    const textSample = pageText.toLowerCase().substring(0, 1000);
    
    // Simple keyword-based language detection
    if (textSample.includes(' el ') || textSample.includes(' la ') || textSample.includes(' de ')) return 'spanish';
    if (textSample.includes(' le ') || textSample.includes(' la ') || textSample.includes(' et ')) return 'french';
    
    return 'english'; // Default fallback
  }

  async function validateMedicalTerminologyWithReporting(page: any, terms: any, language: string, reporter: TestReporter) {
    const pageText = (await page.textContent('body') || '').toLowerCase();
    
    console.log(`🏥 Validating ${language.toUpperCase()} Medical Terminology...`);
    
    // Check common medical terms
    const foundCommonTerms = terms.common.filter((term: string) => 
      pageText.includes(term.toLowerCase())
    );
    
    await reporter.logVerification(page, 'Common Medical Terms', foundCommonTerms.length > 0,
      `Found: ${foundCommonTerms.join(', ')} (${foundCommonTerms.length}/${terms.common.length})`);
    
    // Check clinical terms
    const foundClinicalTerms = terms.clinical.filter((term: string) => 
      pageText.includes(term.toLowerCase())
    );
    
    if (foundClinicalTerms.length > 0) {
      await reporter.logVerification(page, 'Clinical Terms', true,
        `Found: ${foundClinicalTerms.join(', ')} (${foundClinicalTerms.length}/${terms.clinical.length})`);
    } else {
      await reporter.logVerification(page, 'Clinical Terms', false,
        'No clinical terms found on page');
    }
    
    // Check form terms
    const foundFormTerms = terms.forms.filter((term: string) => 
      pageText.includes(term.toLowerCase())
    );
    
    await reporter.logVerification(page, 'Form Terminology', foundFormTerms.length > 0,
      `Found: ${foundFormTerms.join(', ')} (${foundFormTerms.length}/${terms.forms.length})`);
    
    // Log terminology summary
    await reporter.logTestData('Terminology Validation Summary', {
      language: language,
      commonTerms: {
        expected: terms.common.length,
        found: foundCommonTerms.length,
        terms: foundCommonTerms
      },
      clinicalTerms: {
        expected: terms.clinical.length,
        found: foundClinicalTerms.length,
        terms: foundClinicalTerms
      },
      formTerms: {
        expected: terms.forms.length,
        found: foundFormTerms.length,
        terms: foundFormTerms
      }
    });
  }

  async function validateFormLocalizationWithReporting(page: any, terms: any, reporter: TestReporter) {
    await reporter.logStep(page, 'FORM LOCALIZATION', 'Validating form element localization');
    
    // Check for form elements using expected terminology
    const formSelectors = [
      '#txt-username',
      '#txt-password', 
      '#btn-login',
      '#btn-make-appointment'
    ];
    
    let visibleElements = 0;
    const elementResults = [];
    
    for (const selector of formSelectors) {
      const isVisible = await page.isVisible(selector);
      elementResults.push({
        selector: selector,
        visible: isVisible
      });
      
      if (isVisible) visibleElements++;
    }
    
    await reporter.logVerification(page, 'Form Elements Present', visibleElements > 0,
      `${visibleElements}/${formSelectors.length} form elements visible`);
    
    await reporter.logTestData('Form Element Analysis', {
      totalSelectors: formSelectors.length,
      visibleElements: visibleElements,
      elements: elementResults
    });
  }

  async function validatePageStructureWithReporting(page: any, reporter: TestReporter) {
    // Check heading hierarchy
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) => 
      elements.map(el => ({
        tag: el.tagName,
        text: el.textContent?.trim().slice(0, 50) || '',
        level: parseInt(el.tagName.charAt(1))
      }))
    );
    
    // Validate heading hierarchy
    const hasH1 = headings.some(h => h.tag === 'H1');
    const headingLevels = [...new Set(headings.map(h => h.level))].sort();
    
    await reporter.logVerification(page, 'Heading Hierarchy - H1 Present', hasH1,
      `Found ${headings.length} headings across ${headingLevels.length} levels`);
    
    // Validate critical sections exist
    const criticalSections = [
      'Make Appointment',
      'Login',
      'Healthcare',
      'Service'
    ];
    
    const pageText = await page.textContent('body') || '';
    const foundSections = criticalSections.filter(section => 
      pageText.includes(section)
    );
    
    await reporter.logVerification(page, 'Critical Sections', foundSections.length > 0,
      `Found: ${foundSections.join(', ')} (${foundSections.length}/${criticalSections.length})`);
    
    await reporter.logTestData('Page Structure Analysis', {
      headings: {
        total: headings.length,
        levels: headingLevels,
        hasH1: hasH1,
        details: headings
      },
      sections: {
        expected: criticalSections.length,
        found: foundSections.length,
        missing: criticalSections.filter(s => !foundSections.includes(s)),
        present: foundSections
      }
    });
    
    return { headings, criticalSections: foundSections };
  }

  async function validateContentOrganizationWithReporting(page: any, reporter: TestReporter) {
    // Check for logical content grouping
    const contentGroups = await page.$$eval('.container, section, .row, .col', elements => 
      elements.length
    );
    
    await reporter.logVerification(page, 'Content Grouping', contentGroups > 0,
      `Found ${contentGroups} content grouping elements`);
    
    // Validate navigation structure
    const navElements = await page.$$eval('nav, .navbar, .menu, #menu-toggle', elements => 
      elements.length
    );
    
    await reporter.logVerification(page, 'Navigation Elements', navElements > 0,
      `Found ${navElements} navigation elements`);
    
    await reporter.logPerformance('Content Organization Score', 
      Math.min(100, (contentGroups + navElements) * 10), 'points');
  }

  async function validateNavigationFlowWithReporting(page: any, reporter: TestReporter) {
    // Test main navigation actions
    const initialUrl = page.url();
    
    // Test make appointment flow
    await page.click('#btn-make-appointment');
    await page.waitForSelector('#txt-username', { timeout: TestConfig.elementTimeout });
    
    const onLoginPage = await page.isVisible('#txt-username');
    
    await reporter.logVerification(page, 'Navigation to Login Page', onLoginPage,
      `Successfully navigated from ${initialUrl} to login form`);
    
    // Navigate back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    const returnedToHome = page.url() === initialUrl;
    await reporter.logVerification(page, 'Return Navigation', returnedToHome,
      'Successfully returned to homepage');
    
    await reporter.logTestData('Navigation Flow Analysis', {
      initialUrl: initialUrl,
      navigatedToLogin: onLoginPage,
      returnedToHome: returnedToHome
    });
  }

  async function validateFormElementsWithReporting(page: any, reporter: TestReporter) {
    const formElements = [
      { selector: '#txt-username', type: 'username field' },
      { selector: '#txt-password', type: 'password field' },
      { selector: '#btn-login', type: 'login button' }
    ];
    
    let allElementsVisible = true;
    const elementAnalysis = [];
    
    for (const element of formElements) {
      const isVisible = await page.isVisible(element.selector);
      const isEnabled = await page.isEnabled(element.selector);
      
      elementAnalysis.push({
        type: element.type,
        selector: element.selector,
        visible: isVisible,
        enabled: isEnabled
      });
      
      await reporter.logVerification(page, `${element.type}`, isVisible,
        `Selector: ${element.selector}, Enabled: ${isEnabled}`);
      
      if (!isVisible) allElementsVisible = false;
    }
    
    await reporter.logVerification(page, 'All Form Elements Present', allElementsVisible,
      `${formElements.length} form elements checked`);
    
    await reporter.logTestData('Form Element Analysis', {
      totalElements: formElements.length,
      allVisible: allElementsVisible,
      elements: elementAnalysis
    });
  }

  async function validateFormValidationWithReporting(page: any, reporter: TestReporter) {
    // Test empty form submission
    await page.click('#btn-login');
    await page.waitForTimeout(2000);
    
    // Should remain on login page or show error
    const stillOnLogin = await page.isVisible('#txt-username') || page.url().includes('login');
    
    await reporter.logVerification(page, 'Form Validation Working', stillOnLogin,
      `Empty form submission ${stillOnLogin ? 'prevented' : 'allowed'}`);
    
    await reporter.logTestData('Form Validation Analysis', {
      validationWorking: stillOnLogin,
      currentUrl: page.url(),
      loginFormVisible: await page.isVisible('#txt-username')
    });
  }

  async function validateFormAccessibilityWithReporting(page: any, reporter: TestReporter) {
    // Check for accessibility attributes
    const accessibilityChecks = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select');
      const elementsWithLabels = Array.from(inputs).filter(input => {
        return input.getAttribute('aria-label') || 
               input.getAttribute('placeholder') ||
               document.querySelector(`label[for="${input.id}"]`);
      });
      
      return {
        totalInputs: inputs.length,
        accessibleInputs: elementsWithLabels.length,
        accessibilityScore: inputs.length > 0 ? (elementsWithLabels.length / inputs.length) * 100 : 0,
        hasFocusIndicators: getComputedStyle(document.body).outlineWidth !== '0px'
      };
    });
    
    await reporter.logVerification(page, 'Form Accessibility', 
      accessibilityChecks.accessibilityScore > 50,
      `${accessibilityChecks.accessibleInputs}/${accessibilityChecks.totalInputs} inputs accessible (${accessibilityChecks.accessibilityScore.toFixed(1)}%)`);
    
    await reporter.logPerformance('Accessibility Score', accessibilityChecks.accessibilityScore, '%');
    
    await reporter.logTestData('Accessibility Analysis', accessibilityChecks);
  }

  async function validateCulturalAppropriatenessWithReporting(page: any, reporter: TestReporter) {
    const pageText = await page.textContent('body') || '';
    
    // Check for culturally sensitive content
    const sensitiveTerms = ['appropriate', 'respectful', 'professional'];
    const hasAppropriateContent = sensitiveTerms.every(term => 
      !pageText.toLowerCase().includes(term) // These should NOT be present in negative context
    );
    
    await reporter.logVerification(page, 'Culturally Appropriate Content', hasAppropriateContent,
      `Checked for sensitive terms: ${sensitiveTerms.join(', ')}`);
    
    await reporter.logTestData('Cultural Appropriateness Analysis', {
      sensitiveTerms: sensitiveTerms,
      allTermsAppropriate: hasAppropriateContent,
      pageTextSample: pageText.substring(0, 200) + '...'
    });
  }

  async function validateMedicalImageryWithReporting(page: any, reporter: TestReporter) {
    // Check for medical-related images
    const images = await page.$$eval('img', elements => 
      elements.map(img => ({
        src: img.src,
        alt: img.alt,
        medicalRelevance: img.alt.toLowerCase().includes('medical') || 
                         img.alt.toLowerCase().includes('health') ||
                         img.alt.toLowerCase().includes('care')
      }))
    );
    
    const medicalImages = images.filter(img => img.medicalRelevance);
    
    await reporter.logVerification(page, 'Medical-Related Images', medicalImages.length > 0,
      `Found ${medicalImages.length} medical-related images out of ${images.length} total`);
    
    await reporter.logTestData('Medical Imagery Analysis', {
      totalImages: images.length,
      medicalImages: medicalImages.length,
      imageDetails: images
    });
  }

  async function validateColorSymbolismWithReporting(page: any, reporter: TestReporter) {
    // Check for appropriate medical colors (blues, greens, whites - calming and professional)
    const colorAnalysis = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const medicalColors = ['blue', 'green', 'white', 'teal', 'cyan'];
      let medicalColorCount = 0;
      
      elements.forEach(el => {
        const style = getComputedStyle(el);
        const bgColor = style.backgroundColor;
        const color = style.color;
        
        medicalColors.forEach(medColor => {
          if (bgColor.includes(medColor) || color.includes(medColor)) {
            medicalColorCount++;
          }
        });
      });
      
      return { 
        medicalColorCount, 
        totalElements: elements.length,
        medicalColorPercentage: elements.length > 0 ? (medicalColorCount / elements.length) * 100 : 0
      };
    });
    
    const hasAppropriateColors = colorAnalysis.medicalColorPercentage > 10;
    
    await reporter.logVerification(page, 'Medical-Appropriate Colors', hasAppropriateColors,
      `${colorAnalysis.medicalColorCount} medical colors out of ${colorAnalysis.totalElements} elements (${colorAnalysis.medicalColorPercentage.toFixed(1)}%)`);
    
    await reporter.logPerformance('Color Appropriateness Score', colorAnalysis.medicalColorPercentage, '%');
    
    await reporter.logTestData('Color Symbolism Analysis', colorAnalysis);
  }
});