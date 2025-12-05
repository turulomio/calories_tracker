
import { expect } from './fixtures.js';
import {
  mymenuinline_selection, 
  v_text_input_settext, 
  promise_to_get_id_from_post_response,
  v_autocomplete_selection_with_role_option
} from './reusing/playwright_vuetify.js';

export async function companies_add_from_Companies(page, name="My Linux company"){
    await mymenuinline_selection(page,"Companies_MyMenuInline", 0, 0)

    await v_text_input_settext(page,"CompaniesCRUD_Name", name)

    const id_promise=promise_to_get_id_from_post_response(page, "/api/companies/");
    await page.getByTestId('CompaniesCRUD_Button').click()
    const id= await id_promise;
    await expect(page.getByTestId(`Companies_Table_IconEdit${id}`)).toBeVisible();
    return id
}

export async function meals_add_from_Meals(page, name="My Linux company"){
    await mymenuinline_selection(page,"Meals_MyMenuInline", 0, 0)

    await v_text_input_settext(page,"CompaniesCRUD_Name", name)

    const id_promise=promise_to_get_id_from_post_response(page, "/api/companies/");
    await page.getByTestId('CompaniesCRUD_Button').click()
    const id= await id_promise;
    await expect(page.getByTestId(`Companies_Table_IconEdit${id}`)).toBeVisible();
    return id
}

export async function products_add_from_Products(page, name="My product"){
    await mymenuinline_selection(page,"Products_MyMenuInline", 0, 0)

    await v_text_input_settext(page,"ProductsCRUD_Name", name)
    await v_autocomplete_selection_with_role_option(page,"ProductsCRUD_FoodTypes", "Fruit")
    await v_text_input_settext(page,"ProductsCRUD_Amount", "100")
    await v_text_input_settext(page,"ProductsCRUD_Calories", "143") 

    const id_promise=promise_to_get_id_from_post_response(page, "/api/products/");
    await page.getByTestId('ProductsCRUD_ButtonAdd').click()
    const id= await id_promise;
    await expect(page.getByTestId(`Products_Table_IconEdit${id}`)).toBeVisible();
    return id
}


