const domain = 'https://api.acme.codes';

export async function getAnimsJson(){
    let res = await fetch( domain + '/anims-json');
    return await res.json();
}

export async function newOrder( params ){
    let res = await fetch( domain + '/new?msg=' + params.msg );
    return await res.json();
}

export async function checkProgress( orderNumber ){
    let res = await fetch( domain + '/orders/' + orderNumber + '/progress');
    return await res.json();
}
