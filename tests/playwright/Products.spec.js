import { test, expect } from './fixtures.js';
import {v_text_input_settext} from './reusing/playwright_vuetify.js';
import {expect_native_confirm_and_accept_it} from './native_dialogs.js';
import {products_add_from_Products} from './commons.js';



test('Products', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralProducts').click();

    var product=await products_add_from_Products(page)

    // Update Products
    await page.getByTestId(`Products_Table_IconEdit${product.id}`).click()
    await v_text_input_settext(page,"ProductsCRUD_Name", "My product updated")
    await page.getByTestId('ProductsCRUD_ButtonAdd').click()
    await expect(page.getByTestId('ProductsCRUD_ButtonAdd')).toBeHidden()

    // Delete Products
    await page.getByTestId(`Products_Table_IconDelete${product.id}`).click()
    await expect_native_confirm_and_accept_it(page)
    await page.getByTestId('ProductsCRUD_ButtonAdd').click()
    await expect(page.getByTestId('ProductsCRUD_ButtonAdd')).toBeHidden()

});
