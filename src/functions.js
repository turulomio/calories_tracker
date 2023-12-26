import { useStore } from './store.js'
import moment from 'moment-timezone'
import {my_round} from 'vuetify_rules'

// item is an additive_risks url
export function product_risk_color(additive_risks_url){
    let id=id_from_hyperlinked_url(additive_risks_url)
    if (id==0) return "green"
    if (id==1) return "#f7ff61"
    if (id==2) return "orange"
    if (id==3) return "red"
    if (id==100) return "gray"
}

// item is an object with additive_risks parameters as integer,glutenfree
// type: 1:system_product, 2:product, 3:elaborated products, 4: meals (item is product_url), 5: system_product english
export function products_html_fullname(item,type_){
    if (type_==4) {
        item=this.store().products.get(item)
        type_=2
    }
    let additive_risks_object=this.getMapObjectById("additive_risks", item.additives_risk)
    let obsolete=(item.obsolete)? 'text-decoration-line-through' : ''
    let risk_color=product_risk_color(additive_risks_object.url)
    let type_icon
    let type_string
    if (type_==1|| type_==5) {//System
        type_icon="mdi-database"
        type_string="System product"
    } else if (type_==2) { //Products
        if (item.system_products){
            type_icon="mdi-database"
            type_string="System product"
        } else if (item.elaborated_products){
            type_icon="mdi-food-takeout-box"
            type_string="Elaborated product"
        } else {
            type_icon="mdi-apple"
            type_string="Product"
        }
    } else { //Elaborated
        type_string="Elaborated product"
        type_icon="mdi-food-takeout-box"
    }

    let type=`<span title="${type_string}\n${additive_risks_object.localname}" class="mdi ${type_icon}" style="color:${risk_color};" color="${risk_color}"></span>`
    let glutenfree=(item.glutenfree)? '<span title="Gluten free" style="color:#00aaff" class="mdi mdi-barley-off"></span>':''
    if (type_==5){
        return `${type} <span class="${obsolete}">${item.fullname_english}</span> ${glutenfree}`
    } else {
        return `${type} <span class="${obsolete}">${item.fullname}</span> ${glutenfree}`
    }
}


// item is an object of additives. additives_object.additive_risks is an url
export function additives_html_fullname(additives_object){
    let additive_risks_object=this.store().additive_risks.get(additives_object.additive_risks)

    let risk_color=product_risk_color(additive_risks_object.url)

    let icon=`<span title="${additive_risks_object.localname}" class="mdi mdi-checkbox-blank-circle" style="color:${risk_color};" color="${risk_color}"></span>`
    return `${icon} ${additives_object.fullname}</span>`
}




export function store(){
    return useStore()    
}


// Due to problems with translations I made this function to help i18n
// Function to use "[0] [1]".format(a, b) style
String.prototype.format = function() {
    var formatted = this
    for (var i = 0; i < arguments.length; i++) {
        var search=`[${i}]`
        var replace=`${arguments[i]}`
        formatted = formatted.replace(search, replace );
    }
    return formatted;
};

export function myheaders(){
    return {
        headers:{
            'Authorization': `Token ${store().token}`,
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type':'application/json'
        }
    }
}


export function myheaders_noauth(){
    return {
        headers:{
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type':'application/json'
        }
    }
}

export function myheaders_formdata(){
    return {
        headers:{
            'Authorization': `Token ${store().token}`,
            'Accept-Language': `${localStorage.locale}-${localStorage.locale}`,
            'Content-Type': 'multipart/form-data'
        }
    }
}

// returns true if everything is ok
// return false if there is something wrong
export function parseResponse(response){
    if (response.status==200){ //Good connection
        if (response.data == "Wrong credentials"){
            this.store().token=null
            this.store().logged=false
            alert(this.$t("Wrong credentials"))
            return false
        }
        return true
    } else if (response.status==201){// Created
        
    } else if (response.status==204){// Deleted
    } else {
        alert (`${response.status}: ${response.data}`)
        return false
    }
}

export function parseResponseError(error){
    if (error.response) {
      // Request made and server responded
        console.log("made and responded")
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
        if (error.response.status == 401){
            if (this.store().token==null){ // Not logged yet
                alert(this.$t("Wrong credentials"))
            } else {
                alert (this.$t("You aren't authorized to do this request"))
                this.store().token=null;
                this.store().logged=false;
                if (this.$router.currentRoute.name != "about") this.$router.push("about")
                console.log(error.response)
            }
        } else if (error.response.status == 400){ // Used for developer or app errors
            alert (this.$t("Something wrong with your request"))
            console.log(error.response)
        } else if (error.response.status == 403){ // Used for developer or app errors
            alert (this.$t("You've done something forbidden"))
            this.store().token=null;
            this.store().logged=false;
            if (this.$router.currentRoute.name != "about") this.$router.push("about")
            console.log(error.response)
        } else if (error.response.status == 500){
            alert (this.$t("There is a server error"))
            console.log(error.response)
        }
    } else if (error.request) {
        console.log("The request was made but no response was received")
        alert (this.$t("Server couldn't answer this request"))
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
        console.log("OTROS")
        console.log('Error', error.message);
    }
}

