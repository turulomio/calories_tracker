import { login_test_User, add_recipe_from_recipes_vue } from "./commons"
describe('e2e Recipes Elaborations', () => {
  it('Recipes Elaborations', () => {    

    login_test_User(cy)


    // Add needed product
    cy.getDataTest('lateral_icon').click()
    cy.getDataTest('lateral_recipes').click()

    // Merging recipes

    add_recipe_from_recipes_vue(cy,"Recipe for elaboration")
    cy.get('@recipes_post_id').then((recipes_id)=>{
      cy.getDataTest(`Recipes_Table_Row${recipes_id}`).click()
      cy.get('h1 > .v-btn').last().click()
      cy.getDataTest('MyMenuInline_Header0_Item2').click()

      cy.getDataTest("ElaborationCRUD_Diners").type("4")
      cy.getDataTest("ElaborationCRUD_Button").click()
      
    })
  })


  
})

