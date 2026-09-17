export async function expect_native_alert_and_accept_it(page) {
  /**
   * Must be before action raises it
   * Value is a string
   */
  page.once('dialog', dialog => {
    dialog.accept();
    console.log(`Dialog message: ${dialog.message()} accepted`);
  });
}

export async function expect_native_confirm_and_accept_it(page) {
  /**
   * Must be before action raises it
   */
  page.once('dialog', dialog => {
    // console.log(dialog.message())
    dialog.accept();
    console.log(`Dialog message: ${dialog.message()} accepted`);
  });
}

export async function expect_native_prompt_and_set_value(page, value) {
  /**
   * Must be before action raises it
   * Value is a string
   */
  page.once('dialog', dialog => {
    dialog.accept(value);
    console.log(`Dialog message: ${dialog.message()}. Set value: ${value}`);
  });
}
