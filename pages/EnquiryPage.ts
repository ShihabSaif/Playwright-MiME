import { Page, expect } from '@playwright/test';

export class EnquiryPage {
    private page: Page;

    // Locators
    private sidebarMenu = 'i.tim-icons.icon-align-center.visible-on-sidebar-regular';
    private enquiryLink = 'li >> a:has(p:text("Enquiry"))'; // more stable

    constructor(page: Page) {
        this.page = page;
    }

    async openSidebarIfCollapsed() {
        const isVisible = await this.page.locator(this.sidebarMenu).isVisible();
        if (!isVisible) {
            // click sidebar toggle if exists
            const toggle = this.page.locator('button:has(i.tim-icons.icon-align-center)');
            if (await toggle.count() > 0) await toggle.click();
        }
    }

    async enquiry() {
        // Ensure sidebar is expanded
        await this.openSidebarIfCollapsed();

        // Click Enquiry link safely
        const enquiry = this.page.locator(this.enquiryLink);
        await expect(enquiry).toBeVisible({ timeout: 5000 });
        await enquiry.click();
    }
}
