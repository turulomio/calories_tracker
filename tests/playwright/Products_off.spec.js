import { test, expect } from './fixtures.js';
import {productsoff_add_from_Products} from './commons.js';



test('Products', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralProducts').click();

    await mymenuinline_selection(page,"Products_MyMenuInline", 2, 0)

    await v_text_input_settext(page,"OpenFoodFactsSearch_Search", "Comino molido carrefour")
    await page.getByTestId('OpenFoodFactsSearch_Button').click()

});

