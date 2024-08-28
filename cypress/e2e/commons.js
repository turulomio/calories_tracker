



export function login_test_User(cy){
    cy.visit('/')
    cy.contains("Log in").click()
    cy.getDataTest("BtnLogIn_User").type("test")
    cy.getDataTest("BtnLogIn_Password").type("test")
    cy.getDataTest('BtnLogIn_cmd').click() //Find by id
}

export function add_product_from_products_vue(name){
    /*
     * Add a product from Products.vue
     */
    cy.get('h1 > .v-btn').click()
    cy.get('.v-list > :nth-child(1) > :nth-child(2) > .v-list-item > .v-list-item__content > .v-list-item-title').click()

    cy.getDataTest('ProductsCRUD_Name').type(name)
    cy.getDataTest('ProductsCRUD_Companies').type("Hacendado{downArrow}{enter}")
    cy.getDataTest('ProductsCRUD_FoodTypes').type("V{downArrow}{enter}")
    cy.getDataTest('ProductsCRUD_Additives').type("e621{downArrow}{enter}{downArrow}{downArrow}{enter}{esc}")
    cy.getDataTest('ProductsCRUD_Amount').type("100")
    cy.getDataTest('ProductsCRUD_Calories').type("30")
    cy.getDataTest('ProductsCRUD_Density').type("1")
    cy.getDataTest('ProductsCRUD_Fat').type("2")
    cy.getDataTest('ProductsCRUD_SaturatedFat').type("3")
    cy.getDataTest('ProductsCRUD_Protein').type("4")
    cy.getDataTest('ProductsCRUD_Carbohydrate').type("5")
    cy.getDataTest('ProductsCRUD_Sugars').type("6")
    cy.getDataTest('ProductsCRUD_Cholesterol').type("7")
    cy.getDataTest('ProductsCRUD_Salt').type("8")
    cy.getDataTest('ProductsCRUD_Sodium').type("9")
    cy.getDataTest('ProductsCRUD_Potassium').type("10")
    cy.getDataTest('ProductsCRUD_Fiber').type("11")
    cy.getDataTest('ProductsCRUD_Ferrum').type("12")
    cy.getDataTest('ProductsCRUD_Magnesium').type("13")
    cy.getDataTest('ProductsCRUD_Phosphor').type("14")
    cy.getDataTest('ProductsCRUD_Calcium').type("15")
    cy.getDataTest('ProductsCRUD_ButtonFormat').click()
    cy.getDataTest('FormatsCRUD_format').type("Un{downArrow}{enter}")
    cy.getDataTest('FormatsCRUD_amount').type("100")
    cy.getDataTest('FormatsCRUD_cmd').click()
    cy.getDataTest('ProductsCRUD_ButtonAdd').click()
}


export function add_recipe_from_recipes_vue(cy,name){
    /*
     * Add a recipe from Recipes.vue
     */
    cy.get('h1 > .v-btn').click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest("RecipesCRUD_Name").type(name)
    cy.getDataTest("RecipesCRUD_RecipesCategories").type("chicken{downArrow}{enter}")
    cy.intercept({method:'POST', url:'http://127.0.0.1:8011/api/recipes/', times:1 }).as("recipes_post")
    cy.getDataTest('RecipesCRUD_Button').click()
    cy.wait('@recipes_post').then((interception)=>{
        var id=interception.response.body.id
        cy.wrap(id).as("recipes_post_id") // Stores the captured ID for later us
    })
}