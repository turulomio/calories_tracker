import {describe,test, expect, } from 'vitest'
import {mount, shallowMount} from "@vue/test-utils";
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

    });



    test('Mount directly', async () => {
        const wrapper = shallowMount(Multiplier,{
            
            propsData: {
                modelValue:2
            }
        })
        console.log(wrapper.html())
        expect(wrapper.html()).toContain("Select a multiplier");
        expect(wrapper.vm.items.length).toBe(20)
        wrapper.vm.newvalue=5
        expect(wrapper.vm.modelValue).toBe(2)
        let found=wrapper.find('v-select-stub')
        console.log("Compoent,", found )
        console.log("VM",wrapper.vm)
        console.log("$REFS",wrapper.vm.$refs)
        // console.log("$REFS",wrapper.vm.$)
        // await found.setSelect(4)
    });

});