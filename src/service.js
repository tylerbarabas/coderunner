export const api = 'https://api.acme.codes';
export const production = 'https://acme.codes';
export const stage = 'https://service.animatedcodes.net';

const constParams = {
	xres: 300,
	yres: 300
};

export function serializeParams( params ){
    return Object.keys( params ).map(function( key ) {
      return key + '=' + params[key];
    }).join('&');
}

export async function getAnimsJson(){
    let res = await fetch( api + '/anims-json?tags=image' );
    return await res.json();
}

export async function getColorsJson(){
	let res = await fetch( api + '/color-palettes-json' );
	return await res.json();
}

export async function newOrder( params ){
    let res = await fetch( api + '/new?' + serializeParams( params ) + '&' + serializeParams(constParams));
    return await res.json();
}

export async function checkProgress( orderNumber ){
    let res = await fetch( api + '/orders/' + orderNumber + '/progress');
    return await res.json();
}

export async function uploadImage(formData) {
    let res = await fetch( production + '/coderunner/upload', {
        method: 'POST',
        body: formData
    });
    return await res.json();
}

export async function getClientToken(){
    let res = await fetch( stage + '/coderunner/generate-token', {
        method: 'POST'
    } );
    return await res.json();
}

export async function processPayment(amount, nonce){
    let res = await fetch( stage + '/coderunner/process-payment', {
        method: 'POST',
        body: JSON.stringify({
            amount,
            nonce
        }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    } );
    return await res.json();
}

export async function unlock( orderNumber ){
    let res = await fetch( production + '/coderunner/unlock', {
        method: 'POST',
        body: JSON.stringify({ orderNumber }),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json' 
        }
    } );
    return await res.json();
}

export async function checkImageReady( orderNumber ) {
    let res = await fetch( api + '/orders/' + orderNumber + '/gif-file-info' );
    return await res.json();
}

export async function sendEmail( orderNumber, email ) {
    let res = await fetch ( api + '/orders/' + orderNumber + '/gif?eMail= ' + email );
    return await res.text();
}
