import {describe,test, expect, } from 'vitest'
import {mount} from "@vue/test-utils";
import { config } from '@vue/test-utils';

import Multiplier from '../../src/components/Multiplier.vue'

describe("Multiplier.vue", () => {

    test('Mount from parent', async () => {
        const wrapper = mount({
          template: '<v-layout><Multiplier ref="mycomp" v-model="value" /></v-layout>'
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
        console.log(wrapper.attributes())
        console.log(wrapper.classes())
        console.log(wrapper.html())
        expect(wrapper.text()).toContain("Select a multiplier");
        console.log("Compoent,", wrapper.findComponent('Multiplier'))

    });



    // test('Mount directly', () => {
    //     const div = document.createElement('div')
    //     document.body.appendChild(div)
    //     const wrapper = mount(Multiplier,{
            
    //   attachTo: div,
    //         propsData: {
    //             modelValue:2
    //       }
    //     })
    //     console.log(wrapper.attributes())
    //     console.log(wrapper.classes())
    //     expect(wrapper.text()).toContain("Select a multiplier");
    // });

});