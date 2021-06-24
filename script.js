// DATA TO BE PROTECTED
let encodedUsername, encryptedData, decryptedData, secretKey;
const userName = "IYOKjE4VCI4/y3JVyl+be5G4fYsROenOXaVxlw9gWSU=";
const lob = "BOP";
const company = "renoagency";
const environment = "test";
const businessClass = "";
const environments = {
    test: 'demo.tarmika',
    prod: '.tarmika'
};

// ENCRYPTION ALGO
encrypt = salt => {
    let textToChars = text => text.split('').map(c => c.charCodeAt(0));
    let applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
    let byteHex = n => ("0" + Number(n).toString(16)).substr(-2);

    return text => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');
};

// DECRYPTION ALGO
decrypt = salt => {
    let textToChars = text => text.split('').map(c => c.charCodeAt(0));
    let applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);

    return encoded => encoded.match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('');
};


// GENERATING A SECRET KEY
generateDynamicKey = () => {
    let newDate = new Date();
    return newDate.getUTCHours().toString() + newDate.getUTCMinutes().toString() + newDate.getUTCSeconds().toString() + newDate.getUTCMilliseconds().toString();
};


// ATTACHING REDIRECTION TO CLICK EVENT
document.querySelector('#redirector').addEventListener('click', function (e) {
    e.preventDefault();

    let keyPrefix = new Date();
    let keySuffix = generateDynamicKey();
    secretKey = keyPrefix.getUTCFullYear().toString() + keyPrefix.getUTCMonth().toString() + keySuffix;

    encodedUsername = userName;
    lineOfBusiness = lob;
    businessClassification = businessClass;
    let data = {};
    console.log('userName:', userName, 'lob:', lob, 'company:', company, 'environment:', environment);
    if (userName && lob && company && environment) {
        console.log('secretKey:', secretKey, 'encodedUsername:', encodedUsername);
        encryptedData = encrypt(secretKey)(encodedUsername);
        // console.log('Data entered:', encodedUsername, 'Secret Key generated:', secretKey);
        data['token'] = encryptedData;
        data['lob'] = lineOfBusiness;
        data['authType'] = 'eun';
        if (businessClassification)
            data['businessClass'] = businessClassification;

        const decodedData = btoa(JSON.stringify(data));
        console.log("Data to be sent:", data);
        console.log("Decoded data to be sent:", decodedData);
        this.setAttribute('href',
            'https://' + company.trim() +
            (environment.value === 'prod' && company.value !== " " ? '.' : '') +
            environments[environment] +
            '.com/agentportal/?un=' +
            decodedData +
            '&companyIdentifier=36000&ky=' +
            btoa(keySuffix)
        );

        window.location.href = this.href;
    } else {
        alert("Please enter all mandatory fields.");
    }
});
