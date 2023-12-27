  
import {
    myheaders,
    myheaders_noauth,
    parseResponse,
    parseResponseError,
    listobjects_sum,
    percentage_string,
    percentage_generic_html,
    percentage_generic_string, 
    percentage_html,
    getArrayFromMap,
    products_html_fullname,
} from './functions.js'


const mixin = {
    data: function () {
        return {
        }
    },
    methods: {
        myheaders,
        myheaders_noauth,
        parseResponse,
        parseResponseError,
        listobjects_sum,
        percentage_string,
        percentage_generic_html,
        percentage_generic_string, 
        percentage_html,
        products_html_fullname,
        getArrayFromMap,
    }
  }

  
  

export default mixin