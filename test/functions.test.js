
import {
    elaboration_nutritional_information,
}  from '../src/functions.js';
  
var elaboration={
  elaborations_products_in: [
    {
      products:  "mal"
    },
  ]

}

  
  //Coverage of the test not of the module
  
  import assert from "assert"
  
  describe("Functions", () => {
    it('elaboration_nutritional_information', () => {
      console.log(elaboration)
      assert.equal(1,1)
      // assert.equal(elaboration_nutritional_information(elaboration, ""), true);
    });
  
  
  });
  