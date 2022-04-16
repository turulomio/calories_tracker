export function empty_biometrics(){
    return {
        url:null,
        datetime: new Date().toISOString(),
        height:0,
        weight:0,
        weight_wishes:null,
        activities:null,
    }
}

export function empty_companies(){
    return {
        url:null,
        name: null,
        obsolete: false,
        system_companies: null,
    }
}
export function empty_products(){
    return {
        url:null,
        name: null,
        amount:null,
        fat:null,
        protein:null,
        carbohydrate:null,
        calories:null,
        salt:null,
        cholesterol:null,
        sodium:null,
        potassium:null,
        fiber:null,
        sugars:null,
        saturated_fat:null,
        ferrum:null,
        magnesium:null,
        phosphor:null,
        glutenfree:false,
        calcium:null,
        obsolete: false,
        system_products: null,
        elaborated_products:null,
        food_types:null,
        additives:[],
        formats:[],
        companies:null,
        version_parent:null,
        version_description:null

    }    
}

export function empty_formats(){
    return {
        formats: null,
        amount: false,
    }
}