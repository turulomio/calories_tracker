import { test, expect } from './fixtures.js';
import {v_text_input_settext, expect_native_confirm_and_accept_it} from './reusing/playwright_vuetify.js';
import {companies_add_from_Companies} from './commons.js';



test('Companies', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralCompanies').click();

    var companies_id=await companies_add_from_Companies(page)

    // Update Companies
    await page.getByTestId(`Companies_Table_IconEdit${companies_id}`).click()
    await v_text_input_settext(page,"CompaniesCRUD_Name", "My Linux company updated")
    await page.getByTestId('CompaniesCRUD_Button').click()
    await expect(page.getByTestId('CompaniesCRUD_Button')).toBeHidden()

    // Delete Companies
    await page.getByTestId(`Companies_Table_IconDelete${companies_id}`).click()
    await expect_native_confirm_and_accept_it(page)
    await page.getByTestId('CompaniesCRUD_Button').click()
    await expect(page.getByTestId('CompaniesCRUD_Button')).toBeHidden()

});

