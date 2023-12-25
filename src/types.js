// This way https://www.sohamkamani.com/javascript/enums/#defining-enums-with-classes
// https://masteringjs.io/tutorials/fundamentals/enum
import {my_round} from 'vuetify_rules'

import { config } from '@vue/test-utils';


if ("is_testing" in config.global) {
  console.log("testing")
  // this.$t=config.global.mocks.$t
} else {
  console.log("no testing")
}

// console.log(this)

export class NutritionalElement {
    // Create new instances of the same class as static attributes
    static Amount= new NutritionalElement("amount", "Amount")
    static Calories = new NutritionalElement("calories", "Calories")
    static Fat = new NutritionalElement("fat", "Fat")
    static Protein = new NutritionalElement("protein", "Protein")
    static Carbohydrate = new NutritionalElement("carbohydrate", "Carbohydrate")
    static Salt = new NutritionalElement("salt", "Salt")
    static Fiber = new NutritionalElement("fiber", "Fiber")
    static Sugars = new NutritionalElement("sugars", "Sugars")
    static SaturatedFat = new NutritionalElement("saturated_fat", "Saturated fat")
    static Cholesterol = new NutritionalElement("cholesterol", "Cholesterol")
    static Sodium = new NutritionalElement("sodium", "Sodium")
    static Potassium = new NutritionalElement("potassium", "Potassium")
    static Ferrum = new NutritionalElement("ferrum", "Ferrum")
    static Magnesium = new NutritionalElement("magnesium", "Magnesium")
    static Phosphor = new NutritionalElement("phosphor", "Phosphor")
    static Calcium = new NutritionalElement("calcium", "Calcium")

  
    constructor(attribute,name) {
      this.attribute=attribute
      this.name=name
    }

    amount(amount){
      let unit
      let round
      // console.log("THIS",this)
      // console.log(VueI18n)
      // console.log(VueI18n.useI18n().$t("Amount"))
      if (["calories",].includes(this.attribute)){
        unit="kcal"
        round=0
      } else if (["magnessium","phosphor","potassium","ferrum","calcium","sodium"].includes(this.attribute)) {
        unit="mg"
        round=0
      } else {
        unit="g"
        round=2
      }
      return `${my_round(amount,round)} ${unit}`
    }

  }
  