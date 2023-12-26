  
import {
    myheaders,
    myheaders_noauth,
    parseResponse,
    parseResponseError,
    listobjects_sum,
    myheaders_formdata,
    percentage_string,
    percentage_generic_html,
    percentage_generic_string, 
    percentage_html,
    getMapObjectById,
    getArrayFromMap,
    store,
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
        myheaders_formdata,
        parseResponse,
        parseResponseError,
        listobjects_sum,
        store,
        percentage_string,
        percentage_generic_html,
        percentage_generic_string, 
        percentage_html,
        products_html_fullname,
        getMapObjectById,
        getArrayFromMap,
    }
  }

  
  

export default mixin