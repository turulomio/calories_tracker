
import { expect } from './fixtures.js';
export async function v_autocomplete_selection_with_role_select(page, testId, optionText, first = true) {
  const autocomplete = page.getByTestId(testId);

  // 1. Click the component to open the dropdown.
  await autocomplete.click();

  // 2. The actual input is inside the component. We can find it by its role and type.
  await autocomplete.locator('input[type="text"]').fill(optionText);

  // 3. Wait for the desired option to appear in the dropdown and click it.
  const option = page.getByRole('select', { name: optionText, exact: false,  });
  if (first) await option.first().click();
  else await option.last().click();
}


