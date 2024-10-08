import { login_test_User, add_recipe_from_recipes_vue } from "./commons"
describe('e2e Recipes', () => {
  it('Recipes', () => {    
    login_test_User(cy)
    
    // Add needed product
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_recipes').click()

    // Merging recipes
    add_recipe_from_recipes_vue(cy,"Recipe1")
    add_recipe_from_recipes_vue(cy,"Main recipe merging")
    cy.get('@recipes_post_id').then((recipes_id)=>{
      cy.getDataTest(`Recipes_Table_Row${recipes_id}`).click()
      cy.get('h1 > .v-btn').last().click()
      cy.getDataTest('MyMenuInline_Header1_Item0').click()
      cy.getDataTest('RecipesMerge_Autocomplete').type("e1").wait(1000).type("{downArrow}{enter}")
      cy.getDataTest('RecipesMerge_Button').click()
    })
  })
})

