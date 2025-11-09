import { test } from '@playwright/test';
import { EnquiryPage } from '../pages/EnquiryPage';

test.use({ storageState: 'playwright/.auth/user.json' });

test('Enquiry Flow', async ({ page }) => {
    const enquiryPage = new EnquiryPage(page);

    // Navigate to base URL
    await page.goto('/');

    await test.step('Click Enquiry menu', async () => {
        await enquiryPage.enquiry();
        await page.pause(); // for debug
    });
});
