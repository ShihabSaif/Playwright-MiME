import { Page, expect } from '@playwright/test';

export class EnquiryPage {
    private page: Page;

    // Locators
    private sidebarMenu = 'i.tim-icons.icon-align-center.visible-on-sidebar-regular';
    private enquiryLink = 'li >> a:has(p:text("Enquiry"))';

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

    async clickNewEnquiry() {
        await this.page.getByRole('button', { name: /new enquiry/i }).click();
    }

    async nameInput()
    {
        await this.page.locator('#salutation').selectOption('Mr');
        await this.page.locator('#first_name').fill('John');
        await this.page.locator('#middle_name').fill('david');
        await this.page.locator('#last_name').fill('test');
    }

    async mobileNoInput()
    {
        await this.page.locator('#mobile_primary').fill('19876543210');
    }

    async contactAddress() 
    {
        await this.page.locator('#Contact_address_req').fill('123 Main St, Cityville, Countryland');

        // Division
        const divisionDropdown = this.page.locator('#Contact_division_req');
        await divisionDropdown.click();
        const divisionPanel = this.page.locator('.el-select-dropdown:visible');
        await expect(divisionPanel).toBeVisible();
        await divisionPanel.locator('text=Khulna').click();

        // District
        const districtDropdown = this.page.locator('#Contact_district_req');
        await districtDropdown.click();
        const districtPanel = this.page.locator('.el-select-dropdown:visible');
        await expect(districtPanel).toBeVisible();
        await districtPanel.locator('text=Bagerhat').click();

        // Area
        const areaDropdown = this.page.locator('#Contact_area_req');
        await areaDropdown.click();
        const areaPanel = this.page.locator('.el-select-dropdown:visible');
        await expect(areaPanel).toBeVisible();
        await areaPanel.locator('text=Chitalmari').click();
    }


    async customerTypeSelection()
    {
        await this.page.locator('#interested_on').selectOption('individual');
    }

    async activationDateSelection() 
    {
        const dateInput = this.page.locator('#activation_date').nth(0);
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // Click today
        const today = this.page.locator('.el-date-table .today'); // Element UI often uses .today
        await expect(today).toBeVisible();
        await today.click();
    }

    async enquirySource()
    {
        // Locate the dropdown by ID
        const sourceDropdown = this.page.locator('#source');
        // Ensure it is visible
        await expect(sourceDropdown).toBeVisible();
        // Select the "Mail" option
        await sourceDropdown.selectOption('7');

    }

    async assignRM() 
    {
        const assignedRmInput = this.page.locator('#assigned_rm');

        // Scroll into view and click
        await assignedRmInput.scrollIntoViewIfNeeded();
        await assignedRmInput.click();

        // Wait for the dropdown container to appear and be visible
        const dropdownContainer = this.page.locator('.el-select-dropdown:visible');
        await expect(dropdownContainer).toBeVisible({ timeout: 5000 });

        // Then pick the first item
        const firstOption = dropdownContainer.locator('.el-select-dropdown__item').first();
        await firstOption.click();
    }

    async selectSalesPerson()
    {
        const salesPersonInput = this.page.locator('#sales_person');

        // Make sure the input is ready
        await salesPersonInput.scrollIntoViewIfNeeded();
        await expect(salesPersonInput).toBeVisible();
        await salesPersonInput.click();

        // Wait for dropdown container to fully appear
        const dropdown = this.page.locator('.el-select-dropdown:visible');
        await dropdown.waitFor({ state: 'visible' });

        // Wait a bit for animation & rendering (Element Plus needs this)
        await this.page.waitForTimeout(500);

        // Ensure at least one item is attached and visible
        const firstOption = dropdown.locator('.el-select-dropdown__item').first();
        await firstOption.waitFor({ state: 'visible' });

        // Use force click to bypass transient stability checks
        await firstOption.click({ force: true });

        // Optional: ensure dropdown is closed and value filled
        await expect(salesPersonInput).not.toHaveValue('');
    }

    async addService()
    {
        // add service button
        const addButton = this.page.locator('#show_add_service');
        await expect(addButton).toBeVisible({ timeout: 5000 });
        await addButton.click();

        //service type
        const serviceDropdown = this.page.locator('#service_type');
        await expect(serviceDropdown).toBeVisible({ timeout: 5000 });
        await serviceDropdown.selectOption({ index: 1 });

        //packages
        const packageDropdown = this.page.locator('#package_service');
        await expect(packageDropdown).toBeVisible({ timeout: 5000 });
        await packageDropdown.selectOption({ index: 1 });

        //checkbox
        const inheritedCheckbox = this.page.locator('fieldset:has-text("Installation Address *")').locator('#inherited_checkbox');
        await expect(inheritedCheckbox).toBeVisible({ timeout: 5000 });
        await expect(inheritedCheckbox).toBeEnabled();
        await inheritedCheckbox.click();

        //MiME number
        const inputField = this.page.locator('input.form-control[type="text"]').first();
        await expect(inputField).toBeVisible({ timeout: 5000 });
        await inputField.fill('Your Value Here');


        //add service button
        const addServiceButton = this.page.locator('#add_service');
        await expect(addServiceButton).toBeVisible({ timeout: 5000 });
        await expect(addServiceButton).toBeEnabled();
        await addServiceButton.click();
    }
}
