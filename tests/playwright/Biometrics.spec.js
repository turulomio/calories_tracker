import { test, expect } from './fixtures.js';
import {biometrics_add_from_Biometrics} from './commons.js';
import {v_text_input_settext, expect_native_confirm_and_accept_it} from './reusing/playwright_vuetify.js';


test('Biometrics', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralBiometrics').click();

    await page.getByTestId('Biometrics_TabHeight').click()
    await page.getByTestId('Biometrics_TabWeight').click()
    await page.getByTestId('Biometrics_TabRegisters').click()

    var biometrics_id=await biometrics_add_from_Biometrics(page)


    // Update biometrics
    await page.getByTestId(`Biometrics_Table_IconEdit${biometrics_id}`).click()
    await v_text_input_settext(page,"BiometricsCRUD_Height", "181")
    await page.getByTestId('BiometricsCRUD_Button').click()
    await expect(page.getByTestId('BiometricsCRUD_Button')).toBeHidden()

    // Delete biometrics
    await page.getByTestId(`Biometrics_Table_IconDelete${biometrics_id}`).click()
    await expect_native_confirm_and_accept_it(page)
    await page.getByTestId('BiometricsCRUD_Button').click()
    await expect(page.getByTestId('BiometricsCRUD_Button')).toBeHidden()

});