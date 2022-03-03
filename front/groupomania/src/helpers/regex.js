let alphaRegex      = /^[a-zA-Zçñàéèêëïîôüù][a-zA-Zçñàéèêëïîôüù\- '\\.]{0,25}$/;
let pseudoRegex     = /^[0-9a-zA-Zçñàéèêëïîôüù_]{2,20}$/;
let emailRegex      = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
let passwordRegex   = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;

export { 
    alphaRegex, 
    pseudoRegex, 
    emailRegex, 
    passwordRegex 
}