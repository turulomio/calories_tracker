import {describe,test, expect, } from 'vitest'
import {mount, shallowMount} from "@vue/test-utils";
import { config } from '@vue/test-utils';

import Curiosities from '../../src/components/Curiosities.vue'

describe("Curiosities.vue", () => {
    test('Mount directly', async () => {
        const wrapper = mount(Curiosities,{
        })
        console.log(wrapper.html())
        expect(wrapper.html()).toContain("Curiosities")
        console.log("VM",wrapper.vm)
        console.log("$REFS",wrapper.vm.curiosities)
        console.log(wrapper.vm.logged,"LOGGED")
        // console.log("$REFS",wrapper.vm.$)
        // await found.setSelect(4)
    });

});