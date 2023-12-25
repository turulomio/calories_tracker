<template>
    <div>
      {{ translatedText }}
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        keyToTranslate: 'Amount'
      };
    },
    computed: {
      translatedText() {
        return this.$t(this.keyToTranslate);
      }
    }
  };
  </script>
  