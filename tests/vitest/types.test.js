import { NutritionalElement } from '@/types';
import {describe,it, expect, test,} from 'vitest'

describe('types', () => {
  it('NutritionalElement', () => {
    expect(NutritionalElement.Fat.attribute).toBe("fat")
    expect(NutritionalElement.Fat.name).toBe("Fat")

    expect(NutritionalElement.Calories.amount(122)).toBe("122 kcal")
    expect(NutritionalElement.Sugars.amount(122)).toBe("122 g")
  })
})

