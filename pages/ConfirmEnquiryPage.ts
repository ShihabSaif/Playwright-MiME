import { Page, expect } from '@playwright/test';

export class ConfirmEnquiryPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async emailInput()
    {
        const emailInput = this.page.locator('#email').fill('test@gmail.com');
    }

    async generateUsername()
    {
        //generate username button
        await this.page.locator('span:has-text("Generate Username")').nth(1).click();

        //active immediate with payment checkbox
        const immediateCheckbox = this.page.locator('#swal2-checkbox');
        await expect(immediateCheckbox).toBeVisible({ timeout: 5000 });
        await immediateCheckbox.click();

        //YES button click
        const yesButton = this.page.locator('button:has-text("Yes")');
        await expect(yesButton).toBeVisible({ timeout: 5000 });
        await yesButton.click();
    }

    async submitButton()
    {
        const submitButton = this.page.locator('button:has-text("Submit")');
        await expect(submitButton).toBeVisible({ timeout: 5000 });
        await submitButton.click();
    }
}