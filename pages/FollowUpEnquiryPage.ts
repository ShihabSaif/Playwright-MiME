import { Page, expect } from '@playwright/test';

export class FollowUpEnquiryPage {
    private page: Page;

    // Locators inside Follow-up Enquiry tab
    private followUpTab = 'button:has-text("Follow Up")';

    constructor(page: Page) {
        this.page = page;
    }

    async gotoNewCreatedEnquiry() {
        const firstCard = this.page.locator('li.timeline-inverted.pointer').first();
        await firstCard.waitFor({ state: 'visible' });
        await firstCard.click();
    }

    async followUpEnquiryComment()
    {
        // Locate the textarea by ID
        const followUpTextarea = this.page.locator('#textAt');

        // Ensure it's visible and enabled
        await expect(followUpTextarea).toBeEnabled({ timeout: 5000 });

        // Fill the value
        await followUpTextarea.fill('This is a follow-up note');
    }

    async departmentDropdown()
    {
        // Locate the department input
        const departmentInput = this.page.locator('input[name="department_id"]');

        // Scroll into view and click to open dropdown
        await departmentInput.scrollIntoViewIfNeeded();
        await expect(departmentInput).toBeVisible({ timeout: 5000 });
        await departmentInput.click();

        // Wait for dropdown panel to appear
        const dropdownPanel = this.page.locator('.el-select-dropdown:visible');
        await expect(dropdownPanel).toBeVisible({ timeout: 5000 });

        // Click the first option
        const firstOption = dropdownPanel.locator('.el-select-dropdown__item').first();
        await firstOption.click();

    }

    // async AssignedRMDropdown()
    // {
    //     // Locate the assign input
    //     const assignInput = this.page.locator('input[name="assign_id"]');
    //     await assignInput.scrollIntoViewIfNeeded();
    //     await expect(assignInput).toBeVisible({ timeout: 5000 });
    //     await assignInput.click();

    //     // Wait for the dropdown panel to appear
    //     const dropdownPanel = this.page.locator('.el-select-dropdown:visible');
    //     await expect(dropdownPanel).toBeVisible({ timeout: 5000 });

    //     // Get the first option text
    //     const firstOption = dropdownPanel.locator('.el-select-dropdown__item').first();
    //     const optionLabel = await firstOption.textContent();
    //     await firstOption.click();

    //     // Optional: verify that the visible label is set
    //     const inputValue = await assignInput.inputValue();
    //     console.log('Input value after selection (internal value):', inputValue);
    //     console.log('Option label:', optionLabel);
    // }

    async statusDropdown()
    {
        // Locate the status dropdown
        const statusDropdown = this.page.locator('select[name="status_id"]');
        // Ensure it is visible and enabled
        await expect(statusDropdown).toBeVisible({ timeout: 5000 });
        await expect(statusDropdown).toBeEnabled({ timeout: 5000 });
        // Select the option with value "4"
        await statusDropdown.selectOption({ value: '4' });
        // Optional: verify the selected value
        const selectedValue = await statusDropdown.inputValue();
        expect(selectedValue).toBe('4');
    }

    async NasDropdown()
    {
        // Locate the NAS dropdown input
        const nasInput = this.page.locator('input[placeholder="Select NAS"]');

        // Ensure visible
        await nasInput.scrollIntoViewIfNeeded();
        await expect(nasInput).toBeVisible({ timeout: 5000 });

        // Click to open dropdown
        await nasInput.click();

        // Wait for the dropdown panel
        const dropdown = this.page.locator('.el-select-dropdown:visible');
        await expect(dropdown).toBeVisible({ timeout: 5000 });

        // Wait for items to load
        const firstOption = dropdown.locator('.el-select-dropdown__item').first();
        await expect(firstOption).toBeVisible({ timeout: 5000 });

        // Click the first option
        await firstOption.click({ force: true });
    }
}
