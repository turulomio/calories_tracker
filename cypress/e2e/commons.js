

export function login_test_User(cy){
    cy.visit('http://127.0.0.1:8012/calories_tracker/')
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

    cy.get('#name').type(name)
    cy.get('#companies').type("Hacendado{downArrow}{enter}")
    cy.get('#food_types').type("V{downArrow}{enter}")
    cy.get('#additives').type("{downArrow}{enter}{downArrow}{downArrow}{enter}{esc}")
    cy.get('#amount').type("100")
    cy.get('#calories').type("30")
    cy.get('#density').type("1")
    cy.get('#fat').type("2")
    cy.get('#saturated_fat').type("3")
    cy.get('#protein').type("4")
    cy.get('#carbohydrate').type("5")
    cy.get('#sugars').type("6")
    cy.get('#cholesterol').type("7")
    cy.get('#salt').type("8")
    cy.get('#sodium').type("9")
    cy.get('#potassium').type("10")
    cy.get('#fiber').type("11")
    cy.get('#ferrum').type("12")
    cy.get('#magnesium').type("13")
    cy.get('#phosphor').type("14")
    cy.get('#calcium').type("15")
    cy.get('#cmdFormat').click()
    cy.get('#FormatsCRUD_format').type("Un{downArrow}{enter}")
    cy.get('#FormatsCRUD_amount').type("100")
    cy.get('#FormatsCRUD_cmd').click()
    cy.get('#cmd').click()
}