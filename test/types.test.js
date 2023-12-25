import { NutritionalElement } from '@/types';
import {describe,it, expect, test,} from 'vitest'
import { config } from '@vue/test-utils';
console.log(config)

describe('types', () => {
  it('NutritionalElement', () => {
    expect(NutritionalElement.Fat.attribute).toBe("fat")
    expect(NutritionalElement.Fat.name).toBe("Fat")

    expect(NutritionalElement.Calories.amount(122)).toBe("122 kcal")
    expect(NutritionalElement.Sugars.amount(122)).toBe("122 g")
  })
})


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
  