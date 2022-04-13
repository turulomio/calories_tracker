
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
