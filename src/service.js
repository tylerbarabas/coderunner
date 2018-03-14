export const api = 'https://api.acme.codes';
export const production = 'https://acme.codes';
export const stage = 'https://stage.acme.codes';

export function serializeParams( params ){
    return Object.keys( params ).map(function( key ) {
      return key + '=' + params[key];
    }).join('&');
}

export async function getAnimsJson(){
    let res = await fetch( api + '/anims-json' );
    return await res.json();
}

export async function getColorsJson(){
	let res = await fetch( api + '/color-palettes-json' );
	return await res.json();
}

export async function newOrder( params ){
    let res = await fetch( api + '/new?' + serializeParams( params ));
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
    console.log('pp', amount, nonce);
    let res = await fetch( stage + '/coderunner/process-payment', {
        method: 'POST',
        body: JSON.stringify({
            amount,
            nonce
        })
    } );
    return await res.json();
}
