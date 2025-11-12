import { test } from '@playwright/test';
import { EnquiryPage } from '../pages/EnquiryPage';

test.use({ storageState: 'playwright/.auth/user.json' });

test('Enquiry Flow', async ({ page }) => {
    const enquiryPage = new EnquiryPage(page);

    // Navigate to base URL
    await page.goto('/');

    await test.step('Click Enquiry menu', async () => {
        await enquiryPage.enquiry();
        await enquiryPage.clickNewEnquiry();
        await enquiryPage.nameInput();
        await enquiryPage.mobileNoInput();
        await enquiryPage.contactAddress();
        await enquiryPage.customerTypeSelection();
        await enquiryPage.activationDateSelection();
        await enquiryPage.enquirySource();
        await enquiryPage.assignRM();
        await enquiryPage.selectSalesPerson();
        await enquiryPage.addService();
        await enquiryPage.addOneTimeCost();
        await page.pause(); // for debug
    });
});
