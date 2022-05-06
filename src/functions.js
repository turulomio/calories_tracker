
// item is an object with additives_risk parameters as integer
export function product_risk_color(item){
    if (item.additives_risk==0) return "green"
    if (item.additives_risk==1) return "yellow"
    if (item.additives_risk==2) return "orange"
    if (item.additives_risk==3) return "red"
    if (item.additives_risk==100) return "gray"
}
// item is an object with additives_risk parameters as integer
export function product_risk_tooltip(item){
    if (item.additives_risk==0) return "No risk"
    if (item.additives_risk==1) return "Low risk"
    if (item.additives_risk==2) return "Medium risk"
    if (item.additives_risk==3) return "High risk"
    if (item.additives_risk==100) return "Not evaluated"
}
// item is an object with additives_risk parameters as integer
export function html_risk_icon(item){
    return `<span title="${product_risk_tooltip(item)}" class="mdi mdi-checkbox-blank-circle-outline" style="color:${product_risk_color(item)};" color="${product_risk_color(item)}"></span>`
}