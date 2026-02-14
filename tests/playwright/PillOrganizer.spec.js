import { test, expect } from './fixtures.js';
import {mymenuinline_selection, v_text_input_settext, expect_native_confirm_and_accept_it} from './reusing/playwright_vuetify.js';

test('Pill organizer', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralPillOrganizer').click();

    // Add a simple pill event
    await mymenuinline_selection(page,"PillOrganizer_MyMenuInline", 0, 0)
    await v_text_input_settext(page,"PillEventsCRUD_Name", "Aspirine")  
    await page.getByTestId('PillEventsCRUD_Button').click()
    await expect(page.getByTestId('PillEventsCRUD_Button')).toBeHidden()

    // Add each day
    await mymenuinline_selection(page,"PillOrganizer_MyMenuInline", 0, 1)
    await v_text_input_settext(page,"PillEventsCRUD_Name", "Aspirine each day")
    await v_text_input_settext(page,"PillEventsCRUD_Days", "3")
    await page.getByTestId('PillEventsCRUD_Button').click()
    await expect(page.getByTestId('PillEventsCRUD_Button')).toBeHidden()

    // Add each n hours
    await mymenuinline_selection(page,"PillOrganizer_MyMenuInline", 0, 2)
    await v_text_input_settext(page,"PillEventsCRUD_Name", "Aspirine each n hours")
    await v_text_input_settext(page,"PillEventsCRUD_Hours", "8")
    await v_text_input_settext(page,"PillEventsCRUD_Number", "3")
    await page.getByTestId('PillEventsCRUD_Button').click()
    await expect(page.getByTestId('PillEventsCRUD_Button')).toBeHidden()

    // Copy last week
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/pill_events/copy_last_week/') && response.status() === 200);
    await expect_native_confirm_and_accept_it(page)
    await mymenuinline_selection(page,"PillOrganizer_MyMenuInline", 0, 3)
    await responsePromise
    await page.waitForResponse(response => response.url().includes('/api/pill_events/') && response.status() === 200);

});
