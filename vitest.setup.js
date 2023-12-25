import { config } from '@vue/test-utils';
// import i18n from '@/i18n';
// import { createApp } from 'vue'



// const app = createApp({
//   setup() {
//     const { t } = VueI18n.useI18n() // call `useI18n`, and spread `t` from  `useI18n` returning
//     return { t } // return render context that included `t`
//   }
// })

// Configura un mock simple para vue-i18n
config.global.mocks = {
  $t: (msg) => msg,
  // $i18n: i18n,
  // $app: app
};
config.global.is_testing=true
console.log("Testing...")
// console.log(i18n)