import {describe,test, expect, } from 'vitest'
import {mount} from "@vue/test-utils";

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')


import Multiplier from '../../src/components/Multiplier.vue'

describe("Multiplier.vue", () => {

    test('displays message', () => {
        const wrapper = mount({
          template: '<v-layout><Multiplier v-model="value" /></v-layout>'
        }, {
          props: {},
          data: ()=>{
              return {
                  value:2
              }
          },
          global: {
            components: {
              Multiplier,
            },
            plugins: [vuetify],
    
          },


        })
        
        expect(wrapper.text()).toContain("Select a multiplier");
    });

});