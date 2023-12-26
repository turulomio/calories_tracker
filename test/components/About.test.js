import {i18n} from '../../src/i18n.js'
import {describe,it, expect, } from 'vitest'
import {mount} from "@vue/test-utils";
import About from '../../src/components/About.vue'

import { createTestingPinia } from '@pinia/testing';
import sinon from 'sinon';

const testingPinia = createTestingPinia({
  createSpy: sinon.spy,
});

describe("About.vue", () => {
    it("renders the greeting message", async () => {
      const wrapper = mount(About, {
        global: {
          plugins: [testingPinia,i18n],
        },
      });
      console.log(wrapper.text())
      expect(wrapper.text()).toContain("About Calories Tracker");
    });

});