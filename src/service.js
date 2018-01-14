export const domain = 'https://api.acme.codes';

export function serializeParams( params ){
    return Object.keys( params ).map(function( key ) {
      return key + '=' + params[key];
    }).join('&');
}

export async function getAnimsJson(){
    let res = await fetch( domain + '/anims-json' );
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
