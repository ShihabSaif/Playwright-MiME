import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { config } from '../utils/config';

test('Mime Connect Login Flow', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await test.step('Go to login page', async () => {
    await loginPage.goto();
  });

  await test.step('Perform login', async () => {
    await loginPage.login(config.username, config.password);
  });

  await test.step('Verify dashboard appears', async () => {
    await loginPage.assertLoginSuccess();
  });
});