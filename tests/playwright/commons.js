
import { expect } from './fixtures.js';
import {mymenuinline_selection, v_text_input_settext, promise_to_get_id_from_post_response} from './reusing/playwright_vuetify.js';

export async function companies_add_from_Companies(page, name="My Linux company"){
    await mymenuinline_selection(page,"Companies_MyMenuInline", 0, 0)

    await v_text_input_settext(page,"CompaniesCRUD_Name", name)

    const id_promise=promise_to_get_id_from_post_response(page, "/api/companies/");
    await page.getByTestId('CompaniesCRUD_Button').click()
    const id= await id_promise;
    await expect(page.getByTestId(`Companies_Table_IconEdit${id}`)).toBeVisible();
    return id
}