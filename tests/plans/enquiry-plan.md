# Enquiry Flow Test Plan

## Executive summary

This document defines a comprehensive test plan for the Enquiry flow of the MiME application. It covers the main happy path (creating a new enquiry), input validations, negative/edge cases, permissions, accessibility, and persistence. Tests are written as independent scenarios and assume a fresh browser state unless otherwise stated.

Related automation artifacts in this repository:
- `tests/enquiry.spec.ts` — a starter Playwright test that navigates to the app and triggers the Enquiry menu.
- `pages/EnquiryPage.ts` — page object expected to expose actions such as navigating to the Enquiry menu and interacting with the New Enquiry form.

Assumptions
- All scenarios assume a fresh browser session (no pre-existing authentication) unless a scenario explicitly requires an authenticated state.
- Base URL resolves in the Playwright config; in automated tests use `page.goto('/')` or `page.goto('/enquiries')` as appropriate. The provided test uses storageState `playwright/.auth/user.json` to simulate an authenticated user.
- The Enquiry UI has: an "Enquiry" menu item, a "New Enquiry" button, a form with clearly labeled fields (e.g., Name, Email, Phone, Subject, Description), standard submit and cancel controls, optional file attachment control, and client-side validation messages.
- Success criteria: form submission creates a new enquiry entry visible in the enquiry list and returns a success message.

Test structure and conventions
- Each scenario contains: title, preconditions, step-by-step steps (numbered), expected results, and pass/fail criteria.
- Tests are independent and may be executed in any order. Where state is required (like a pre-existing enquiry), data setup steps are included.
- Use the `EnquiryPage` page object to centralize selectors and actions.

---

## Scenario 1 — Happy path: Create new enquiry

Preconditions: Authenticated user (use `playwright/.auth/user.json` in test `test.use` or perform login within the test). Fresh state (no pre-existing form data).

Steps:
1. Navigate to the application root: `page.goto('/')`.
2. Open the Enquiry menu (click `Enquiry` in the main navigation).
3. Click `New Enquiry`.
4. Fill the form fields with valid values:
   - Name: `Test User`
   - Email: `test.user+{timestamp}@example.com`
   - Phone: `+8801712345678`
   - Subject: `Service Request`
   - Description: `This is a test enquiry.`
5. (Optional) Attach a small file (e.g., 10KB text file) using the file upload control.
6. Click `Submit` or `Create`.

Expected results:
- The form submits successfully without client-side validation errors.
- A confirmation message/toast appears (e.g., "Enquiry created" or similar).
- The application navigates to the enquiry list or the newly created enquiry detail view.
- The newly created enquiry appears in the list with correct values (name, subject, timestamp).

Success criteria:
- Any assertions validate the presence of the new enquiry and the success message. Failure if submission returns an error or the new entry does not appear.

---

## Scenario 2 — Form validation: Required fields

Preconditions: Authenticated user; fresh state.

Steps:
1. Open Enquiry menu, click `New Enquiry`.
2. Try submitting the form with all fields empty.

Expected results:
- Client-side validation highlights required fields (e.g., Name, Email, Subject, Description).
- Validation messages are shown near each required field (e.g., "Name is required").
- Form is not submitted and no new enquiry is created.

Failure conditions:
- Form submits with missing required values, server accepts the request without validation, or no validation messages appear.

---

## Scenario 3 — Form validation: Invalid email and phone formats

Preconditions: Authenticated user; fresh state.

Steps:
1. Open New Enquiry form.
2. Enter invalid email (e.g., `bad-email`) and invalid phone (e.g., `abcd1234`).
3. Submit the form.

Expected results:
- Inline validation prevents submit and shows specific messages ("Enter a valid email", "Enter a valid phone number").
- No new enquiry is created.

Edge checks:
- Accepts international phone formats and plus sign.
- Accepts emails with + addressing (e.g., `user+tag@example.com`).

---

## Scenario 4 — Character limits and long input handling

Preconditions: Authenticated user; fresh state.

Steps:
1. Open New Enquiry form.
2. Fill fields with long strings (e.g., Description of 10,000 characters; Name with 256 characters).
3. Submit the form.

Expected results:
- Either client-side prevents excessive input with user-friendly messages OR the server truncates/stores safely and returns success.
- The UI should still be responsive and display a success or appropriate error.

Failure conditions:
- Unhandled exceptions, UI freeze, or data corruption.

---

## Scenario 5 — Duplicate submission / idempotency

Preconditions: Authenticated user; fresh state.

Steps:
1. Open New Enquiry form and fill with valid data.
2. Click `Submit` twice quickly (or simulate duplicate POSTs).

Expected results:
- The application prevents duplicate enquiries (either by disabling the submit button on first click or by server-side idempotency), or clearly surfaces duplicate detection.
- At most one enquiry is created.

---

## Scenario 6 — Attachments: file upload handling

