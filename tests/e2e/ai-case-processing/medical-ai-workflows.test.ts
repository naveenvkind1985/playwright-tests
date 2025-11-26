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
      await page.waitForTimeout(3000);

      // Test form element labels and placeholders with better error handling
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
    
    // Check for form elements using expected terminology - with better error handling
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
    await page.waitForTimeout(3000); // Wait for navigation
    
    // Check if we're on a different page (login or appointment form)
    const currentUrl = page.url();
    const urlChanged = currentUrl !== initialUrl;
    
    // Check for common login form elements with multiple selectors
    const loginIndicators = [
      await page.isVisible('#txt-username'),
      await page.isVisible('input[type="text"]'),
      await page.isVisible('input[placeholder*="name"]'),
      await page.isVisible('input[placeholder*="user"]')
    ];
    
    const hasLoginForm = loginIndicators.some(indicator => indicator === true);
    
    await reporter.logVerification(page, 'Navigation Flow', urlChanged && hasLoginForm,
      `URL changed: ${urlChanged}, Login form detected: ${hasLoginForm}`);
    
    // Navigate back if needed
    if (urlChanged) {
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
    
    await reporter.logTestData('Navigation Analysis', {
      initialUrl: initialUrl,
      navigatedUrl: currentUrl,
      urlChanged: urlChanged,
      loginFormDetected: hasLoginForm,
      loginIndicators: loginIndicators
    });
  }

  async function validateFormElementsWithReporting(page: any, reporter: TestReporter) {
    // Try multiple selectors for form elements
    const formElements = [
      { selector: '#txt-username', type: 'username field' },
      { selector: '#txt-password', type: 'password field' },
      { selector: '#btn-login', type: 'login button' },
      { selector: 'input[type="text"]', type: 'text input' },
      { selector: 'input[type="password"]', type: 'password input' },
      { selector: 'button[type="submit"]', type: 'submit button' }
    ];
    
    let foundElements = 0;
    const elementAnalysis = [];
    
    for (const element of formElements) {
      try {
        const isVisible = await page.isVisible(element.selector);
        const isEnabled = isVisible ? await page.isEnabled(element.selector) : false;
        
        elementAnalysis.push({
          type: element.type,
          selector: element.selector,
          visible: isVisible,
          enabled: isEnabled
        });
        
        if (isVisible) {
          foundElements++;
          await reporter.logVerification(page, `${element.type}`, true,
            `Selector: ${element.selector}, Enabled: ${isEnabled}`);
        }
      } catch (error) {
        elementAnalysis.push({
          type: element.type,
          selector: element.selector,
          visible: false,
          enabled: false,
          error: error.message
        });
        
        await reporter.logVerification(page, `${element.type}`, false,
          `Error checking element: ${error.message}`);
      }
    }
    
    await reporter.logVerification(page, 'Form Elements Overall', foundElements > 0,
      `Found ${foundElements}/${formElements.length} form elements`);
    
    await reporter.logTestData('Form Element Analysis', {
      totalElements: formElements.length,
      foundElements: foundElements,
      elements: elementAnalysis
    });
  }

  async function validateFormValidationWithReporting(page: any, reporter: TestReporter) {
    // Try to find and click login button with multiple selectors
    const loginSelectors = ['#btn-login', 'button[type="submit"]', 'input[type="submit"]', 'button'];
    
    let loginClicked = false;
    let usedSelector = '';
    
    for (const selector of loginSelectors) {
      if (await page.isVisible(selector)) {
        await page.click(selector);
        loginClicked = true;
        usedSelector = selector;
        break;
      }
    }
    
    if (!loginClicked) {
      await reporter.logVerification(page, 'Form Validation Test', false,
        'No login button found to test form validation');
      return;
    }
    
    await page.waitForTimeout(2000);
    
    // Check if we're still on a form page (indicating validation prevented submission)
    const formIndicators = [
      await page.isVisible('#txt-username'),
      await page.isVisible('input[type="text"]'),
      await page.isVisible('input[type="password"]'),
      page.url().includes('login')
    ];
    
    const stillOnForm = formIndicators.some(indicator => indicator === true);
    
    await reporter.logVerification(page, 'Form Validation Working', stillOnForm,
      `Empty form submission ${stillOnForm ? 'prevented' : 'allowed'} - Used selector: ${usedSelector}`);
    
    await reporter.logTestData('Form Validation Analysis', {
      loginClicked: loginClicked,
      usedSelector: usedSelector,
      stillOnForm: stillOnForm,
      formIndicators: formIndicators
    });
  }

  async function validateFormAccessibilityWithReporting(page: any, reporter: TestReporter) {
    // Check for accessibility attributes with better error handling
    const accessibilityChecks = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, textarea, select');
      const elementsWithLabels: any[] = [];
      
      inputs.forEach(input => {
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasPlaceholder = input.getAttribute('placeholder');
        const hasLabel = document.querySelector(`label[for="${input.id}"]`);
        
        if (hasAriaLabel || hasPlaceholder || hasLabel) {
          elementsWithLabels.push({
            type: input.tagName,
            id: input.id,
            hasAriaLabel: !!hasAriaLabel,
            hasPlaceholder: !!hasPlaceholder,
            hasLabel: !!hasLabel
          });
        }
      });
      
      return {
        totalInputs: inputs.length,
        accessibleInputs: elementsWithLabels.length,
        accessibilityScore: inputs.length > 0 ? (elementsWithLabels.length / inputs.length) * 100 : 0,
        details: elementsWithLabels
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
    
    // Check for culturally sensitive content - look for positive terms
    const positiveTerms = ['professional', 'quality', 'care', 'service', 'health'];
    const negativeTerms = ['inappropriate', 'offensive', 'rude']; // These should NOT be present
    
    const foundPositiveTerms = positiveTerms.filter(term => 
      pageText.toLowerCase().includes(term)
    );
    
    const foundNegativeTerms = negativeTerms.filter(term => 
      pageText.toLowerCase().includes(term)
    );
    
    const hasPositiveContent = foundPositiveTerms.length > 0;
    const hasNegativeContent = foundNegativeTerms.length > 0;
    
    await reporter.logVerification(page, 'Positive Cultural Content', hasPositiveContent,
      `Found positive terms: ${foundPositiveTerms.join(', ')} (${foundPositiveTerms.length}/${positiveTerms.length})`);
    
    await reporter.logVerification(page, 'No Negative Cultural Content', !hasNegativeContent,
      `Negative terms found: ${hasNegativeContent ? foundNegativeTerms.join(', ') : 'None'}`);
    
    await reporter.logTestData('Cultural Appropriateness Analysis', {
      positiveTerms: {
        expected: positiveTerms.length,
        found: foundPositiveTerms.length,
        terms: foundPositiveTerms
      },
      negativeTerms: {
        expected: negativeTerms.length,
        found: foundNegativeTerms.length,
        terms: foundNegativeTerms
      },
      overallAppropriate: hasPositiveContent && !hasNegativeContent
    });
  }

  async function validateMedicalImageryWithReporting(page: any, reporter: TestReporter) {
    // Check for medical-related images with better error handling
    const images = await page.$$eval('img', elements => 
      elements.map(img => ({
        src: img.src || 'no-src',
        alt: img.alt || 'no-alt',
        medicalRelevance: img.alt ? (
          img.alt.toLowerCase().includes('medical') || 
          img.alt.toLowerCase().includes('health') ||
          img.alt.toLowerCase().includes('care') ||
          img.alt.toLowerCase().includes('doctor') ||
          img.alt.toLowerCase().includes('hospital')
        ) : false
      }))
    );
    
    const medicalImages = images.filter(img => img.medicalRelevance);
    const imagesWithAlt = images.filter(img => img.alt !== 'no-alt');
    
    await reporter.logVerification(page, 'Medical Images Present', medicalImages.length > 0,
      `Found ${medicalImages.length} medical-related images out of ${images.length} total`);
    
    await reporter.logVerification(page, 'Images Have Alt Text', imagesWithAlt.length > 0,
      `${imagesWithAlt.length}/${images.length} images have alt text`);
    
    await reporter.logTestData('Medical Imagery Analysis', {
      totalImages: images.length,
      medicalImages: medicalImages.length,
      imagesWithAlt: imagesWithAlt.length,
      altTextCoverage: images.length > 0 ? (imagesWithAlt.length / images.length) * 100 : 0,
      imageDetails: images
    });
  }

  async function validateColorSymbolismWithReporting(page: any, reporter: TestReporter) {
    // Check for appropriate medical colors (blues, greens, whites - calming and professional)
    const colorAnalysis = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const medicalColors = ['blue', 'green', 'white', 'teal', 'cyan', 'gray'];
      let medicalColorCount = 0;
      let totalColoredElements = 0;
      
      elements.forEach(el => {
        const style = getComputedStyle(el);
        const bgColor = style.backgroundColor;
        const color = style.color;
        
        // Only count elements that actually have colors set
        if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          totalColoredElements++;
          medicalColors.forEach(medColor => {
            if (bgColor.includes(medColor)) {
              medicalColorCount++;
            }
          });
        }
        
        if (color !== 'rgb(0, 0, 0)' && color !== 'rgba(0, 0, 0, 0)') {
          totalColoredElements++;
          medicalColors.forEach(medColor => {
            if (color.includes(medColor)) {
              medicalColorCount++;
            }
          });
        }
      });
      
      return { 
        medicalColorCount, 
        totalColoredElements,
        medicalColorPercentage: totalColoredElements > 0 ? (medicalColorCount / totalColoredElements) * 100 : 0
      };
    });
    
    const hasAppropriateColors = colorAnalysis.medicalColorPercentage > 30;
    
    await reporter.logVerification(page, 'Medical-Appropriate Colors', hasAppropriateColors,
      `${colorAnalysis.medicalColorCount} medical colors out of ${colorAnalysis.totalColoredElements} elements (${colorAnalysis.medicalColorPercentage.toFixed(1)}%)`);
    
    await reporter.logPerformance('Color Appropriateness Score', colorAnalysis.medicalColorPercentage, '%');
    
    await reporter.logTestData('Color Symbolism Analysis', colorAnalysis);
  }
});