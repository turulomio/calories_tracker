
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
        last: new Date().toISOString(),
        obsolete: false,
        system_companies: null,
    }
}
