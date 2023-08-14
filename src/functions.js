import {id_from_hyperlinked_url} from './components/reusing/my_commons.js'

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
// type: 1:system_product, 2:product, 3:elaborated products, 4: meals (item is product_url)
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
    if (type_==1) {//System
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
    return `${type} <span class="${obsolete}">${item.fullname}</span> ${glutenfree}`
}


// item is an object of additives. additives_object.additive_risks is an url
export function additives_html_fullname(additives_object){
    let additive_risks_object=this.store().additive_risks.get(additives_object.additive_risks)

    let risk_color=product_risk_color(additive_risks_object.url)

    let icon=`<span title="${additive_risks_object.localname}" class="mdi mdi-checkbox-blank-circle" style="color:${risk_color};" color="${risk_color}"></span>`
    return `${icon} ${additives_object.fullname}</span>`
}

import { useStore } from './store.js'
export function store(){
    return useStore()    
}