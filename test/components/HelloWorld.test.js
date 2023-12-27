import {i18n} from '../../src/i18n.js'
import {describe,it, expect, } from 'vitest'
import {mount} from "@vue/test-utils";
import HelloWorld from '../../src/components/HelloWorld.vue'

describe("HelloWorld.vue", () => {
    it("renders the greeting message", async () => {
      const wrapper = mount(HelloWorld, {
        global: {
          plugins: [i18n],
        },
      });
  
      expect(wrapper.text()).toContain("Amount");
    });

});