import { test } from '@playwright/test';
import { EnquiryPage } from '../pages/NewEnquiryPage';
import { FollowUpEnquiryPage } from '../pages/FollowUpEnquiryPage';

test.use({ storageState: 'playwright/.auth/user.json' });

test('Enquiry Flow', async ({ page }) => {
    const enquiryPage = new EnquiryPage(page);
    const followUpEnquiryPage = new FollowUpEnquiryPage(page);

    // Navigate to base URL
    await page.goto('/');

    await test.step('New enquiry', async () => {
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
        await enquiryPage.clickOTCButton();
        await enquiryPage.clickSaveAndProceed()
    });

    await test.step('Follow-Up enquiry', async () => {
        await followUpEnquiryPage.gotoNewCreatedEnquiry();
        await followUpEnquiryPage.followUpEnquiryComment();
        await followUpEnquiryPage.departmentDropdown();
        // await followUpEnquiryPage.AssignedRMDropdown();
        await followUpEnquiryPage.statusDropdown();
        await followUpEnquiryPage.ServiceDetails();
        await followUpEnquiryPage.submitButton();
        await page.pause();
    })

    await test.step('Confirm enquiry', async () => {
    });
});
