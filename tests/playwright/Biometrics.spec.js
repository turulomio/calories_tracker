import { test, expect } from './fixtures.js';
import {mymenuinline_selection, v_text_input_settext, v_autocomplete_selection_with_role_option, expect_native_confirm_and_accept_it} from './reusing/playwright_vuetify.js';


test('Biometrics', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralBiometrics').click();

    await page.getByTestId('Biometrics_TabHeight').click()
    await page.getByTestId('Biometrics_TabWeight').click()
    await page.getByTestId('Biometrics_TabRegisters').click()

    await mymenuinline_selection(page,"Biometrics_MyMenuInline", 0, 0)

    await v_autocomplete_selection_with_role_option(page, "BiometricsCRUD_Activities", "Very active")
    await v_autocomplete_selection_with_role_option(page, "BiometricsCRUD_WeightWishes", "Lose weight")
    await v_text_input_settext(page,"BiometricsCRUD_Height", "180")
    await v_text_input_settext(page,"BiometricsCRUD_Weight", "90")
    await page.getByTestId('BiometricsCRUD_Button').click()

    // Update biometrics
    await page.getByTestId('Biometrics_Table_IconEdit1').click()
    await v_text_input_settext(page,"BiometricsCRUD_Height", "181")
    await page.getByTestId('BiometricsCRUD_Button').click()
    await expect(page.getByTestId('BiometricsCRUD_Button')).toBeHidden()

    // Delete biometrics
    await page.getByTestId('Biometrics_Table_IconDelete1').click()
    await expect_native_confirm_and_accept_it(page)
    await page.getByTestId('BiometricsCRUD_Button').click()
    await expect(page.getByTestId('BiometricsCRUD_Button')).toBeHidden()

});