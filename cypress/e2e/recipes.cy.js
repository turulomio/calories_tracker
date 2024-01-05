import { login_test_User, add_recipe_from_recipes_vue } from "./commons"
describe('e2e System products', () => {
  it('System Products', () => {    

    login_test_User(cy)


    // Add needed product
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_recipes').click()

    // Merging recipes

    add_recipe_from_recipes_vue("Recipe1")
    add_recipe_from_recipes_vue("Recipe2")
    cy.intercept('POST', 'http://127.0.0.1:8011/api/recipes/').as("post_main_recipe")
    add_recipe_from_recipes_vue("Main recipe merging")
    cy.wait('@post_main_recipe').then((interception)=>{
      var recipes_id=interception.response.body.id
      console.log("Recipe to merge", recipes_id)
      cy.getDataTest(`Recipes_Table_Row${recipes_id}`).click()
      cy.get('h1 > .v-btn').last().click()
      cy.getDataTest('MyMenuInline_Header1_Item0').click()
      
    })
  })


  
})

