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
export function empty_system_companies(){
    return {
        last: new Date().toISOString(),
        url:null,
        name: null,
        obsolete: false,
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
        density: null,
        companies:null,
        version_parent:null,
        version_description:null

    }    
}
export function empty_system_products(){
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
        food_types:null,
        additives:[],
        formats:[],
        density: null,
        system_companies:null,
        version: new Date().toISOString(),
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


export function empty_meals(){
    return {
        url: null,
        datetime: new Date().toISOString(),
        products: null,
        amount: 0,
    }
}
export function empty_elaborated_products(){
    return {
        url: null,
        final_amount: null,
        food_types:null,
        last: new Date().toISOString(),
        name: null,
        obsolete: false,
        products_in: [],
    }
}
export function empty_products_in(){
    return {
        products: null,
        amount: null,
    }
}

export function empty_products_data_transfer(){
    return {
        product_from: null,
        product_to: null
    }
}

export function empty_pots(){
    return {
        name: '',
        weight: 0,
        diameter: 0,
    }
}

export function empty_recipes(){
    return {
        url:null,
        name: '',
        last: new Date().toISOString(),
        food_types:null,
        obsolete:false,
        comment:'',
        valoration:null,
        guests:false,
        soon:false,
    }
}

export function empty_recipes_categories(){
    return {
        url:null,
        name: "",
    }
}

export function empty_recipes_links_types(){
    return {
        url:null,
        name: "",
    }
}

export function empty_stir_types(){
    return {
        url:null,
        name: "",
    }
}

export function empty_temperatures_types(){
    return {
        url:null,
        name: "",
    }
}

export function empty_recipes_links(){
    return {
        url:null,
        description: "",
        type: null,
        link:null,
        content: null, //Base 64 string
        recipes: null,
        mime: null,
    }
}

export function empty_elaborations(){
    return {
        url: null,
        final_amount: null,
        diners:null,
        elaborations_products_in: [],
        recipes: null,
        elaborations_steps: [],
    }
}

export function empty_elaborations_products_in(){
    return {
        products: null,
        amount: null,
        measures_types: null,
        elaborations: null,
    }
}

export function empty_elaborations_steps(){
    return {
        order: 1,
        elaborations: null,
        steps: null,
        duration: "00:01:00",
        temperature: null,
        stir:null,
        comment: null,
        products_in_step: [],
    }
}


export function empty_measures_types(){
    return {
        url:null,
        name: "",
    }
}

export function empty_elaborations_containers(){
    return {
        url: null,
        name: "",
        elaborations: null,
    }
}