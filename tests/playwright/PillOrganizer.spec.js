import { test, expect } from './fixtures.js';
import {mymenuinline_selection, v_text_input_settext} from './reusing/playwright_vuetify.js';

test('Pill organizer', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralPillOrganizer').click();

    // Add a simple pill event
    await mymenuinline_selection(page,"PillOrganizer_MyMenuInline", 0, 0)
    await v_text_input_settext(page,"PillEventsCRUD_Name", "Aspirine")  
    await page.getByTestId('PillEventsCRUD_Button').click()
    expect(page.getByTestId('PillEventsCRUD_Button')).toBeHidden()

    // Add each day
    await mymenuinline_selection(page,"PillOrganizer_MyMenuInline", 0, 1)
    await v_text_input_settext(page,"PillEventsCRUD_Name", "Aspirine each day")
    await v_text_input_settext(page,"PillEventsCRUD_Days", "3")
    await page.getByTestId('PillEventsCRUD_Button').click()
    expect(page.getByTestId('PillEventsCRUD_Button')).toBeHidden()

    // Add each n hours
    await mymenuinline_selection(page,"PillOrganizer_MyMenuInline", 0, 2)
    await v_text_input_settext(page,"PillEventsCRUD_Name", "Aspirine each n hours")
    await v_text_input_settext(page,"PillEventsCRUD_Hours", "8")
    await v_text_input_settext(page,"PillEventsCRUD_Number", "3")
    await page.getByTestId('PillEventsCRUD_Button').click()
    expect(page.getByTestId('PillEventsCRUD_Button')).toBeHidden()

});
