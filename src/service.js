export const domain = 'https://api.acme.codes';
export const imghost = 'https://acme.codes';

export function serializeParams( params ){
    return Object.keys( params ).map(function( key ) {
      return key + '=' + params[key];
    }).join('&');
}

export async function getAnimsJson(){
    let res = await fetch( domain + '/anims-json' );
    return await res.json();
}

export async function getColorsJson(){
	let res = await fetch( domain + '/color-palettes-json' );
	return await res.json();
}

export async function newOrder( params ){
    let res = await fetch( domain + '/new?' + serializeParams( params ));
    return await res.json();
}

export async function checkProgress( orderNumber ){
    let res = await fetch( domain + '/orders/' + orderNumber + '/progress');
    return await res.json();
}

export async function uploadImage(formData) {
    let res = await fetch( imghost + '/coderunner/upload', {
        method: 'POST',
        body: formData
    });
    return await res.json();
} 
