
// item is an object with additives_risk parameters as integer
export function product_risk_color(item){
    if (item.additives_risk==0) return "green"
    if (item.additives_risk==1) return "#f7ff61"
    if (item.additives_risk==2) return "orange"
    if (item.additives_risk==3) return "red"
    if (item.additives_risk==100) return "gray"
}

// item is an object with additives_risk parameters as integer,glutenfree
// type: 1:system_product, 2:product, 3:elaborated products, 4: meals (item is product_url)
export function html_fullname(item,type_){
    if (type_==4) {
        item=this.$store.getters.getObjectByUrl("products",item)
        type_=2
    }

    let obsolete=(item.obsolete)? 'text-decoration-line-through' : ''
    let risk_color=product_risk_color(item)
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

    let product_risk_tooltip

    if (item.additives_risk==0) product_risk_tooltip= this.$t("No risk")
    if (item.additives_risk==1) product_risk_tooltip= this.$t( "Low risk")
    if (item.additives_risk==2) product_risk_tooltip= this.$t( "Medium risk")
    if (item.additives_risk==3) product_risk_tooltip= this.$t( "High risk")
    if (item.additives_risk==100) product_risk_tooltip= this.$t( "Not evaluated")

    let type=`<span title="${type_string}\n${product_risk_tooltip}" class="mdi ${type_icon}" style="color:${risk_color};" color="${risk_color}"></span>`
    let glutenfree=(item.glutenfree)? '<span title="Gluten free" style="color:#00aaff" class="mdi mdi-barley-off"></span>':''
    return `${type} <span class="${obsolete}">${item.fullname}</span> ${glutenfree}`
}
