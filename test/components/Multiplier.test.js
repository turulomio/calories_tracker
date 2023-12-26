import {describe,test, expect, } from 'vitest'
import {mount} from "@vue/test-utils";
import { config } from '@vue/test-utils';

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
            plugins: [config.global.vuetify],
    
          },


        })
        
        expect(wrapper.text()).toContain("Select a multiplier");
    });

});