Preconditions: Authenticated user; fresh state.

Steps:
1. Open New Enquiry form.
2. Attach several files: a small text file, a mid-size image (e.g., 2MB), and a file with disallowed extension (e.g., `.exe`).
3. Submit the form.

Expected results:
- Allowed files are accepted; disallowed file types are rejected with clear messages.
- File size limits are enforced and reported (e.g., "File too large").
- The final enquiry shows file metadata (names, size) if displayed.

Failure conditions:
- Security issue (executable files accepted), server error, or UI crash.

---

## Scenario 7 — Cancel/Close behavior

Preconditions: Authenticated user; fresh state.

Steps:
1. Open New Enquiry form, fill partial data.
2. Click `Cancel` or `Close` without submitting.

Expected results:
- Form closes, and no new enquiry is created.
- (Optional) If the app has an unsaved-change prompt, verify the prompt appears and the choices work.

---

## Scenario 8 — Permission and unauthenticated access

Preconditions: Unauthenticated user (clear storageState/session).

Steps:
1. Attempt to access the Enquiry menu or navigate directly to `/enquiries`.

Expected results:
- The app redirects to login or shows a permission error.
- No access to new-enquiry creation unless logged in.

Failure conditions:
- Unauthenticated users can create enquiries that should be restricted.

---

## Scenario 9 — Server error and network resilience

Preconditions: Authenticated user; fresh state.

Steps:
1. Open New Enquiry form and fill with valid data.
2. Simulate network failure or server 500 upon form submission (in automation, intercept response to return 500).

Expected results:
- The UI surfaces a clear error message ("Server error, please try again") and retains form inputs so the user can retry.
- No half-created or inconsistent resource is present in the list.

---

## Scenario 10 — Accessibility and keyboard behavior

Preconditions: Authenticated user; fresh state.

Steps:
1. Navigate only with keyboard (Tab/Shift+Tab) to the Enquiry menu, open New Enquiry, fill fields and submit.
2. Verify all interactive controls have accessible names and aria attributes where needed.
3. Use a screen reader (or run an automated AX check) over the enquiry form.

Expected results:
- Full keyboard navigation is possible; focus order is logical.
- Form controls provide semantic labels and validation messages are accessible to assistive tech.

Automated checks:
- Run axe-core or Playwright accessibility snapshot checks at critical steps.

---

## Scenario 11 — Data persistence and list view

Preconditions: Authenticated user; fresh state.

Steps:
1. Create a new enquiry (Scenario 1).
2. Refresh the page or navigate away and back to the enquiry list.

Expected results:
- Created enquiry persists and remains visible in the list.
- List sorting/paging shows the new entry where expected.

---

## Scenario 12 — Concurrency / multiple users (sanity)

Preconditions: Two authenticated users.

Steps:
1. User A creates an enquiry.
2. User B refreshes the enquiry list.

Expected results:
- User B sees the newly created enquiry (either immediately or after short eventual consistency window).

---

## Test data recommendations
- Use unique data per test (append timestamp or GUID to subject/email) so tests are idempotent.
- Provide small fixture files for upload tests (text, image, and a disallowed-file placeholder).
- Use a dedicated test account with known permissions and a cleaned state.

## Automation tips for `EnquiryPage` page object
- Provide methods:
  - `async openEnquiryMenu()` — clicks the Enquiry menu and waits for navigation.
  - `async clickNewEnquiry()` — clicks the New Enquiry button and waits for the form.
  - `async fillEnquiryForm(data)` — fills fields from a data object.
  - `async attachFiles(paths: string[])` — attaches files to the upload control.
  - `async submitForm()` — submits and waits for success or error toast.
  - `async getValidationMessages()` — returns visible validation texts.
- Centralize selectors (data-testids preferred) to avoid brittle tests.
- After submission, wait for network idle or for a success toast to avoid flakiness.

## Execution notes
- For Playwright tests, reuse `playwright/.auth/user.json` to skip login where applicable.
- Intercept API calls when you need to simulate server errors or slow responses.
- Add retries cautiously for transient network flakiness, but prefer deterministic waits on success indicators.

## Acceptance and pass/fail
- A scenario passes when all listed expected results are verified via assertions.
- Fails when UI behavior deviates (missing validation, server errors without clear messages, permission regressions, security issues like accepting forbidden file types).

---

## Appendix — Example automated check snippets (Playwright pseudocode)

- Verify success toast after submit:
  1. `await page.waitForSelector('text=Enquiry created', { timeout: 5000 })`.
  2. `expect(await page.locator('.enquiry-list-item:has-text("Test User")').count()).toBeGreaterThan(0)`.

- Validate required fields:
  1. `await page.click('button:has-text("Submit")')`
  2. `expect(await page.locator('.error:has-text("is required")').count()).toBeGreaterThan(0)`.


---

End of Enquiry Flow Test Plan
