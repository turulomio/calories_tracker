// This way https://www.sohamkamani.com/javascript/enums/#defining-enums-with-classes
// https://masteringjs.io/tutorials/fundamentals/enum



export class NutritionalElement {
    // Create new instances of the same class as static attributes
    static Amount= new NutritionalElement("amount", "Amount")
    static Calories = new NutritionalElement("calories", "Calories")
    static Fat = new NutritionalElement("fat", "Fat")
    static Protein = new NutritionalElement("protein", "Protein")
  
    constructor(attribute,name) {
      this.attribute=attribute
      this.name=name
      console.log(this)
    }

  }
  