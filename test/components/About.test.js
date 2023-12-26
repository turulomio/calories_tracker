import {describe,it, expect, } from 'vitest'
import {mount} from "@vue/test-utils";
import About from '../../src/components/About.vue'

describe("About.vue", () => {
    it("renders the greeting message", async () => {
      const wrapper = mount(About, {
        // global: {
        //   plugins: [testingPinia,i18n],
        // },
      });
      console.log(wrapper.text())
      expect(wrapper.text()).toContain("About Calories Tracker");
    });

});