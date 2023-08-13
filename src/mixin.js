import {
    arrayofintegers_to_stringofintegers,
    arrayobjects_to_array,
    localtime,
    id_from_hyperlinked_url,
    hyperlinked_url,
    ifnullempty,
    myheaders,
    myheaders_noauth,
    parseResponse,
    parseResponseError,
    listobjects_sum,
    listobjects_average_ponderated,
    parseNumber,
    myheaders_formdata,
    my_round,
    store,
    percentage_string,
    percentage_generic_html,
    percentage_generic_string, 
    percentage_html,
    getMapObjectById,
    getArrayFromMap,
} from './my_commons.js'
  
import {
    RulesFloat,
    RulesDate,
    RulesDatetime,
    RulesEmail,
    RulesInteger,
    RulesPassword,
    RulesString,
    RulesSelection, 
    RulesFloatGZ, 
    RulesFloatGEZ, 
    RulesFloatLEZ, 
} from './rules.js'



const mixin = {
    data: function () {
        return {
        }
    },
    methods: {
        arrayofintegers_to_stringofintegers,
        arrayobjects_to_array,
        id_from_hyperlinked_url,
        hyperlinked_url,
        ifnullempty,
        localtime,
        myheaders,
        myheaders_noauth,
        my_round,
        myheaders_formdata,
        parseNumber,
        parseResponse,
        parseResponseError,
        listobjects_average_ponderated,
        listobjects_sum,
        RulesDate,
        RulesDatetime,
        RulesEmail,
        RulesFloat,
        RulesInteger,
        RulesPassword,
        RulesString,
        RulesSelection,
        RulesFloatGZ,
        RulesFloatGEZ,
        RulesFloatLEZ,
        store,
        percentage_string,
        percentage_generic_html,
        percentage_generic_string, 
        percentage_html,
        getMapObjectById,
        getArrayFromMap,
    }
  }

  
  

export default mixin