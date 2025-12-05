import { test, expect } from './fixtures.js';

test('Home and its alerts', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralBiometrics').click();



});