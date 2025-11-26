// Enhanced test reporting utility - FIXED VERSION
export class TestReporter {
  private testInfo: any;
  private startTime: number;
  
  constructor(testInfo: any) {
    this.testInfo = testInfo;
    this.startTime = Date.now();
  }

  // Enhanced step logging with timing - FIXED
  async logStep(page: any, stepName: string, description?: string) {
    const stepStartTime = Date.now();
    const elapsedTime = stepStartTime - this.startTime;
    
    console.log(`⏰ [${this.formatTime(elapsedTime)}] 📋 ${stepName}: ${description || ''}`);
    
    // Take screenshot for this step
    try {
      const screenshot = await page.screenshot();
      await this.testInfo.attach(`${stepName} - ${description}`, {
        body: screenshot,
        contentType: 'image/png'
      });
    } catch (error) {
      console.log(`⚠️ Could not capture screenshot for step: ${stepName}`);
    }
    
    // REMOVED: this.testInfo.step() as it's not available
    // Instead, use console logging for step tracking
    if (description) {
      console.log(`   📝 ${description}`);
    }
    
    return stepStartTime;
  }

  // Enhanced verification logging
  async logVerification(page: any, verificationName: string, result: boolean, details?: string) {
    const status = result ? '✅ PASS' : '❌ FAIL';
    const statusIcon = result ? '✅' : '❌';
    
    console.log(`${statusIcon} ${verificationName}: ${status}`);
    
    if (details) {
      console.log(`   📊 ${details}`);
    }
    
    // Always capture screenshot for verification (pass or fail)
    try {
      const screenshot = await page.screenshot();
      await this.testInfo.attach(`VERIFICATION - ${verificationName} - ${status}`, {
        body: screenshot,
        contentType: 'image/png'
      });
    } catch (error) {
      console.log(`⚠️ Could not capture verification screenshot: ${verificationName}`);
    }
  }

  // Enhanced error logging
  async logError(page: any, errorName: string, error: any) {
    console.error(`🚨 ${errorName}:`, error.message);
    console.error(`   Stack:`, error.stack);
    
    // Capture multiple screenshot types on error
    try {
      // Regular screenshot
      const screenshot = await page.screenshot();
      await this.testInfo.attach(`ERROR - ${errorName}`, {
        body: screenshot,
        contentType: 'image/png'
      });
      
      // Full page screenshot for debugging
      const fullPageScreenshot = await page.screenshot({ fullPage: true });
      await this.testInfo.attach(`FULL PAGE - ${errorName}`, {
        body: fullPageScreenshot,
        contentType: 'image/png'
      });
    } catch (screenshotError) {
      console.log(`⚠️ Could not capture error screenshots: ${errorName}`);
    }
  }

  // Enhanced performance logging
  async logPerformance(metricName: string, value: number, unit: string = 'ms') {
    console.log(`⏱️  ${metricName}: ${value}${unit}`);
    
    await this.testInfo.attach(`PERFORMANCE - ${metricName}`, {
      body: JSON.stringify({ 
        metric: metricName, 
        value, 
        unit,
        timestamp: new Date().toISOString()
      }, null, 2),
      contentType: 'application/json'
    });
  }

  // Enhanced test data logging
  async logTestData(dataName: string, data: any) {
    console.log(`📊 ${dataName}:`, JSON.stringify(data, null, 2));
    
    await this.testInfo.attach(`TEST DATA - ${dataName}`, {
      body: JSON.stringify(data, null, 2),
      contentType: 'application/json'
    });
  }

  // Log test completion
  async logTestCompletion(testName: string, success: boolean) {
    const totalTime = Date.now() - this.startTime;
    const status = success ? '✅ COMPLETED SUCCESSFULLY' : '❌ COMPLETED WITH FAILURES';
    
    console.log(`\n${status}`);
    console.log(`🏁 Test: ${testName}`);
    console.log(`⏱️  Total Duration: ${totalTime}ms`);
    console.log('=' .repeat(60));
  }

  // Format time for logging
  private formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}.${milliseconds % 1000}s`;
  }
}