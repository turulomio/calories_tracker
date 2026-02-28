import { test, expect } from './fixtures.js';

test('Statistics', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralStatistics').click();

    await expect(page.getByRole('heading', { name: 'Statistics' })).toBeVisible();
    await expect(page.getByText('Here you can see the distribution of the registers in the application')).toBeVisible();
    await expect(page.getByTestId('Statistics_Chart')).toBeVisible();
    await expect(page.getByTestId('Statistics_Chart').locator('canvas')).toBeVisible();

});