export function sortObjectsArray(objectsArray, sortKey)
{
    // Quick Sort:
    var retVal;

    if (1 < objectsArray.length)
    {
        var pivotIndex = Math.floor((objectsArray.length - 1) / 2);  // middle index
        var pivotItem = objectsArray[pivotIndex];                    // value in the middle index
        var less = [], more = [];

        objectsArray.splice(pivotIndex, 1);                          // remove the item in the pivot position
        objectsArray.forEach(function(value)
        {
            value[sortKey] <= pivotItem[sortKey] ?                   // compare the 'sortKey' proiperty
                less.push(value) :
                more.push(value) ;
        });

        retVal = sortObjectsArray(less, sortKey).concat([pivotItem], sortObjectsArray(more, sortKey));
    }
    else
    {
        retVal = objectsArray;
    }
    
    return retVal;
}


export function arrayobjects_to_stringofstrings(l, key){
    var s=""
    l.forEach(o => s=s+o[key].toString() + ", ")
    return s.slice(0,-2)
}


export function arrayofintegers_to_stringofintegers(l){
    var s=""
    l.forEach(o => s=s+o.toString() + ", ")
    return s.slice(0,-2)
}


export function stringofintegers_to_arrayofintegers(s,separator=", "){
    var l=[]
    s.split(separator).forEach(o => l.push(parseInt(o)))
    return l
}


export function arrayobjects_to_array(l, key){
    var s=[]
    l.forEach(o => s.push(o[key]))
    return s
}

export function percentage_generic_string(num, locale, decimals=2){
    if (num==null) return "- - - %"
    return `${my_round(num*100,decimals).toLocaleString(locale,{ minimumFractionDigits: decimals,  })} %`
}

export function percentage_generic_html(num, locale, decimals=2){
    if (num==null){
        return percentage_generic_string(num,locale,decimals)
    }

    if (num>=0){
        return `<span>${percentage_generic_string(num, locale, decimals)}</span>`
    } else {
        return `<span class='vuered'>${percentage_generic_string(num, locale, decimals)}</span>`
    }
}

export function listobjects_sum(lo,key){
    if (lo.length==0) return 0
    return lo.reduce((accum,item) => accum + item[key], 0)
}



// Generate a hyperlinked_url (DRF hyperlinked url) from model and id uses $sotre for apiroot
export function hyperlinked_url(model,id){
    return `${store().apiroot}/api/${model}/${id}/`
}

//Gets id (integer) from an hyperlinked_url(DRF hyperlinked ul)
export function id_from_hyperlinked_url(url){
    let r=url.split("/") //[ "http:", "", "localhost:8011", "api", "additive_risks", "0", "" ]
    return parseInt(r[r.length-2])
}

// file is the value of v-file-input. La funcion donde se pone la función debe ser async y para recibir valor const l= await getBase64(file)
// Returns an object with image in base64, jsimage, and mime parameters
export function getBase64(file) {
    // Returns a promise which gets resolved or rejected based on the reader events
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        // Sets up even listeners BEFORE you call reader.readAsDataURL
        reader.onload = function () {
            const result = reader.result
            var r={
                jsimage: result,
                image: result.split(",")[1],
                mime: result.split(";base64,")[0].split(":")[1],
            }
            return resolve(r)
        };
        reader.onerror = function (error) {
            return reject(error);
        };
        // Calls reader function
        reader.readAsDataURL(file);
    })
}


export function getMapObjectById(catalog,id) { 
    // If id doesn't exists return undefined
    var url=hyperlinked_url(catalog,id)
    var r= store()[catalog].get(url)
    return r
}

export function getArrayFromMap(catalog){
    //Catalog is a map
    return Array.from(catalog).map(([,value]) => (value))
    
}


export function percentage_string(num, decimals=2){
    return percentage_generic_string(num,localStorage.locale,decimals )
}
export function percentage_html(num, decimals=2){
    return percentage_generic_html(num,localStorage.locale,decimals )
}

/**
 * Returns a rounded float with the nutritional information of a elaboration and an element in 100 grams of elaboration
 * For example elaboration_nutritional_information(elaboration, "calories")
 * 
 * Elaboration is an object  with elaborations_products_in array that have [products,ni,amount]
 */
export function elaboration_nutritional_information(elaboration,item_name){
    var sum_items=0
    elaboration.elaborations_products_in.forEach(o => {
        let product=useStore().products.get(o.products)
        if (o.ni){
            sum_items+=product[item_name]*o.amount/product["amount"]
        }
    })
    var final_amount=elaboration.final_amount

    return 100*sum_items/final_amount
}

/**
 * Returns a string with the nutritional information of a elaboration and an element in 100 grams of elaboration
 * For example elaboration_nutritional_information(elaboration, "calories")
 * 
 * Elaboration is an object  with elaborations_products_in array that have [products,ni,amount]
 */
export function elaboration_nutritional_information_string(elaboration, nutritional_element){
    let value=elaboration_nutritional_information(elaboration,nutritional_element.attribute)
    return nutritional_element.amount(value)
}