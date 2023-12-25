
  
  //Coverage of the test not of the module
  
// import assert from "assert"
// import {NutritionalElement} from '../src/types.js'

// sum.test.js
import { expect, test,} from 'vitest'
import { config } from '@vue/test-utils'
config.global.mocks = {
    $t: (tKey) => tKey,
  };
test('adds 1 + 2 to equal 3', () => {
  expect(1+2).toBe(3)
})

console.log(this)
console.log(this.$t("HOLA"))

// function $t(s){
//     return s
// }
// console.log(this)

//   describe("Functions", () => {
//     it('NutritionalElement', () => {;
//         beforeEach(function () {
//           this.$t=function(s){
//             return s
//           }
//           console.log("Initialising... Test " + testRan);
//         });
//       assert.equal(NutritionalElement.Fat,2)
//     });
  
  
//   });
  