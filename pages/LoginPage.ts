import { Page, expect } from '@playwright/test';

export class LoginPage {
  private page: Page;

  // ✅ Locators
  private usernameInput = '#username';
  private passwordInput = '#password';
  private loginButton = '#login';
  private dashboardHeader = 'h1:has-text("Dashboard")'; // 👈 success indicator

  constructor(page: Page) {
    this.page = page;
  }

  // ✅ Page actions
  async goto() {
    await this.page.goto('https://testconnect.mimebd.com/');
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  // ✅ Assert success: Dashboard header is visible
  async assertLoginSuccess() {
    await expect(this.page.locator(this.dashboardHeader)).toBeVisible(
        {
            timeout: 30000
        }
    );
  }
}