import { Page, expect } from '@playwright/test';

export class MedicalAIPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginAsMedicalProfessional(username: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('[data-testid="username"]', username);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-btn"]');
    await expect(this.page.locator('[data-testid="dashboard"]')).toBeVisible();
  }

  async createMedicalCase(patientData: any) {
    await this.page.click('[data-testid="new-case-btn"]');
    await this.page.fill('[data-testid="patient-id"]', patientData.id);
    await this.page.selectOption('[data-testid="department"]', patientData.department);
    await this.page.click('[data-testid="create-case"]');
  }

  async triggerAIAnalysis() {
    await this.page.click('[data-testid="ai-analyze-btn"]');
    await expect(this.page.locator('[data-testid="ai-processing"]')).toBeVisible();
  }

  async switchLanguage(language: string) {
    await this.page.click('[data-testid="language-selector"]');
    await this.page.click(`[data-testid="lang-${language}"]`);
    await this.page.waitForTimeout(1000);
  }
}